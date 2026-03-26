# komputer-operator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Kubernetes operator using operator-sdk that manages KomputerAgent, KomputerAgentTemplate, and KomputerRedisConfig CRDs — creating and maintaining agent pods with persistent storage.

**Architecture:** The operator watches 3 CRDs. When a KomputerAgent CR is created, it resolves the referenced template and the singleton redis config, then creates a PVC and Pod for the agent. It keeps the pod alive (recreates on termination) and updates CR status based on pod state.

**Tech Stack:** Go 1.22, operator-sdk, controller-runtime, envtest, ginkgo/gomega

---

## Prerequisites

operator-sdk must be installed before starting. If not present:

```bash
brew install operator-sdk
```

Verify: `operator-sdk version`

---

## File Structure

All files live under `komputer-operator/` within the monorepo. The operator-sdk scaffolding creates the base structure; we modify/create these files:

| File | Responsibility |
|------|---------------|
| `api/v1alpha1/komputeragent_types.go` | KomputerAgent CRD types (spec, status) |
| `api/v1alpha1/komputeragenttemplate_types.go` | KomputerAgentTemplate CRD types (PodSpec passthrough) |
| `api/v1alpha1/komputerredisconfig_types.go` | KomputerRedisConfig CRD types (redis connection) |
| `api/v1alpha1/groupversion_info.go` | API group/version registration (scaffolded) |
| `internal/controller/komputeragent_controller.go` | Main reconciliation: creates PVC + Pod, keeps pod alive |
| `internal/controller/komputeragent_controller_test.go` | Integration tests using envtest |
| `config/samples/` | Sample CRs for all 3 kinds |
| `cmd/main.go` | Manager entrypoint (scaffolded, modified to register controllers) |

---

### Task 1: Scaffold the operator project

**Files:**
- Create: `komputer-operator/` (entire scaffolded project)

- [ ] **Step 1: Initialize the operator-sdk project**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai
mkdir komputer-operator
cd komputer-operator
operator-sdk init --domain komputer.ai --repo github.com/komputer-ai/komputer-operator
```

Expected: Project scaffolded with `cmd/main.go`, `go.mod`, `Makefile`, `config/` directories.

- [ ] **Step 2: Create KomputerAgent API**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator
operator-sdk create api --group komputer --version v1alpha1 --kind KomputerAgent --resource --controller
```

Expected: Creates `api/v1alpha1/komputeragent_types.go`, `internal/controller/komputeragent_controller.go`.

- [ ] **Step 3: Create KomputerAgentTemplate API**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator
operator-sdk create api --group komputer --version v1alpha1 --kind KomputerAgentTemplate --resource --controller
```

Expected: Creates `api/v1alpha1/komputeragenttemplate_types.go`, `internal/controller/komputeragenttemplate_controller.go`.

- [ ] **Step 4: Create KomputerRedisConfig API**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator
operator-sdk create api --group komputer --version v1alpha1 --kind KomputerRedisConfig --resource --controller
```

Expected: Creates `api/v1alpha1/komputerredisconfig_types.go`, `internal/controller/komputerredisconfig_controller.go`.

- [ ] **Step 5: Verify scaffolding compiles**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator
make generate
make manifests
go build ./...
```

Expected: All commands succeed with no errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai
git add komputer-operator/
git commit -m "feat(operator): scaffold operator-sdk project with 3 CRDs"
```

---

### Task 2: Define KomputerRedisConfig CRD types

**Files:**
- Modify: `komputer-operator/api/v1alpha1/komputerredisconfig_types.go`

- [ ] **Step 1: Define the KomputerRedisConfig spec and status types**

Replace the generated spec/status in `komputer-operator/api/v1alpha1/komputerredisconfig_types.go`:

```go
package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// SecretKeyRef references a key in a Kubernetes Secret.
type SecretKeyRef struct {
	// Name of the Secret.
	Name string `json:"name"`
	// Key within the Secret.
	Key string `json:"key"`
}

// KomputerRedisConfigSpec defines the desired state of KomputerRedisConfig.
type KomputerRedisConfigSpec struct {
	// Address is the Redis host:port.
	Address string `json:"address"`
	// DB is the Redis database number.
	// +kubebuilder:default=0
	DB int `json:"db,omitempty"`
	// Queue is the Redis queue/stream name for agent events.
	// +kubebuilder:default="komputer-events"
	Queue string `json:"queue,omitempty"`
	// PasswordSecret references a Kubernetes Secret containing the Redis password.
	// +optional
	PasswordSecret *SecretKeyRef `json:"passwordSecret,omitempty"`
}

// KomputerRedisConfigStatus defines the observed state of KomputerRedisConfig.
type KomputerRedisConfigStatus struct {
}

// +kubebuilder:object:root=true
// +kubebuilder:subresource:status

// KomputerRedisConfig is the Schema for the komputerredisconfigs API.
type KomputerRedisConfig struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   KomputerRedisConfigSpec   `json:"spec,omitempty"`
	Status KomputerRedisConfigStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// KomputerRedisConfigList contains a list of KomputerRedisConfig.
type KomputerRedisConfigList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []KomputerRedisConfig `json:"items"`
}

func init() {
	SchemeBuilder.Register(&KomputerRedisConfig{}, &KomputerRedisConfigList{})
}
```

