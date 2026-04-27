// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://komputer-ai.github.io',
	base: '/komputer-ai',
	integrations: [
		starlight({
			title: 'Komputer.AI',
			description: 'Distributed Claude AI agents on Kubernetes',
			logo: {
				src: './src/assets/logo.png',
				replacesTitle: true,
			},
			favicon: '/favicon.ico',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/komputer-ai/komputer-ai' },
			],
			editLink: {
				baseUrl: 'https://github.com/komputer-ai/komputer-ai/edit/main/docs-site/',
			},
			customCss: ['./src/styles/custom.css'],
			tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'index' },
						{ label: 'Concepts', slug: 'getting-started/concepts' },
						{ label: 'Local Development', slug: 'getting-started/local-development' },
					],
				},
				{
					label: 'Features',
					items: [
						{ label: 'Squads', slug: 'features/squads' },
						{ label: 'Connectors (MCP)', slug: 'features/connectors-mcp-status' },
						{ label: 'Custom Agent Image', slug: 'features/custom-agent-image' },
					],
				},
				{
					label: 'Operations',
					items: [
						{ label: 'Logging', slug: 'operations/logging' },
						{ label: 'Monitoring', slug: 'operations/monitoring' },
					],
				},
				{
					label: 'Integration',
					items: [
						{ label: 'Integration Guide', slug: 'integration/integration-guide' },
					],
				},
			],
		}),
	],
});
