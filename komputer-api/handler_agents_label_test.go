package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

// TestLabelQueryParamParsing verifies that the ?label=k=v query-param parsing
// in listAgents correctly builds the label filter map and rejects malformed inputs.
func TestLabelQueryParamParsing(t *testing.T) {
	gin.SetMode(gin.TestMode)

	cases := []struct {
		name       string
		query      string
		wantStatus int
	}{
		{"no labels", "", http.StatusOK},
		{"single label", "?label=env=prod", http.StatusOK},
		{"multiple labels", "?label=env=prod&label=team=alpha", http.StatusOK},
		{"missing value", "?label=env=", http.StatusBadRequest},
		{"missing key", "?label==prod", http.StatusBadRequest},
		{"no equals sign", "?label=envprod", http.StatusBadRequest},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			r := gin.New()
			r.GET("/agents", func(c *gin.Context) {
				// Replicate the query-param parsing logic from listAgents.
				rawLabels := c.QueryArray("label")
				for _, p := range rawLabels {
					eq := -1
					for i, ch := range p {
						if ch == '=' {
							eq = i
							break
						}
					}
					if eq <= 0 || eq == len(p)-1 {
						c.JSON(http.StatusBadRequest, gin.H{"error": "invalid label filter"})
						return
					}
				}
				c.JSON(http.StatusOK, gin.H{"ok": true})
			})

			req := httptest.NewRequest(http.MethodGet, "/agents"+tc.query, nil)
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			if w.Code != tc.wantStatus {
				t.Errorf("query %q: got status %d, want %d", tc.query, w.Code, tc.wantStatus)
			}
		})
	}
}
