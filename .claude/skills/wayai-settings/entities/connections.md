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

## Connection Categories

### Agent Connections (Required for Agents)

**You must add an Agent connection before creating any agents.**

| Type | Description | Setup |
|------|-------------|-------|
| OpenAI | GPT models (gpt-4o, gpt-4o-mini, etc.) | API Key |
| OpenRouter | Access to multiple LLM providers | API Key |

### Channel Connections (For messaging)

| Type | Description | Setup |
|------|-------------|-------|
| WhatsApp Business | Send/receive WhatsApp messages | Meta OAuth |
| Instagram | Instagram DMs | Meta OAuth |
| Gmail | Send emails | Google OAuth |

### Tool Connections (For native/custom tools)

| Type | Description | Setup |
|------|-------------|-------|
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

### OpenAI (Agent Connection)

```
1. Go to wayai.pro → Your Hub → Settings → Connections
2. Click "Add Connection" → "OpenAI"
3. Enter your OpenAI API Key
4. Click "Save"
```

**Requirements:**
- OpenAI account (platform.openai.com)
- API key with sufficient credits

**Getting an API Key:**
1. Go to platform.openai.com
2. Navigate to API Keys section
3. Click "Create new secret key"
4. Copy the key (shown only once)

### OpenRouter (Agent Connection)

```
1. Go to wayai.pro → Your Hub → Settings → Connections
2. Click "Add Connection" → "OpenRouter"
3. Enter your OpenRouter API Key
4. Click "Save"
```

**Requirements:**
- OpenRouter account (openrouter.ai)
- API key with credits

**Getting an API Key:**
1. Go to openrouter.ai
2. Sign in and go to Keys section
3. Create a new API key
4. Copy the key

**Benefits:**
- Access to multiple LLM providers (Anthropic, Google, Meta, etc.)
- Pay-per-use pricing across providers

### WhatsApp Business

```
1. Go to wayai.pro → Your Hub → Settings → Connections
2. Click "Add Connection" → "WhatsApp Business"
3. A Meta popup will open - click "Continue" to start the embedded signup
4. Select business assets to share with WayAI:
   - Business portfolio (select or create)
   - WhatsApp Business account (select existing or create new)
   - Facebook Page (optional)
   - Ad account (optional)
   - Pixel (optional)
5. Click "Next"
6. Add your WhatsApp phone number:
   - "Use a display name only" - no phone number required
   - "Use a new or existing WhatsApp number" - select/add a phone number
   - "Add a phone number later" - complete setup without number
7. Click "Next"
8. Review permissions and click "Confirm"
9. Return to WayAI - connection should show as "Active"
```

**Requirements:**
- Facebook account with access to Meta Business Suite
- WhatsApp Business account (can be created during signup)
- Phone number NOT registered with regular WhatsApp (if adding number)

**Phone Number Options:**
- **Display name only:** Send messages without a dedicated number
- **New/existing number:** Use a phone number you own (verification required)
- **Add later:** Complete setup first, add number in Meta Business Settings

**Troubleshooting:**
- "Access denied" → Ensure you have admin access to the Meta Business portfolio
- Phone number issues → Number must not be active on regular WhatsApp app
- Verification failed → Check SMS/voice call verification code

### Instagram

```
1. Go to wayai.pro → Your Hub → Settings → Connections
2. Click "Add Connection" → "Instagram"
3. You'll be redirected to Meta/Facebook
4. Log in with your Facebook account linked to Instagram Business
5. Select the Instagram Business account to connect
6. Authorize WayAI to access messages
7. Return to WayAI - connection should show as "Active"
```

**Requirements:**
- Instagram Business or Creator account
- Facebook Page linked to Instagram account
- Meta Business account

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
