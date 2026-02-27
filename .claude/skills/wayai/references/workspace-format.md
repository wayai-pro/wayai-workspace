# Workspace Format (HubAsCode)

Conventions for the workspace directory structure and `wayai.yaml` configuration format.

## Table of Contents
- [Directory Structure](#directory-structure)
- [Slugification Rules](#slugification-rules)
- [wayai.yaml Structure](#wayaiyaml-structure)
- [Kanban Statuses](#kanban-statuses)
- [Agent Instructions](#agent-instructions)
- [Resources](#resources)
- [Evals](#evals)
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
        ├── wayai.yaml                    # Hub config + agents + tools + states + resources
        ├── agents/                       # Agent instruction files
        │   ├── pilot.md                  # Instructions for "Pilot Agent"
        │   └── specialist-billing.md     # Instructions for "Specialist - Billing"
        ├── evals/                        # Evaluation scenario files (synced to backend)
        │   ├── greeting.yaml             # eval_name = "greeting", eval_path = null
        │   └── order-issues/             # Subfolder = eval_path
        │       └── cancellation.yaml     # eval_name = "cancellation", eval_path = "order-issues"
        ├── resources/                    # Resource files (synced to backend)
        │   ├── product-catalog/          # Knowledge resource
        │   │   ├── pricing.md
        │   │   └── catalog.pdf
        │   └── order-management/         # Skill resource
        │       ├── SKILL.md
        │       └── references/
        │           └── api-docs.md
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
      order: 0
      color: "#22c55e"
      isInitialStatus: true
      triggersAgentResponse: true
    - name: In Progress
      order: 1
      color: "#3b82f6"
      allowsAgentUpdate: true
    - name: Waiting for Customer
      order: 2
      color: "#f59e0b"
      followups:
        - order: 0
          type: inactivity
          threshold: 30
          timeUnit: minutes
          message: "Hi! Just checking in — do you still need help?"
    - name: Scheduled
      order: 3
      color: "#8b5cf6"
      isSchedulingStatus: true
      eventName: appointment
      followups:
        - order: 0
          type: before_event
          threshold: 1
          timeUnit: hours
          message: "Reminder: your appointment is in 1 hour."
          excludedWeekDays: [0, 6]
          excludedTimeStart: "22:00"
          excludedTimeEnd: "08:00"
    - name: Resolved
      order: 4
      color: "#ef4444"
      isTerminalStatus: true

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
    resources:                          # agent-resource linkages
      - name: Product Catalog
        resource_id: "resource-uuid-123"
        priority: 0
      - name: Order Management
        resource_id: "skill-uuid-456"
        priority: 1
        use_native_integration: false   # skill-only: tool-based (false) vs provider-native (true)

resources:
  - id: "resource-uuid-123"             # stable ID (set by pull)
    name: Product Catalog
    # type: knowledge                   # 'knowledge' (default, omitted) | 'skill'
    description: Product documentation and pricing
    # enabled: true                     # default, omitted
    # user_browsable: false             # default, omitted
    # Files live on disk at resources/product-catalog/ (scanned automatically)

  - id: "skill-uuid-456"
    name: Order Management
    type: skill
    skill_name: order-management         # auto-derived from name if omitted
    description: Handles order queries and management

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
- **Default omission:** Fields matching defaults are omitted to keep YAML concise (e.g., `enabled: true` is default, only `enabled: false` appears). Kanban statuses follow the same rule: boolean flags default to `false` (only `true` appears), `excludeHolidays` defaults to `true` (only `false` appears), and empty followup arrays are omitted
- **Connections:** Non-OAuth connections listed here are auto-created by `wayai push` from matching organization credentials. Each entry needs `name`, `type` (connector type), and `service` (connector service name). Optional `credential` field disambiguates when multiple org credentials share the same auth type (e.g., two API Key credentials). OAuth connections must be set up via UI.

### Entity matching (for sync/diff)

Entities are matched by **`id` first** (stable UUID), then by name as fallback. This enables safe renaming — when an entity is matched by ID but the name differs, the diff engine treats it as a rename (update), not delete + create.

| Entity | Primary match | Fallback match |
|--------|--------------|----------------|
| Agent | `id` | `name` (unique per hub) |
| State | `id` | `name` + `scope` |
| Resource | `id` | `name` (unique per hub) |
| Resource file | `id` | `path` (relative path within resource) |
| Native tool | `tool_name` (per agent) | — |
| Custom tool | `id` | `name` (per agent) |
| Delegation tool | `target` name (per agent) | — |
| Agent-resource link | `(agent_id, resource_id)` | — |
| Eval | `id` | `name` + `path` (composite) |

The `id` field is set automatically by `wayai pull` and should not be edited manually. Agents, custom tools, states, and evals without an `id` fall back to name-based matching (backwards-compatible).

## Kanban Statuses

Kanban statuses define workflow stages for conversations in `support` and `task` views. They are configured in `wayai.yaml` under `hub.kanban_statuses`.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Status display name (unique per hub) |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | string | — | Stable UUID (set by pull) |
| `order` | number | — | Display order (0-based) |
| `color` | string | — | Hex color code (e.g., `"#22c55e"`) |
| `isInitialStatus` | boolean | `false` | New conversations start in this status |
| `triggersAgentResponse` | boolean | `false` | Moving to this status triggers an AI response |
| `allowsAgentUpdate` | boolean | `false` | AI can update conversations in this status |
| `isTerminalStatus` | boolean | `false` | Moving here ends the conversation |
| `isSchedulingStatus` | boolean | `false` | Enables time-based event scheduling |
| `eventName` | string | — | Event name for scheduling (used with `before_event` followups) |
| `additional_instructions` | string | — | Extra instructions for the AI when conversation is in this status |
| `label_additional_context` | string | — | Additional context label shown in UI |
| `followups` | array | — | Time-based followup messages (see below) |

### Followups

Followups are automated messages triggered by time conditions. Two types:

**`inactivity`** — sent after a period of no activity:
```yaml
followups:
  - order: 0
    type: inactivity
    threshold: 30
    timeUnit: minutes
    message: "Are you still there?"
```

**`before_event`** — sent before a scheduled event (requires `isSchedulingStatus: true`):
```yaml
followups:
  - order: 0
    type: before_event
    threshold: 1
    timeUnit: hours
    message: "Your appointment is in 1 hour."
```

### Followup Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `order` | number | yes | — | Execution order (0-based) |
| `type` | enum | yes | — | `inactivity` or `before_event` |
| `threshold` | number | yes | — | Time value |
| `timeUnit` | enum | yes | — | `seconds`, `minutes`, `hours`, or `days` |
| `message` | string | yes | — | Message text to send |
| `excludedWeekDays` | number[] | no | `[]` | Days to skip (0=Sun, 6=Sat) |
| `excludeHolidays` | boolean | no | `true` | Skip holidays |
| `excludedTimeStart` | string | no | — | Start of quiet hours (e.g., `"22:00"`) |
| `excludedTimeEnd` | string | no | — | End of quiet hours (e.g., `"08:00"`) |

### Default Omission

On `wayai pull`, default values are stripped to keep YAML concise:
- Boolean flags (`isInitialStatus`, `triggersAgentResponse`, etc.) — omitted when `false`
- `excludeHolidays` — omitted when `true` (platform default)
- Empty `followups` arrays — omitted entirely

## Agent Instructions

Agent instructions are stored in separate `.md` files under `agents/` for easier editing and diff-friendly PRs:

- **Path convention:** `agents/{slugified-agent-name}.md` — resolved automatically by the parser (no explicit path needed in YAML)
- **How it works:** The parser looks for `agents/{slugify(agent.name)}.md` and inlines the content when pushing. No `instructions` key is needed in `wayai.yaml`.
- **Explicit path (optional):** You can still set `instructions: agents/custom-name.md` in YAML to override the convention
- **Content:** Pure instruction text (no frontmatter, no metadata)
- Supports dynamic placeholders: `{{now()}}`, `{{user_name()}}`, `{{state()}}`, etc. — see [agent-placeholders.md](agent-placeholders.md)

**Renaming agents:** When you rename an agent (change `name:` in YAML while keeping the same `id:`), `wayai push` automatically renames the `.md` file to match the new slug. No manual file rename needed.

## Resources

Resources are knowledge bases (documents) or skills (versioned agent capability packages) that can be attached to agents. Resource files are stored on the filesystem and synced bidirectionally.

### Directory Structure

```
resources/
├── product-catalog/          # Knowledge resource (slugified name)
│   ├── pricing.md            # Text file — editable, diffable
│   ├── catalog.pdf           # Binary file — uploaded as asset
│   └── images/
│       └── logo.png
└── order-management/         # Skill resource
    ├── SKILL.md              # Skill entry point (YAML frontmatter required)
    └── references/
        └── api-docs.md
```

### Resource Types

- **`knowledge`** (default) — document collections (FAQ, product docs, manuals). Files are indexed for AI retrieval.
- **`skill`** — versioned agent capability packages. Must contain a `SKILL.md` with YAML frontmatter (`name`, `description`). Optional `references/` subfolder for supporting docs.

### YAML Configuration

Resources are declared in `wayai.yaml` under `resources:`. File content lives on disk — the `files` key is **not** included in YAML (filesystem is source of truth).

```yaml
resources:
  - id: "resource-uuid"           # stable ID (set by pull)
    name: Product Catalog
    # type: knowledge             # default, omitted
    description: Product docs
    # enabled: true               # default, omitted
    # user_browsable: false       # default, omitted

  - id: "skill-uuid"
    name: Order Management
    type: skill
    skill_name: order-management  # auto-derived from name if omitted
    description: Handles order queries
```

### Agent-Resource Linkages

Agent `resources` entries link resources to agents (parallel to `tools`):

```yaml
agents:
  - name: Sales Agent
    resources:
      - name: Product Catalog       # matches resource name
        resource_id: "resource-uuid" # stable ID
        priority: 0
      - name: Order Management
        resource_id: "skill-uuid"
        priority: 1
        use_native_integration: false  # skill-only: tool-based (false) vs provider-native (true)
```

### Text vs Binary Files

- **Text files** (`.md`, `.txt`, `.json`, `.yaml`, `.html`, `.css`, `.js`, `.ts`, etc.) — content is inlined for push, editable by AI agents, diffable in git
- **Binary files** (`.pdf`, `.png`, `.jpg`, `.gif`, `.mp4`, `.zip`, `.woff2`, etc.) — base64-encoded for push, downloaded via signed URLs on pull
- Detection uses a deny-list of known binary extensions — unknown extensions are treated as text
- **Size limit:** 10MB per file. Files exceeding this are skipped with a warning.
- **Change detection:** SHA-256 hash comparison. Only changed files are uploaded on push.

## Evals

Evals are test scenarios for verifying agent behavior. Each eval is stored as a separate YAML file in the `evals/` directory, making them easy to review and version in git.

### Directory Structure

```
evals/
├── greeting.yaml                    # eval_name = "greeting", eval_path = null
├── order-issues/                    # Subfolder = eval_path
│   ├── cancellation.yaml            # eval_name = "cancellation", eval_path = "order-issues"
│   └── refund.yaml                  # eval_name = "refund", eval_path = "order-issues"
└── a/b/c/                           # Arbitrary nesting depth supported
    └── deep-test.yaml               # eval_name = "deep-test", eval_path = "a/b/c"
```

### File Format

```yaml
# evals/order-issues/cancellation.yaml
id: "eval-uuid-123"                  # stable ID (set by pull, do not edit)
name: Order Cancellation             # original name (only when it differs from filename slug)
agent: Pilot                         # resolved to responder_agent_fk
agent_id: "agent-uuid-456"           # stable ref (set by pull)
runs: 3                              # default 1, omitted if 1
enabled: false                       # default true, omitted if true

history:                             # message_history (omitted if empty)
  - role: user
    content: "I placed order #12345"
  - role: assistant
    content: "I can see order #12345."

input:                               # message_text (required)
  role: user
  content: "Cancel it please"

expected:                            # message_expected_response (required)
  role: assistant
  tool_calls:
    - function:
        name: cancel_order
        arguments: '{"order_id": "12345"}'

evaluator_instructions: |
  The agent MUST call cancel_order with the correct order_id.
```

### Key Rules

- **Filename = eval name:** The filename without extension becomes `eval_name` (e.g., `cancellation.yaml` → `eval_name = "cancellation"`). If the original name differs from its slug (e.g., `"Order Cancellation"` → `order-cancellation.yaml`), an explicit `name` field is included in the YAML and takes precedence over the filename.
- **Subfolder = eval path:** Subfolder hierarchy maps to `eval_path` (e.g., `order-issues/cancellation.yaml` → `eval_path = "order-issues"`)
- **Agent reference:** `agent` is the agent display name; `agent_id` is the stable UUID (set by pull)
- **Default omission:** `runs: 1` and `enabled: true` are defaults and omitted when matching
- **Entity matching:** Matched by `id` first (stable UUID), then by `name:path` composite key as fallback

### Entity Matching (for sync/diff)

| Entity | Primary match | Fallback match |
|--------|--------------|----------------|
| Eval | `id` | `name` + `path` (composite) |

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