- [ ] **Step 2: Regenerate and verify**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator
make generate
make manifests
go build ./...
```

Expected: Compiles successfully. CRD manifest updated at `config/crd/bases/`.

- [ ] **Step 3: Create sample CR**

Create `komputer-operator/config/samples/komputer_v1alpha1_komputerredisconfig.yaml`:

```yaml
apiVersion: komputer.komputer.ai/v1alpha1
kind: KomputerRedisConfig
metadata:
  name: default
spec:
  address: "redis:6379"
  db: 0
  queue: "komputer-events"
  passwordSecret:
    name: "redis-secret"
    key: "password"
```

- [ ] **Step 4: Commit**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai
git add komputer-operator/
git commit -m "feat(operator): define KomputerRedisConfig CRD types"
```

---

### Task 3: Define KomputerAgentTemplate CRD types

**Files:**
- Modify: `komputer-operator/api/v1alpha1/komputeragenttemplate_types.go`

- [ ] **Step 1: Define the KomputerAgentTemplate spec with PodSpec passthrough**

Replace the generated spec/status in `komputer-operator/api/v1alpha1/komputeragenttemplate_types.go`:

```go
package v1alpha1

import (
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// StorageSpec defines PVC settings for agent workspaces.
type StorageSpec struct {
	// Size is the PVC storage size (e.g. "5Gi").
	// +kubebuilder:default="5Gi"
	Size string `json:"size,omitempty"`
	// StorageClassName is the optional storage class name.
	// +optional
	StorageClassName *string `json:"storageClassName,omitempty"`
}

// KomputerAgentTemplateSpec defines the desired state of KomputerAgentTemplate.
type KomputerAgentTemplateSpec struct {
	// PodSpec is a full corev1.PodSpec passthrough for the agent pod.
	PodSpec corev1.PodSpec `json:"podSpec"`
	// Storage defines the PVC settings for agent workspaces.
	// +optional
	Storage StorageSpec `json:"storage,omitempty"`
}

// KomputerAgentTemplateStatus defines the observed state of KomputerAgentTemplate.
type KomputerAgentTemplateStatus struct {
}

// +kubebuilder:object:root=true
// +kubebuilder:subresource:status

// KomputerAgentTemplate is the Schema for the komputeragenttemplates API.
type KomputerAgentTemplate struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   KomputerAgentTemplateSpec   `json:"spec,omitempty"`
	Status KomputerAgentTemplateStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// KomputerAgentTemplateList contains a list of KomputerAgentTemplate.
type KomputerAgentTemplateList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []KomputerAgentTemplate `json:"items"`
}

func init() {
	SchemeBuilder.Register(&KomputerAgentTemplate{}, &KomputerAgentTemplateList{})
}
```

- [ ] **Step 2: Regenerate and verify**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator
make generate
make manifests
go build ./...
```

Expected: Compiles successfully.

- [ ] **Step 3: Create sample CR**

Create `komputer-operator/config/samples/komputer_v1alpha1_komputeragenttemplate.yaml`:

```yaml
apiVersion: komputer.komputer.ai/v1alpha1
kind: KomputerAgentTemplate
metadata:
  name: default
spec:
  podSpec:
    containers:
      - name: agent
        image: komputer-agent:latest
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"
          limits:
            cpu: "2"
            memory: "2Gi"
  storage:
    size: "5Gi"
```

- [ ] **Step 4: Commit**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai
git add komputer-operator/
git commit -m "feat(operator): define KomputerAgentTemplate CRD types with PodSpec passthrough"
```

---

### Task 4: Define KomputerAgent CRD types

**Files:**
- Modify: `komputer-operator/api/v1alpha1/komputeragent_types.go`

- [ ] **Step 1: Define the KomputerAgent spec and status types**

Replace the generated spec/status in `komputer-operator/api/v1alpha1/komputeragent_types.go`:

