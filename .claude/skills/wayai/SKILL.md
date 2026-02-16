---
name: wayai
description: |
  Configure WayAI hubs, agents, and tools via MCP. Use when: (1) Creating or configuring WayAI hubs,
  (2) Managing AI agents and their tools, (3) Working with MCP operations for WayAI platform,
  (4) Syncing workspace settings with Git, (5) Using hub templates for new deployments.
---

<!-- v3.3.0 -->

# WayAI Skill

## Table of Contents
- [Agent Guidelines](#agent-guidelines)
- [Tool Usage Priority](#tool-usage-priority)
- [Quick Decision: MCP or UI?](#quick-decision-mcp-or-ui)
- [Entity Hierarchy](#entity-hierarchy)
- [Connection Prerequisites](#️-connection-prerequisites)
- [Core Workflow](#core-workflow)
- [MCP Tools Quick Reference](#mcp-tools-quick-reference)
- [Editing Agent Instructions](#editing-agent-instructions)
- [Using Templates](#using-templates)
- [Reference Documentation](#reference-documentation)

## Agent Guidelines

- Only provide information from this skill, MCP tool descriptions, or MCP resources
- Do not invent URLs, paths, or steps
- When editing agent instructions, follow the [Editing Agent Instructions](#editing-agent-instructions) workflow

## Tool Usage Priority

1. **WayAI MCP Server** - Use for ALL settings operations (CRUD on hubs, agents, tools, connections)
2. **UI (platform.wayai.pro)** - Use when MCP doesn't support the operation (OAuth, delete hub, user management)

## Quick Decision: MCP or UI?

| Entity | MCP | UI Only |
|--------|-----|---------|
| **Organization** | Read (`get_workspace`) | Create, update, delete, users |
| **Project** | Read, Create | Update, delete |
| **Hub** | Create, Read, Update | Delete |
| **Connection** | Create (non-OAuth), enable, disable, sync MCP | Delete, OAuth setup |
| **Org Credential** | List | Create, update, delete |
| **Agent** | Full CRUD | - |
| **Tool** | Full CRUD | - |
| **Evals** | Full CRUD (scenarios, sessions, analytics) | - |

## Entity Hierarchy

```
Organization          ← UI only
├── Org Credentials   ← UI to create; MCP to list
└── Project           ← MCP to create
    └── Hub           ← Full MCP control
        ├── Connections   ← Wayai auto-created; non-OAuth via MCP (using org credentials); OAuth via UI
        └── Agents        ← Full MCP control
            └── Tools     ← Full MCP control
```

Setup order: Organization (signup) → Org Credentials (UI) → Project → Hub → Connections (MCP for non-OAuth, UI for OAuth) → Agents → Tools

**Note:** Wayai connection (native tools) is auto-created when a hub is created. Non-OAuth connections (Agent, STT, TTS, Custom Tool) can be created via MCP using organization credentials. OAuth connections (WhatsApp, Instagram, Gmail, Google Calendar) require UI setup.

### ⚠️ Connection Prerequisites

**Organization credentials (one-time setup in UI):**
- Store API keys at the organization level: UI → Settings → Organization → Credentials tab
- Reusable across hubs — no need to re-enter keys per connection
- Supported auth types: API Key, Bearer Token, Basic Auth

**For creating agents → Agent connection required:**
- OpenAI, OpenRouter, Anthropic, or Google AI Studio
- **Via MCP:** `list_organization_credentials(org_id)` → `add_connection(hub_id, connector_id, organization_credential_id)`
- **Via UI:** Settings → Hub → Connections → Agent group

**For enabling/creating tools → Tool connection required:**
- **Wayai (auto-created):** Native tools automatically available when hub is created
- **Tool - Native (OAuth):** Google Calendar — UI only
- **Tool - Native (API Key):** External Resources — MCP with org credential or UI
- **Tool - Custom:** Custom API tools — MCP with org credential or UI
- **Tool - MCP:** MCP Server (Token) — MCP with org credential or UI; MCP Server (OAuth) — UI only

## Core Workflow

```
BEFORE changes:
1. get_workspace()     → discover hub_id
2. Read workspace/<hub_folder>/CONTEXT.md (create if missing — see CLAUDE.md)
3. get_hub(hub_id)     → current state (JSON)

MAKING changes:
4. Use MCP tools OR edit local Markdown files
5. Apply changes via MCP tools

AFTER changes:
6. Update workspace/<hub_folder>/CONTEXT.md if decisions or context changed
7. Update local Markdown files from JSON
8. Commit to Git
```

## MCP Tools Quick Reference

| Category | Tools |
|----------|-------|
| **Workspace** | `get_workspace`, `download_workspace`, `download_skill` |
| **Hub** | `get_hub`, `create_hub`, `update_hub` |
| **Agent** | `get_agent`, `download_agent_instructions`, `create_agent`, `update_agent`, `upload_agent_instructions`, `delete_agent` |
| **Tool** | `get_tool`, `add_native_tool`, `add_mcp_tool`, `add_custom_tool`, `update_custom_tool`, `enable_tool`, `disable_tool`, `remove_tool`, `remove_custom_tool` |
| **Connection** | `list_organization_credentials`, `add_connection`, `update_connection`, `enable_connection`, `disable_connection`, `sync_mcp_connection` |
| **Analytics** | `get_analytics_variables`, `get_analytics_data`, `get_conversations_list`, `get_conversation_messages`, `pin_analytics_variable` |
| **Evals** | `get_evals`, `create_eval`, `update_eval`, `delete_eval`, `create_eval_session`, `run_eval_session`, `get_eval_session_details`, `get_eval_session_runs`, `get_eval_analytics` |

See [references/mcp-operations.md](references/mcp-operations.md) for detailed usage.

## Editing Agent Instructions

When working with agent instructions, always follow this workflow to keep files in sync:

### Download Workflow
```
1. DOWNLOAD: download_agent_instructions(hub_id, agent_id)
   → Returns signed URL (valid 1 hour)

2. SAVE: curl to workspace file
   curl -L "{url}" -o workspace/{org}/{project}/{hub}/{agentname}-instructions.md
   → Saves instructions to the workspace directory

3. READ: Read the workspace file when needed
   → User reviews and edits in their editor
```

### Upload Workflow
```
1. REVIEW: Show proposed changes (before/after)
   → Wait for user approval before uploading

2. GET URL: upload_agent_instructions(hub_id, agent_id)
   → Returns upload URL, headers, and curl command

3. UPLOAD: Run the returned curl command with the workspace file
   curl -X POST '{upload_url}' ... --data-binary @workspace/{org}/{project}/{hub}/{agentname}-instructions.md
   → File stored in R2 and synced to database
```

**File Naming Convention:**
- Pattern: `{agentname}-instructions.md`
- Slugify agent name: lowercase, spaces→hyphens, remove special chars
- Examples:
  - Agent "Atendente" → `atendente-instructions.md`
  - Agent "Order Taker" → `order-taker-instructions.md`
  - Agent "Suporte Nível 2" → `suporte-nvel-2-instructions.md`

**Important:**
- `get_agent` excludes instructions (use `download_agent_instructions` instead)
- `update_agent` cannot modify instructions (use upload workflow)
- Always fetch current instructions before editing to avoid overwriting changes
- Always prefer upload workflow over direct update (token-efficient, works with files)
- Always save and edit instruction files in the `workspace/` directory (never use `/tmp` or other locations) so the repo stays in sync with the platform without requiring an extra `download_workspace` step
- Instructions support dynamic placeholders like `{{now()}}`, `{{user_name()}}`, `{{state()}}`, etc. — see [agent-placeholders.md](references/agent-placeholders.md)

**Example:**
```
User: "Update the Pilot agent instructions to be more friendly"

Claude:
1. download_agent_instructions(hub_id, agent_id) → signed_url
2. curl -L "{signed_url}" -o workspace/{org}/{project}/{hub}/atendente-instructions.md
3. Read the workspace file → show current instructions
4. Show user: "Here are the current instructions. I'll make them more friendly..."
5. Edit the workspace file with proposed changes
6. Show diff to user, wait for approval
7. upload_agent_instructions(hub_id, agent_id) → upload URL + curl command
8. Run curl to upload workspace/{org}/{project}/{hub}/atendente-instructions.md
```

## Using Templates

Templates are bundled in this skill. See [templates.md](references/templates.md) for the full list with paths to hub and agent instruction files.

```
User: "Preciso de um hub para pizzaria"

Claude:
1. Find matching template in references/templates.md
2. Read the hub config and agent instructions from template paths
3. Copy to workspace: organizations/{org}/{project}/{hub-name}/
4. Customize placeholders ({NOME_EMPRESA}, etc.)
5. Create hub via MCP: create_hub(...)
6. list_organization_credentials(org_id) → check for matching credential
7a. If org credential exists: add_connection(hub_id, connector_id, org_credential_id) → create connection via MCP
7b. If no org credential: ⚠️ STOP — direct user to UI: Organization → Credentials tab to create one, then retry
8. Create agent via MCP: create_agent(...)
9. Add tools to agent as needed
```

## Reference Documentation

| Reference | When to Read |
|-----------|--------------|
| [platform-overview.md](references/platform-overview.md) | Understanding WayAI concepts, entity types, AI modes |
| [mcp-operations.md](references/mcp-operations.md) | MCP tool details, parameters, examples |
| [analytics.md](references/analytics.md) | Conversation analytics, metrics, and performance analysis |
| [connections.md](references/connections.md) | Setting up hub connections (OAuth, API keys, channels) |
| [native-tools.md](references/native-tools.md) | Native tool parameters and usage by connector |
| [user-tools.md](references/user-tools.md) | Creating custom API tools with placeholders |
| [agent-placeholders.md](references/agent-placeholders.md) | Dynamic placeholders for agent instructions (`{{now()}}`, `{{state()}}`, etc.) |
| [templates.md](references/templates.md) | Available hub templates catalog |
| [template-structure.md](references/template-structure.md) | Template file formats, placeholders, structure |
| [markdown-format.md](references/markdown-format.md) | File format conventions, export/import workflows |
