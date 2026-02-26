# Workspace Format (HubAsCode)

Conventions for the workspace directory structure and `wayai.yaml` configuration format.

## Table of Contents
- [Directory Structure](#directory-structure)
- [Slugification Rules](#slugification-rules)
- [wayai.yaml Structure](#wayaiyaml-structure)
- [Agent Instructions](#agent-instructions)
- [Custom Tool Definition](#custom-tool-definition)
- [Download Workflow](#download-workflow)
- [Sync via GitOps](#sync-via-gitops)

## Directory Structure

```
.wayai.yaml                               # Repo config — organization scope (created by `wayai init`)
workspace/                                # Workspace folder (from download_workspace or wayai pull)
├── workspace.md                          # Workspace overview (projects/hubs index)
├── last-sync.md                          # Sync metadata
└── {project-slug}/                       # Project folder
    └── {hub-slug}-{label}/               # Preview hub folder
        ├── wayai.yaml                    # Hub config + agents + tools + states
        ├── agents/                       # Agent instruction files
        │   ├── pilot.md                  # Instructions for "Pilot Agent"
        │   └── specialist-billing.md     # Instructions for "Specialist - Billing"
        ├── CONTEXT.md                    # Living notes (NOT synced to backend)
        └── references/                   # Supporting files (NOT synced to backend)
```

Only preview hubs are stored in the repository. Production hubs are not tracked in git — their state lives in the platform database and is synced explicitly via the UI.

### Preview Hub Folder Naming

Preview hub folders use a suffix for disambiguation:
- **With `preview_label`:** `hub-slug-my-label`
- **Fallback (hub_id prefix):** `hub-slug-abc12345`

## Slugification Rules

Convert names to URL-safe slugs:

| Original | Slug |
|----------|------|
| `Mario's Pizza` | `marios-pizza` |
| `Pilot Agent` | `pilot-agent` |
| `Specialist - Billing` | `specialist-billing` |
| `Suporte Nível 2` | `suporte-nivel-2` |
| `Support Hub 2.0` | `support-hub-20` |

Rules:
1. Lowercase
2. Normalize accents (NFD + strip diacritics)
3. Replace non-alphanumeric with hyphens
4. Collapse consecutive hyphens
5. Remove leading/trailing hyphens
6. Limit to 50 characters

## wayai.yaml Structure

Hub configuration is stored as structured YAML. The file has these top-level sections:

```yaml
version: 1

# Read-only metadata (set by wayai pull, do not edit)
hub_id: "abc-123-def"
hub_environment: preview

hub:
  name: Customer Support
  description: AI-powered support hub
  hub_type: chat               # chat | task
  ai_mode: Pilot+Copilot      # Pilot | Copilot | Pilot+Copilot | Turned Off
  timezone: America/New_York
  app_permission: require_permission
  non_app_permission: not_allowed
  mcp_access: read_only        # disabled | read_only | read_write
  file_handling_mode: metadata_only
  max_file_size_for_attachment: 10485760
  inactivity_interval: 30
  followup_message: "Is there anything else I can help with?"
  hub_sla:
    time_threshold1: 60
    time_threshold2: 300
    time_threshold3: 600
  kanban_statuses:
    - name: New
    - name: In Progress
    - name: Resolved

agents:
  - id: "agent-uuid-123"             # stable ID (set by pull, used for rename detection)
    name: Pilot Agent
    role: Pilot
    connection: anthropic             # connection display name (must exist on hub)
    # instructions resolved by convention: agents/pilot-agent.md (slugified name)
    enabled: true
    include_message_timestamps: false
    settings:
      model: claude-sonnet-4-20250514
      temperature: 0.7
      max_tokens: 4096
    tools:
      native:
        - send_text_message
        - update_kanban_status
      delegation:
        - type: agent
          tool: transfer_to_agent
          target: Specialist - Billing
        - type: team
          tool: transfer_to_team
          target: Tier 2 Support
      custom:
        - id: "tool-uuid-456"        # stable ID (set by pull)
          name: check_order_status
          description: Check order status by email
          method: post
          path: /api/orders/status
          body_format: json
          connection: my-api-connection

states:
  - id: "state-uuid-789"            # stable ID (set by pull)
    name: order_tracking
    scope: conversation          # conversation | user
    description: Tracks current order
    enabled: true
    json_schema:
      type: object
      properties:
        order_id: { type: string }
        status: { type: string, enum: [pending, shipped, delivered] }
    initial_value: { order_id: null, status: null }

# Connections (non-OAuth auto-created from org credentials during push)
connections:
  - name: anthropic
    type: Agent
    service: Anthropic
  - name: my-api-connection
    type: Tool - Custom
    service: User Tool - API Key
```

### Key rules

- **`hub_id`**, **`hub_environment`**, and **`id`** fields are read-only — do not edit (set by `wayai pull`)
- **Agents** reference connections by `connection` display name (must match a connection on the hub or be defined in `connections`)
- **Tools** are grouped as `native` (by tool name), `delegation` (agent or team), and `custom` (HTTP endpoints)
- **Renaming:** To rename an agent, custom tool, or state, just change its `name` field in YAML — the `id` field ensures the diff engine detects it as a rename (not delete + create). For agents, `wayai push` also auto-renames the `.md` file.
- **Default omission:** Fields matching defaults are omitted to keep YAML concise (e.g., `enabled: true` is default, only `enabled: false` appears)
- **Connections:** Non-OAuth connections listed here are auto-created by `wayai push` from matching organization credentials. Each entry needs `name`, `type` (connector type), and `service` (connector service name). Optional `credential` field disambiguates when multiple org credentials share the same auth type (e.g., two API Key credentials). OAuth connections must be set up via UI.

### Entity matching (for sync/diff)

Entities are matched by **`id` first** (stable UUID), then by name as fallback. This enables safe renaming — when an entity is matched by ID but the name differs, the diff engine treats it as a rename (update), not delete + create.

| Entity | Primary match | Fallback match |
|--------|--------------|----------------|
| Agent | `id` | `name` (unique per hub) |
| State | `id` | `name` + `scope` |
| Native tool | `tool_name` (per agent) | — |
| Custom tool | `id` | `name` (per agent) |
| Delegation tool | `target` name (per agent) | — |

The `id` field is set automatically by `wayai pull` and should not be edited manually. Agents, custom tools, and states without an `id` fall back to name-based matching (backwards-compatible).

## Agent Instructions

Agent instructions are stored in separate `.md` files under `agents/` for easier editing and diff-friendly PRs:

- **Path convention:** `agents/{slugified-agent-name}.md` — resolved automatically by the parser (no explicit path needed in YAML)
- **How it works:** The parser looks for `agents/{slugify(agent.name)}.md` and inlines the content when pushing. No `instructions` key is needed in `wayai.yaml`.
- **Explicit path (optional):** You can still set `instructions: agents/custom-name.md` in YAML to override the convention
- **Content:** Pure instruction text (no frontmatter, no metadata)
- Supports dynamic placeholders: `{{now()}}`, `{{user_name()}}`, `{{state()}}`, etc. — see [agent-placeholders.md](agent-placeholders.md)

**Renaming agents:** When you rename an agent (change `name:` in YAML while keeping the same `id:`), `wayai push` automatically renames the `.md` file to match the new slug. No manual file rename needed.

## Custom Tool Definition

Custom tools in `wayai.yaml` under each agent's `tools.custom`:

```yaml
agents:
  - name: Order Agent
    tools:
      custom:
        - name: create_order
          description: Creates a new order
          method: POST
          path: /api/orders
          body_format: json
          connection: my-api-connection
          tool_instructions: "Use when the customer wants to place a new order"
        - name: get_menu
          description: Retrieves menu items
          method: GET
          path: /api/menu
          connection: my-api-connection
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Tool name (snake_case recommended) |
| `description` | string | What the tool does (for AI) |
| `method` | enum | HTTP method: GET, POST, PUT, DELETE, PATCH |
| `path` | string | URL path (appended to connection base URL) |
| `body_format` | string | `json` or `form` |
| `connection` | string | Display name of the Tool - Custom connection |
| `tool_instructions` | string | Usage instructions for the AI |

## Download Workflow

### Using WayAI CLI (Recommended)

```bash
wayai pull                       # Pull the hub specified in .wayai.yaml
wayai pull -y                    # Skip confirmation prompts
```

Each pull fetches the hub config from the platform, shows a diff against local files (if they exist), and writes `wayai.yaml` + `agents/*.md` on confirmation.

### Alternative: Using download_workspace (MCP)

```
1. download_workspace(organization="My Org") → download URL
2. Download and extract zip
3. Replace local workspace folders
4. git diff to review
5. git commit
```

### Downloading Agent Instructions

```
1. download_agent_instructions(hub_id, agent_id) → signed download URL
2. curl -L "{url}" -o workspace/{project}/{hub}/agents/{agentname}.md
3. Read the workspace file when needed
```

## Push Workflow

Push local changes to the platform using the WayAI CLI:

```bash
wayai push                       # Push the hub specified in .wayai.yaml
wayai push -y                    # Skip confirmation prompts
```

Each push parses local files, computes a diff against the current platform state, shows changes, and syncs the hub to the platform on confirmation.

After pushing:
1. Test the preview hub
2. Publish to production when ready (via platform UI)

## Sync via GitOps

Push to `main` → CI automatically syncs the hub to the platform:

```
1. Edit wayai.yaml and/or agents/*.md locally
2. wayai push -y                  → apply to preview hub immediately (optional but recommended)
3. git commit + push to main      → CI syncs the hub to the preview hub
4. Test the preview hub
5. Ready to go live? Sync to production via platform UI
```

The GitHub Action (`.github/actions/wayai-sync/`) reads `hub_id` from `.wayai.yaml`, finds the hub folder in `workspace/`, parses it, and calls the CI API to push changes. No PRs or branching required — commit directly to `main`.

## Key Principle

**Platform is the source of truth.** Workspace files are structured mirrors for agent context, user review, and git history. Always sync from platform before making changes.
