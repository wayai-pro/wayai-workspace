# WayAI Configuration

WayAI is a platform for building AI-powered communication hubs that connect AI Assistants with human teams across channels like WhatsApp, Email, Instagram, and a native app. You can configure agents, tools, and connections to automate and augment conversations — all managed from a single hub.

This repository is a version-controlled workspace for the WayAI platform configuration. It gives you full context about the hubs, agents, and tools — and lets you make changes directly on the platform through MCP. The local workspace stays in sync with the remote platform, so every configuration change is reviewable, trackable, and reversible through git.

All platform operations (creating hubs, configuring agents, managing tools, etc.) are done through the **WayAI MCP server** configured in `.mcp.json`. Non-OAuth connections (LLM providers, custom tools, STT/TTS) can be created via MCP using **organization credentials** — pre-stored API keys at the org level. OAuth connections (WhatsApp, Instagram, Gmail) still require UI setup. Detailed instructions, workflows, and reference docs are in the skill at `.claude/skills/wayai/` — **read `SKILL.md` before making any changes**.

## Hub Environments

Hubs use a **preview/production branching** model. New hubs start as `preview` (editable). Use `publish_hub` for first-time promotion, `sync_hub` to push subsequent changes, and `replicate_preview` to create experimental previews from production. Production hubs are **read-only** — all config changes must flow through a preview hub. See SKILL.md for details.

### MCP Access Modes

Each hub has an `mcp_access` setting that determines how changes flow:

- **`read_write`** — Agent edits hub directly via MCP tools. Agile, no git needed. Best for rapid iteration.
- **`read_only`** — Changes must flow through git: edit YAML files → PR → GitHub Action syncs to preview → test → merge → publish to production. Governed workflow.
- **`disabled`** — No MCP access. Hub managed via UI only.

### GitOps Workflow (for `read_only` hubs)

When a production hub has `mcp_access: read_only`, configuration changes are managed as code:

1. **Edit hub config files** — modify `wayai.yaml` and `agents/*.md` in `workspace/<project>/<hub>/`
2. **Create a PR** — GitHub Action detects changed hub folders and creates a branch preview per production hub
3. **Test the preview** — verify changes work as expected
4. **Merge the PR** — GitHub Action syncs and publishes each changed hub to production

GitOps only applies to **production hubs**. Preview-only hubs are managed via MCP/UI.

## Agent Goal

Your primary role is to manage hub settings for the user through the WayAI MCP server. When the user asks you to do anything hub-related:

1. **Identify the hub** — determine which hub the request applies to. If it's not clear from context, **ask the user before proceeding**. Never guess or assume.
2. **Read CONTEXT.md** — before starting work on a hub, read `workspace/<hub_folder>/CONTEXT.md` for background on that hub's purpose, configuration decisions, and ongoing work.
3. **Create CONTEXT.md if missing** — if the file doesn't exist after downloading the workspace, create it with what you know about the hub (name, description, purpose, key agents and tools, any relevant decisions). If you're uncertain about any details, ask the user to confirm or enrich it.
4. **Update CONTEXT.md when relevant** — after making significant changes or learning new context about a hub (purpose clarifications, design decisions, configuration rationale), update the file so future sessions start with accurate context.
5. **Create a `references/` folder for supporting files** — if the hub needs additional reference material (e.g., business rules, example flows, tone guides, API specs), create a `references/` folder inside the hub folder and place files there. Reference them from `CONTEXT.md` so future sessions know what's available.

The `CONTEXT.md` file is a living document — it ensures continuity across sessions and prevents repeated questions about the same hub.

## CLI Setup

The WayAI CLI (`@wayai/cli`) is the recommended tool for syncing hub configuration between local files and the platform. Install and authenticate once:

```bash
npm install -g @wayai/cli
wayai login          # Opens browser for OAuth — or use `wayai login --token` for headless/CI
wayai init           # Link repo to your organization (creates .wayai.yaml)
```

## Workflow

