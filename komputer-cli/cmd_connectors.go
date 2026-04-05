package main

import (
	"encoding/json"
	"fmt"
	"net/url"
	"os"

	"github.com/spf13/cobra"
)

func registerConnectorCommands(root *cobra.Command) {
	// ── connector ──────────────────────────────────────────────────────────
	connCmd := &cobra.Command{
		Use:     "connector",
		Aliases: []string{"conn"},
		Short:   "Manage MCP connectors",
	}

	// ── connector list ──────────────────────────────────────────────────
	connCmd.AddCommand(&cobra.Command{
		Use:     "list",
		Aliases: []string{"ls"},
		Short:   "List all connectors",
		Run: func(cmd *cobra.Command, args []string) {
			jsonMode, _ := cmd.Flags().GetBool("json")
			ep := resolveEndpoint(cmd)
			data, status, err := apiRequest("GET", fmt.Sprintf("%s/api/v1/connectors%s", ep, nsQuery(cmd)), nil)
			if err != nil {
				if jsonMode {
					dieJSON("Request failed: "+err.Error(), 0)
				}
				fmt.Println(errorStyle.Render("Request failed: " + err.Error()))
				os.Exit(1)
			}
			if status != 200 {
				if jsonMode {
					dieJSON(fmt.Sprintf("API error (%d): %s", status, string(data)), status)
				}
				fmt.Println(errorStyle.Render(fmt.Sprintf("API error (%d): %s", status, string(data))))
				os.Exit(1)
			}
			var resp ConnectorListResponse
			json.Unmarshal(data, &resp)
			if jsonMode {
				printJSON(resp)
				return
			}
			if len(resp.Connectors) == 0 {
				fmt.Println(dimStyle.Render("No connectors found."))
				return
			}
			fmt.Println(titleStyle.Render(fmt.Sprintf("  %d connector(s)  ", len(resp.Connectors))))
			fmt.Println()
			nameW := len("NAME")
			svcW := len("SERVICE")
			urlW := len("URL")
			authW := len("AUTH")
			for _, c := range resp.Connectors {
				if len(c.Name) > nameW {
					nameW = len(c.Name)
				}
				if len(c.Service) > svcW {
					svcW = len(c.Service)
				}
				u := c.URL
				if len(u) > 40 {
					u = u[:40]
				}
				if len(u) > urlW {
					urlW = len(u)
				}
				auth := c.AuthType
				if auth == "" {
					auth = "none"
				}
				if len(auth) > authW {
					authW = len(auth)
				}
			}
			header := fmt.Sprintf("  %-*s  %-*s  %-*s  %-*s  %-6s  %s",
				nameW, "NAME", svcW, "SERVICE", urlW, "URL", authW, "AUTH", "AGENTS", "CREATED")
			fmt.Println(dimStyle.Render(header))
			for _, c := range resp.Connectors {
				urlStr := c.URL
				if len(urlStr) > 40 {
					urlStr = urlStr[:40] + "..."
				}
				auth := c.AuthType
				if auth == "" {
					auth = "none"
				}
				created := c.CreatedAt
				if len(created) > 10 {
					created = created[:10]
				}
				fmt.Printf("  %-*s  %-*s  %-*s  %-*s  %-6d  %s\n",
					nameW, c.Name, svcW, c.Service, urlW, urlStr, authW, auth, c.AttachedAgents, created)
			}
		},
	})

	// ── connector get ───────────────────────────────────────────────────
	connCmd.AddCommand(&cobra.Command{
		Use:   "get <name>",
		Short: "Get connector details and tools",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			jsonMode, _ := cmd.Flags().GetBool("json")
			ep := resolveEndpoint(cmd)

			// Fetch connector details
			data, status, err := apiRequest("GET", fmt.Sprintf("%s/api/v1/connectors/%s%s", ep, url.PathEscape(args[0]), nsQuery(cmd)), nil)
			if err != nil {
				if jsonMode {
					dieJSON("Request failed: "+err.Error(), 0)
				}
				fmt.Println(errorStyle.Render("Request failed: " + err.Error()))
				os.Exit(1)
			}
			if status == 404 {
				if jsonMode {
					dieJSON(fmt.Sprintf("Connector %q not found", args[0]), 404)
				}
				fmt.Println(errorStyle.Render(fmt.Sprintf("Connector %q not found", args[0])))
				os.Exit(1)
			}
			if status != 200 {
				if jsonMode {
					dieJSON(fmt.Sprintf("API error (%d): %s", status, string(data)), status)
				}
				fmt.Println(errorStyle.Render(fmt.Sprintf("API error (%d): %s", status, string(data))))
				os.Exit(1)
			}
			var c ConnectorResponse
			json.Unmarshal(data, &c)

			// Fetch tools
			var toolResp ConnectorToolResponse
			toolData, toolStatus, toolErr := apiRequest("GET", fmt.Sprintf("%s/api/v1/connectors/%s/tools%s", ep, url.PathEscape(args[0]), nsQuery(cmd)), nil)
			if toolErr == nil && toolStatus == 200 {
				json.Unmarshal(toolData, &toolResp)
			}

			if jsonMode {
				printJSON(map[string]any{"connector": c, "tools": toolResp.Tools})
				return
			}
			printConnector(c)

			// Display tools
			if len(toolResp.Tools) == 0 {
				fmt.Println(dimStyle.Render("  No tools available — the MCP server may be unreachable or require authentication."))
			} else {
				fmt.Println(dimStyle.Render("  ── Tools ──"))
				fmt.Println()
				nameW := len("NAME")
				for _, t := range toolResp.Tools {
					if len(t.Name) > nameW {
						nameW = len(t.Name)
					}
				}
				header := fmt.Sprintf("  %-*s  %s", nameW, "NAME", "DESCRIPTION")
				fmt.Println(dimStyle.Render(header))
				for _, t := range toolResp.Tools {
					desc := t.Description
					if len(desc) > 80 {
						desc = desc[:80] + "..."
					}
					fmt.Printf("  %-*s  %s\n", nameW, t.Name, desc)
				}
			}
			fmt.Println()
		},
	})

	// ── connector create ────────────────────────────────────────────────
	connCreateCmd := &cobra.Command{
		Use:   "create <name>",
		Short: "Create a new connector",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			jsonMode, _ := cmd.Flags().GetBool("json")
			ep := resolveEndpoint(cmd)
			service, _ := cmd.Flags().GetString("service")
			connURL, _ := cmd.Flags().GetString("url")
			token, _ := cmd.Flags().GetString("token")
			displayName, _ := cmd.Flags().GetString("display-name")
			ns, _ := cmd.Flags().GetString("namespace")

			if service == "" {
				msg := "--service is required"
				if jsonMode {
					dieJSON(msg, 400)
				}
				fmt.Println(errorStyle.Render(msg))
				os.Exit(1)
			}
			if connURL == "" {
				msg := "--url is required"
				if jsonMode {
					dieJSON(msg, 400)
				}
				fmt.Println(errorStyle.Render(msg))
				os.Exit(1)
			}

			body := map[string]interface{}{
				"name":     args[0],
				"service":  service,
				"url":      connURL,
				"authType": "token",
			}
			if displayName != "" {
				body["displayName"] = displayName
			}
			if ns != "" {
				body["namespace"] = ns
			}

			// If a token is provided, create a K8s secret first, then reference it
			if token != "" {
				secretName := args[0] + "-credentials"
				secretBody := map[string]interface{}{
					"name": secretName,
					"data": map[string]string{"token": token},
				}
				if ns != "" {
					secretBody["namespace"] = ns
				}
				sData, sStatus, sErr := apiRequest("POST", ep+"/api/v1/secrets", secretBody)
				if sErr != nil {
					if jsonMode {
						dieJSON("Failed to create secret: "+sErr.Error(), 0)
					}
					fmt.Println(errorStyle.Render("Failed to create secret: " + sErr.Error()))
					os.Exit(1)
				}
				if sStatus != 201 {
					if jsonMode {
						dieJSON(fmt.Sprintf("Secret creation error (%d): %s", sStatus, string(sData)), sStatus)
					}
					fmt.Println(errorStyle.Render(fmt.Sprintf("Secret creation error (%d): %s", sStatus, string(sData))))
					os.Exit(1)
				}
				body["authSecretName"] = secretName
				body["authSecretKey"] = "token"
			}

			data, status, err := apiRequest("POST", ep+"/api/v1/connectors", body)
			if err != nil {
				if jsonMode {
					dieJSON("Request failed: "+err.Error(), 0)
				}
				fmt.Println(errorStyle.Render("Request failed: " + err.Error()))
				os.Exit(1)
			}
			if status != 201 {
				if jsonMode {
					dieJSON(fmt.Sprintf("API error (%d): %s", status, string(data)), status)
				}
				fmt.Println(errorStyle.Render(fmt.Sprintf("API error (%d): %s", status, string(data))))
				os.Exit(1)
			}
			var c ConnectorResponse
			json.Unmarshal(data, &c)
			if jsonMode {
				printJSON(c)
				return
			}
			fmt.Println(successStyle.Render(fmt.Sprintf("✔ Connector %q created", args[0])))
		},
	}
	connCreateCmd.Flags().String("service", "", "Service type (e.g. github, slack, linear) (required)")
	connCreateCmd.Flags().String("url", "", "MCP server URL (required)")
	connCreateCmd.Flags().String("token", "", "Auth token — creates a secret named {name}-credentials automatically")
	connCreateCmd.Flags().String("display-name", "", "Display name")
	connCmd.AddCommand(connCreateCmd)

	// ── connector delete ────────────────────────────────────────────────
	connCmd.AddCommand(&cobra.Command{
		Use:     "delete <name>",
		Aliases: []string{"rm"},
		Short:   "Delete a connector",
		Args:    cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			jsonMode, _ := cmd.Flags().GetBool("json")
			ep := resolveEndpoint(cmd)
			data, status, err := apiRequest("DELETE", fmt.Sprintf("%s/api/v1/connectors/%s%s", ep, url.PathEscape(args[0]), nsQuery(cmd)), nil)
			if err != nil {
				if jsonMode {
					dieJSON("Request failed: "+err.Error(), 0)
				}
				fmt.Println(errorStyle.Render("Request failed: " + err.Error()))
				os.Exit(1)
			}
			if status != 200 {
				if jsonMode {
					dieJSON(fmt.Sprintf("API error (%d): %s", status, string(data)), status)
				}
				fmt.Println(errorStyle.Render(fmt.Sprintf("API error (%d): %s", status, string(data))))
				os.Exit(1)
			}
			if jsonMode {
				printJSON(map[string]any{"name": args[0], "deleted": true})
				return
			}
			fmt.Println(successStyle.Render(fmt.Sprintf("✔ Connector %q deleted", args[0])))
		},
	})

	// ── connector templates ─────────────────────────────────────────────
	connCmd.AddCommand(&cobra.Command{
		Use:   "templates",
		Short: "List available connector templates",
		Run: func(cmd *cobra.Command, args []string) {
			jsonMode, _ := cmd.Flags().GetBool("json")
			ep := resolveEndpoint(cmd)
			data, status, err := apiRequest("GET", ep+"/api/v1/connector-templates", nil)
			if err != nil {
				if jsonMode {
					dieJSON("Request failed: "+err.Error(), 0)
				}
				fmt.Println(errorStyle.Render("Request failed: " + err.Error()))
				os.Exit(1)
			}
			if status != 200 {
				if jsonMode {
					dieJSON(fmt.Sprintf("API error (%d): %s", status, string(data)), status)
				}
				fmt.Println(errorStyle.Render(fmt.Sprintf("API error (%d): %s", status, string(data))))
				os.Exit(1)
			}
			var resp ConnectorTemplateListResponse
			json.Unmarshal(data, &resp)
			if jsonMode {
				printJSON(resp)
				return
			}
			if len(resp.Templates) == 0 {
				fmt.Println(dimStyle.Render("No templates available."))
				return
			}
			fmt.Println(titleStyle.Render(fmt.Sprintf("  %d template(s)  ", len(resp.Templates))))
			fmt.Println()
			svcW := len("SERVICE")
			nameW := len("NAME")
			authW := len("AUTH")
			for _, t := range resp.Templates {
				if len(t.Service) > svcW {
					svcW = len(t.Service)
				}
				if len(t.DisplayName) > nameW {
					nameW = len(t.DisplayName)
				}
				if len(t.AuthType) > authW {
					authW = len(t.AuthType)
				}
			}
			header := fmt.Sprintf("  %-*s  %-*s  %-*s  %s", svcW, "SERVICE", nameW, "NAME", authW, "AUTH", "URL")
			fmt.Println(dimStyle.Render(header))
			for _, t := range resp.Templates {
				urlStr := t.URL
				if urlStr == "__custom__" {
					urlStr = "(custom)"
				}
				if len(urlStr) > 40 {
					urlStr = urlStr[:40] + "..."
				}
				fmt.Printf("  %-*s  %-*s  %-*s  %s\n", svcW, t.Service, nameW, t.DisplayName, authW, t.AuthType, urlStr)
			}
		},
	})

	// ── connector tools ─────────────────────────────────────────────────
	connCmd.AddCommand(&cobra.Command{
		Use:   "tools <name>",
		Short: "List available MCP tools for a connector",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			jsonMode, _ := cmd.Flags().GetBool("json")
			ep := resolveEndpoint(cmd)
			data, status, err := apiRequest("GET", fmt.Sprintf("%s/api/v1/connectors/%s/tools%s", ep, url.PathEscape(args[0]), nsQuery(cmd)), nil)
			if err != nil {
				if jsonMode {
					dieJSON("Request failed: "+err.Error(), 0)
				}
				fmt.Println(errorStyle.Render("Request failed: " + err.Error()))
				os.Exit(1)
			}
			if status != 200 {
				if jsonMode {
					dieJSON(fmt.Sprintf("API error (%d): %s", status, string(data)), status)
				}
				fmt.Println(errorStyle.Render(fmt.Sprintf("API error (%d): %s", status, string(data))))
				os.Exit(1)
			}
			var resp ConnectorToolResponse
			json.Unmarshal(data, &resp)
			if jsonMode {
				printJSON(resp)
				return
			}
			if len(resp.Tools) == 0 {
				fmt.Println(dimStyle.Render("No tools found — the MCP server may be unreachable or require authentication."))
				return
			}
			fmt.Println(titleStyle.Render(fmt.Sprintf("  %d tool(s) for %s  ", len(resp.Tools), args[0])))
			fmt.Println()
			nameW := len("NAME")
			for _, t := range resp.Tools {
				if len(t.Name) > nameW {
					nameW = len(t.Name)
				}
			}
			header := fmt.Sprintf("  %-*s  %s", nameW, "NAME", "DESCRIPTION")
			fmt.Println(dimStyle.Render(header))
			for _, t := range resp.Tools {
				desc := t.Description
				if len(desc) > 80 {
					desc = desc[:80] + "..."
				}
				fmt.Printf("  %-*s  %s\n", nameW, t.Name, desc)
			}
		},
	})

	root.AddCommand(connCmd)
}

