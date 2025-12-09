# Export & Import

## Overview

Export WayAI configurations to Markdown for version control. Import from Markdown to update the platform.

**Key principle:** The database is the source of truth. Markdown files are working copies for version control and editing.

## Quick Export (Recommended)

Use `export_workspace` to generate a zip file with all your configurations:

```
User: "Export my workspace"

Claude:
1. export_workspace() → returns download URL
2. Download and extract zip
3. Replace local org folders with extracted files
4. Review changes with git diff
```

The zip contains:
- `workspace.md` - Overview of all orgs/projects/hubs
- `{org}/{project}/{hub}/hub.md` - Hub settings and connections
- `{org}/{project}/{hub}/{agent}.md` - Agent configurations

### Sync Workflow

```bash
# 1. Check for local changes first
git status

# 2. If dirty, commit or stash changes
git stash

# 3. Download export (URL from export_workspace)
curl -L "https://..." -o workspace-export.zip

# 4. Extract to temp location
unzip -o workspace-export.zip -d /tmp/workspace-export

# 5. Remove old org folders (keep .claude/)
rm -rf */  # Removes org folders only

# 6. Copy new files
cp -r /tmp/workspace-export/* .

# 7. Review and commit
git diff
git add .
git commit -m "Sync workspace from database"

# 8. Restore any stashed changes if needed
git stash pop
```

## Manual Export Workflow (MCP → Markdown)

For granular control or partial exports, use individual MCP tools:

### Step 1: Fetch Current State

```
get_workspace() → discover all orgs, projects, hubs
get_hub(hub_id) → full hub schema with agents and tools
get_agent(hub_id, agent_id, include_instructions=true) → full agent details
```

### Step 2: Convert to Markdown

Use templates from [entities/](../entities/) to convert JSON to Markdown:

**Hub → hub.md** (includes connections table)
```markdown
---
_wayai_id: abc-123
name: Support Hub
description: Customer support automation
hub_type: user
ai_mode: Pilot+Copilot
followup_message: Need anything else?
inactivity_interval: 10
---

# Support Hub

Customer support automation

## Connections

| Name | Type | Status |
|------|------|--------|
| WhatsApp Business | whatsapp | enabled |
| OpenAI | agent | enabled |

## Agents

| Agent | Role | File |
|-------|------|------|
| Support Agent | Pilot | `support-agent.md` |
| Escalation Agent | Specialist for Pilot | `escalation-agent.md` |
```

**Agent → {agent-slug}.md**
```markdown
---
_wayai_id: def-456
name: Support Agent
role: Pilot
model: gpt-4o
temperature: 0.7
tools:
  native:
    - web_search
    - send_email
  custom:
    - name: check_order
      description: Check order status
      method: GET
      endpoint: /orders/{id}
---

You are a helpful support agent...
```

### Step 3: Save to Repository

```
workspace.md                        # Updated with workspace overview
acme-corp/                          # Organization folder
└── customer-support/               # Project folder
    └── support-hub/                # Hub folder
        ├── hub.md                  # Hub settings + connections
        ├── support-agent.md        # Agent file
        └── escalation-agent.md     # Agent file
```

## Import Workflow (Markdown → MCP)

### Step 1: Read Markdown Files

```
Read hub.md → parse YAML frontmatter + body
Read *.md (excluding hub.md) → parse each agent
```

### Step 2: Compare with Current State

```
get_hub(hub_id) → current state
Compare fields → identify changes
```

### Step 3: Apply Changes via MCP

**Hub changes:**
```
update_hub(hub_id, name="...", description="...", ai_mode="...")
```

**Agent changes:**
```
update_agent(hub_id, agent_id, name="...", instructions="...")
```

**Tool changes:**
```
add_native_tool(hub_id, agent_id, tool_id)
remove_tool(hub_id, agent_id, tool_id)
add_custom_tool(hub_id, agent_id, tool_name="...", ...)
```

## File Structure Convention

### Directory Layout

```
workspace.md                        # Workspace overview (orgs/projects/hubs)
{org-slug}/                         # Organization folder
└── {project-slug}/                 # Project folder
    └── {hub-slug}/                 # Hub folder
        ├── hub.md                  # Hub settings + connections table
        └── {agent-slug}.md         # Agent files (one per agent)
```

### Slugification Rules

Convert names to URL-safe slugs:

| Original | Slug |
|----------|------|
| `Mario's Pizza` | `marios-pizza` |
| `Order Taker Agent` | `order-taker-agent` |
| `Support Hub 2.0` | `support-hub-20` |

Rules:
1. Lowercase
2. Replace spaces with hyphens
3. Remove special characters (except hyphens)
4. Remove consecutive hyphens

### System Fields

Fields prefixed with `_wayai_` are system-managed:

| Field | Description |
|-------|-------------|
| `_wayai_id` | Database primary key - NEVER edit |
| `_wayai_created_at` | Creation timestamp |
| `_wayai_updated_at` | Last update timestamp |

Claude uses `_wayai_id` to match files to database records.

## Full Export Example

### Using export_workspace (Recommended)

```
User: "Export my workspace"

Claude:
1. export_workspace()

   Workspace Export Ready!
   Download URL: https://...signed-url...
   Expires in: 300 seconds

2. Check git status for uncommitted changes
3. Download: curl -L "URL" -o workspace-export.zip
4. Extract: unzip -o workspace-export.zip -d /tmp/workspace-export
5. Remove old org folders, copy new files
6. git diff to review changes
7. git commit -m "Sync workspace from database"

"Exported 2 organizations, 5 hubs to zip. Download URL expires in 5 minutes."
```

### Using Manual Export

```
User: "Export just the Support Hub"

Claude:
1. get_workspace() → find hub_id

2. get_hub(hub_id) → full schema
   get_agent(hub_id, agent_1, include_instructions=true)
   get_agent(hub_id, agent_2, include_instructions=true)

3. Convert and save:
   workspace.md (update with current state)
   acme-corp/customer-support/support-hub/hub.md
   acme-corp/customer-support/support-hub/support-agent.md
   acme-corp/customer-support/support-hub/escalation-agent.md

"Exported Support Hub with 2 agents to Markdown."
```

## Full Import Example

```
User: "I updated the support agent instructions, sync to platform"

Claude:
1. Read support-agent.md → parse changes
2. get_agent(hub_id, agent_id) → current state
3. Compare → instructions changed

4. update_agent(hub_id, agent_id, instructions="...")

"Updated Support Agent instructions in platform."
```