```go
package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// KomputerAgentPhase represents the lifecycle phase of a KomputerAgent.
type KomputerAgentPhase string

const (
	AgentPhasePending   KomputerAgentPhase = "Pending"
	AgentPhaseRunning   KomputerAgentPhase = "Running"
	AgentPhaseSucceeded KomputerAgentPhase = "Succeeded"
	AgentPhaseFailed    KomputerAgentPhase = "Failed"
)

// KomputerAgentSpec defines the desired state of KomputerAgent.
type KomputerAgentSpec struct {
	// TemplateRef is the name of the KomputerAgentTemplate to use.
	// +kubebuilder:default="default"
	TemplateRef string `json:"templateRef,omitempty"`
	// Instructions is the prompt/task for the Claude agent.
	Instructions string `json:"instructions"`
	// Model is the Claude model to use.
	// +kubebuilder:default="claude-sonnet-4-20250514"
	Model string `json:"model,omitempty"`
}

// KomputerAgentStatus defines the observed state of KomputerAgent.
type KomputerAgentStatus struct {
	// Phase is the current lifecycle phase.
	Phase KomputerAgentPhase `json:"phase,omitempty"`
	// PodName is the name of the agent pod.
	PodName string `json:"podName,omitempty"`
	// PvcName is the name of the agent PVC.
	PvcName string `json:"pvcName,omitempty"`
	// StartTime is when the agent was started.
	// +optional
	StartTime *metav1.Time `json:"startTime,omitempty"`
	// CompletionTime is when the agent finished.
	// +optional
	CompletionTime *metav1.Time `json:"completionTime,omitempty"`
	// Message is a human-readable status message.
	Message string `json:"message,omitempty"`
}

// +kubebuilder:object:root=true
// +kubebuilder:subresource:status
// +kubebuilder:printcolumn:name="Phase",type=string,JSONPath=`.status.phase`
// +kubebuilder:printcolumn:name="Model",type=string,JSONPath=`.spec.model`
// +kubebuilder:printcolumn:name="Age",type=date,JSONPath=`.metadata.creationTimestamp`

// KomputerAgent is the Schema for the komputeragents API.
type KomputerAgent struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   KomputerAgentSpec   `json:"spec,omitempty"`
	Status KomputerAgentStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// KomputerAgentList contains a list of KomputerAgent.
type KomputerAgentList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []KomputerAgent `json:"items"`
}

func init() {
	SchemeBuilder.Register(&KomputerAgent{}, &KomputerAgentList{})
}
```

- [ ] **Step 2: Regenerate and verify**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator
make generate
make manifests
go build ./...
```

Expected: Compiles successfully.

- [ ] **Step 3: Create sample CR**

Create `komputer-operator/config/samples/komputer_v1alpha1_komputeragent.yaml`:

```yaml
apiVersion: komputer.komputer.ai/v1alpha1
kind: KomputerAgent
metadata:
  name: my-research-agent
  labels:
    komputer.ai/agent-name: my-research-agent
spec:
  templateRef: "default"
  instructions: "Research quantum computing and write a summary"
  model: "claude-sonnet-4-20250514"
```

- [ ] **Step 4: Commit**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai
git add komputer-operator/
git commit -m "feat(operator): define KomputerAgent CRD types with phase tracking"
```

---

### Task 5: Implement KomputerAgent controller — PVC creation

**Files:**
- Modify: `komputer-operator/internal/controller/komputeragent_controller.go`

- [ ] **Step 1: Write the test for PVC creation**

Replace the contents of `komputer-operator/internal/controller/komputeragent_controller_test.go`:

```go
package controller

import (
	"context"
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"

	komputerv1alpha1 "github.com/komputer-ai/komputer-operator/api/v1alpha1"
)

var _ = Describe("KomputerAgent Controller", func() {
	const (
		timeout  = time.Second * 10
		interval = time.Millisecond * 250
	)

	Context("When creating a KomputerAgent", func() {
		It("should create a PVC for the agent", func() {
			ctx := context.Background()

			// Create a KomputerAgentTemplate
			template := &komputerv1alpha1.KomputerAgentTemplate{
				ObjectMeta: metav1.ObjectMeta{
					Name:      "default",
					Namespace: "default",
				},
				Spec: komputerv1alpha1.KomputerAgentTemplateSpec{
					PodSpec: corev1.PodSpec{
						Containers: []corev1.Container{
							{
								Name:  "agent",
								Image: "komputer-agent:latest",
							},
						},
					},
					Storage: komputerv1alpha1.StorageSpec{
						Size: "1Gi",
					},
				},
			}
			Expect(k8sClient.Create(ctx, template)).Should(Succeed())

			// Create a KomputerRedisConfig
			redisConfig := &komputerv1alpha1.KomputerRedisConfig{
				ObjectMeta: metav1.ObjectMeta{
					Name:      "default",
					Namespace: "default",
				},
				Spec: komputerv1alpha1.KomputerRedisConfigSpec{
					Address: "redis:6379",
					DB:      0,
					Queue:   "komputer-events",
				},
			}
			Expect(k8sClient.Create(ctx, redisConfig)).Should(Succeed())

			// Create a KomputerAgent
			agent := &komputerv1alpha1.KomputerAgent{
				ObjectMeta: metav1.ObjectMeta{
					Name:      "test-agent",
					Namespace: "default",
					Labels: map[string]string{
						"komputer.ai/agent-name": "test-agent",
					},
				},
				Spec: komputerv1alpha1.KomputerAgentSpec{
					TemplateRef:  "default",
					Instructions: "Do a test task",
					Model:        "claude-sonnet-4-20250514",
				},
			}
			Expect(k8sClient.Create(ctx, agent)).Should(Succeed())

			// Verify PVC is created
			pvcKey := types.NamespacedName{Name: "test-agent-pvc", Namespace: "default"}
			createdPVC := &corev1.PersistentVolumeClaim{}
			Eventually(func() error {
				return k8sClient.Get(ctx, pvcKey, createdPVC)
			}, timeout, interval).Should(Succeed())

			Expect(createdPVC.Spec.Resources.Requests[corev1.ResourceStorage]).To(Equal(resource.MustParse("1Gi")))
		})
	})
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator
make test
```

