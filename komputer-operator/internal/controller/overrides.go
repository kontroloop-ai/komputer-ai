package controller

import (
	komputerv1alpha1 "github.com/komputer-ai/komputer-operator/api/v1alpha1"
)

// applyAgentOverrides returns a deep copy of the template with the agent's
// podSpec and/or storage overrides applied wholesale. Pure function — does NOT
// mutate inputs. Overrides only affect future pod / PVC creation; existing pods
// and PVCs are not modified.
func applyAgentOverrides(template *komputerv1alpha1.KomputerAgentTemplate, agent *komputerv1alpha1.KomputerAgent) *komputerv1alpha1.KomputerAgentTemplate {
	out := template.DeepCopy()
	if agent.Spec.PodSpec != nil {
		out.Spec.PodSpec = *agent.Spec.PodSpec.DeepCopy()
	}
	if agent.Spec.Storage != nil {
		out.Spec.Storage = *agent.Spec.Storage.DeepCopy()
	}
	return out
}
