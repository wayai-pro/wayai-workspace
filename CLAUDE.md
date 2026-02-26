# WayAI Configuration

## Platform Overview

WayAI is a SaaS platform for AI-powered communication hubs. Each hub connects AI agents with human teams across channels (WhatsApp, Email, Instagram, native App).

**Entity hierarchy:** Organization → Project → Hub → Agents, Connections, Tools, Channels, States

**Hub types:**
- `chat` — one conversation per end user, all channels (support, sales, helpdesk)
- `task` — multiple conversations per user, App channel only (tasks, approvals)

**AI modes:** `Pilot` (AI autonomous) | `Copilot` (AI assists humans) | `Pilot+Copilot` (AI handles until human takes over) | `Turned Off`

**Agent roles:**
- **Pilot** / **Copilot** — primary agents for each track
- **Specialist** (for Pilot or Copilot) — delegation targets for specific tasks
- **Consultant** (for Pilot or Copilot) — advisory input, then returns control
- **Monitor** — background observer
- **Evaluator** (of Conversations or Messages) — async quality assessment

**Connections** link hubs to external services: LLM providers (required for agents), messaging channels, tool APIs, speech services. OAuth connections (WhatsApp, Instagram, Gmail) require UI setup; non-OAuth connections are auto-created by `wayai push` from organization credentials.

**Tools** give agents capabilities: native (platform built-ins like web_search, send_email, transfer_to_human), custom (HTTP API endpoints), MCP (from MCP servers), and delegation (agent-to-agent/team handoff).

**Hub environments:** Hubs start as `preview` (editable) and can be published to `production` (read-only, serves live traffic). All config changes flow through preview → sync → production.

## Security

This repo syncs to a public template — never include internal implementation details in any file: backend/database schema, RLS policies, authentication internals, secret management, or source code structure. User-facing platform concepts (hub types, agent roles, MCP operations) are fine.

## This Repository

This is a version-controlled workspace for a **single WayAI hub**. Hub settings, agents, tools, and states are stored as local files (`wayai.yaml` + `agents/*.md`) that sync bidirectionally with the platform via the WayAI CLI.

The repository is scoped to one hub via `.wayai.yaml` at the repo root. All CLI commands (`pull`, `push`) operate on that hub only.

Every configuration change is reviewable, trackable, and reversible through git. Local files are the edit surface — changes flow through files → `wayai push` → platform. Always `wayai pull` before editing to catch out-of-band changes.

Detailed instructions, workflows, and reference docs are in `.claude/skills/wayai/SKILL.md` — **read it before making changes**.

## How to Make Changes

**Files + CLI (`wayai push`)** — for all hub config:
- Hub settings (name, ai_mode, timezone, permissions, SLA, kanban, etc.)
- Agents (name, role, model, temperature, tools)
- Agent instructions (edit `.md` files in `agents/`)
- States (conversation/user state schemas)
- Custom tools (name, path, method, body)
- Connections (non-OAuth — auto-created from org credentials during push)

**MCP (read-only + runtime):**
- `get_workspace` — discover orgs, projects, hubs
- `get_hub` — inspect current hub state
- `get_agent`, `download_agent_instructions` — inspect agent config
- Analytics → `get_analytics_data`, `get_conversations_list`, `get_conversation_messages`
- Evals → `get_evals`, `get_eval_session_details`, `get_eval_session_runs`, `get_eval_analytics`
- Evals (write) → `create_eval`, `run_eval_session`

**UI only (one-time setup):**
- Organization, org credentials, project, hub creation
- OAuth connections (WhatsApp, Instagram, Gmail)
- Delete hubs
- Publish/sync to production
- User management, MCP access mode

## Workflow

1. **Pull** — `wayai pull -y` to sync local files from platform (catches out-of-band changes)
2. **Edit** — modify `wayai.yaml` and `agents/*.md` in `workspace/<project>/<hub>/`
3. **Push** — `wayai push` to apply changes to the preview hub
4. **Commit** — `git commit` and push to `main`; CI syncs changes to the preview hub automatically
5. **Go live** — when ready, sync to production via the platform UI

For analytics and evals, use MCP read tools. After any out-of-band changes, run `wayai pull -y` to sync back to local files, then commit.

## Hub Environments

Hubs use a **preview/production branching** model:

- **New hubs** start as `preview` — edit freely
- **Publish** — first-time promotion creates a `production` hub cloned from preview (via platform UI)
- **Sync** — pushes subsequent preview changes to the linked production hub (via platform UI)
- **Replicate Preview** — creates a new preview from production for experimentation (via platform UI)
- **Production is read-only** — all config changes must flow through a preview hub

