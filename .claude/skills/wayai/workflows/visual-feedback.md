# Visual Feedback with Playwright

## Overview

Use **Playwright MCP** to provide visual confirmation after MCP operations. This hybrid approach combines:

- **WayAI MCP** → Fast, reliable CRUD operations (~200ms)
- **Playwright MCP** → Navigate to show users the result (OPTIONAL)

**Important:** Visual feedback is optional. Always ask the user first before using Playwright.

## Ask Before Visual Feedback

Visual feedback is optional. Always ask the user first:

### Pattern: Ask After Operation

```
User: "Create a support agent"

Claude:
1. create_agent(hub_id, ...) via WayAI MCP
2. "Done! Support Agent created successfully.
   Would you like me to show you the result in the browser?"

If user says yes → proceed with visual feedback
If user says no → done, no Playwright needed
```

### When to Skip Asking

- User already said "and show me the result"
- User explicitly requested visual confirmation
- Bulk operations (10+ items) - default to no visual feedback

## Setup Requirement

User must have Playwright MCP installed:

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

No API keys required. Runs locally on user's machine.

## When Visual Feedback Makes Sense

Only offer visual feedback when it adds value:

| Scenario | Offer Visual Feedback? |
|----------|------------------------|
| Single operation (create agent) | Yes, ask user |
| Multiple operations (3+ agents) | Usually no, too slow |
| User explicitly requested | Yes, no need to ask |
| CI/CD or automation | No |
| User said "don't show me" | No |

### Navigation Targets by Operation

| After this MCP operation... | Navigate to show... |
|-----------------------------|---------------------|
| `create_agent` | Agents tab with new agent |
| `update_agent` | Agent details with changes |
| `add_native_tool` / `add_custom_tool` | Agent's tools list |
| `create_hub` | Hub Overview tab |
| `update_hub` | Hub Overview with new settings |
| `enable_connection` / `disable_connection` | Connections tab |

## Hybrid Pattern

### Step 1: Perform MCP Operation (Fast)

```
create_agent(hub_id, "Support Agent", agent_role="Pilot", ...)
→ Returns agent_id in ~200ms
```

### Step 2: Navigate for Visual Confirmation

```
browser_navigate("https://platform.wayai.pro")
browser_snapshot()
→ Find and click through: Organization → Project → Hub → Tab
→ User sees the result on screen
```

## Navigation Workflow

### Basic Flow

```
1. browser_navigate(wayai_url)
2. browser_snapshot() → get page state with element refs
3. browser_click(element_ref) → click target element
4. Repeat snapshot + click until destination reached
```

### WayAI Navigation Path

```
Login Page (if needed)
    ↓
Chat View (default landing)
    ↓ Click settings icon in sidebar
Settings View
    ↓ Select organization (if multiple)
Organization
    ↓ Select project
Project
    ↓ Select hub
Hub
    ↓ Select tab (Overview, Connections, Agents, etc.)
Target View
```

## Complete Examples

### Example 1: Create Agent + Show Result

```
User: "Create a support agent for my hub"

Claude:
1. get_workspace() → find hub_id
2. create_agent(hub_id, "Support Agent", agent_role="Pilot",
                instructions="You help customers with questions...")
   → agent created successfully

3. "Let me show you the new agent in the platform..."

4. browser_navigate("https://platform.wayai.pro")
5. browser_snapshot()
6. browser_click(settings_icon_ref)
7. browser_snapshot()
8. browser_click(organization_ref)
9. browser_snapshot()
10. browser_click(project_ref)
11. browser_snapshot()
12. browser_click(hub_ref)
13. browser_snapshot()
14. browser_click(agents_tab_ref)
15. browser_snapshot()
    → User sees "Support Agent" in the agents list
```

### Example 2: Add Tool + Show Result

```
User: "Add web search tool to the Support Agent"

Claude:
1. add_native_tool(hub_id, agent_id, "web_search")
   → tool added successfully

2. "I'll show you the tool in the agent's configuration..."

3. browser_navigate("https://platform.wayai.pro")
4. [navigate to hub → Agents tab → click agent]
5. browser_snapshot()
   → User sees "web_search" in agent's tools list
```

### Example 3: Update Hub Settings + Verify

```
User: "Change the hub AI mode to Pilot only"

Claude:
1. update_hub(hub_id, ai_mode="Pilot")
   → hub updated successfully

2. "Let me show you the updated settings..."

3. browser_navigate("https://platform.wayai.pro")
4. [navigate to hub → Overview tab]
5. browser_snapshot()
   → User sees AI Mode: "Pilot" in Overview
```

## Playwright Tips

### Taking Snapshots

```
browser_snapshot()
```

Returns accessibility tree with `ref=` identifiers for each element.

### Clicking Elements

```
browser_click(element="Description", ref="e123")
```

- `element`: Human-readable description (for logging)
- `ref`: Exact reference from snapshot

### Typing Text

```
browser_type(element="Search input", ref="e456", text="search query")
```

### Waiting for Content

```
browser_wait_for(text="Success")
```

Wait for specific text to appear after actions.

## Handling Authentication

### First Visit (User Not Logged In)

If snapshot shows login page:

```
Claude: "I see you need to log in. Please log in via Google or email,
         then let me know when you're ready."

[User logs in]

Claude: "Great! Let me continue navigating..."
browser_snapshot() → now shows authenticated view
```

### Session Already Active

If user is already logged into platform.wayai.pro in their browser, Playwright will use that session.

## Best Practices

1. **Always snapshot before clicking** - refs change after navigation
2. **Describe what you're doing** - "I'll navigate to the Agents tab..."
3. **Handle login gracefully** - Ask user to authenticate if needed
4. **Verify the result** - Take final snapshot to confirm the change is visible
5. **Don't over-navigate** - Only show visual feedback when it adds value

## When NOT to Use Visual Feedback

- Bulk operations (creating 10+ agents)
- Background sync tasks
- When user explicitly wants speed over visibility
- CI/CD or automated pipelines

## Troubleshooting

### Page Shows Blank

```
browser_snapshot() → mostly empty
```

Page may be loading. Wait and retry:

```
browser_wait_for(text="expected content")
browser_snapshot()
```

### Element Not Found

If ref from previous snapshot doesn't work:

```
browser_snapshot() → get fresh refs
→ Find correct element in new snapshot
browser_click(new_ref)
```

### Navigation Lost

If browser ends up on wrong page:

```
browser_navigate("https://platform.wayai.pro")
→ Start navigation from beginning
```
