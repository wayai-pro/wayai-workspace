# WayAI Configuration

## Platform Overview

WayAI is a SaaS platform for AI-powered communication hubs. Each hub connects AI agents with human teams across channels (WhatsApp, Email, Instagram, native App).

**Entity hierarchy:** Organization → Project → Hub → Agents, Connections, Tools, Channels, States

**Hub types:**
- `user` — one conversation per end user, all channels (support, sales, helpdesk)
- `workflow` — multiple conversations per user, App channel only (tasks, approvals)

**AI modes:** `Pilot` (AI autonomous) | `Copilot` (AI assists humans) | `Pilot+Copilot` (AI handles until human takes over) | `Turned Off`

**Agent roles:**
- **Pilot** / **Copilot** — primary agents for each track
- **Specialist** (for Pilot or Copilot) — delegation targets for specific tasks
- **Consultant** (for Pilot or Copilot) — advisory input, then returns control
- **Monitor** — background observer
- **Evaluator** (of Conversations or Messages) — async quality assessment

**Connections** link hubs to external services: LLM providers (required for agents), messaging channels, tool APIs, speech services. OAuth connections (WhatsApp, Instagram, Gmail) require UI setup; non-OAuth can be created via MCP using org-level credentials.

**Tools** give agents capabilities: native (platform built-ins like web_search, send_email, transfer_to_human), custom (HTTP API endpoints), MCP (from MCP servers), and delegation (agent-to-agent/team handoff).

**Hub environments:** Hubs start as `preview` (editable) and can be published to `production` (read-only, serves live traffic). All config changes flow through preview → sync → production.

## This Repository

This is a version-controlled workspace for WayAI hub configuration. Hub settings, agents, tools, and states are stored as local files (`wayai.yaml` + `agents/*.md`) that sync bidirectionally with the platform via the WayAI CLI.

Every configuration change is reviewable, trackable, and reversible through git. Local files are the edit surface — changes flow through files → `wayai push` → platform. Always `wayai pull` before editing to catch out-of-band changes.

Detailed instructions, workflows, and reference docs are in `.claude/skills/wayai/SKILL.md` — **read it before making changes**.

## How to Make Changes

**Default: edit files + CLI push** — for all config managed in `wayai.yaml` and `agents/*.md`:
- Hub settings (name, ai_mode, timezone, permissions, SLA, kanban, etc.)
- Agents (name, role, model, temperature, tools)
- Agent instructions (edit `.md` files in `agents/`)
- States (conversation/user state schemas)
- Custom tools (name, path, method, body)

**MCP — for operations without file equivalents:**
- Create new hubs → `create_hub` (then populate via files + push)
- Manage connections → `add_connection`, `enable_connection`, `disable_connection`
- Publish/sync environments → `publish_hub`, `sync_hub`, `replicate_preview`
- Analytics → `get_analytics_data`, `get_conversations_list`, `get_conversation_messages`
- Evals → `create_eval`, `run_eval_session`, `get_eval_session_details`
- Skills → `create_skill`, `link_skill_to_agent`

**MCP reads (discovery/inspection):**
- `get_workspace` — discover orgs, projects, hubs
- `get_hub` — inspect current hub state
- `get_agent`, `download_agent_instructions` — inspect agent config
- `list_organization_credentials` — check available API credentials

**UI only:**
- OAuth connections (WhatsApp, Instagram, Gmail)
- Delete hubs
- Organization/user management

## Workflow

1. **Pull** — `wayai pull --all` to sync local files from platform (catches out-of-band changes)
2. **Edit** — modify `wayai.yaml` and `agents/*.md` in `workspace/<project>/<hub>/`
3. **Push** — `wayai push` to apply changes to the preview hub
4. **PR** — create a PR for review; CI pushes to preview hub (idempotent safety net)
5. **Merge** — CI pushes final state and syncs preview to production (if linked)

For operations without file equivalents (connections, publish/sync, analytics, evals), use MCP tools directly. After MCP changes, run `wayai pull --all -y` to sync back to local files, then commit.

## Hub Environments

Hubs use a **preview/production branching** model:

- **New hubs** start as `preview` — edit freely
- **`publish_hub`** — first-time promotion creates a `production` hub cloned from preview
- **`sync_hub`** — pushes subsequent preview changes to the linked production hub
- **`replicate_preview`** — creates a new preview from production for experimentation
- **Production is read-only** — all config changes must flow through a preview hub

CI handles both hub environments:
- **Preview hubs**: CI pushes config directly. On merge, also syncs to production if linked.
- **Production hubs** (legacy): CI creates/updates ephemeral branch previews. On merge, publishes and cleans up.

## Agent Goal

