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

**Config changes:** Use files + `wayai push`. MCP is read-only for hub config.

| Operation | Method |
|-----------|--------|
| List | MCP: `get_workspace` |
| View | MCP: `get_hub(hub_id)` |
| Create | Platform UI |
| Update | Files + `wayai push` |
| Publish/Sync/Replicate | Platform UI |
| Delete | Platform UI |

### get_hub
Get complete hub schema including agents, tools, and connections.
```
get_hub(hub_id)
```

### Hub Environment Workflow

Hubs use a preview/production branching model. New hubs start as `preview`. Publish, sync, and replicate operations are managed via the platform UI.

```
1. Create hub (UI)         → starts as preview
2. Configure freely        → agents, tools, connections, etc. (files + wayai push)
3. Publish (UI)            → creates production clone (first time only)
4. Make more changes       → edit the preview hub (files + wayai push)
5. Sync (UI)               → push changes to production
6. Replicate Preview (UI)  → create new preview for experimentation
```

---

## Agent Operations

**Config changes:** Use files + `wayai push`. MCP is read-only for agent config.

| Operation | Method |
|-----------|--------|
| List | MCP: `get_hub(hub_id)` |
| View | MCP: `get_agent(hub_id, agent_id)` |
| Download instructions | MCP: `download_agent_instructions(hub_id, agent_id)` |
| Create/Update/Delete | Files + `wayai push` |

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

---

## Tool Operations

**Config changes:** Use files + `wayai push`. MCP is read-only for tool config.

| Operation | Method |
|-----------|--------|
| List | MCP: `get_hub(hub_id)` |
| View | MCP: `get_tool(hub_id, tool_id)` |
| Create/Update/Delete | Files + `wayai push` |

### get_tool
Get tool details and configuration.
```
get_tool(hub_id, tool_id)
```

---

## Connection Operations

**Config changes:** Non-OAuth connections are auto-created by `wayai push` from organization credentials. OAuth connections require UI setup.

| Operation | Method |
|-----------|--------|
| List | MCP: `get_hub(hub_id)` |
| Create (non-OAuth) | Files + `wayai push` (auto-created from org credentials) |
| Create (OAuth) | Platform UI |
| Delete | Platform UI |
| Sync MCP server | MCP: `sync_mcp_connection(hub_id, connection_id)` |

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

| Entity | List | View | Create/Update/Delete | Notes |
|--------|------|------|---------------------|-------|
| Organization | `get_workspace` | - | UI | - |
| Project | `get_workspace` | `get_project` | UI (or MCP `create_project`) | - |
| Hub | `get_workspace` | `get_hub` | UI to create; files + `wayai push` for config | Publish/sync via UI |
| Agent | `get_hub` | `get_agent` | Files + `wayai push` | - |
| Tool | `get_hub` | `get_tool` | Files + `wayai push` | - |
| Connection | `get_hub` | - | `wayai push` (non-OAuth); UI (OAuth) | Auto-created from org credentials |
| Analytics | `get_analytics_variables` | `get_analytics_data` | `pin_analytics_variable` | - |
| Conversations | `get_conversations_list` | `get_conversation_messages` | - | - |
| Eval Scenario | `get_evals` | - | MCP (create, update, delete) | - |
| Eval Session | `get_eval_session_details` | `get_eval_session_runs` | MCP (create, run) | - |
| Eval Analytics | - | `get_eval_analytics` | - | - |
