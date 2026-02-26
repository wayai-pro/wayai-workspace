# MCP Operations

Complete reference for WayAI MCP tools organized by entity type.

## Table of Contents
- [Workspace Operations](#workspace-operations)
- [Organization Operations](#organization-operations)
- [Project Operations](#project-operations)
- [Hub Operations](#hub-operations)
- [Agent Operations](#agent-operations)
- [Tool Operations](#tool-operations)
- [Connection Operations](#connection-operations)
- [Analytics Operations](#analytics-operations)
- [Evals Operations](#evals-operations)
- [Quick Reference Table](#quick-reference-table)

## Workspace Operations

### get_workspace
Discover all organizations, projects, and hubs you have access to.
```
get_workspace()
```
Returns: workspace hierarchy with org/project/hub IDs and names

### download_workspace
Download workspace for a specific organization as downloadable zip with YAML configuration files.
```
download_workspace(
  organization,     # Required — organization name
  project           # Optional — filter to a specific project
)
```
Returns: download URL (expires in 5 minutes)

**To download and extract:**
```bash
curl -L "<url>" -o workspace.zip
unzip -o workspace.zip -d ./
```

Creates a `./workspace/` folder with structure:
```
workspace/
├── workspace.md
├── last-sync.md
└── {project-slug}/{hub-slug}/
    ├── wayai.yaml
    └── agents/{agent-slug}.md
```

### download_skill
Download Claude Code skill files. Use this to install or update the WayAI skill.
```
download_skill()
```
Returns: download URL for skill zip (expires in 5 minutes)

**To install/update:**
1. Call `download_skill()` to get download URL
2. Download and extract: `curl -L "<url>" -o skill.zip && unzip -o skill.zip -d ~/.claude/skills/`
3. Start a new conversation to load the updated skill

---

## Organization Operations

**MCP capabilities:** Read only

| Operation | MCP | UI |
|-----------|-----|----|
| List | `get_workspace` | - |
| Create | - | platform.wayai.pro signup |
| Update | - | platform.wayai.pro settings |
| Delete | - | platform.wayai.pro settings |
| Manage users | - | platform.wayai.pro team |

Organizations are discovered via `get_workspace()`. Creation and management require UI.

---

## Project Operations

**MCP capabilities:** Read, Create

| Operation | MCP | UI |
|-----------|-----|----|
| List | `get_workspace` | - |
| View | `get_project(project_id)` | - |
| Create | `create_project(...)` | platform.wayai.pro |
| Update | - | platform.wayai.pro settings |
| Delete | - | platform.wayai.pro settings |

### create_project
Create a new project in an organization.
```
create_project(
  organization_id,  # Required
  project_name      # Required
)
```

---

## Hub Operations

**Repo users:** Use files + `wayai push` for hub config changes. MCP writes require `read_write` access and are for non-repo clients only.

**MCP capabilities:** Create, Read, Update (delete, publish/sync via UI)

| Operation | MCP | UI |
|-----------|-----|----|
| List | `get_workspace` | - |
| View | `get_hub(hub_id)` | - |
| Create | `create_hub(...)` | platform.wayai.pro |
| Update | `update_hub(...)` | platform.wayai.pro |
| Publish | - | platform.wayai.pro |
| Sync | - | platform.wayai.pro |
| Replicate | - | platform.wayai.pro |
| Delete | - | platform.wayai.pro settings |
| MCP access | - | platform.wayai.pro hub settings |

### create_hub
Create a new hub in a project.

**Before calling this tool:**
1. Use `get_workspace()` to list organizations/projects and confirm with the user which project to create the hub in
2. If wayai skill is available, see references/templates.md for available hub templates and ask the user which template to use

```
create_hub(
  project_id,                   # Required
  hub_name,                     # Required
  hub_type,                     # Required: "chat" | "task"
  hub_description,              # Optional
  ai_mode,                      # Optional: "Pilot+Copilot" | "Pilot" | "Copilot" | "Turned Off"
  timezone,                     # Optional: default "America/Sao_Paulo"
  app_permission,               # Optional: "require_permission" (default) | "everyone"
  non_app_permission,           # Optional: "not_allowed" (default) | "require_permission" | "everyone"
  followup_message,             # Optional: message sent after inactivity
  inactivity_interval,          # Optional: minutes before followup message
  file_handling_mode,           # Optional: "metadata_only" (default) | "always_attach"
  max_file_size_for_attachment, # Optional: max file size in bytes
  hub_sla                       # Optional: {time_threshold1, time_threshold2, time_threshold3} in seconds
)
```

**Hub type guidance:**
- `chat`: Person-centered, works with ALL channels (WhatsApp, Instagram, Email, App)
- `task`: Task-centered, App channel only

### get_hub
Get complete hub schema including agents, tools, and connections.
```
get_hub(hub_id)
```

### update_hub
Update hub settings. Only works on preview hubs — production hubs are read-only.
```
update_hub(
  hub_id,                       # Required
  hub_name,                     # Optional
  hub_description,              # Optional
  ai_mode,                      # Optional
  followup_message,             # Optional
  inactivity_interval,          # Optional: minutes
  timezone,                     # Optional
  app_permission,               # Optional: "require_permission" | "everyone"
  non_app_permission,           # Optional: "not_allowed" | "require_permission" | "everyone"
  file_handling_mode,           # Optional: "metadata_only" | "always_attach"
  max_file_size_for_attachment, # Optional: max file size in bytes
  hub_sla                       # Optional: {time_threshold1, time_threshold2, time_threshold3} in seconds
)
```

### Hub Environment Workflow

Hubs use a preview/production branching model. New hubs start as `preview`. Publish, sync, and replicate operations are managed via the platform UI.

```
1. Create hub              → starts as preview
2. Configure freely        → agents, tools, connections, etc. (files + wayai push)
3. Publish (UI)            → creates production clone (first time only)
4. Make more changes       → edit the preview hub (files + wayai push)
5. Sync (UI)               → push changes to production
6. Replicate Preview (UI)  → create new preview for experimentation
```

---

## Agent Operations

**Repo users:** Use files + `wayai push` for agent config changes. MCP writes require `read_write` access and are for non-repo clients only.

**MCP capabilities:** Full CRUD

### ⚠️ Prerequisite: Agent Connection Required

Creating agents requires an **Agent connection** (LLM provider):
- **OpenAI** or **OpenRouter**
- Created via UI: Settings → Organization → Project → Hub → Connections → **Agent** group
- If missing, `create_agent` will fail

Direct user to create Agent connection first, then proceed with agent creation.

| Operation | MCP |
|-----------|-----|
| List | `get_hub(hub_id)` |
| View | `get_agent(hub_id, agent_id)` |
| Download instructions | `download_agent_instructions(hub_id, agent_id)` |
| Create | `create_agent(...)` |
| Update settings | `update_agent(...)` |
| Upload instructions | `upload_agent_instructions(hub_id, agent_id)` → URL + curl |
| Delete | `delete_agent(...)` |

### get_agent
Get agent details including tools. Instructions are excluded to save context.
```
get_agent(hub_id, agent_id)
```
Use `download_agent_instructions` to retrieve the agent's instructions.

### download_agent_instructions
Download agent instructions as a downloadable file URL.
```
download_agent_instructions(hub_id, agent_id)
```
Returns:
- `download_url`: Signed URL valid for 1 hour
- `expires_in`: Time until URL expires

**Download using curl:**
```bash
curl -L "{download_url}" -o workspace/{project}/{hub}/{agentname}-instructions.md
```

Note: The file is recreated from `agent.instructions` on each call to ensure sync with the database. Always save to the `workspace/` directory so the repo stays in sync, then Read when needed (avoids context bloat).

### create_agent
Create a new agent. Use `get_hub` first to find available Agent connections and their supported models. After creation, upload instructions using `upload_agent_instructions`.
```
create_agent(
  hub_id,            # Required
  agent_name,        # Required
  agent_role,        # Required: Pilot, Copilot, Specialist for Pilot, etc.
  connection_id,     # Required: LLM connection ID (use get_hub to find)
  model,             # Required: e.g., gpt-4o, claude-sonnet-4-5, gemini-2.5-flash
  # Optional settings (validated against connector schema):
  temperature,       # Controls randomness (0=focused, 2=creative)
  max_tokens,        # Maximum tokens to generate
  top_p,             # Nucleus sampling (OpenAI, OpenRouter)
  reasoning_effort,  # OpenAI gpt-5 family: minimal, low, medium, high, none
  verbosity,         # OpenAI gpt-5 family: low, medium, high
  service_tier       # OpenAI gpt-5 family: auto, flex, default, priority
)
```
**Note:** Settings are validated against the connector's `agent_settings_schema`. Invalid settings return an error with details.

### update_agent
Update an existing agent. To update instructions, use `upload_agent_instructions`.
```
update_agent(
  hub_id,            # Required
  agent_id,          # Required
  agent_name,        # Optional
  agent_role,        # Optional
  # Optional settings (validated against connector schema):
  model,             # LLM model
  temperature,       # Controls randomness (0=focused, 2=creative)
  max_tokens,        # Maximum tokens to generate
  top_p,             # Nucleus sampling (OpenAI, OpenRouter)
  reasoning_effort,  # OpenAI gpt-5 family: minimal, low, medium, high, none
  verbosity,         # OpenAI gpt-5 family: low, medium, high
  service_tier       # OpenAI gpt-5 family: auto, flex, default, priority
)
```

### upload_agent_instructions
Get an upload URL and auth headers for uploading agent instructions. The file is stored in R2 and synced to the agent instructions column.
```
upload_agent_instructions(
  hub_id,        # Required
  agent_id       # Required
)
```
Returns: upload URL, required headers, and a ready-to-use curl command.

**Upload using the returned curl command:**
```bash
curl -X POST '{upload_url}' \
  -H 'Content-Type: text/markdown' \
  -H 'Authorization: Bearer {token}' \
  --data-binary @workspace/{project}/{hub}/{agentname}-instructions.md
```

Always upload from the `workspace/` directory so the repo stays in sync with the platform.

### delete_agent
Remove an agent from the hub.
```
delete_agent(
  hub_id,        # Required
  agent_id,      # Required
  confirm=true   # Required: must be true
)
```

---

## Tool Operations

**Repo users:** Use files + `wayai push` for tool config changes. MCP writes require `read_write` access and are for non-repo clients only.

**MCP capabilities:** Full CRUD

### ⚠️ Prerequisite: Tool Connections Required

Enabling or creating tools requires a **Tool connection** for the tool's connector:

**Auto-enabled (no connection needed):**
- Wayai Conversation, Wayai Meta Tools, Wayai Resource

**Tool - Native group (via UI):**
- **Google Calendar, Drive, YouTube** → OAuth
- **Wayai External Storage** → API Key

**Tool - Custom group (via UI):**
- **Custom API tools** → API Key or Basic Auth

**MCP - External group (via UI):**
- **MCP Server tools** → Token or OAuth

| Operation | MCP |
|-----------|-----|
| List | `get_hub(hub_id)` |
| View | `get_tool(hub_id, tool_id)` |
| Add native | `add_native_tool(...)` |
| Add MCP | `add_mcp_tool(...)` |
| Add custom | `add_custom_tool(...)` |
| Update custom | `update_custom_tool(...)` |
| Enable/Disable | `enable_tool(...)` / `disable_tool(...)` |
| Remove | `remove_tool(...)` |
| Delete custom | `remove_custom_tool(...)` |

### get_tool
Get tool details and configuration.
```
get_tool(hub_id, tool_id)
```

### add_native_tool
Add a built-in platform tool to an agent.
```
add_native_tool(
  hub_id,          # Required
  agent_id,        # Required
  tool_native_id   # Required: e.g., "web_search", "send_email"
)
```

### add_mcp_tool
Add a tool from a connected MCP server.
```
add_mcp_tool(
  hub_id,       # Required
  agent_id,     # Required
  mcp_tool_id   # Required: from MCP connection tools list
)
```

### add_custom_tool
Create a custom API tool. Requires a Tool - Custom connection.
```
add_custom_tool(
  hub_id,                      # Required
  agent_id,                    # Required
  connection_id,               # Required: ID of a Tool - Custom connection
  tool_name,                   # Required
  tool_description,            # Optional: description for AI
  tool_instructions,           # Optional: usage instructions
  tool_path,                    # Optional: URL endpoint (e.g., "/orders/{{order_id}}")
  tool_method,                 # Optional: get, post, put, delete, patch
  tool_headers,                # Optional: HTTP headers as [{key, value}] array
  tool_body,                   # Optional: default body parameters
  tool_body_format,            # Optional: 'json' (default) or 'form' (x-www-form-urlencoded)
  include_history_in_context   # Optional: include tool messages in conversation context (default: false)
)
```

### update_custom_tool
Update an existing custom tool.
```
update_custom_tool(
  hub_id,                      # Required
  tool_id,                     # Required
  connection_id,               # Optional: new Tool - Custom connection
  tool_name,                   # Optional
  tool_description,            # Optional
  tool_instructions,           # Optional
  tool_path,                    # Optional
  tool_method,                 # Optional
  tool_headers,                # Optional
  tool_body,                   # Optional
  tool_body_format,            # Optional: 'json' (default) or 'form' (x-www-form-urlencoded)
  enabled,                     # Optional: true/false
  include_history_in_context   # Optional: include tool messages in conversation context
)
```

### enable_tool / disable_tool
Toggle tool status (works for all tool types).
```
enable_tool(hub_id, agent_id, tool_id)
disable_tool(hub_id, agent_id, tool_id)
```

### remove_tool
Remove a tool from an agent (keeps custom tool definition).
```
remove_tool(hub_id, agent_id, tool_id)
```

### remove_custom_tool
Delete a custom tool completely.
```
remove_custom_tool(hub_id, tool_id)
```

---

## Connection Operations

**Repo users:** Use files + `wayai push` for non-OAuth connections. MCP writes require `read_write` access and are for non-repo clients only.

**MCP capabilities:** Create (non-OAuth), Update, Enable, Disable, Sync (delete via UI, OAuth via UI)

| Operation | MCP | UI |
|-----------|-----|----|
| List | `get_hub(hub_id)` | - |
| Create | `add_connection(...)` (non-OAuth) | platform.wayai.pro (OAuth/credentials) |
| Update | `update_connection(...)` | platform.wayai.pro |
| Delete | - | platform.wayai.pro settings |
| Enable | `enable_connection(...)` | platform.wayai.pro |
| Disable | `disable_connection(...)` | platform.wayai.pro |
| Sync MCP | `sync_mcp_connection(...)` | - |

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
Returns: tools_count, resources_count

---

## Analytics Operations

**MCP capabilities:** Read analytics, list conversations, view messages

Query conversation analytics, performance metrics, and drill into individual conversations.

| Operation | MCP |
|-----------|-----|
| List variables | `get_analytics_variables(hub_id)` |
| Query data | `get_analytics_data(...)` |
| List conversations | `get_conversations_list(...)` |
| View messages | `get_conversation_messages(...)` |
| Pin variable | `pin_analytics_variable(...)` |

### get_analytics_variables
Discover all available analytics variables for a hub, organized by category.
```
get_analytics_variables(hub_id)
```
Returns: Variables grouped by category (conversation_metrics, instruction_following, escalation_performance, function_calling, user_satisfaction)

### get_analytics_data
Query analytics data with aggregations and optional trend analysis.
```
get_analytics_data(
  hub_id,           # Required
  variable_ids,     # Required: list of variable IDs from get_analytics_variables
  start_date,       # Required: YYYY-MM-DD
  end_date,         # Required: YYYY-MM-DD
  periodicity,      # Optional: daily|weekly|monthly|yearly (default: daily)
  include_trend,    # Optional: true for time series data (default: false)
  include_summary,  # Optional: true for conversation summary (default: true)
  filters           # Optional: [{variable_id, filter_type, filter_value}]
)
```
Returns: Summary stats, aggregated metrics per variable, trend data if requested

**Filter types:**
- Numeric: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`
- Text: `equals`, `not_equals`, `contains`, `not_contains`, `starts_with`, `ends_with`
- Categorical: `is`, `is_not`, `in`, `not_in`

### get_conversations_list
List conversations with optional filtering and pagination.
```
get_conversations_list(
  hub_id,       # Required
  start_date,   # Optional: filter by date range
  end_date,     # Optional
  limit,        # Optional: max results (default: 50)
  offset,       # Optional: pagination offset (default: 0)
  filters       # Optional: variable filters
)
```
Returns: List of conversations with participant info, message count, timestamps

### get_conversation_messages
Get full message history for a specific conversation.
```
get_conversation_messages(
  hub_id,           # Required (for access verification)
  conversation_id,  # Required
  limit,            # Optional: max messages (default: 100)
  offset            # Optional: pagination (default: 0)
)
```
Returns: Conversation metadata and message history with sender info

### pin_analytics_variable
Pin or unpin a variable for quick access. Requires write access.
```
pin_analytics_variable(
  hub_id,       # Required
  variable_id,  # Required
  pinned        # Required: true to pin, false to unpin
)
```

See [references/analytics.md](analytics.md) for detailed analytics documentation.

---

## Evals Operations

**MCP capabilities:** Full CRUD on scenarios, create/run sessions, view results and analytics

Manage evaluation scenarios (test cases), run sessions, and review results. Scenarios test how agents respond to specific inputs.

| Operation | MCP |
|-----------|-----|
| List scenarios | `get_evals(hub_id)` |
| Create scenario | `create_eval(...)` |
| Update scenario | `update_eval(...)` |
| Delete scenario | `delete_eval(hub_id, eval_id)` |
| Create session | `create_eval_session(...)` |
| Run session | `run_eval_session(hub_id, session_id)` |
| Session details | `get_eval_session_details(hub_id, session_id)` |
| Session runs | `get_eval_session_runs(hub_id, session_id, eval_id?)` |
| Analytics | `get_eval_analytics(hub_id)` |

### get_evals
Get all evaluation scenarios for a hub.
```
get_evals(hub_id)
```
Returns: List of scenarios with name, path, status, and runs-per-session count.

### create_eval
Create a new evaluation scenario.
```
create_eval(
  hub_id,                      # Required
  eval_name,                   # Required: name of the scenario
  responder_agent_fk,          # Required: ID of the agent that responds
  message_text,                # Required: {role: "user", content: "..."} — the test input
  message_expected_response,   # Required: {role: "assistant", content: "..."} — expected output
  eval_path,                   # Optional: category path for organizing (e.g., "greeting")
  evaluator_instructions,      # Optional: custom instructions for the evaluator agent
  number_of_runs,              # Optional: 1-10 runs per session (default: 1)
  enabled                      # Optional: default true
)
```

### update_eval
Update an existing scenario.
```
update_eval(
  hub_id,                    # Required (for access verification)
  eval_id,                   # Required
  eval_name,                 # Optional
  eval_path,                 # Optional
  evaluator_instructions,    # Optional
  number_of_runs,            # Optional
  enabled                    # Optional
)
```

### delete_eval
Delete a scenario.
```
delete_eval(hub_id, eval_id)
```

### create_eval_session
Create a new evaluation session. Sessions group scenario runs together.
```
create_eval_session(
  hub_id,              # Required
  session_name,        # Required
  session_description  # Optional
)
```
Returns: Session ID and status (draft). Use `run_eval_session` to start.

### run_eval_session
Start running all enabled scenarios in a session.
```
run_eval_session(hub_id, session_id)
```
Triggers AI agents to respond to each test case. Use `get_eval_session_details` to check progress.

### get_eval_session_details
Get session results with per-scenario aggregated scores.
```
get_eval_session_details(hub_id, session_id)
```
Returns: Session status, run counts, success rates, and per-scenario results with aggregated scores.

### get_eval_session_runs
Get individual run results with AI responses and evaluator feedback.
```
get_eval_session_runs(
  hub_id,      # Required
  session_id,  # Required
  eval_id      # Optional: filter by specific scenario
)
```
Returns: Per-run pass/fail, response content, evaluator comment, execution time, and dimensional scores.

### get_eval_analytics
Get aggregated analytics across all scenarios and sessions.
```
get_eval_analytics(hub_id)
```
Returns: Total counts, success rates, top-performing agents, and recent trends.

### Evals Workflow

```
1. Create scenarios     → create_eval(...) for each test case
2. Create session       → create_eval_session(hub_id, session_name)
3. Run session          → run_eval_session(hub_id, session_id)
4. Check progress       → get_eval_session_details(hub_id, session_id)
5. Review individual    → get_eval_session_runs(hub_id, session_id)
6. Overall analytics    → get_eval_analytics(hub_id)
7. Iterate              → update_eval(...) to refine, create new session, re-run
```

---

## Quick Reference Table

| Entity | List | View | Create | Update | Delete | Notes |
|--------|------|------|--------|--------|--------|-------|
| Organization | `get_workspace` | - | UI | UI | UI | - |
| Project | `get_workspace` | `get_project` | MCP | UI | UI | - |
| Hub | `get_workspace` | `get_hub` | MCP | MCP | UI | Publish/sync/replicate via UI |
| Agent | `get_hub` | `get_agent` | MCP | MCP | MCP | Repo users: files + CLI |
| Tool | `get_hub` | `get_tool` | MCP | MCP* | MCP | Repo users: files + CLI |
| Connection | `get_hub` | - | MCP (non-OAuth) | MCP | UI | OAuth via UI |
| Analytics | `get_analytics_variables` | `get_analytics_data` | - | `pin_analytics_variable` | - | - |
| Conversations | `get_conversations_list` | `get_conversation_messages` | - | - | - | - |
| Eval Scenario | `get_evals` | - | MCP | MCP | MCP | - |
| Eval Session | `get_eval_session_details` | `get_eval_session_runs` | MCP | `run_eval_session` | - | - |
| Eval Analytics | - | `get_eval_analytics` | - | - | - | - |

*Only custom tools can be updated via MCP
