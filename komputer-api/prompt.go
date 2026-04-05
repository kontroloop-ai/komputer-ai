package main

import _ "embed"

//go:embed prompts/shared.md
var sharedPrompt string

//go:embed prompts/worker.md
var workerPromptFile string

//go:embed prompts/manager.md
var managerPromptFile string

var workerSystemPrompt = workerPromptFile + "\n" + sharedPrompt
var managerSystemPrompt = managerPromptFile + "\n" + sharedPrompt