Your primary role is to help the user manage hub configuration through this repository. When the user asks you to do anything hub-related:

1. **Identify the hub** — determine which hub the request applies to. If unclear, **ask the user**. Never guess or assume.
2. **Read CONTEXT.md** — check `workspace/<hub_folder>/CONTEXT.md` for background on the hub's purpose, decisions, and ongoing work.
3. **Create CONTEXT.md if missing** — after syncing the workspace, create it with what you know about the hub. Ask the user to confirm or enrich.
4. **Make changes via files** — edit `wayai.yaml` and `agents/*.md`, then `wayai push`. Use MCP only for operations without file equivalents (see [How to Make Changes](#how-to-make-changes)).
5. **Update CONTEXT.md** — after significant changes or new context, update the file for future sessions.
6. **Use `references/`** for supporting files — business rules, API specs, tone guides. Reference them from `CONTEXT.md`.

The `CONTEXT.md` file is a living document — it ensures continuity across sessions and prevents repeated questions about the same hub.

## CLI Setup

Install and authenticate the WayAI CLI (`@wayai/cli`):

```bash
npm install -g @wayai/cli
wayai login          # Opens browser for OAuth — or `wayai login --token` for headless/CI
```

Link to your organization (creates `.wayai.yaml` at repo root):

```bash
wayai init              # Interactive — picks org/project
wayai init <org-name>   # Direct — creates .wayai.yaml with org ID
```

The generated file looks like:
```yaml
organization_id: your-org-uuid-here
project_id: your-project-uuid-here  # optional — enables 1-part hub paths
```

### CLI Commands

```bash
wayai pull --all                 # Pull all hubs from platform to local files
wayai pull support/customer-hub  # Pull a specific hub
wayai push                       # Auto-detect changed hubs via git, push each
wayai push support/customer-hub  # Push a specific hub
wayai status                     # Show workspace status
# Add -y to skip confirmation prompts
```

## Sync

### Workspace operations

```bash
# Pull: platform → local (before working)
wayai pull --all                 # Fetch all hubs, shows diff, asks for confirmation
wayai pull support/customer-hub  # Fetch a specific hub

# Push: local → platform (after editing)
wayai push                       # Detect changed hubs via git, shows diff, asks for confirmation
wayai push support/customer-hub  # Push a specific hub

# Alternative: MCP download (read-only snapshot)
download_workspace(organization="<org-name>")  # Returns download URL (5 min expiry)
curl -L "<url>" -o workspace.zip && unzip -o workspace.zip -d ./
```

Both `pull` and `push` show a diff before applying changes and wait for confirmation. Use `-y` to skip prompts (useful for scripting/CI).

When to use:
- **Pull before working** — catch changes made outside the repo (UI, other users, MCP)
- **Push after editing** — apply local file changes to the preview hub

### Repository sync (template -> local)

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
├── CONTEXT.md              # Living notes — purpose, decisions, ongoing work (NOT synced)
└── references/             # Supporting files (NOT synced)
```

### `wayai.yaml` key fields

- **`hub_id`** and **`hub_environment`** — read-only metadata. Do not edit.
- **`hub`** — hub settings (name, ai_mode, timezone, permissions, SLA, kanban, etc.)
- **`agents`** — list with `id` (stable UUID, set by pull), `name`, `role`, `connection` (display name), `settings`, `tools`. Instructions resolved by convention from `agents/{slugified-name}.md`
- **`states`** — conversation/user state schemas
- **`connections`** — read-only reference (managed via MCP/UI, not synced back)

Agents reference connections by display name. Tools are grouped as `native` (platform built-ins), `delegation` (agent-to-agent/team), and `custom` (HTTP endpoints). Renaming: change the `name` field — the `id` ensures it's detected as rename, not delete+create.

## Repository Structure

```
CLAUDE.md                     # This file — agent instructions
.wayai.yaml                   # Repo config — organization_id (and optional project_id)
.claude/skills/wayai/         # WayAI skill — workflows, references, templates
├── SKILL.md                  # Start here for detailed workflows
├── references/               # Platform reference docs
└── assets/templates/         # Hub templates
.github/
├── actions/wayai-sync/       # GitOps action (sync, publish, cleanup)
└── workflows/wayai-hub-sync.yml
workspace/                    # Local copy of remote workspace
├── <project>/<hub>/
│   ├── wayai.yaml
│   ├── agents/
│   ├── CONTEXT.md
│   └── references/
.mcp.json                     # MCP server connection
```

Preview hubs use disambiguated folder names: `hub-slug-<preview_label>`, `hub-slug-<branch_name>`, or `hub-slug-<hub_id_prefix>`. Production hubs use plain `hub-slug`.