Expected: Test fails because the controller has no reconciliation logic yet.

- [ ] **Step 3: Implement PVC creation in the controller**

Replace the contents of `komputer-operator/internal/controller/komputeragent_controller.go`:

```go
package controller

import (
	"context"
	"encoding/json"
	"fmt"

	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/types"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
	"sigs.k8s.io/controller-runtime/pkg/log"

	komputerv1alpha1 "github.com/komputer-ai/komputer-operator/api/v1alpha1"
)

// KomputerAgentReconciler reconciles a KomputerAgent object.
type KomputerAgentReconciler struct {
	client.Client
	Scheme *runtime.Scheme
}

// +kubebuilder:rbac:groups=komputer.komputer.ai,resources=komputeragents,verbs=get;list;watch;create;update;patch;delete
// +kubebuilder:rbac:groups=komputer.komputer.ai,resources=komputeragents/status,verbs=get;update;patch
// +kubebuilder:rbac:groups=komputer.komputer.ai,resources=komputeragents/finalizers,verbs=update
// +kubebuilder:rbac:groups=komputer.komputer.ai,resources=komputeragenttemplates,verbs=get;list;watch
// +kubebuilder:rbac:groups=komputer.komputer.ai,resources=komputerredisconfigs,verbs=get;list;watch
// +kubebuilder:rbac:groups=core,resources=pods,verbs=get;list;watch;create;update;patch;delete
// +kubebuilder:rbac:groups=core,resources=persistentvolumeclaims,verbs=get;list;watch;create;update;patch;delete
// +kubebuilder:rbac:groups=core,resources=secrets,verbs=get;list;watch

func (r *KomputerAgentReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	log := log.FromContext(ctx)

	// Fetch the KomputerAgent
	var agent komputerv1alpha1.KomputerAgent
	if err := r.Get(ctx, req.NamespacedName, &agent); err != nil {
		if errors.IsNotFound(err) {
			return ctrl.Result{}, nil
		}
		return ctrl.Result{}, err
	}

	// Resolve the template
	templateName := agent.Spec.TemplateRef
	if templateName == "" {
		templateName = "default"
	}
	var template komputerv1alpha1.KomputerAgentTemplate
	if err := r.Get(ctx, types.NamespacedName{Name: templateName, Namespace: agent.Namespace}, &template); err != nil {
		log.Error(err, "failed to get KomputerAgentTemplate", "templateRef", templateName)
		return r.updateStatus(ctx, &agent, komputerv1alpha1.AgentPhaseFailed, fmt.Sprintf("template %q not found", templateName))
	}

	// Resolve the singleton KomputerRedisConfig
	redisConfig, err := r.getRedisConfig(ctx, agent.Namespace)
	if err != nil {
		log.Error(err, "failed to get KomputerRedisConfig")
		return r.updateStatus(ctx, &agent, komputerv1alpha1.AgentPhaseFailed, "KomputerRedisConfig not found")
	}

	// Ensure PVC exists
	pvcName := agent.Name + "-pvc"
	if err := r.ensurePVC(ctx, &agent, &template, pvcName); err != nil {
		log.Error(err, "failed to ensure PVC")
		return ctrl.Result{}, err
	}

	// Ensure Pod exists
	podName := agent.Name + "-pod"
	if err := r.ensurePod(ctx, &agent, &template, redisConfig, pvcName, podName); err != nil {
		log.Error(err, "failed to ensure Pod")
		return ctrl.Result{}, err
	}

	// Update status based on pod state
	return r.reconcileStatus(ctx, &agent, podName, pvcName)
}

func (r *KomputerAgentReconciler) getRedisConfig(ctx context.Context, namespace string) (*komputerv1alpha1.KomputerRedisConfig, error) {
	var list komputerv1alpha1.KomputerRedisConfigList
	if err := r.List(ctx, &list, client.InNamespace(namespace)); err != nil {
		return nil, err
	}
	if len(list.Items) == 0 {
		return nil, fmt.Errorf("no KomputerRedisConfig found in namespace %s", namespace)
	}
	return &list.Items[0], nil
}

func (r *KomputerAgentReconciler) ensurePVC(ctx context.Context, agent *komputerv1alpha1.KomputerAgent, template *komputerv1alpha1.KomputerAgentTemplate, pvcName string) error {
	pvc := &corev1.PersistentVolumeClaim{}
	err := r.Get(ctx, types.NamespacedName{Name: pvcName, Namespace: agent.Namespace}, pvc)
	if err == nil {
		return nil // PVC already exists
	}
	if !errors.IsNotFound(err) {
		return err
	}

	storageSize := template.Spec.Storage.Size
	if storageSize == "" {
		storageSize = "5Gi"
	}

	pvc = &corev1.PersistentVolumeClaim{
		ObjectMeta: metav1.ObjectMeta{
			Name:      pvcName,
			Namespace: agent.Namespace,
			Labels: map[string]string{
				"komputer.ai/agent-name": agent.Name,
			},
		},
		Spec: corev1.PersistentVolumeClaimSpec{
			AccessModes: []corev1.PersistentVolumeAccessMode{corev1.ReadWriteOnce},
			Resources: corev1.VolumeResourceRequirements{
				Requests: corev1.ResourceList{
					corev1.ResourceStorage: resource.MustParse(storageSize),
				},
			},
		},
	}

	if template.Spec.Storage.StorageClassName != nil {
		pvc.Spec.StorageClassName = template.Spec.Storage.StorageClassName
	}

	if err := controllerutil.SetControllerReference(agent, pvc, r.Scheme); err != nil {
		return err
	}

	return r.Create(ctx, pvc)
}

func (r *KomputerAgentReconciler) ensurePod(ctx context.Context, agent *komputerv1alpha1.KomputerAgent, template *komputerv1alpha1.KomputerAgentTemplate, redisConfig *komputerv1alpha1.KomputerRedisConfig, pvcName, podName string) error {
	pod := &corev1.Pod{}
	err := r.Get(ctx, types.NamespacedName{Name: podName, Namespace: agent.Namespace}, pod)
	if err == nil {
		// Pod exists — check if it failed and needs recreation
		if pod.Status.Phase == corev1.PodFailed || pod.Status.Phase == corev1.PodSucceeded {
			if err := r.Delete(ctx, pod); err != nil {
				return err
			}
			// Will be recreated on next reconcile
			return nil
		}
		return nil
	}
	if !errors.IsNotFound(err) {
		return err
	}

	// Build the config.json content
	configJSON, err := r.buildConfigJSON(ctx, redisConfig)
	if err != nil {
		return err
	}

	// Build pod from template
	pod = r.buildPod(agent, template, pvcName, podName)

	if err := controllerutil.SetControllerReference(agent, pod, r.Scheme); err != nil {
		return err
	}

	return r.Create(ctx, pod)
}

func (r *KomputerAgentReconciler) buildConfigJSON(ctx context.Context, redisConfig *komputerv1alpha1.KomputerRedisConfig) (string, error) {
	password := ""
	if redisConfig.Spec.PasswordSecret != nil {
		var secret corev1.Secret
		if err := r.Get(ctx, types.NamespacedName{
			Name:      redisConfig.Spec.PasswordSecret.Name,
			Namespace: redisConfig.Namespace,
		}, &secret); err != nil {
			return "", fmt.Errorf("failed to get redis password secret: %w", err)
		}
		password = string(secret.Data[redisConfig.Spec.PasswordSecret.Key])
	}

	config := map[string]interface{}{
		"redis": map[string]interface{}{
			"address":  redisConfig.Spec.Address,
			"password": password,
			"db":       redisConfig.Spec.DB,
			"queue":    redisConfig.Spec.Queue,
		},
	}

	data, err := json.Marshal(config)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func (r *KomputerAgentReconciler) buildPod(agent *komputerv1alpha1.KomputerAgent, template *komputerv1alpha1.KomputerAgentTemplate, pvcName, podName string) *corev1.Pod {
	// Deep copy the template PodSpec
	podSpec := template.Spec.PodSpec.DeepCopy()

	// Inject env vars and volume mounts into the first container
	if len(podSpec.Containers) > 0 {
		podSpec.Containers[0].Env = append(podSpec.Containers[0].Env,
			corev1.EnvVar{Name: "KOMPUTER_INSTRUCTIONS", Value: agent.Spec.Instructions},
			corev1.EnvVar{Name: "KOMPUTER_MODEL", Value: agent.Spec.Model},
			corev1.EnvVar{Name: "KOMPUTER_AGENT_NAME", Value: agent.Name},
		)
		podSpec.Containers[0].VolumeMounts = append(podSpec.Containers[0].VolumeMounts,
			corev1.VolumeMount{Name: "workspace", MountPath: "/workspace"},
			corev1.VolumeMount{Name: "komputer-config", MountPath: "/etc/komputer", ReadOnly: true},
		)
	}

	// Add volumes
	podSpec.Volumes = append(podSpec.Volumes,
		corev1.Volume{
			Name: "workspace",
			VolumeSource: corev1.VolumeSource{
				PersistentVolumeClaim: &corev1.PersistentVolumeClaimVolumeSource{
					ClaimName: pvcName,
				},
			},
		},
		corev1.Volume{
			Name: "komputer-config",
			VolumeSource: corev1.VolumeSource{
				ConfigMap: &corev1.ConfigMapVolumeSource{
					LocalObjectReference: corev1.LocalObjectReference{
						Name: podName + "-config",
					},
				},
			},
		},
	)

	// Set restart policy to Never — the controller will recreate the pod
	podSpec.RestartPolicy = corev1.RestartPolicyNever

	return &corev1.Pod{
		ObjectMeta: metav1.ObjectMeta{
			Name:      podName,
			Namespace: agent.Namespace,
			Labels: map[string]string{
				"komputer.ai/agent-name": agent.Name,
			},
		},
		Spec: *podSpec,
	}
}

func (r *KomputerAgentReconciler) reconcileStatus(ctx context.Context, agent *komputerv1alpha1.KomputerAgent, podName, pvcName string) (ctrl.Result, error) {
	pod := &corev1.Pod{}
	err := r.Get(ctx, types.NamespacedName{Name: podName, Namespace: agent.Namespace}, pod)

	var phase komputerv1alpha1.KomputerAgentPhase
	var message string

	if errors.IsNotFound(err) {
		phase = komputerv1alpha1.AgentPhasePending
		message = "Waiting for pod creation"
	} else if err != nil {
		return ctrl.Result{}, err
	} else {
		switch pod.Status.Phase {
		case corev1.PodPending:
			phase = komputerv1alpha1.AgentPhasePending
			message = "Pod is pending"
		case corev1.PodRunning:
			phase = komputerv1alpha1.AgentPhaseRunning
			message = "Agent is running"
		case corev1.PodSucceeded:
			phase = komputerv1alpha1.AgentPhaseSucceeded
			message = "Agent completed"
		case corev1.PodFailed:
			phase = komputerv1alpha1.AgentPhaseFailed
			message = "Agent pod failed"
		default:
			phase = komputerv1alpha1.AgentPhasePending
			message = "Unknown pod state"
		}
	}

	return r.updateStatus(ctx, agent, phase, message, func() {
		agent.Status.PodName = podName
		agent.Status.PvcName = pvcName
		if phase == komputerv1alpha1.AgentPhaseRunning && agent.Status.StartTime == nil {
			now := metav1.Now()
			agent.Status.StartTime = &now
		}
		if (phase == komputerv1alpha1.AgentPhaseSucceeded || phase == komputerv1alpha1.AgentPhaseFailed) && agent.Status.CompletionTime == nil {
			now := metav1.Now()
			agent.Status.CompletionTime = &now
		}
	})
}

func (r *KomputerAgentReconciler) updateStatus(ctx context.Context, agent *komputerv1alpha1.KomputerAgent, phase komputerv1alpha1.KomputerAgentPhase, message string, extras ...func()) (ctrl.Result, error) {
	agent.Status.Phase = phase
	agent.Status.Message = message
	for _, fn := range extras {
		fn()
	}
	if err := r.Status().Update(ctx, agent); err != nil {
		return ctrl.Result{}, err
	}
	return ctrl.Result{}, nil
}

// SetupWithManager sets up the controller with the Manager.
func (r *KomputerAgentReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&komputerv1alpha1.KomputerAgent{}).
		Owns(&corev1.Pod{}).
		Owns(&corev1.PersistentVolumeClaim{}).
		Complete(r)
}
```

