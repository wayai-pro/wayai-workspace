# Schema Reference

## Agent Fields

| Field | Type | Editable | Description |
|-------|------|----------|-------------|
| `_wayai_id` | string | NO | System ID - DO NOT EDIT |
| `name` | string | Yes | Agent display name |
| `role` | string | Yes | Brief description of agent's function |
| `model` | string | Yes | LLM model (e.g., gpt-4o, gpt-4o-mini) |
| `temperature` | number | Yes | Model temperature (0-2) |
| `tools.native` | array | Yes | Native tool IDs |
| `tools.custom` | array | Yes | Custom tool definitions |
| `instructions` | markdown | Yes | Agent instructions (in body) |

## Hub Fields

| Field | Type | Editable | Description |
|-------|------|----------|-------------|
| `_wayai_id` | string | NO | System ID - DO NOT EDIT |
| `name` | string | Yes | Hub display name |
| `description` | string | Yes | Hub description |
| `ai_mode` | enum | Yes | Pilot+Copilot, Pilot, Copilot, Turned Off |
| `followup_message` | string | Yes | Message after inactivity |
| `inactivity_interval` | number | Yes | Minutes before followup |

## Custom Tool Definition

```yaml
tools:
  custom:
    - name: "create_order"
      description: "Creates a new order in the POS system"
      method: POST              # GET, POST, PUT, DELETE, PATCH
      connection_type: webhook  # Connection type required
      endpoint_path: "/orders"  # API endpoint path
```

## Native Tools

Common native tools:
- `web_search` - Search the web
- `send_whatsapp_message` - Send WhatsApp message (requires WhatsApp connection)
- `send_email` - Send email (requires email connection)
- `transfer_to_human` - Transfer conversation to human agent
- `end_conversation` - End the conversation

## AI Modes

| Mode | Description |
|------|-------------|
| `Pilot+Copilot` | AI handles conversations, humans can take over |
| `Pilot` | AI only, no human intervention |
| `Copilot` | AI assists, humans lead |
| `Turned Off` | AI disabled |
