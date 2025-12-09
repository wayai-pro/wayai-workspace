# Hubs

## Overview

Hubs are omnichannel entities where conversations happen between end users, AI agents, and support users across multiple channels (WhatsApp, Instagram, Email, etc.). Each hub contains connections (channels/APIs), agents (AI personalities), and their tools.

```
Organization
└── Project
    └── Hub (you are here)
        ├── Connections (channels)
        └── Agents → Tools
```

## Hub Types

| Type | Description | Channels | Use Case |
|------|-------------|----------|----------|
| `user` | ONE open conversation per end user | All (WhatsApp, Instagram, Email, App) | User-centered: any interaction focused on a person |
| `workflow` | MULTIPLE open conversations per user | App only (native) | Task-centered: processes focused on objects/tasks |

**User hubs (user-centered):**
- Best for any interaction centered on a PERSON (customer, employee, partner)
- Context persists across all interactions with the same user
- Works with ALL channels (WhatsApp, Instagram, Email, App)
- Examples:
  - Customer support, sales inquiries
  - Employee support by HR department
  - IT helpdesk for internal users
  - Partner/vendor communication

**Workflow hubs (task-centered):**
- Best for processes centered on OBJECTS or TASKS (not people)
- Each task/workflow instance is a separate conversation
- **Only works with App (native) channel** - external channels cannot manage multiple conversation instances
- Examples:
  - Invoice processing
  - Inventory movements
  - Purchase order approvals
  - Document review workflows

## MCP vs UI

| Operation | MCP | UI | Details |
|-----------|-----|----|---------|
| List hubs | `get_workspace` | - | Returns all hubs with MCP access |
| View hub details | `get_hub(hub_id)` | - | Full schema: agents, tools, connections |
| Create hub | `create_hub(project_id, hub_name, hub_type, ...)` | wayai.pro | Full MCP support |
| Update hub | `update_hub(hub_id, ...)` | wayai.pro | Name, description, AI mode, etc. |
| Delete hub | - | wayai.pro → Hub Settings | Destructive, UI only |
| Set MCP access | - | wayai.pro → Hub Settings | Enable/configure MCP access level |

## Fields

| Field | Type | Editable | Description |
|-------|------|----------|-------------|
| `_wayai_id` | string | NO | System ID - DO NOT EDIT |
| `name` | string | Yes | Hub display name |
| `description` | string | Yes | Hub description |
| `hub_type` | enum | UI only | `user` or `workflow` (set at creation) |
| `ai_mode` | enum | Yes | AI behavior mode (see below) |
| `followup_message` | string | Yes | Message sent after inactivity |
| `inactivity_interval` | number | Yes | Minutes before followup message |

## AI Modes

| Mode | Description |
|------|-------------|
| `Pilot+Copilot` | AI handles conversations, humans can take over anytime |
| `Pilot` | AI only, no human intervention option |
| `Copilot` | AI assists humans, humans lead conversations |
| `Turned Off` | AI disabled, humans only |

## MCP Tools

### create_hub
Create a new hub in a project.
```
create_hub(
  project_id,      # Required
  hub_name,        # Required
  hub_type,        # Required: "user" | "workflow"
  hub_description, # Optional
  ai_mode,         # Optional: "Pilot+Copilot" | "Pilot" | "Copilot" | "Turned Off"
  mcp_acesso       # Optional: "leitura_escrita" (default) | "leitura" | "desabilitado"
)
```

### get_hub
Get complete hub schema including agents, tools, and connections.
```
get_hub(hub_id)
```

### update_hub
Update hub settings.
```
update_hub(
  hub_id,              # Required
  hub_name,            # Optional
  hub_description,     # Optional
  ai_mode,             # Optional: "Pilot+Copilot" | "Pilot" | "Copilot" | "Turned Off"
  followup_message,    # Optional
  inactivity_interval  # Optional: minutes
)
```

## Markdown Template

```markdown
---
_wayai_id: {hub_id}
name: {name}
description: {description}
hub_type: {hub_type}
ai_mode: {ai_mode}
followup_message: {followup_message}
inactivity_interval: {inactivity_interval}
---

# {name}

{description}
```

## File Location

```
organizations/
└── {org-name-slugified}/
    └── projects/
        └── {project-name-slugified}/
            └── hubs/
                └── {hub-name-slugified}/
                    ├── hub.md
                    └── agents/
```

## Examples

**Viewing hub details:**
```
User: "Show me the Support Hub configuration"

Claude:
1. get_workspace() → find hub_id for "Support Hub"
2. get_hub(hub_id) → get full schema
3. Convert to Markdown and display
```

**Updating hub settings:**
```
User: "Change the Support Hub to Copilot mode"

Claude:
1. get_hub(hub_id) → current state
2. update_hub(hub_id, ai_mode="Copilot")
3. Update local hub.md file
```

**Creating a new hub:**
```
User: "I need a new hub for pizza ordering via WhatsApp"

Claude:
1. get_workspace() → find project_id
2. create_hub(
     project_id,
     hub_name="Pizza Orders",
     hub_type="user"  # Required for WhatsApp
   )
3. Save to organizations/{org}/projects/{proj}/hubs/pizza-orders/hub.md

"Hub 'Pizza Orders' created! Since you need WhatsApp, I used 'user' type.

Next steps:
- Add WhatsApp connection via UI: wayai.pro → Hub → Connections
- I can then create agents and add tools

I also found a 'pizzeria' template. Would you like to use it?"
```

```
User: "I need a hub for invoice processing"

Claude:
1. get_workspace() → find project_id
2. create_hub(
     project_id,
     hub_name="Invoice Processing",
     hub_type="workflow"  # Task-centered, App channel only
   )

"Hub 'Invoice Processing' created with 'workflow' type.
Each invoice will be a separate conversation (App channel only).

Ready to create agents?"
```

**Deleting a hub:**
```
User: "Delete the old test hub"

Claude: "Hub deletion must be done in the UI for safety:
        1. Go to wayai.pro → Your Hub → Settings
        2. Click 'Delete Hub'
        3. Confirm the deletion

        This will remove all agents, tools, and connections."
```