Only preview hubs are tracked in this repository. Production hubs are not stored in git — their state lives in the platform database.

- **Preview hubs**: CI syncs automatically on every push to `main`. No branching or PRs required.
- **Production hubs**: not tracked in git. Sync to production explicitly via the platform UI when ready to go live.

## Agent Goal

Your primary role is to help the user manage hub configuration through this repository. When the user asks you to do anything hub-related:

1. **Check `.wayai.yaml`** — if `hub_id` is set, use it. If not, ask which hub to work on, call `get_workspace()` via MCP to list hubs, then run `wayai init --hub <hub-id>` to scope the repo.
2. **Update the CLI** — run `npm install -g @wayai/cli@latest` to ensure you are always on the latest version before any CLI operation.
3. **Pull the hub** — run `wayai pull -y` to sync local files from the platform and catch any out-of-band changes before editing.
4. **Read CONTEXT.md** — check `workspace/<hub_folder>/CONTEXT.md` for background on the hub's purpose, decisions, and ongoing work.
5. **Create CONTEXT.md if missing** — after syncing, create it with what you know about the hub. Ask the user to confirm or enrich.
6. **Make changes via files, then push immediately** — edit `wayai.yaml` and `agents/*.md`, then run `wayai push -y` as part of the same flow. Editing and pushing are a single action — always complete both together. Use MCP only for operations without file equivalents (see [How to Make Changes](#how-to-make-changes)).
7. **Update CONTEXT.md** — after significant changes or new context, update the file for future sessions.
8. **Use `references/`** for supporting files — business rules, API specs, tone guides. Reference them from `CONTEXT.md`.

The `CONTEXT.md` file is a living document — it ensures continuity across sessions and prevents repeated questions about the same hub.

## CLI Setup

Install and authenticate the WayAI CLI (`@wayai/cli`):

```bash
npm install -g @wayai/cli@latest   # Install or update to the latest version
wayai login                        # Opens browser for OAuth — or `wayai login --token` for headless/CI
```

Scope the repo to a hub (creates `.wayai.yaml` at repo root):

```bash
wayai init              # Interactive — picks org/project/hub
wayai init --hub <uuid> # Direct — sets hub_id, fetches org/project info
```

The generated file looks like:
```yaml
organization_id: your-org-uuid
organization_name: Your Org          # optional — for readability
project_id: your-project-uuid
project_name: Your Project           # optional — for readability
hub_id: your-hub-uuid
hub_name: Your Hub                   # optional — for readability
```

### CLI Commands

```bash
wayai pull              # Pull hub config from platform to local files
wayai push              # Push local changes to the platform
wayai status            # Show workspace status (org, project, hub)
# Add -y to skip confirmation prompts
```

## Sync

### Workspace operations

```bash
# Pull: platform → local (before working)
wayai pull              # Fetch hub config, shows diff, asks for confirmation

# Push: local → platform (after editing)
wayai push              # Shows diff, asks for confirmation

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
git remote add template https://github.com/wayai-pro/wayai-workspace.git
git fetch template && git merge template/main --allow-unrelated-histories
```

## Workspace Format (HubAsCode)

The hub folder in `workspace/` contains structured YAML config plus separate `.md` files for agent instructions:

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
- **`connections`** — connection definitions (non-OAuth auto-created from org credentials during push)

Agents reference connections by display name. Tools are grouped as `native` (platform built-ins), `delegation` (agent-to-agent/team), and `custom` (HTTP endpoints). Renaming: change the `name` field — the `id` ensures it's detected as rename, not delete+create.

## Repository Structure

```
CLAUDE.md                     # This file — agent instructions
.wayai.yaml                   # Repo config — organization_id, project_id, hub_id
.claude/skills/wayai/         # WayAI skill — workflows, references, templates
├── SKILL.md                  # Start here for detailed workflows
├── references/               # Platform reference docs
└── assets/templates/         # Hub templates
.github/
├── actions/wayai-sync/       # GitOps action (sync hub on push to main)
└── workflows/wayai-hub-sync.yml
workspace/                    # Local copy of hub configuration
├── <project>/<hub>/
│   ├── wayai.yaml
│   ├── agents/
│   ├── CONTEXT.md
│   └── references/
.mcp.json                     # MCP server connection
```

Only preview hubs are stored under `workspace/`. Preview hub folders use disambiguated names: `hub-slug-<preview_label>`, `hub-slug-<branch_name>`, or `hub-slug-<hub_id_prefix>`.