func printConnector(c ConnectorResponse) {
	fmt.Println(headerStyle.Render(fmt.Sprintf("  %s  ", c.Name)))
	fmt.Println()
	row := func(label, value string) {
		fmt.Printf("  %s %s\n", labelStyle.Render(fmt.Sprintf("%-16s", label)), valueStyle.Render(value))
	}
	row("Service:", c.Service)
	if c.DisplayName != "" {
		row("Display Name:", c.DisplayName)
	}
	row("Namespace:", c.Namespace)
	row("URL:", c.URL)
	row("Type:", c.Type)
	if c.AuthType != "" {
		row("Auth Type:", c.AuthType)
	}
	if c.OAuthStatus != "" {
		row("OAuth Status:", c.OAuthStatus)
	}
	if c.AuthSecretName != "" {
		row("Auth Secret:", fmt.Sprintf("%s / %s", c.AuthSecretName, c.AuthSecretKey))
	}
	row("Agents:", fmt.Sprintf("%d", c.AttachedAgents))
	if len(c.AgentNames) > 0 {
		for i, name := range c.AgentNames {
			if i == 0 {
				row("Agent Names:", name)
			} else {
				fmt.Printf("  %-16s %s\n", "", name)
			}
		}
	}
	row("Created:", c.CreatedAt)
	fmt.Println()
}
