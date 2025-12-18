# Native Tools

Tools provided by native connectors. Added to agents via `add_native_tool()`.

## Table of Contents
- [Conversation Tools](#conversation-tools)
- [Knowledge Tools](#knowledge-tools)
- [Google Calendar Tools](#google-calendar-tools)
- [Meta Tools](#meta-tools)
- [MCP Client Tools](#mcp-client-tools)

---

## Conversation Tools

**Connector:** Wayai Conversation

Tools for managing conversations, transfers, and agent consultations.

### conversation_transfer

Transfer conversation to another team, user, or agent.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `new_team_id` | string | One required | Team ID to transfer to |
| `new_support_user_id` | string | One required | User ID to transfer to |
| `new_agent_id` | string | One required | Agent ID to transfer to |

### transfer_to_agent

Transfer to agent by name (dynamic lookup).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agent_name` | string | Yes | Name of agent to transfer to |

### transfer_to_team

Transfer to team by name (dynamic lookup).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `team_name` | string | Yes | Name of team to transfer to |

### conversation_close

Close/end a conversation.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `new_status` | string | No | Status after closing (default: 'ended') |

### conversation_claim

Claim a conversation for a team.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `new_team_id` | string | Yes | Team ID to claim conversation |

### conversation_release

Release a conversation from current assignment.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `new_status` | string | No | Status after release |

### conversation_update_kanban_status

Update conversation's kanban board status.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `new_kanban_status` | string | Yes | New kanban status value |

### conversation_schedule_followup

Schedule a followup message for later.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scheduled_time` | string | Yes | ISO 8601 datetime |
| `message` | string | Yes | Message to send |

### consult_agent

Consult with another agent without transferring.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agent_name` | string | Yes | Name of agent to consult |
| `consult_question` | string | Yes | Question to ask |

### call_consultant

Call a pre-configured consultant agent.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `question` | string | Yes | Question for consultant |
| `context` | string | No | Additional context |

---

## Knowledge Tools

**Connector:** Wayai Knowledge

Tools for accessing and managing knowledge bases.

### retrieve_knowledge_content

Search and retrieve knowledge items with filtering.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `entity_type` | string | No | 'organization', 'project', or 'hub' |
| `entity_id` | string | No | Entity ID to scope search |
| `knowledge_id` | string | No | Specific knowledge base ID |
| `search_query` | string | No | Search text |
| `tags` | array | No | Filter by tags |
| `content_format` | array | No | Filter by format |
| `limit` | number | No | Max results (default 10, max 100) |
| `offset` | number | No | Pagination offset |

### list_knowledge_bases

List available knowledge bases.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `knowledge_base_name` | string | No | Filter by specific name |

### get_knowledge_item

Get a specific knowledge item by ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `knowledge_item_id` | string | Yes | Knowledge item ID |

### update_knowledge_content

Update an existing knowledge item.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `knowledge_item_id` | string | Yes | Item ID to update |
| `knowledge_item_content` | string | Yes | New content |
| `knowledge_item_title` | string | No | New title |

---

## Google Calendar Tools

**Connector:** Google Calendar

Tools for managing calendar events and availability.

### google_calendar_list_calendars

List all calendars available to user.

*No parameters required.*

### google_calendar_get_calendar

Get specific calendar info.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | No | Calendar ID (default: 'primary') |

### google_calendar_list_events

List events within a time range.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | No | Calendar ID |
| `timeMin` | string | No | Start time (ISO 8601) |
| `timeMax` | string | No | End time (ISO 8601) |
| `timeZone` | string | Yes | Timezone (e.g., 'America/Sao_Paulo') |
| `maxResults` | number | No | Max events to return |

### google_calendar_create_event

Create a new calendar event.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | No | Calendar ID |
| `event.summary` | string | Yes | Event title |
| `event.start` | string | Yes | Start datetime (ISO 8601) |
| `event.end` | string | Yes | End datetime (ISO 8601) |
| `event.timeZone` | string | Yes | Timezone |
| `event.description` | string | No | Event description |
| `event.attendees` | array | No | List of attendee emails |

### google_calendar_update_event

Update an existing event.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | No | Calendar ID |
| `eventId` | string | Yes | Event ID to update |
| `event` | object | Yes | Event fields to update |

### google_calendar_delete_event

Delete a calendar event.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | No | Calendar ID |
| `eventId` | string | Yes | Event ID to delete |

### google_calendar_check_availability

Check if a time slot is available.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | No | Calendar ID |
| `timeMin` | string | Yes | Start time (ISO 8601) |
| `timeMax` | string | Yes | End time (ISO 8601) |
| `timeZone` | string | Yes | Timezone |

---

## Meta Tools

**Connector:** Wayai Meta Tools

Tools for meta-level tool management and execution.

### get_tool_schema

Retrieve schema for a specific tool.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tool_name` | string | Yes | Name of tool to get schema for |

### execute_tool

Execute a tool with parameters.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tool_name` | string | Yes | Name of tool to execute |
| `parameters` | object | Yes | Tool parameters |

> Note: Cannot execute orchestration tools recursively.

---

## MCP Client Tools

**Connector:** MCP Server (Token or OAuth)

Tools for interfacing with external MCP servers.

### mcp_discover_tools

Discover available tools from MCP server.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `connection_id` | string | No | MCP connection (uses context if not provided) |

### mcp_discover_resources

Discover available resources from MCP server.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `connection_id` | string | No | MCP connection |

### mcp_read_resource

Read a resource from MCP server.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `uri` | string | Yes | Resource URI |
| `connection_id` | string | No | MCP connection |

### mcp_refresh

Refresh tools and resources from MCP server.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `connection_id` | string | No | MCP connection |

### Dynamic MCP Tools

Any tool discovered from connected MCP servers can be executed directly by name. Tool parameters depend on the specific MCP server implementation.

---

## Quick Reference

| Module | Key Tools |
|--------|-----------|
| Conversation | `transfer_to_agent`, `transfer_to_team`, `conversation_close`, `consult_agent` |
| Knowledge | `retrieve_knowledge_content`, `list_knowledge_bases`, `get_knowledge_item` |
| Google Calendar | `google_calendar_list_events`, `google_calendar_create_event`, `google_calendar_check_availability` |
| Meta Tools | `get_tool_schema`, `execute_tool` |
| MCP Client | `mcp_discover_tools`, `mcp_read_resource`, dynamic tools |
