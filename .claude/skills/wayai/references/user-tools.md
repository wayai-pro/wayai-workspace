# User Tools (Custom Tools)

Create custom API integrations for agents using Tool - Custom connections.

## Table of Contents
- [Overview](#overview)
- [Creating a Custom Tool](#creating-a-custom-tool)
- [Tool Configuration](#tool-configuration)
- [Placeholder System](#placeholder-system)
- [Examples](#examples)

---

## Overview

Custom tools allow agents to call external APIs. They require:
1. A **Tool - Custom connection** (API Key or Basic Auth) - created via UI
2. A **custom tool** attached to an agent - created via MCP or UI. Each custom tool **must** reference a connection for authentication

---

## Creating a Custom Tool

### Via MCP

```
add_custom_tool(
  hub_id,                  # Required
  agent_id,                # Required
  connection_id,           # Required: ID of a Tool - Custom connection
  tool_name,               # Required: display name
  tool_description,        # Optional: description for AI
  tool_instructions,       # Optional: usage guidance for AI
  tool_url,                # Optional: URL endpoint (e.g., "/orders/{{order_id}}")
  tool_method,             # Optional: get, post, put, delete, patch
  tool_headers,            # Optional: HTTP headers as [{key, value}] array
  tool_body,               # Optional: default body parameters
  tool_body_format         # Optional: 'json' (default) or 'form' (x-www-form-urlencoded)
)
```

### Via UI

1. Hub → Agents → Select agent
2. Tools → Add Tool → Custom
3. Fill in configuration fields

---

## Tool Configuration

| Field | Description |
|-------|-------------|
| `tool_name` | Display name for the tool |
| `tool_method` | HTTP method: GET, POST, PUT, DELETE, PATCH |
| `tool_url` | Endpoint path, supports `{{placeholders}}` |
| `tool_config` | OpenAI function schema (auto-generated or custom) |
| `tool_headers` | Additional headers array: `[{key, value}]` |
| `tool_body_format` | Body encoding: `json` (default) or `form` (`application/x-www-form-urlencoded`) |
| `tool_instructions` | AI guidance for when/how to use the tool |

### tool_config Schema

OpenAI function calling format. Required fields: `name`, `description`, `parameters`.

```json
{
  "name": "get_order_status",
  "description": "Get the status of a customer order",
  "parameters": {
    "type": "object",
    "properties": {
      "order_id": {
        "type": "string",
        "description": "The unique order identifier"
      }
    },
    "required": ["order_id"]
  }
}
```

> **Note:** `tool_name` and `tool_description` are auto-populated from `tool_config.name` and `tool_config.description` by a database trigger.

---

## Placeholder System

Placeholders are replaced at runtime in URLs, headers, query params, and body.

| Placeholder | Source | Description |
|-------------|--------|-------------|
| `{{api_key}}` | Connection secrets | API key from User Tool connection |
| `{{access_token}}` | Connection secrets | Access token (for dual-credential APIs) |
| `{{param_name}}` | AI parameters | Value provided by AI during tool call |

### Where Placeholders Work

- **URL/Path:** `/orders/{{order_id}}/status`
- **Headers:** `Authorization: Bearer {{api_key}}`
- **Query params:** `?token={{api_key}}&id={{order_id}}`
- **Body params:** Merge additional params with AI-provided body

---

## Examples

### Example 1: Simple GET endpoint

**Use case:** Fetch order status from an e-commerce API.

```
add_custom_tool(
  hub_id: "hub-123",
  agent_id: "agent-456",
  connection_id: "conn-789",
  tool_name: "Get Order Status",
  tool_description: "Retrieve the current status of a customer order by order ID",
  tool_url: "/orders/{{order_id}}",
  tool_method: "get"
)
```

**Connection setup (UI):**
- Type: User Tool - API Key
- Base URL: `https://api.example.com/v1`
- API Key: `sk-xxx`

**Headers (connection level):**
```json
{"Authorization": "Bearer {{api_key}}"}
```

**Resulting request:**
```
GET https://api.example.com/v1/orders/ORD-12345
Authorization: Bearer sk-xxx
```

### Example 2: POST with body

**Use case:** Create a support ticket in an external system.

```
add_custom_tool(
  hub_id: "hub-123",
  agent_id: "agent-456",
  connection_id: "conn-789",
  tool_name: "Create Ticket",
  tool_description: "Create a new support ticket with customer issue details",
  tool_url: "/tickets",
  tool_method: "post"
)
```

**tool_config (set via UI):**
```json
{
  "name": "create_ticket",
  "description": "Create a new support ticket",
  "parameters": {
    "type": "object",
    "properties": {
      "subject": {
        "type": "string",
        "description": "Ticket subject line"
      },
      "description": {
        "type": "string",
        "description": "Detailed issue description"
      },
      "priority": {
        "type": "string",
        "enum": ["low", "medium", "high"],
        "description": "Ticket priority level"
      }
    },
    "required": ["subject", "description"]
  }
}
```

**AI call generates:**
```
POST https://api.example.com/v1/tickets
Content-Type: application/json
Authorization: Bearer sk-xxx

{
  "subject": "Cannot access my account",
  "description": "Customer reports login issues since yesterday",
  "priority": "high"
}
```

### Example 3: Dual-credential API

**Use case:** API requiring both API key and access token.

**Connection setup (UI):**
- Type: User Tool - API Key
- Base URL: `https://api.service.com`
- API Key: `key-xxx`
- Access Token: `token-yyy`

**Headers (connection level):**
```json
{
  "X-API-Key": "{{api_key}}",
  "Authorization": "Bearer {{access_token}}"
}
```

---

## Quick Reference

| Operation | MCP Tool |
|-----------|----------|
| Create | `add_custom_tool(hub_id, agent_id, connection_id, tool_name, ...)` |
| Update | `update_custom_tool(hub_id, tool_id, connection_id?, ...)` |
| Enable/Disable | `enable_tool()` / `disable_tool()` |
| Remove from agent | `remove_tool(hub_id, agent_id, tool_id)` |
| Delete completely | `remove_custom_tool(hub_id, tool_id)` |
