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
1. A **Tool - Custom connection** (API Key or Basic Auth) — defined in `wayai.yaml` connections section (auto-created from org credentials during push) or created via UI
2. A **custom tool** attached to an agent — defined in `wayai.yaml` under the agent's `tools.custom` section

---

## Creating a Custom Tool

### Via Files + CLI (Recommended)

Add custom tools to `wayai.yaml` under the agent's `tools.custom` section:

```yaml
agents:
  - name: Order Agent
    role: Pilot
    connection: anthropic
    tools:
      custom:
        - name: get_order_status
          description: Retrieve the current status of a customer order
          method: get
          path: /orders/{{order_id}}
          connection: my-api-connection    # Must match a connection name
        - name: create_ticket
          description: Create a new support ticket
          method: post
          path: /tickets
          body_format: json
          connection: my-api-connection

connections:
  - name: my-api-connection
    type: Tool - Custom
    service: User Tool - API Key
```

Then run `wayai push` to create the tools on the hub.

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
| `tool_path` | Path relative to connection base_url, supports `{{placeholders}}` |
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

```yaml
# In wayai.yaml
agents:
  - name: Support Agent
    tools:
      custom:
        - name: get_order_status
          description: Retrieve the current status of a customer order by order ID
          path: /orders/{{order_id}}
          method: get
          connection: my-api

connections:
  - name: my-api
    type: Tool - Custom
    service: User Tool - API Key
```

**Connection setup (UI — org credential):**
- Auth type: API Key
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

```yaml
# In wayai.yaml
agents:
  - name: Support Agent
    tools:
      custom:
        - name: create_ticket
          description: Create a new support ticket with customer issue details
          path: /tickets
          method: post
          body_format: json
          connection: my-api
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

| Operation | Method |
|-----------|--------|
| Create | Edit `wayai.yaml` → `wayai push` |
| Update | Edit `wayai.yaml` → `wayai push` |
| Delete | Remove from `wayai.yaml` → `wayai push` |
| View | MCP: `get_tool(hub_id, tool_id)` |
