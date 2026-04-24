package main

import (
	"github.com/prometheus/client_golang/prometheus"
)

// Populated at build time via -ldflags "-X main.version=... -X main.commit=..."
var (
	version = "dev"
	commit  = "unknown"
)

// perAgentLabelsEnabled controls whether agent_name appears as a real value or ""
// on per-agent metrics. Set once at startup.
var perAgentLabelsEnabled bool

// Two separate registries — kept apart so /api/metrics and /agent/metrics
// can be scraped by different ServiceMonitors with different retention/cardinality
// budgets if the operator wants.
var (
	apiRegistry   *prometheus.Registry
	agentRegistry *prometheus.Registry
)

// Per-registry metric handles. Initialized eagerly so they are always non-nil.
var (
	httpRequestsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "komputer_api_http_requests_total",
			Help: "Total HTTP requests received by the API.",
		},
		[]string{"method", "path", "status"},
	)
	agentTasksTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "komputer_agent_tasks_total",
			Help: "Total agent task lifecycle transitions (started, completed, cancelled, errored).",
		},
		[]string{"namespace", "model", "outcome", "agent_name"},
	)

	// Build-info gauges (value=1) give each registry at least one active metric
	// and expose version information to dashboards.
	apiBuildInfo = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "komputer_api_build_info",
			Help: "Always 1; exposes build metadata labels for dashboards.",
		},
		[]string{"version", "commit"},
	)
	agentBuildInfo = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "komputer_agent_build_info",
			Help: "Always 1; exposes build metadata labels for dashboards.",
		},
		[]string{"version", "commit"},
	)
)

// newMetricsRegistries creates fresh registries and registers all metric handles.
// Called once from SetupRoutes. The perAgentLabels flag controls whether
// agent_name appears as a real value or as the empty string on per-agent metrics.
func newMetricsRegistries(perAgentLabels bool) (*prometheus.Registry, *prometheus.Registry) {
	perAgentLabelsEnabled = perAgentLabels

	apiRegistry = prometheus.NewRegistry()
	agentRegistry = prometheus.NewRegistry()

	apiRegistry.MustRegister(httpRequestsTotal)
	apiRegistry.MustRegister(apiBuildInfo)
	agentRegistry.MustRegister(agentTasksTotal)
	agentRegistry.MustRegister(agentBuildInfo)

	apiBuildInfo.WithLabelValues(version, commit).Set(1)
	agentBuildInfo.WithLabelValues(version, commit).Set(1)

	return apiRegistry, agentRegistry
}

// agentNameLabel returns the agent name when perAgentLabels is enabled, "" otherwise.
// Always include this in the label set on per-agent metrics so dashboards stay schema-stable.
func agentNameLabel(name string) string {
	if perAgentLabelsEnabled {
		return name
	}
	return ""
}
