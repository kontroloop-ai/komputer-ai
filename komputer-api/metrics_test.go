package main

import (
	"testing"
)

func TestRegistriesAreSeparate(t *testing.T) {
	apiReg, agentReg := newMetricsRegistries(false)
	if apiReg == agentReg {
		t.Fatal("api and agent registries must be different instances")
	}
	// Verify the api registry is independently gatherable (not the global default).
	apiMetrics, err := apiReg.Gather()
	if err != nil {
		t.Fatalf("api gather: %v", err)
	}
	if len(apiMetrics) == 0 {
		t.Errorf("expected api registry to have metrics, got 0")
	}
	agentMetrics, err := agentReg.Gather()
	if err != nil {
		t.Fatalf("agent gather: %v", err)
	}
	if len(agentMetrics) == 0 {
		t.Errorf("expected agent registry to have metrics, got 0")
	}
}

func TestPerAgentLabelEnabled(t *testing.T) {
	_, _ = newMetricsRegistries(true)
	if !perAgentLabelsEnabled {
		t.Errorf("expected perAgentLabels=true after construction with true")
	}
}

func TestPerAgentLabelDisabled(t *testing.T) {
	_, _ = newMetricsRegistries(false)
	if perAgentLabelsEnabled {
		t.Errorf("expected perAgentLabels=false after construction with false")
	}
}
