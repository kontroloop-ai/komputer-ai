package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/testutil"
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

func TestHTTPMiddlewareIncrementsCounter(t *testing.T) {
	_, _ = newMetricsRegistries(false)
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(metricsMiddleware())
	r.GET("/foo", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{}) })

	req := httptest.NewRequest("GET", "/foo", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	count := testutil.ToFloat64(httpRequestsTotal.WithLabelValues("GET", "/foo", "200"))
	if count != 1 {
		t.Errorf("expected 1 request counted, got %v", count)
	}
}

func TestHTTPMiddlewareObservesDuration(t *testing.T) {
	_, _ = newMetricsRegistries(false)
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(metricsMiddleware())
	r.GET("/bar", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{}) })

	req := httptest.NewRequest("GET", "/bar", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Histogram count should be 1 after one request
	count := testutil.CollectAndCount(httpRequestDuration)
	if count == 0 {
		t.Errorf("expected histogram to have observations")
	}
}
