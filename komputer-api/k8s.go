package main

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	komputerv1alpha1 "github.com/komputer-ai/komputer-operator/api/v1alpha1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/types"
	utilruntime "k8s.io/apimachinery/pkg/util/runtime"
	clientgoscheme "k8s.io/client-go/kubernetes/scheme"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

type K8sClient struct {
	client    client.Client
	namespace string
}

func NewK8sClient(namespace string) (*K8sClient, error) {
	scheme := runtime.NewScheme()
	utilruntime.Must(clientgoscheme.AddToScheme(scheme))
	utilruntime.Must(komputerv1alpha1.AddToScheme(scheme))

	config, err := ctrl.GetConfig()
	if err != nil {
		return nil, fmt.Errorf("failed to get kubeconfig: %w", err)
	}

	c, err := client.New(config, client.Options{Scheme: scheme})
	if err != nil {
		return nil, fmt.Errorf("failed to create k8s client: %w", err)
	}

	return &K8sClient{client: c, namespace: namespace}, nil
}

func (k *K8sClient) CreateAgent(ctx context.Context, name, instructions, model, templateRef string) (*komputerv1alpha1.KomputerAgent, error) {
	if model == "" {
		model = "claude-sonnet-4-20250514"
	}
	if templateRef == "" {
		templateRef = "default"
	}

	agent := &komputerv1alpha1.KomputerAgent{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: k.namespace,
			Labels: map[string]string{
				"komputer.ai/agent-name": name,
			},
		},
		Spec: komputerv1alpha1.KomputerAgentSpec{
			TemplateRef:  templateRef,
			Instructions: instructions,
			Model:        model,
		},
	}

	if err := k.client.Create(ctx, agent); err != nil {
		return nil, err
	}
	return agent, nil
}

func (k *K8sClient) GetAgent(ctx context.Context, name string) (*komputerv1alpha1.KomputerAgent, error) {
	agent := &komputerv1alpha1.KomputerAgent{}
	err := k.client.Get(ctx, types.NamespacedName{Name: name, Namespace: k.namespace}, agent)
	if err != nil {
		return nil, err
	}
	return agent, nil
}

func (k *K8sClient) ListAgents(ctx context.Context) ([]komputerv1alpha1.KomputerAgent, error) {
	list := &komputerv1alpha1.KomputerAgentList{}
	if err := k.client.List(ctx, list, client.InNamespace(k.namespace)); err != nil {
		return nil, err
	}
	return list.Items, nil
}

func (k *K8sClient) GetAgentPodIP(ctx context.Context, podName string) (string, error) {
	pod := &corev1.Pod{}
	err := k.client.Get(ctx, types.NamespacedName{Name: podName, Namespace: k.namespace}, pod)
	if err != nil {
		return "", err
	}
	if pod.Status.PodIP == "" {
		return "", fmt.Errorf("pod %s has no IP yet", podName)
	}
	return pod.Status.PodIP, nil
}

func (k *K8sClient) ForwardTaskToAgent(ctx context.Context, podIP, instructions string) error {
	url := fmt.Sprintf("http://%s:8000/task", podIP)
	body := fmt.Sprintf(`{"instructions":%q}`, instructions)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, strings.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to forward task to agent: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusAccepted {
		return fmt.Errorf("agent returned status %d", resp.StatusCode)
	}
	return nil
}
