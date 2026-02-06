# WayAI Configuration

WayAI is a platform for building AI-powered communication hubs that connect AI Assistants with human teams across channels like WhatsApp, Email, Instagram, and a native app. You can configure agents, tools, and connections to automate and augment conversations — all managed from a single hub.

This repository is a version-controlled workspace for the WayAI platform configuration. It gives you full context about the hubs, agents, and tools — and lets you make changes directly on the platform through MCP. The local workspace stays in sync with the remote platform, so every configuration change is reviewable, trackable, and reversible through git.

All platform operations (creating hubs, configuring agents, managing tools, etc.) are done through the **WayAI MCP server** configured in `.mcp.json`. Detailed instructions, workflows, and reference docs are in the skill at `.claude/skills/wayai/` — **read `SKILL.md` before making any changes**.

## Workflow

1. **Sync before working**: Download workspace from remote — the platform is the source of truth
2. **Make changes**: Use WayAI MCP tools to apply changes on the platform (follow SKILL.md workflows)
3. **Sync after changes**: Download workspace again so local files reflect the new state
4. **Commit**: Git commit the updated workspace as a versioned snapshot

## Sync Procedure

The platform is the source of truth. The local `workspace/` directory is a Markdown mirror — used for agent context, user review, and git history.

```
Session start
  └─ download_workspace → unzip → git diff (see what changed remotely)

Making changes
  └─ Use MCP tools to apply changes on the platform
      └─ download_workspace → unzip → git diff (reflect what was just changed)

End of session
  └─ git commit (snapshot the final state)
```

How to sync:

```bash
download_workspace()  # MCP tool — returns a download URL (expires in 5 min)
curl -L "<url>" -o workspace.zip && unzip -o workspace.zip -d ./
```

## Repository Structure

```
CLAUDE.md                     # This file — agent instructions
.claude/skills/wayai/         # WayAI skill - START HERE
├── SKILL.md                  # Workflows and prerequisites
├── references/               # Detailed reference docs
└── assets/templates/         # Hub templates
workspace/                    # Local copy of remote workspace
.mcp.json                     # MCP server configuration
```