- [ ] **Step 4: The controller also needs to create a ConfigMap for the config.json. Add this to ensurePod, before building the pod.**

Add a `ensureConfigMap` method and call it from `ensurePod`. Insert in the same file:

```go
func (r *KomputerAgentReconciler) ensureConfigMap(ctx context.Context, agent *komputerv1alpha1.KomputerAgent, configMapName, configJSON string) error {
	cm := &corev1.ConfigMap{}
	err := r.Get(ctx, types.NamespacedName{Name: configMapName, Namespace: agent.Namespace}, cm)
	if err == nil {
		return nil // Already exists
	}
	if !errors.IsNotFound(err) {
		return err
	}

	cm = &corev1.ConfigMap{
		ObjectMeta: metav1.ObjectMeta{
			Name:      configMapName,
			Namespace: agent.Namespace,
			Labels: map[string]string{
				"komputer.ai/agent-name": agent.Name,
			},
		},
		Data: map[string]string{
			"config.json": configJSON,
		},
	}

	if err := controllerutil.SetControllerReference(agent, cm, r.Scheme); err != nil {
		return err
	}

	return r.Create(ctx, cm)
}
```

Update the `ensurePod` method to call `ensureConfigMap` before creating the pod. Replace the section after `configJSON, err := r.buildConfigJSON(...)`:

