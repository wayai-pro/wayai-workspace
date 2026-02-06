# WayAI Configuration

WayAI is a platform for building AI-powered communication hubs that connect AI Assistants with human teams across channels like WhatsApp, Email, Instagram, and a native app. You can configure agents, tools, and connections to automate and augment conversations — all managed from a single hub.

This repository is a version-controlled workspace for the WayAI platform configuration. It gives you full context about the hubs, agents, and tools — and lets you make changes directly on the platform through MCP. The local workspace stays in sync with the remote platform, so every configuration change is reviewable, trackable, and reversible through git.

All platform operations (creating hubs, configuring agents, managing tools, etc.) are done through the **WayAI MCP server** configured in `.mcp.json`. Detailed instructions, workflows, and reference docs are in the skill at `.claude/skills/wayai/` — **read `SKILL.md` before making any changes**.

## Workflow

1. **Sync before working**: Download workspace from remote — the platform is the source of truth
2. **Make changes**: Use WayAI MCP tools to apply changes on the platform (follow SKILL.md workflows)
3. **Sync after changes**: Download workspace again so local files reflect the new state
4. **Commit**: Git commit the updated workspace as a versioned snapshot

## Sync

There are two types of sync — keep them distinct:

### Workspace sync (platform → local)

Syncs your hub configuration from the platform into the local `workspace/` directory. The platform is the source of truth — the local files are a Markdown mirror for agent context, user review, and git history.

```bash
download_workspace()  # MCP tool — returns a download URL (expires in 5 min)
curl -L "<url>" -o workspace.zip && unzip -o workspace.zip -d ./
```

When to sync:
- **Before working** — catch changes made outside the agent (UI, other users)
- **After changes** — reflect what was just applied via MCP tools

### Repository sync (template → local)

Syncs the repo with the upstream template to get the latest skill files, instructions, and templates.

```bash
git fetch template && git merge template/main
```

If the `template` remote isn't set up yet:

```bash
git remote add template https://github.com/wayai-resources/wayai.git
git fetch template && git merge template/main --allow-unrelated-histories
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
