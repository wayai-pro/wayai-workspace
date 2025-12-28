# Connections

Setup guide for WayAI hub connections. Created via **UI** at Settings → Organization → Project → Hub → Connections.

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

| Connector | connector_id | Auth | Description |
|-----------|--------------|------|-------------|
| OpenAI | `0cd6a292-895b-4667-b89e-dd298628c272` | API Key | LLM provider for OpenAI GPT models. Requires API key. |
| OpenRouter | `4d7e9f23-1a2b-4c3d-9e8f-5a6b7c8d9e0f` | API Key | Multi-provider LLM gateway with access to OpenAI, Anthropic, Google, and xAI models. |
| Anthropic | `b3c4d5e6-f7a8-9012-bcde-f12345678902` | API Key | LLM provider for Anthropic Claude models. Requires API key. |
| Google AI Studio | `c4d5e6f7-a8b9-0123-cdef-234567890123` | API Key | LLM provider for Google Gemini models. Requires API key. |

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

### Anthropic

**Prerequisites:** Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Agent** group, click the **Anthropic** card
3. Fill the form:
   - **Connection Name** (required): A name to identify this connection
   - **API Key** (required): Your Anthropic API key
4. Click Save

### Google AI Studio

**Prerequisites:** Google AI Studio API key from [aistudio.google.com](https://aistudio.google.com)

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Agent** group, click the **Google AI Studio** card
3. Fill the form:
   - **Connection Name** (required): A name to identify this connection
   - **API Key** (required): Your Google AI Studio API key
4. Click Save

---

## Channel

Messaging channels for customer communication.

### Available Connectors

| Connector | connector_id | Auth | Description |
|-----------|--------------|------|-------------|
| WhatsApp | `5fb214cb-aaa8-4b3d-8c65-c9370b3e7c85` | OAuth | Send and receive WhatsApp messages via Meta Business API with embedded signup. |
| Instagram | `f9e8d7c6-5b4a-3210-9876-543210fedcba` | OAuth | Send and receive Instagram Direct Messages via Meta Business API. |
| Gmail | `e12d4567-89ab-4cef-9012-3456789abcde` | OAuth | Send and receive emails via Gmail API with OAuth authentication. |

### WhatsApp

**Prerequisites:**
- Meta Business account (or create one during signup)
- Phone number for WhatsApp Business (can be new or existing)

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Channel** group, click the **WhatsApp** card
3. Click "Connect with Meta" → Meta embedded signup opens

**Step 1 - Welcome Screen:**
- Review the connection benefits (Cloud API for messaging at scale)
- Click **Continue**

**Step 2 - Select Business Portfolio:**
- Choose an existing Business portfolio from the dropdown, or
- Click **Create a Business portfolio** if you don't have one
- Click **Next**

**Step 3 - Select WhatsApp Business Account:**
- Choose an existing WhatsApp Business account, or
- Click **Create a WhatsApp Business account** to create new, or
- Click **Connect a WhatsApp Business App** to migrate existing app
- Click **Next**

**Step 4 - Select Facebook Page:**
- Choose an existing Facebook Page from your portfolio, or
- Click **Create a Facebook Page** to create new
- Click **Next**

**Step 5 - Select Pixel (optional):**
- Choose an existing Meta Pixel or create new
- Select an Ad Account for conversion tracking
- Click **Next**

**Step 6 - Add WhatsApp Phone Number:**
- **Use a display name only**: Send messages showing only your business name
- **Use a new or existing WhatsApp number**: Register a phone number (verification required)
- **Add a phone number later**: Skip and configure in Meta Business Settings
- If adding a number: enter phone number and choose verification method (Text message or Phone call)
- Click **Next**

**Step 7 - Review Permissions:**
- Review what WayAI will access (WhatsApp Business account, Ad account, Facebook page, Dataset)
- Click **Confirm**

**Step 8 - Complete:**
- "Your account is connected to Wayai" confirmation appears
- Optionally click **Add payment method** for WhatsApp conversations billing
- Click **Finish**

**After Setup:** Connection created automatically in WayAI.

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

### Gmail

**Prerequisites:**
- Google account with Gmail access

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Channel** group, click the **Gmail** card
3. Click "Connect with Google"
4. Authorize Gmail access (send and receive emails)
5. Connection created automatically

**Features:** Send/receive emails, auto-refresh (1 hour).

---

## Tool - Native

Platform-provided tool integrations that extend agent capabilities.

See [native-tools.md](native-tools.md) for available tools and their parameters.

### Available Connectors

| Connector | connector_id | Auth | Description |
|-----------|--------------|------|-------------|
| Google Calendar | `189c2e74-2275-43b6-8dac-0fb3b782e9de` | OAuth | Manage Google Calendar events and check time slot availability. |
| Google Drive | `3b8d9e5f-7a1c-4d2e-9b3f-8a7c6d5e4f3a` | OAuth | Access and manage files and folders in Google Drive. |
| YouTube | `7c9e2f4a-6b8d-4e1f-9c3a-5d7e8f6a9b2c` | OAuth | Access YouTube channel data, videos, and playlists. |
| Wayai Conversation | `b17d9f3a-4e1b-46c9-b648-a2f0c3611aa4` | None | Manage conversations, transfers, and agent consultations. |
| Wayai Meta Tools | `c39d5aca-1c43-47cc-b6f1-56d962fe2bbb` | None | Dynamically execute tools and retrieve tool schemas. |
| Wayai Resource | `d45e6f78-9abc-4def-8901-23456789abcd` | None | Search and manage resource base content. |
| Wayai External Storage | `e8f9a0b1-2c3d-4e5f-6789-0abcdef12345` | API Key | Connect to external file storage services. |

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

Internal tools for conversation management.

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Tool - Native** group, click the **Wayai Conversation** card
3. Click Save (no credentials required)

**Agent tools:** Get conversation context, manage conversation state.

### Wayai Meta Tools

Internal tools for agent orchestration.

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Tool - Native** group, click the **Wayai Meta Tools** card
3. Click Save (no credentials required)

**Agent tools:** Transfer to human, end conversation, escalation controls.

### Wayai Resource

Internal resource base tools.

**Setup:**
1. Settings → Organizations → Project → Hub → Connections
2. In the **Tool - Native** group, click the **Wayai Resource** card
3. Click Save (no credentials required)

**Agent tools:** Search resource base, retrieve documents.

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

| Connector | connector_id | Auth | Description |
|-----------|--------------|------|-------------|
| User Tool - API Key | `b15fb991-63e1-4a79-a174-d10aa66f4414` | API Key | Connect custom REST APIs using API key or bearer token authentication. |
| User Tool - Basic | `c25fb992-63e1-4a79-a174-d10aa66f4415` | Basic Auth | Connect custom REST APIs using HTTP Basic authentication. |

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

| Connector | connector_id | Auth | Description |
|-----------|--------------|------|-------------|
| MCP Server - Token | `f1a2b3c4-d5e6-7890-abcd-ef1234567890` | Bearer/None | Connect to external MCP servers with optional bearer token authentication. |
| MCP Server - OAuth | `a2b3c4d5-e6f7-8901-bcde-f12345678901` | OAuth | Connect to external MCP servers with OAuth 2.0 authentication (RFC 9728). |

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

| Connector | connector_id | Auth | Description |
|-----------|--------------|------|-------------|
| Groq STT | `78328cbf-19d5-4310-9c37-fea2d792f356` | API Key | Fast speech-to-text transcription using Groq's Whisper implementation. |
| OpenAI STT | `c3d4e5f6-7a8b-4c9d-0e1f-2a3b4c5d6e7f` | API Key | Speech-to-text transcription using OpenAI Whisper API. |
| OpenAI TTS | `b2c3d4e5-f6a7-4b89-c012-3456789abcdf` | API Key | Text-to-speech synthesis using OpenAI voices (alloy, echo, fable, onyx, nova, shimmer). |
| ElevenLabs TTS | `a1b2c3d4-e5f6-4789-a012-3456789abcde` | API Key | High-quality text-to-speech with custom voice cloning via ElevenLabs. |

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

| Connector | connector_id | Type | Auth | Description |
|-----------|--------------|------|------|-------------|
| OpenAI | `0cd6a292-895b-4667-b89e-dd298628c272` | Agent | API Key | LLM provider for OpenAI GPT models. |
| OpenRouter | `4d7e9f23-1a2b-4c3d-9e8f-5a6b7c8d9e0f` | Agent | API Key | Multi-provider LLM gateway. |
| Anthropic | `b3c4d5e6-f7a8-9012-bcde-f12345678902` | Agent | API Key | LLM provider for Anthropic Claude models. |
| Google AI Studio | `c4d5e6f7-a8b9-0123-cdef-234567890123` | Agent | API Key | LLM provider for Google Gemini models. |
| WhatsApp | `5fb214cb-aaa8-4b3d-8c65-c9370b3e7c85` | Channel | OAuth | WhatsApp via Meta Business API. |
| Instagram | `f9e8d7c6-5b4a-3210-9876-543210fedcba` | Channel | OAuth | Instagram DMs via Meta Business API. |
| Gmail | `e12d4567-89ab-4cef-9012-3456789abcde` | Channel | OAuth | Email via Gmail API. |
| Google Calendar | `189c2e74-2275-43b6-8dac-0fb3b782e9de` | Tool - Native | OAuth | Manage calendar events. |
| Google Drive | `3b8d9e5f-7a1c-4d2e-9b3f-8a7c6d5e4f3a` | Tool - Native | OAuth | Access files and folders. |
| YouTube | `7c9e2f4a-6b8d-4e1f-9c3a-5d7e8f6a9b2c` | Tool - Native | OAuth | Access channel data and videos. |
| Wayai Conversation | `b17d9f3a-4e1b-46c9-b648-a2f0c3611aa4` | Tool - Native | None | Manage conversations and transfers. |
| Wayai Meta Tools | `c39d5aca-1c43-47cc-b6f1-56d962fe2bbb` | Tool - Native | None | Execute tools dynamically. |
| Wayai Knowledge | `d45e6f78-9abc-4def-8901-23456789abcd` | Tool - Native | None | Search knowledge base content. |
| Wayai External Storage | `e8f9a0b1-2c3d-4e5f-6789-0abcdef12345` | Tool - Native | API Key | External file storage. |
| User Tool - API Key | `b15fb991-63e1-4a79-a174-d10aa66f4414` | Tool - User | API Key | Custom REST APIs with API key. |
| User Tool - Basic | `c25fb992-63e1-4a79-a174-d10aa66f4415` | Tool - User | Basic Auth | Custom REST APIs with Basic auth. |
| MCP Server - Token | `f1a2b3c4-d5e6-7890-abcd-ef1234567890` | MCP - External | Bearer/None | MCP servers with token auth. |
| MCP Server - OAuth | `a2b3c4d5-e6f7-8901-bcde-f12345678901` | MCP - External | OAuth | MCP servers with OAuth 2.0. |
| Groq STT | `78328cbf-19d5-4310-9c37-fea2d792f356` | STT & TTS | API Key | Fast STT via Groq Whisper. |
| OpenAI STT | `c3d4e5f6-7a8b-4c9d-0e1f-2a3b4c5d6e7f` | STT & TTS | API Key | STT via OpenAI Whisper API. |
| OpenAI TTS | `b2c3d4e5-f6a7-4b89-c012-3456789abcdf` | STT & TTS | API Key | TTS via OpenAI voices. |
| ElevenLabs TTS | `a1b2c3d4-e5f6-4789-a012-3456789abcde` | STT & TTS | API Key | High-quality TTS with custom voices. |
