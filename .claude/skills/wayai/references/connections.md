# Connections

Setup guide for WayAI hub connections. Created via **UI** at platform.wayai.pro → Hub → Settings → Connections.

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
1. Hub → Settings → Connections → Add Connection
2. Select **OpenAI**
3. Enter connection name and API key
4. Configure default model

**Settings:**
- `model` - gpt-4o, gpt-4o-mini, o1, o1-mini, etc.
- `temperature` - Creativity (0-2, default 0.7)
- `max_tokens` - Response limit (default 4096)

### OpenRouter

**Prerequisites:** OpenRouter API key from [openrouter.ai](https://openrouter.ai)

**Setup:**
1. Hub → Settings → Connections → Add Connection
2. Select **OpenRouter**
3. Enter connection name and API key
4. Select default model

**Available models:** GPT, Claude, Gemini, Grok, Llama via single API.

---

## Channel

Messaging channels for customer communication.

### Available Connectors

| Connector | Auth | Status |
|-----------|------|--------|
| WhatsApp (OAuth) | OAuth | ✅ Available |
| WhatsApp (Token) | API Key | ⚠️ Disabled |
| Instagram | OAuth | ✅ Available |

### WhatsApp (OAuth) ✅

**Prerequisites:**
- Meta Business account
- Verified business
- WhatsApp Business phone number

**Setup:**
1. Hub → Settings → Connections → Add Connection
2. Select **WhatsApp**
3. Click "Connect with Meta"
4. Complete Meta embedded signup flow
5. Select phone number and permissions

**Features:** Automatic token refresh (7 days), CTWA + Conversions API.

### WhatsApp (Token) ⚠️ Disabled

> This connector is currently disabled. Use OAuth method instead.

### Instagram

**Prerequisites:**
- Instagram Business or Creator account
- Connected to Facebook Page
- Meta Business account

**Setup:**
1. Hub → Settings → Connections → Add Connection
2. Select **Instagram**
3. Click "Connect with Meta"
4. Authorize Instagram messaging permissions
5. Select Instagram account

**Features:** Instagram DMs, auto-refresh (7 days).

---

## Tool - Native

Platform-provided tool integrations that extend agent capabilities.

See [native-tools.md](native-tools.md) for available tools and their parameters.

### Available Connectors

| Connector | Auth | Status |
|-----------|------|--------|
| Google Calendar | OAuth | ✅ Available |
| Wayai Conversation | None | ✅ Auto-enabled |
| Wayai Meta Tools | None | ✅ Auto-enabled |
| Wayai Knowledge | None | ✅ Auto-enabled |
| Wayai External Storage | API Key | ✅ Available |

### Google Calendar

**Prerequisites:** Google account with Calendar access

**Setup:**
1. Hub → Settings → Connections → Add Connection
2. Select **Google Calendar**
3. Click "Connect with Google"
4. Authorize calendar access

**Agent tools:** List events, create events, check availability.

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
1. Hub → Settings → Connections → Add Connection
2. Select **Wayai External Storage**
3. Enter:
   - Connection name
   - Storage API URL
   - API key

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
1. Hub → Settings → Connections → Add Connection
2. Select **User Tool - API Key**
3. Enter:
   - Connection name
   - Base URL (e.g., `https://api.example.com`)
   - API key
   - Access token (optional, for APIs requiring two credentials)
   - Custom headers (optional)

**Usage:** After creating the connection, add custom tools to agents that call your API endpoints.

### User Tool - Basic

Connect to APIs using Basic Authentication.

**Setup:**
1. Hub → Settings → Connections → Add Connection
2. Select **User Tool - Basic**
3. Enter:
   - Connection name
   - Base URL
   - Username
   - Password
   - Custom headers (optional)

---

## MCP - External

Connect external MCP (Model Context Protocol) servers to extend agent capabilities.

### Available Connectors

| Connector | Auth | Status |
|-----------|------|--------|
| MCP Server - Token | Bearer/None | ✅ Available |
| MCP Server - OAuth | OAuth | ✅ Available |

### MCP Server - Token

**Prerequisites:** MCP server URL (Streamable HTTP endpoint)

**Setup:**
1. Hub → Settings → Connections → Add Connection
2. Select **MCP Server - Token**
3. Enter:
   - Connection name
   - Base URL (MCP server endpoint)
   - Bearer token (optional, leave empty for no auth)
   - Custom headers (optional)
4. Save → Tools auto-discovered

**After setup:** Use `sync_mcp_connection()` to refresh available tools.

### MCP Server - OAuth

**Prerequisites:** MCP server with OAuth 2.0 support (RFC 9728)

**Setup:**
1. Hub → Settings → Connections → Add Connection
2. Select **MCP Server - OAuth**
3. Enter:
   - Connection name
   - Base URL
   - Client ID (optional, for pre-registered clients)
   - Client Secret (optional)
4. Complete OAuth authorization flow

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
1. Hub → Settings → Connections → Add Connection
2. Select **Groq STT**
3. Enter connection name and API key
4. Select model (whisper-large-v3 or whisper-large-v3-turbo)

**Usage:** Transcribes voice messages to text.

### OpenAI STT

**Prerequisites:** OpenAI API key

**Setup:**
1. Hub → Settings → Connections → Add Connection
2. Select **OpenAI STT**
3. Enter connection name and API key
4. Select model (gpt-4o-transcribe, whisper-1)

**Usage:** Transcribes voice messages to text.

### OpenAI TTS

**Prerequisites:** OpenAI API key

**Setup:**
1. Hub → Settings → Connections → Add Connection
2. Select **OpenAI TTS**
3. Enter connection name and API key
4. Configure voice, model, speed

**Voices:** alloy, echo, fable, onyx, nova, shimmer

### ElevenLabs TTS

**Prerequisites:** ElevenLabs API key from [elevenlabs.io](https://elevenlabs.io)

**Setup:**
1. Hub → Settings → Connections → Add Connection
2. Select **ElevenLabs TTS**
3. Enter connection name and API key
4. Configure voice ID, model, stability

**Usage:** High-quality voice synthesis with custom voices.

---

## Quick Reference

| Connector | Type | Auth | Auto-Refresh |
|-----------|------|------|--------------|
| OpenAI | Agent | API Key | - |
| OpenRouter | Agent | API Key | - |
| WhatsApp OAuth | Channel | OAuth | 7 days |
| Instagram | Channel | OAuth | 7 days |
| Google Calendar | Tool - Native | OAuth | 1 hour |
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
