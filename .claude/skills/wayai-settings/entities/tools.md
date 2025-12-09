# Tools

## Overview

Tools are capabilities assigned to agents. There are three types: native (built-in), MCP (from connected servers), and custom (API endpoints).

```
Organization
└── Project
    └── Hub
        ├── Connections
        └── Agents → Tools (you are here)
```

## MCP vs UI

| Operation | MCP | UI | Details |
|-----------|-----|----|---------|
| List tools | `get_hub(hub_id)` | - | Native available + agent tools |
| View tool | `get_tool(hub_id, tool_id)` | wayai.pro | Full configuration |
| Add native tool | `add_native_tool(...)` | wayai.pro | Add to agent |
| Add MCP tool | `add_mcp_tool(...)` | wayai.pro | From connected MCP server |
| Add custom tool | `add_custom_tool(...)` | wayai.pro | Create API tool |
| Update custom tool | `update_custom_tool(...)` | wayai.pro | Only custom tools |
| Enable tool | `enable_tool(...)` | wayai.pro | Activate disabled tool |
| Disable tool | `disable_tool(...)` | wayai.pro | Temporarily disable |
| Remove tool | `remove_tool(...)` | wayai.pro | Remove from agent |
| Delete custom tool | `remove_custom_tool(...)` | wayai.pro | Delete custom tool |

## Tool Types

### Native Tools

Built-in platform tools. Common native tools:

| Tool ID | Description | Requirements |
|---------|-------------|--------------|
| `web_search` | Search the web | None |
| `send_whatsapp_message` | Send WhatsApp message | WhatsApp connection |
| `send_email` | Send email | Email connection |
| `transfer_to_human` | Transfer to human agent | None |
| `end_conversation` | End the conversation | None |

### MCP Tools

Tools from connected MCP servers. Discovered via `sync_mcp_connection()`.

### Custom Tools

API endpoints you define. Configure HTTP method, endpoint, and description.

## MCP Tools Reference

### get_tool
Get tool details including configuration.
```
get_tool(hub_id, tool_id)
```

### add_native_tool
Add a native platform tool to an agent.
```
add_native_tool(
  hub_id,          # Required
  agent_id,        # Required
  tool_native_id   # Required: from available native tools list
)
```

### add_mcp_tool
Add a tool from a connected MCP server.
```
add_mcp_tool(
  hub_id,      # Required
  agent_id,    # Required
  mcp_tool_id  # Required: from MCP connection tools list
)
```

### add_custom_tool
Create a custom API tool for an agent.
```
add_custom_tool(
  hub_id,                 # Required
  agent_id,               # Required
  tool_name,              # Required
  tool_description_ai,    # Optional: description for the AI
  tool_instructions,      # Optional: usage instructions
  tool_endpoint_template, # Optional: API endpoint path
  tool_method             # Optional: GET, POST, PUT, DELETE, PATCH
)
```

### update_custom_tool
Update an existing custom tool.
```
update_custom_tool(
  hub_id,                 # Required
  tool_id,                # Required
  tool_name,              # Optional
  tool_description_ai,    # Optional
  tool_instructions,      # Optional
  tool_endpoint_template, # Optional
  tool_method,            # Optional
  enabled                 # Optional: true/false
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

## Custom Tool Definition

In agent Markdown files:

```yaml
tools:
  native:
    - web_search
    - send_whatsapp_message
  custom:
    - name: "create_order"
      description: "Creates a new order in the POS system"
      method: POST
      connection_type: webhook
      endpoint_path: "/orders"
    - name: "get_menu"
      description: "Retrieves current menu items"
      method: GET
      connection_type: webhook
      endpoint_path: "/menu"
```

### Custom Tool Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Tool name (snake_case recommended) |
| `description` | string | What the tool does (for AI) |
| `method` | enum | HTTP method: GET, POST, PUT, DELETE, PATCH |
| `connection_type` | string | Connection to use (e.g., "webhook") |
| `endpoint_path` | string | API path appended to connection base URL |

## Examples

**Adding a native tool:**
```
User: "Add web search to the Support Agent"

Claude:
1. get_hub(hub_id) → find agent_id for Support Agent
2. add_native_tool(hub_id, agent_id, "web_search")
3. Update local agent Markdown file
```

**Adding tools from MCP server:**
```
User: "Add the calendar tools from our MCP server"

Claude:
1. get_hub(hub_id) → find MCP connection_id
2. sync_mcp_connection(hub_id, connection_id) → refresh tools
3. get_hub(hub_id) → see available MCP tools
4. add_mcp_tool(hub_id, agent_id, mcp_tool_id) for each tool
```

**Creating a custom tool:**
```
User: "Create a tool to check order status"

Claude:
1. add_custom_tool(
     hub_id,
     agent_id,
     tool_name="check_order_status",
     tool_description_ai="Checks the status of a customer order by order ID",
     tool_method="GET",
     tool_endpoint_template="/orders/{order_id}/status"
   )
2. Update local agent Markdown file
```

**Disabling a tool temporarily:**
```
User: "Disable the email tool for now"

Claude:
1. get_hub(hub_id) → find tool_id for send_email
2. disable_tool(hub_id, agent_id, tool_id)
3. Update local file (mark tool as disabled)
```

**Removing a custom tool:**
```
User: "Delete the old create_order tool"

Claude:
1. get_hub(hub_id) → find tool_id
2. remove_custom_tool(hub_id, tool_id)
3. Remove from local agent Markdown file
```
