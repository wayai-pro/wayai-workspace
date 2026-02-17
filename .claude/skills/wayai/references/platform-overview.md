# WayAI Platform Overview

## Table of Contents
- [What is WayAI](#what-is-wayai)
- [Hub Types](#hub-types)
- [Hub Environments](#hub-environments)
- [AI Modes](#ai-modes)
- [Agent Roles](#agent-roles)
- [Connection Types](#connection-types)
- [Tool Types](#tool-types)
- [MCP Access Levels](#mcp-access-levels)

## What is WayAI

WayAI is a SaaS platform for AI-powered omnichannel communication hubs. It integrates AI agents with human teams to handle customer interactions across WhatsApp, Email, Instagram, and native App channels.

## Hub Types

| Type | Description | Channels | Use Case |
|------|-------------|----------|----------|
| `user` | ONE conversation per end user | All (WhatsApp, Instagram, Email, App) | Person-centered: support, sales, helpdesk |
| `workflow` | MULTIPLE conversations per user | App only | Task-centered: invoices, inventory, approvals |

**Decision guide:**
- Need WhatsApp/Instagram/Email? → Use `user`
- Processing objects/tasks (not people)? → Use `workflow`

## Hub Environments

Hubs use a **preview/production branching** model for safe configuration management.

| Environment | Description |
|-------------|-------------|
| `preview` | Default. Editable workspace for configuring and testing changes |
| `production` | Read-only. Serves live traffic. Changes must flow from preview via sync |

**Lifecycle:**
1. **New hubs** start as `preview` — edit freely
2. **Publish** (`publish_hub`) — first-time promotion creates a `production` hub cloned from preview
3. **Sync** (`sync_hub`) — pushes subsequent preview changes to the linked production hub
4. **Replicate** (`replicate_preview`) — creates a new preview hub from production for experimentation

**Rules:**
- Production hubs are **read-only** — all config mutations (agents, tools, connections, etc.) are blocked
- Changes always flow: preview → sync → production
- MCP `read_write` access is **not available** on production hubs (clamped to `read_only` on publish/sync)
- Multiple preview hubs can link to the same production hub (many-to-1)
- Deleting a production hub requires deleting all linked previews first

## AI Modes

| Mode | Description |
|------|-------------|
| `Pilot+Copilot` | AI handles conversations, humans can take over |
| `Pilot` | AI only, no human intervention |
| `Copilot` | AI assists humans, humans lead |
| `Turned Off` | AI disabled, humans only |

## Agent Roles

| Role | Description |
|------|-------------|
| `Pilot` | Main AI agent, handles conversations autonomously |
| `Copilot` | AI assistant for human operators |
| `Specialist for Pilot` | Expert agent called by Pilot for specific tasks |
| `Specialist for Copilot` | Expert agent called by Copilot |
| `Consultant for Pilot` | Advisory agent for Pilot decisions |
| `Consultant for Copilot` | Advisory agent for Copilot |
| `Monitor` | Observes without participating |
| `Evaluator of Conversations` | Evaluates full conversations |
| `Evaluator of Messages` | Evaluates individual messages |

## Connection Types

Connections enable hub functionality. Created via UI (Settings → Organization → Project → Hub → Connections).

| Category | Examples |
|----------|----------|
| **Agent** | OpenAI, OpenRouter (required for AI) |
| **Channel** | WhatsApp, Instagram, Gmail |
| **Tool** | Webhook, Google Calendar, MCP Server |
| **Speech** | Groq STT, OpenAI TTS, ElevenLabs |

See [connections.md](connections.md) for setup instructions.

## Tool Types

| Type | Description | How to Add |
|------|-------------|------------|
| Native | Built-in platform tools (web_search, send_email) | `add_native_tool()` |
| MCP | Tools from connected MCP servers | `add_mcp_tool()` |
| Custom | API endpoints you define | `add_custom_tool()` |

### Common Native Tools

| Tool ID | Description |
|---------|-------------|
| `web_search` | Search the web |
| `send_whatsapp_message` | Send WhatsApp message |
| `send_email` | Send email |
| `transfer_to_human` | Transfer to human agent |
| `end_conversation` | End the conversation |

## MCP Access Levels

Hubs can be configured with different MCP access:

| Level | Description | Environments |
|-------|-------------|-------------|
| `read_write` | Full read/write access | Preview only |
| `read_only` | Read-only access | Preview and Production |
| `disabled` | MCP disabled | Preview and Production |

**Note:** Production hubs cannot have `read_write` MCP access. If a preview hub has `read_write`, it is automatically clamped to `read_only` when published or synced to production.
