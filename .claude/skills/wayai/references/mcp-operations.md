# MCP Operations

Complete reference for WayAI MCP tools organized by entity type.

## Table of Contents
- [Workspace Operations](#workspace-operations)
- [Organization Operations](#organization-operations)
- [Project Operations](#project-operations)
- [Hub Operations](#hub-operations)
- [Agent Operations](#agent-operations)
- [Tool Operations](#tool-operations)
- [Connection Operations](#connection-operations)
- [Quick Reference Table](#quick-reference-table)

## Workspace Operations

### get_workspace
Discover all organizations, projects, and hubs you have access to.
```
get_workspace()
```
Returns: workspace hierarchy with org/project/hub IDs and names

### export_workspace
Export entire workspace as downloadable zip with Markdown files.
```
export_workspace()
```
Returns: download URL (expires in 5 minutes)

### export_skill
Export/update Claude Code skill files. Use this to install or update the WayAI skill.
```
export_skill()
```
Returns: download URL for skill zip (expires in 5 minutes)

**To install/update:**
1. Call `export_skill()` to get download URL
2. Download and extract: `curl -L "<url>" -o skill.zip && unzip -o skill.zip -d ~/.claude/skills/`
3. Start a new conversation to load the updated skill

### get_template
Fetch a specific template file content. First read `templates://index` resource to see available templates.
```
get_template(path)
```
Parameters:
- `path` (required): Template file path, e.g., "pt/vertical/pizzaria/pedidos/hub.md"

Returns: Template file content (Markdown)

---

## Organization Operations

**MCP capabilities:** Read only

| Operation | MCP | UI |
|-----------|-----|----|
| List | `get_workspace` | - |
| Create | - | platform.wayai.pro signup |
| Update | - | platform.wayai.pro settings |
| Delete | - | platform.wayai.pro settings |
| Manage users | - | platform.wayai.pro team |

Organizations are discovered via `get_workspace()`. Creation and management require UI.

---

## Project Operations

**MCP capabilities:** Read, Create

| Operation | MCP | UI |
|-----------|-----|----|
| List | `get_workspace` | - |
| View | `get_project(project_id)` | - |
| Create | `create_project(...)` | platform.wayai.pro |
| Update | - | platform.wayai.pro settings |
| Delete | - | platform.wayai.pro settings |

### create_project
Create a new project in an organization.
```
create_project(
  organization_id,  # Required
  project_name      # Required
)
```

---

## Hub Operations

**MCP capabilities:** Create, Read, Update (delete via UI)

| Operation | MCP | UI |
|-----------|-----|----|
| List | `get_workspace` | - |
| View | `get_hub(hub_id)` | - |
| Create | `create_hub(...)` | platform.wayai.pro |
| Update | `update_hub(...)` | platform.wayai.pro |
| Delete | - | platform.wayai.pro settings |

### create_hub
Create a new hub in a project.
```
create_hub(
  project_id,       # Required
  hub_name,         # Required
  hub_type,         # Required: "user" | "workflow"
  hub_description,  # Optional
  ai_mode,          # Optional: "Pilot+Copilot" | "Pilot" | "Copilot" | "Turned Off"
  mcp_access        # Optional: "read_write" | "read_only" | "disabled"
)
```

**Hub type guidance:**
- `user`: Person-centered, works with ALL channels (WhatsApp, Instagram, Email, App)
- `workflow`: Task-centered, App channel only

### get_hub
Get complete hub schema including agents, tools, and connections.
```
get_hub(hub_id)
```

### update_hub
Update hub settings.
```
update_hub(
  hub_id,               # Required
  hub_name,             # Optional
  hub_description,      # Optional
  ai_mode,              # Optional
  followup_message,     # Optional
  inactivity_interval   # Optional: minutes
)
```

---

## Agent Operations

**MCP capabilities:** Full CRUD

### ⚠️ Prerequisite: Agent Connection Required

Creating agents requires an **Agent connection** (LLM provider):
- **OpenAI** or **OpenRouter**
- Created via UI: Settings → Hub → Connections → **Agent** group
- If missing, `create_agent` will fail

Direct user to create Agent connection first, then proceed with agent creation.

| Operation | MCP |
|-----------|-----|
| List | `get_hub(hub_id)` |
| View | `get_agent(hub_id, agent_id)` |
| Export instructions | `export_agent_instructions(hub_id, agent_id)` |
| Get upload URL | `get_agent_instructions_upload_url(hub_id, agent_id)` |
| Create | `create_agent(...)` |
| Update settings | `update_agent(...)` |
| Update instructions | Upload via URL (preferred) or `update_agent_instructions(...)` (fallback) |
| Delete | `delete_agent(...)` |

### get_agent
Get agent details including tools. Instructions are excluded to save context.
```
get_agent(hub_id, agent_id)
```
Use `export_agent_instructions` to retrieve the agent's instructions.

### export_agent_instructions
Export agent instructions as a downloadable file URL.
```
export_agent_instructions(hub_id, agent_id)
```
Returns:
- `download_url`: URL valid for 1 hour - use WebFetch to retrieve content
- `expires_in`: Time until URL expires

Note: The file is recreated from `agent.instructions` on each call to ensure sync with the database.

### get_agent_instructions_upload_url
Get a presigned URL for uploading agent instructions. Use this for large instructions (>10KB) to save tokens.
```
get_agent_instructions_upload_url(hub_id, agent_id)
```
Returns:
- `upload_url`: URL for uploading (valid 5 minutes)
- `auth_token`: Authorization header value
- `expires_in`: Time until URL expires

**Upload using curl:**
```bash
curl -X POST --data-binary @{file}.md "{upload_url}" \
  -H "Authorization: {auth_token}" \
  -H "Content-Type: text/markdown"
```

### create_agent
Create a new agent.
```
create_agent(
  hub_id,         # Required
  agent_name,     # Required
  agent_role,     # Required: Pilot, Copilot, Specialist for Pilot, etc.
  instructions,   # Required: system instructions
  connection_id,  # Optional: LLM connection (auto-selects if not provided)
  model,          # Optional: e.g., gpt-4o, gpt-4o-mini
  temperature     # Optional: 0-2, default 0.7
)
```

### update_agent
Update an existing agent. To update instructions, use `get_agent_instructions_upload_url` (recommended) or `update_agent_instructions` (fallback when file operations unavailable).
```
update_agent(
  hub_id,        # Required
  agent_id,      # Required
  agent_name,    # Optional
  agent_role,    # Optional
  model,         # Optional
  temperature    # Optional
)
```

### update_agent_instructions
**Fallback method** - only use when file operations aren't available (e.g., no Bash tool). Prefer `get_agent_instructions_upload_url` for token-efficient upload.
```
update_agent_instructions(
  hub_id,        # Required
  agent_id,      # Required
  instructions,  # Required: full instructions content (markdown)
  file_name      # Optional: defaults to {agentname}.md
)
```
Returns: `file_id`, `file_path`, `instructions_updated`

### delete_agent
Remove an agent from the hub.
```
delete_agent(
  hub_id,        # Required
  agent_id,      # Required
  confirm=true   # Required: must be true
)
```

---

## Tool Operations

**MCP capabilities:** Full CRUD

### ⚠️ Prerequisite: Tool Connections Required

Enabling or creating tools requires a **Tool connection** for the tool's connector:

**Auto-enabled (no connection needed):**
- Wayai Conversation, Wayai Meta Tools, Wayai Knowledge

**Tool - Native group (via UI):**
- **Google Calendar, Drive, YouTube** → OAuth
- **Wayai External Storage** → API Key

**Tool - User group (via UI):**
- **Custom API tools** → API Key or Basic Auth

**MCP - External group (via UI):**
- **MCP Server tools** → Token or OAuth

| Operation | MCP |
|-----------|-----|
| List | `get_hub(hub_id)` |
| View | `get_tool(hub_id, tool_id)` |
| Add native | `add_native_tool(...)` |
| Add MCP | `add_mcp_tool(...)` |
| Add custom | `add_custom_tool(...)` |
| Update custom | `update_custom_tool(...)` |
| Enable/Disable | `enable_tool(...)` / `disable_tool(...)` |
| Remove | `remove_tool(...)` |
| Delete custom | `remove_custom_tool(...)` |

### get_tool
Get tool details and configuration.
```
get_tool(hub_id, tool_id)
```

### add_native_tool
Add a built-in platform tool to an agent.
```
add_native_tool(
  hub_id,          # Required
  agent_id,        # Required
  tool_native_id   # Required: e.g., "web_search", "send_email"
)
```

### add_mcp_tool
Add a tool from a connected MCP server.
```
add_mcp_tool(
  hub_id,       # Required
  agent_id,     # Required
  mcp_tool_id   # Required: from MCP connection tools list
)
```

### add_custom_tool
Create a custom API tool.
```
add_custom_tool(
  hub_id,                  # Required
  agent_id,                # Required
  tool_name,               # Required
  tool_description_ai,     # Optional: description for AI
  tool_instructions,       # Optional: usage instructions
  tool_endpoint_template,  # Optional: API path (e.g., "/orders/{id}")
  tool_method              # Optional: GET, POST, PUT, DELETE, PATCH
)
```

### update_custom_tool
Update an existing custom tool.
```
update_custom_tool(
  hub_id,                  # Required
  tool_id,                 # Required
  tool_name,               # Optional
  tool_description_ai,     # Optional
  tool_instructions,       # Optional
  tool_endpoint_template,  # Optional
  tool_method,             # Optional
  enabled                  # Optional: true/false
)
```

### enable_tool / disable_tool
Toggle tool status (works for all tool types).
```
enable_tool(hub_id, agent_id, tool_id)
disable_tool(hub_id, agent_id, tool_id)
```

### remove_tool
Remove a tool from an agent (keeps custom tool definition).
```
remove_tool(hub_id, agent_id, tool_id)
```

### remove_custom_tool
Delete a custom tool completely.
```
remove_custom_tool(hub_id, tool_id)
```

---

## Connection Operations

**MCP capabilities:** Enable, Disable, Sync (create/delete via UI)

| Operation | MCP | UI |
|-----------|-----|----|
| List | `get_hub(hub_id)` | - |
| Create | - | platform.wayai.pro (OAuth/credentials) |
| Delete | - | platform.wayai.pro settings |
| Enable | `enable_connection(...)` | platform.wayai.pro |
| Disable | `disable_connection(...)` | platform.wayai.pro |
| Sync MCP | `sync_mcp_connection(...)` | - |

### enable_connection
Activate a disabled connection.
```
enable_connection(hub_id, connection_id)
```

### disable_connection
Temporarily disable a connection (keeps credentials).
```
disable_connection(hub_id, connection_id)
```

### sync_mcp_connection
Refresh available tools from an MCP server connection.
```
sync_mcp_connection(hub_id, connection_id)
```
Returns: tools_count, resources_count

---

## Quick Reference Table

| Entity | List | View | Create | Update | Delete |
|--------|------|------|--------|--------|--------|
| Organization | `get_workspace` | - | UI | UI | UI |
| Project | `get_workspace` | `get_project` | MCP | UI | UI |
| Hub | `get_workspace` | `get_hub` | MCP | MCP | UI |
| Agent | `get_hub` | `get_agent` | MCP | MCP | MCP |
| Tool | `get_hub` | `get_tool` | MCP | MCP* | MCP |
| Connection | `get_hub` | - | UI | UI | UI |

*Only custom tools can be updated via MCP