```go
	// Ensure ConfigMap exists for the config.json
	configMapName := podName + "-config"
	if err := r.ensureConfigMap(ctx, agent, configMapName, configJSON); err != nil {
		return err
	}

	// Build pod from template
	pod = r.buildPod(agent, template, pvcName, podName)
```

Also add RBAC for ConfigMaps. Add this marker above the Reconcile function alongside the others:

```go
// +kubebuilder:rbac:groups=core,resources=configmaps,verbs=get;list;watch;create;update;patch;delete
```

- [ ] **Step 5: Run tests**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator
make generate
make manifests
make test
```

Expected: PVC creation test passes.

- [ ] **Step 6: Commit**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai
git add komputer-operator/
git commit -m "feat(operator): implement KomputerAgent controller with PVC and Pod creation"
```

---

### Task 6: Add test for pod recreation on termination

**Files:**
- Modify: `komputer-operator/internal/controller/komputeragent_controller_test.go`

- [ ] **Step 1: Add test for pod recreation**

Append to the existing test file, inside the outer `Describe` block:

```go
	Context("When an agent pod is terminated", func() {
		It("should recreate the pod", func() {
			ctx := context.Background()

			// The agent and template from the previous test should still exist.
			// Verify the pod exists.
			podKey := types.NamespacedName{Name: "test-agent-pod", Namespace: "default"}
			pod := &corev1.Pod{}
			Eventually(func() error {
				return k8sClient.Get(ctx, podKey, pod)
			}, timeout, interval).Should(Succeed())

			// Delete the pod to simulate termination
			Expect(k8sClient.Delete(ctx, pod)).Should(Succeed())

			// The controller should recreate it
			newPod := &corev1.Pod{}
			Eventually(func() error {
				return k8sClient.Get(ctx, podKey, newPod)
			}, timeout, interval).Should(Succeed())

			// Verify it's a new pod (different UID)
			Expect(newPod.UID).NotTo(Equal(pod.UID))
		})
	})
```