1. **Sync before working**: `wayai pull --all` to fetch all hub configs from platform to local files
2. **Make changes**: Use WayAI MCP tools to apply changes on the platform (follow SKILL.md workflows)
3. **Sync after changes**: `wayai pull --all` again so local files reflect the new state
4. **Commit**: Git commit the updated workspace as a versioned snapshot

To push local changes to the platform: `wayai push` from the repo root auto-detects changed hubs via git status and pushes each one.

## Sync

There are two types of sync — keep them distinct:

### Workspace sync (platform → local)

Syncs your hub configuration from the platform into the local `workspace/` directory. The platform is the source of truth — the local files are a Markdown mirror for agent context, user review, and git history.

```bash
# Recommended: WayAI CLI (from repo root)
wayai pull --all                 # Pull all hubs in workspace
wayai pull --all -y              # Same, skip confirmation prompts
wayai pull support/customer-hub  # Pull a specific hub (resolves to workspace/ folder)
wayai push                       # Auto-detect changed hubs via git, push each
wayai push -y                    # Same, skip confirmation prompts
wayai push support/customer-hub  # Push a specific hub

# Alternative (MCP): download_workspace
download_workspace(organization="My Org")  # Returns a download URL (expires in 5 min)
curl -L "<url>" -o workspace.zip && unzip -o workspace.zip -d ./
```

The CLI is workspace-aware — from the repo root it resolves hub paths to `workspace/project/hub/` folders automatically. Use `--yes` / `-y` to skip confirmation prompts (useful for scripting and CI).

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

## Workspace Format (HubAsCode)

Each hub folder in `workspace/` contains structured YAML config plus separate `.md` files for agent instructions:

```
workspace/<project>/<hub>/
├── wayai.yaml              # Hub config + agents + tools + states (structured, diffable)
├── agents/
│   ├── pilot.md            # Instructions for "Pilot Agent" (slugified name)
│   └── specialist-billing.md
├── CONTEXT.md              # Living notes — purpose, decisions, ongoing work (NOT synced to backend)
└── references/             # Supporting files (NOT synced to backend)
```

### `wayai.yaml` key fields

- **`hub_id`** and **`hub_environment`** — read-only metadata at top level. Do not edit these.
- **`hub`** — hub settings (name, ai_mode, timezone, permissions, SLA, kanban, etc.)
- **`agents`** — list of agents with `id` (stable UUID, set by pull), `name`, `role`, `connection` (display name), `settings`, `tools`. Instructions are resolved by convention from `agents/{slugified-name}.md` (no explicit path needed in YAML)
- **`states`** — conversation/user state schemas
- **`connections`** — read-only reference showing available connections (managed via UI/MCP, not synced back)

Agents reference connections by display name. Tools are grouped as `native` (platform built-ins), `delegation` (agent-to-agent/team), and `custom` (HTTP endpoints).

## Repository Structure

```
CLAUDE.md                     # This file — agent instructions
.wayai.yaml                   # Repo config — organization scope (created by `wayai init`)
.claude/skills/wayai/         # WayAI skill - START HERE
├── SKILL.md                  # Workflows and prerequisites
├── references/               # Detailed reference docs
└── assets/templates/         # Hub templates
.github/
├── actions/wayai-sync/       # GitOps action (sync, publish, cleanup)
└── workflows/wayai-hub-sync.yml  # PR/merge workflow for hub changes
workspace/                    # Local copy of remote workspace (org-scoped)
├── <project>/<hub>/
│   ├── wayai.yaml            # Hub configuration (synced from platform)
│   ├── agents/               # Agent instruction files
│   ├── CONTEXT.md            # Hub context — purpose, decisions, ongoing work
│   └── references/           # Supporting files referenced by CONTEXT.md
.mcp.json                     # MCP server configuration
```

Preview hubs use disambiguated folder names: `hub-slug-<preview_label>`, `hub-slug-<branch_name>`, or `hub-slug-<hub_id_prefix>`. Production hubs use plain `hub-slug`.
