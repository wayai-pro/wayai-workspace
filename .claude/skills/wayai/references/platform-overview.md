# WayAI Platform Overview

## What is WayAI

WayAI is a SaaS platform for AI-powered omnichannel communication hubs. It integrates AI agents with human teams to handle customer interactions across WhatsApp, Email, Instagram, and native App channels.

## Entity Hierarchy

```
Organization          # Company/team container (billing, users)
└── Project           # Logical grouping of hubs
    └── Hub           # Omnichannel conversation space
        ├── Connections   # Channels and API integrations
        └── Agents        # AI personalities
            └── Tools     # Agent capabilities
```

## Hub Types

| Type | Description | Channels | Use Case |
|------|-------------|----------|----------|
| `user` | ONE conversation per end user | All (WhatsApp, Instagram, Email, App) | Person-centered: support, sales, helpdesk |
| `workflow` | MULTIPLE conversations per user | App only | Task-centered: invoices, inventory, approvals |

**Decision guide:**
- Need WhatsApp/Instagram/Email? → Use `user`
- Processing objects/tasks (not people)? → Use `workflow`

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

### Agent Connections (Required for AI)
| Type | Description |
|------|-------------|
| OpenAI | GPT models (gpt-4o, gpt-4o-mini) |
| OpenRouter | Multi-provider access (Anthropic, Google, Meta) |

### Channel Connections (For messaging)
| Type | Description |
|------|-------------|
| WhatsApp Business | Send/receive WhatsApp messages |
| Instagram | Instagram DMs |
| Gmail | Send emails |

### Tool Connections (For integrations)
| Type | Description |
|------|-------------|
| Webhook | Custom REST API integration |
| MCP Server | External MCP tool server |
| Google Calendar | Calendar access |

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

| Level | Description |
|-------|-------------|
| `read_write` | Full read/write access |
| `read_only` | Read-only access |
| `disabled` | MCP disabled |