- [ ] **Step 2: Run tests**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator
make test
```

Expected: Both tests pass. The controller detects the missing pod via the Owns watch and recreates it.

- [ ] **Step 3: Commit**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai
git add komputer-operator/
git commit -m "test(operator): add pod recreation test"
```

---

### Task 7: Add test for config.json content and env vars

**Files:**
- Modify: `komputer-operator/internal/controller/komputeragent_controller_test.go`

- [ ] **Step 1: Add test verifying pod has correct env vars and config**

Append inside the outer `Describe` block:

```go
	Context("When verifying agent pod configuration", func() {
		It("should have correct env vars injected", func() {
			ctx := context.Background()
			podKey := types.NamespacedName{Name: "test-agent-pod", Namespace: "default"}
			pod := &corev1.Pod{}
			Eventually(func() error {
				return k8sClient.Get(ctx, podKey, pod)
			}, timeout, interval).Should(Succeed())

			container := pod.Spec.Containers[0]

			envMap := map[string]string{}
			for _, e := range container.Env {
				envMap[e.Name] = e.Value
			}

			Expect(envMap["KOMPUTER_INSTRUCTIONS"]).To(Equal("Do a test task"))
			Expect(envMap["KOMPUTER_MODEL"]).To(Equal("claude-sonnet-4-20250514"))
			Expect(envMap["KOMPUTER_AGENT_NAME"]).To(Equal("test-agent"))
		})

		It("should have workspace volume mount", func() {
			ctx := context.Background()
			podKey := types.NamespacedName{Name: "test-agent-pod", Namespace: "default"}
			pod := &corev1.Pod{}
			Eventually(func() error {
				return k8sClient.Get(ctx, podKey, pod)
			}, timeout, interval).Should(Succeed())

			container := pod.Spec.Containers[0]

			mountPaths := map[string]bool{}
			for _, m := range container.VolumeMounts {
				mountPaths[m.MountPath] = true
			}

			Expect(mountPaths["/workspace"]).To(BeTrue())
			Expect(mountPaths["/etc/komputer"]).To(BeTrue())
		})

		It("should create a ConfigMap with config.json", func() {
			ctx := context.Background()
			cmKey := types.NamespacedName{Name: "test-agent-pod-config", Namespace: "default"}
			cm := &corev1.ConfigMap{}
			Eventually(func() error {
				return k8sClient.Get(ctx, cmKey, cm)
			}, timeout, interval).Should(Succeed())

			Expect(cm.Data).To(HaveKey("config.json"))

			var config map[string]interface{}
			err := json.Unmarshal([]byte(cm.Data["config.json"]), &config)
			Expect(err).NotTo(HaveOccurred())

			redisConf := config["redis"].(map[string]interface{})
			Expect(redisConf["address"]).To(Equal("redis:6379"))
			Expect(redisConf["queue"]).To(Equal("komputer-events"))
		})
	})
```

