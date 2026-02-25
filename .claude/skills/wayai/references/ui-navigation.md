# UI Navigation via WebMCP

When the user's WayAI app is open in Chrome and Chrome DevTools MCP is connected, you can navigate the UI directly to show the user where things are. This is faster than describing click paths and more interactive than screenshots.

## Available Tools

### Navigation
| Tool | Description |
|------|-------------|
| `navigate_to_view` | Switch main view: `support`, `chat`, `task`, `settings` |
| `select_conversation` | Open a conversation by `conversation_key` |
| `open_panel` | Open right-side panel: `analytics`, `evals`, `resource`, `outbound`, `user` |
| `close_panels` | Close all right-side panels |

### Settings Drill-Down
| Tool | Description |
|------|-------------|
| `navigate_to_organization` | Go to org detail (needs `organization_id`, `organization_name`) |
| `navigate_to_project` | Go to project detail (needs `project_id`, `project_name`) |
| `navigate_to_hub` | Go to hub detail (needs `hub_id`, `hub_name`) |
| `set_hub_tab` | Switch hub tab: `overview`, `connections`, `agents`, `state`, `resource`, `evals`, `outbound`, `analytics`, `users` |
| `select_agent` | Select an agent in the agents tab |
| `select_connection` | Select a connection in the connections tab |

### Conversation Actions
| Tool | Description |
|------|-------------|
| `send_message` | Send a text message in the selected conversation |
| `claim_conversation` | Claim conversation for support (needs `team_id`) |
| `release_conversation` | Release claimed conversation |
| `transfer_conversation` | Transfer to team/agent/user |
| `close_conversation` | End the conversation |

### Resources (Read-Only State)
| Resource | Description |
|----------|-------------|
| `wayai://current-view` | Active nav item, selected conversation, open panels |
| `wayai://current-settings-view` | Settings breadcrumb, selected agent/connection |
| `wayai://conversation-list` | All loaded conversations with status and hub info |

## Common Navigation Sequences

### "How do I configure SLA?"
```
navigate_to_view(view: "settings")
navigate_to_hub(hub_id: "<id>", hub_name: "<name>")
set_hub_tab(tab: "overview")
→ "The SLA settings are in the Overview tab. You can set time thresholds for escalation here."
```

### "How do I add an agent?"
```
navigate_to_view(view: "settings")
navigate_to_hub(hub_id: "<id>", hub_name: "<name>")
set_hub_tab(tab: "agents")
→ "Click '+ New Agent' to create one. You'll configure the name, role, model, and instructions."
```

### "How do I connect WhatsApp?"
```
navigate_to_view(view: "settings")
navigate_to_hub(hub_id: "<id>", hub_name: "<name>")
set_hub_tab(tab: "connections")
→ "Add a WhatsApp connection here. You'll need your Meta Business credentials."
```

### "How do I add tools to an agent?"
```
navigate_to_view(view: "settings")
navigate_to_hub(hub_id: "<id>", hub_name: "<name>")
set_hub_tab(tab: "agents")
select_agent(agent_id: "<id>")
→ "You can add tools in the agent detail view. Scroll to the Tools section."
```

### "How do I set up knowledge base?"
```
navigate_to_view(view: "settings")
navigate_to_hub(hub_id: "<id>", hub_name: "<name>")
set_hub_tab(tab: "resource")
→ "Upload documents here to build the agent's knowledge base."
```

### "How do I manage team users?"
```
navigate_to_view(view: "settings")
navigate_to_hub(hub_id: "<id>", hub_name: "<name>")
set_hub_tab(tab: "users")
→ "Manage team users and end users here. Teams control who can view and respond to conversations."
```

### "How do I view analytics?"
```
open_panel(panel: "analytics")
→ "The analytics panel shows conversation metrics, response times, and agent performance."
```

### "Show me a conversation"
```
Read wayai://conversation-list to find conversations
select_conversation(conversation_key: "<key>")
→ "Here's the conversation. You can see the message history and current status."
```

## Guidelines

- Always read `wayai://current-view` first to understand where the user already is — avoid redundant navigation
- Use hub IDs and names from the MCP workspace context or from `wayai://conversation-list`
- Each tool call shows a toast notification so the user can follow along
- Combine navigation with explanation — navigate first, then explain what the user is seeing
- For write operations (send_message, claim, transfer, close), confirm with the user before executing
