# Connections

Setup guide for WayAI hub connections. Created via **UI** at platform.wayai.pro → Settings → Organizations → Project → Hub → Connections.

## Table of Contents
- [Connector Types](#connector-types)
- [Agent](#agent)
- [Channel](#channel)
- [Tool - Native](#tool---native)
- [Tool - User](#tool---user)
- [MCP - External](#mcp---external)
- [STT & TTS](#stt--tts)
- [Quick Reference](#quick-reference)

---

## Connector Types

| Type | Description |
|------|-------------|
| `Agent` | LLM providers for AI agents (OpenAI, OpenRouter) |
| `Channel` | Messaging channels (WhatsApp, Instagram) |
| `Tool - Native` | Platform-provided tool integrations |
| `Tool - User` | Custom API integrations you create |
| `MCP - External` | External MCP server connections |
| `STT & TTS` | Speech-to-text and text-to-speech services |

---

## Agent

LLM providers for AI functionality. **At least one Agent connection required before creating agents.**

### Available Connectors

| Connector | Auth | Status |
|-----------|------|--------|
| OpenAI | API Key | ✅ Available |
| OpenRouter | API Key | ✅ Available |

### OpenAI

**Prerequisites:** OpenAI API key from [platform.openai.com](https://platform.openai.com)

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Agent** group, click the **OpenAI** card
3. Fill the form:
   - **Connection Name** (required): A name to identify this connection
   - **API Key** (required): Your OpenAI API key
4. Click Save

### OpenRouter

**Prerequisites:** OpenRouter API key from [openrouter.ai](https://openrouter.ai)

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Agent** group, click the **OpenRouter** card
3. Fill the form:
   - **Connection Name** (required): A name to identify this connection
   - **API Key** (required): Your OpenRouter API key
4. Click Save

---

## Channel

Messaging channels for customer communication.

### Available Connectors

| Connector | Auth | Status |
|-----------|------|--------|
| WhatsApp | OAuth | ✅ Available |
| Instagram | OAuth | ✅ Available |

### WhatsApp

**Prerequisites:**
- Meta Business account
- Verified business
- WhatsApp Business phone number

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Channel** group, click the **WhatsApp** card
3. Click "Connect with Meta"
4. Complete Meta embedded signup flow:
   - Log in to your Meta Business account
   - Select or create a WhatsApp Business account
   - Select phone number and permissions
5. Connection created automatically

**Features:** Automatic token refresh (7 days), CTWA + Conversions API.

### Instagram

**Prerequisites:**
- Instagram Business or Creator account
- Connected to Facebook Page
- Meta Business account

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Channel** group, click the **Instagram** card
3. Click "Connect with Meta"
4. Authorize Instagram messaging permissions
5. Select Instagram account
6. Connection created automatically

**Features:** Instagram DMs, auto-refresh (7 days).

---

## Tool - Native

Platform-provided tool integrations that extend agent capabilities.

See [native-tools.md](native-tools.md) for available tools and their parameters.

### Available Connectors

| Connector | Auth | Status |
|-----------|------|--------|
| Google Calendar | OAuth | ✅ Available |
| Google Drive | OAuth | ✅ Available |
| YouTube | OAuth | ✅ Available |
| Wayai Conversation | None | ✅ Auto-enabled |
| Wayai Meta Tools | None | ✅ Auto-enabled |
| Wayai Knowledge | None | ✅ Auto-enabled |
| Wayai External Storage | API Key | ✅ Available |

### Google Calendar

**Prerequisites:** Google account with Calendar access

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Tool - Native** group, click the **Google Calendar** card
3. Click "Connect with Google"
4. Authorize calendar access
5. Connection created automatically

**Agent tools:** List events, create events, check availability.

### Google Drive

**Prerequisites:** Google account with Drive access

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Tool - Native** group, click the **Google Drive** card
3. Click "Connect with Google"
4. Authorize Drive access
5. Connection created automatically

**Agent tools:** List files, read files, search files.

### YouTube

**Prerequisites:** Google account with YouTube access

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Tool - Native** group, click the **YouTube** card
3. Click "Connect with Google"
4. Authorize YouTube access
5. Connection created automatically

### Wayai Conversation

Internal tools for conversation management. **Auto-enabled for all hubs.**

**Agent tools:** Get conversation context, manage conversation state.

### Wayai Meta Tools

Internal tools for agent orchestration. **Auto-enabled for all hubs.**

**Agent tools:** Transfer to human, end conversation, escalation controls.

### Wayai Knowledge

Internal knowledge base tools. **Auto-enabled for all hubs.**

**Agent tools:** Search knowledge base, retrieve documents.

### Wayai External Storage

Connect to external storage services.

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Tool - Native** group, click the **Wayai External Storage** card
3. Fill the form:
   - **Connection Name** (required): A name to identify this connection
   - **Storage API URL** (required): External storage service API endpoint (e.g., `https://storage.example.com/api`)
   - **API Key** (required): Your storage service API key
4. Click Save

**Agent tools:** Store and retrieve files from external storage.

---

## Tool - User

Custom API integrations you create. Connect agents to your own APIs or third-party services.

See [user-tools.md](user-tools.md) for how to create custom tools.

### Available Connectors

| Connector | Auth | Status |
|-----------|------|--------|
| User Tool - API Key | API Key | ✅ Available |
| User Tool - Basic | Basic Auth | ✅ Available |

### User Tool - API Key

Connect to any REST API using API key authentication.

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Tool - User** group, click the **User Tool - API Key** card
3. Fill the form:
   - **Connection Name** (required): A name to identify this connection
   - **Base URL** (optional): Base URL for the API (e.g., `https://api.example.com`)
   - **API Key** (required): Your API key
   - **Access Token** (optional): Secondary credential if your API requires two
   - **Custom Headers** (optional): Additional headers to include in all requests
4. Click Save

**Usage:** After creating the connection, add custom tools to agents that call your API endpoints.

### User Tool - Basic

Connect to APIs using Basic Authentication.

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Tool - User** group, click the **User Tool - Basic** card
3. Fill the form:
   - **Connection Name** (required): A name to identify this connection
   - **Base URL** (optional): Base URL for the API
   - **Username** (required): Your username
   - **Password** (required): Your password
   - **Custom Headers** (optional): Additional headers to include in all requests
4. Click Save

---

## MCP - External

Connect external MCP (Model Context Protocol) servers to extend agent capabilities.

### Available Connectors

| Connector | Auth | Status |
|-----------|------|--------|
| MCP Server - Token | Bearer/None | ✅ Available |
| MCP Server - OAuth | OAuth | ✅ Available |

### MCP Server - Token

Connect to MCP servers using bearer token or no authentication.

**Prerequisites:** MCP server URL (Streamable HTTP endpoint)

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **MCP - External** group, click the **MCP Server - Token** card
3. Fill the form:
   - **Connection Name** (required): A friendly name for this MCP connection
   - **MCP Server URL** (required): The Streamable HTTP endpoint (e.g., `https://mcp.example.com/mcp`)
   - **Bearer Token** (optional): Leave empty if the server doesn't require auth
   - **Custom Headers** (optional): Additional headers for MCP requests
4. Click Save → Tools auto-discovered

**After setup:** Use `sync_mcp_connection()` to refresh available tools.

### MCP Server - OAuth

Connect to MCP servers with OAuth 2.0 support (RFC 9728).

**Prerequisites:** MCP server with OAuth 2.0 Protected Resource Metadata

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **MCP - External** group, click the **MCP Server - OAuth** card
3. Fill the form:
   - **Connection Name** (required): A friendly name for this MCP connection
   - **MCP Server URL** (required): Base URL of the MCP server
   - **OAuth Client ID** (optional): Only if the server has pre-registered clients
   - **OAuth Client Secret** (optional): Only if required by the server
4. Click Save → Complete OAuth authorization flow

**Features:** Automatic token refresh (1 hour).

---

## STT & TTS

Speech-to-text and text-to-speech services for voice message processing.

### Available Connectors

| Connector | Auth | Status |
|-----------|------|--------|
| Groq STT | API Key | ✅ Available |
| OpenAI STT | API Key | ✅ Available |
| OpenAI TTS | API Key | ✅ Available |
| ElevenLabs TTS | API Key | ✅ Available |

### Groq STT

**Prerequisites:** Groq API key from [console.groq.com](https://console.groq.com)

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **STT & TTS** group, click the **Groq STT** card
3. Fill the form:
   - **Connection Name** (required): A name to identify this connection
   - **API Key** (required): Your Groq API key
4. Click Save

**Usage:** Transcribes voice messages to text using Whisper models.

### OpenAI STT

**Prerequisites:** OpenAI API key

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **STT & TTS** group, click the **OpenAI STT** card
3. Fill the form:
   - **Connection Name** (required): A name to identify this connection
   - **API Key** (required): Your OpenAI API key
4. Click Save

**Usage:** Transcribes voice messages to text.

### OpenAI TTS

**Prerequisites:** OpenAI API key

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **STT & TTS** group, click the **OpenAI TTS** card
3. Fill the form:
   - **Connection Name** (required): A name to identify this connection
   - **API Key** (required): Your OpenAI API key
4. Click Save

**Voices available:** alloy, echo, fable, onyx, nova, shimmer

### ElevenLabs TTS

**Prerequisites:** ElevenLabs API key from [elevenlabs.io](https://elevenlabs.io)

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **STT & TTS** group, click the **ElevenLabs TTS** card
3. Fill the form:
   - **Connection Name** (required): A name to identify this connection
   - **API Key** (required): Your ElevenLabs API key
4. Click Save

**Usage:** High-quality voice synthesis with custom voices.

---

## Quick Reference

| Connector | Type | Auth | Auto-Refresh |
|-----------|------|------|--------------|
| OpenAI | Agent | API Key | - |
| OpenRouter | Agent | API Key | - |
| WhatsApp | Channel | OAuth | 7 days |
| Instagram | Channel | OAuth | 7 days |
| Google Calendar | Tool - Native | OAuth | 1 hour |
| Google Drive | Tool - Native | OAuth | 1 hour |
| YouTube | Tool - Native | OAuth | 1 hour |
| Wayai Conversation | Tool - Native | None | - |
| Wayai Meta Tools | Tool - Native | None | - |
| Wayai Knowledge | Tool - Native | None | - |
| Wayai External Storage | Tool - Native | API Key | - |
| User Tool - API Key | Tool - User | API Key | - |
| User Tool - Basic | Tool - User | Basic Auth | - |
| MCP Server - Token | MCP - External | Bearer/None | - |
| MCP Server - OAuth | MCP - External | OAuth | 1 hour |
| Groq STT | STT & TTS | API Key | - |
| OpenAI STT | STT & TTS | API Key | - |
| OpenAI TTS | STT & TTS | API Key | - |
| ElevenLabs TTS | STT & TTS | API Key | - |
