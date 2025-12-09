# Connections

## Overview

Connections link your hub to external channels (WhatsApp, Instagram, Email) and APIs (webhooks, MCP servers). They store credentials and OAuth tokens securely.

```
Organization
└── Project
    └── Hub
        ├── Connections (you are here)
        └── Agents → Tools
```

## MCP vs UI

| Operation | MCP | UI | Details |
|-----------|-----|----|---------|
| List connections | `get_hub(hub_id)` | - | Included in hub schema |
| View connection | `get_hub(hub_id)` | - | Shows type, status, not credentials |
| Create connection | - | wayai.pro → Hub → Connections | OAuth/credentials required |
| Update credentials | - | wayai.pro → Hub → Connections | Security: credentials never via MCP |
| Delete connection | - | wayai.pro → Hub → Connections | Removes channel/API access |
| Enable connection | `enable_connection(hub_id, connection_id)` | wayai.pro | Activate a disabled connection |
| Disable connection | `disable_connection(hub_id, connection_id)` | wayai.pro | Temporarily disable |
| Sync MCP tools | `sync_mcp_connection(hub_id, connection_id)` | - | Refresh tools from MCP server |

## Connection Types

| Type | Description | Setup |
|------|-------------|-------|
| WhatsApp Business | Send/receive WhatsApp messages | Meta OAuth |
| Instagram | Instagram DMs | Meta OAuth |
| Gmail | Send emails | Google OAuth |
| Webhook | Custom REST API integration | Base URL + headers |
| MCP Server | External MCP tool server | Server URL + auth |
| Google Calendar | Calendar access | Google OAuth |

## MCP Tools

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

## Setup Guides (UI)

### WhatsApp Business

```
1. Go to wayai.pro → Your Hub → Settings → Connections
2. Click "Add Connection" → "WhatsApp Business"
3. You'll be redirected to Meta Business
4. Log in with your Meta Business account
5. Select or create a WhatsApp Business Account
6. Authorize WayAI to send messages
7. Return to WayAI - connection should show as "Active"
```

**Requirements:**
- Meta Business account (business.facebook.com)
- WhatsApp Business API access (verified business)
- Phone number NOT registered with regular WhatsApp

**Troubleshooting:**
- "Access denied" → Ensure Meta Business account has WhatsApp Business API access
- Phone number issues → Number must be dedicated to API use

### Webhook (Custom API)

```
1. Go to wayai.pro → Your Hub → Settings → Connections
2. Click "Add Connection" → "Webhook"
3. Enter a display name (e.g., "POS System")
4. Enter the base URL (e.g., "https://api.yourpos.com")
5. Add any required headers (API keys, auth tokens)
6. Click "Save"
```

**Usage with custom tools:**
Once created, reference in custom tool definitions:
```yaml
tools:
  custom:
    - name: "create_order"
      description: "Creates order in POS"
      method: POST
      connection_type: webhook
      endpoint_path: "/orders"  # Appended to base URL
```

### Google Calendar

```
1. Go to wayai.pro → Your Hub → Settings → Connections
2. Click "Add Connection" → "Google Calendar"
3. Sign in with your Google account
4. Authorize WayAI to access your calendar
5. Select which calendars to use
6. Return to WayAI
```

### Gmail

```
1. Go to wayai.pro → Your Hub → Settings → Connections
2. Click "Add Connection" → "Gmail"
3. Sign in with your Google account
4. Authorize WayAI to send emails on your behalf
5. Return to WayAI
```

**Note:** For Google Workspace accounts, admin must allow third-party app access.

### MCP Server

```
1. Go to wayai.pro → Your Hub → Settings → Connections
2. Click "Add Connection" → "MCP Server"
3. Enter the MCP server URL
4. Configure authentication (if required)
5. Click "Save"
6. Use sync_mcp_connection() to discover available tools
```

## Examples

**Checking connection status:**
```
User: "Is WhatsApp connected?"

Claude:
1. get_hub(hub_id) → check connections array
2. Find WhatsApp connection, report status
```

**Adding a new connection:**
```
User: "I need to connect WhatsApp"

Claude: "WhatsApp connections require OAuth setup in the UI:

        1. Go to wayai.pro → Your Hub → Settings → Connections
        2. Click 'Add Connection' → 'WhatsApp Business'
        3. Complete the Meta OAuth flow

        Requirements:
        - Meta Business account
        - WhatsApp Business API access
        - Dedicated phone number

        Let me know when you've completed this!"
```

**Enabling a disabled connection:**
```
User: "Re-enable the webhook connection"

Claude:
1. get_hub(hub_id) → find connection_id for webhook
2. enable_connection(hub_id, connection_id)
3. Confirm activation
```

**Syncing MCP tools:**
```
User: "Refresh tools from the MCP server"

Claude:
1. get_hub(hub_id) → find MCP connection_id
2. sync_mcp_connection(hub_id, connection_id)
3. Report newly discovered tools
```