Add `"encoding/json"` to the imports in the test file.

- [ ] **Step 2: Run tests**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator
make test
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai
git add komputer-operator/
git commit -m "test(operator): add tests for pod env vars, volume mounts, and config"
```

---

### Task 8: Remove unused template and redis config controllers

**Files:**
- Delete: `komputer-operator/internal/controller/komputeragenttemplate_controller.go`
- Delete: `komputer-operator/internal/controller/komputerredisconfig_controller.go`
- Modify: `komputer-operator/cmd/main.go`

- [ ] **Step 1: Remove the scaffolded controllers for template and redis config**

These CRDs don't need their own controllers — they're read by the KomputerAgent controller. Delete the files:

```bash
rm /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator/internal/controller/komputeragenttemplate_controller.go
rm /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator/internal/controller/komputerredisconfig_controller.go
```

Also remove their test files if they exist:

```bash
rm -f /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator/internal/controller/komputeragenttemplate_controller_test.go
rm -f /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator/internal/controller/komputerredisconfig_controller_test.go
```

- [ ] **Step 2: Update cmd/main.go to remove references to deleted controllers**

In `komputer-operator/cmd/main.go`, find and remove the `SetupWithManager` calls for `KomputerAgentTemplateReconciler` and `KomputerRedisConfigReconciler`. Keep only the `KomputerAgentReconciler` setup.

- [ ] **Step 3: Verify it builds and tests pass**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator
make generate
make manifests
go build ./...
make test
```

Expected: Builds and all tests pass.

- [ ] **Step 4: Commit**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai
git add komputer-operator/
git commit -m "refactor(operator): remove unused template and redis config controllers"
```

---

### Task 9: Add .gitignore and final cleanup

**Files:**
- Create: `komputer-operator/.gitignore`
- Create: `komputer-ai/.gitignore` (root)

- [ ] **Step 1: Create root .gitignore**

Create `/Users/amitdebachar/Documents/projects/komputer-ai/.gitignore`:

```
# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
```

- [ ] **Step 2: Verify the operator .gitignore exists (scaffolded by operator-sdk)**

Check if `komputer-operator/.gitignore` was created by the scaffold. If not, create one:

```
# Binaries
bin/
testbin/

# Build
*.o
*.exe
```

- [ ] **Step 3: Run full build and test one final time**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai/komputer-operator
make generate
make manifests
go build ./...
make test
```

Expected: Everything builds and all tests pass.

- [ ] **Step 4: Commit**

```bash
cd /Users/amitdebachar/Documents/projects/komputer-ai
git add .gitignore komputer-operator/
git commit -m "chore: add gitignore files and final cleanup"
```

---

## Verification

After completing all tasks, verify the operator end-to-end:

1. **CRDs generate correctly:**
   ```bash
   cd komputer-operator && make manifests
   ls config/crd/bases/
   ```
   Expected: 3 CRD YAML files for KomputerAgent, KomputerAgentTemplate, KomputerRedisConfig.

2. **All tests pass:**
   ```bash
   make test
   ```
   Expected: All tests pass (PVC creation, pod recreation, env vars, volume mounts, config.json).

3. **Binary builds:**
   ```bash
   go build ./...
   ```
   Expected: No errors.

4. **Sample CRs exist:**
   ```bash
   ls config/samples/
   ```
   Expected: 3 sample YAML files.
