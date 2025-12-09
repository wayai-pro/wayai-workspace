# Setup Flow

## Entity Hierarchy

```
Organization          ← UI only (signup)
└── Project           ← MCP to create, UI to update/delete
    └── Hub           ← Full MCP control
        ├── Connections   ← UI to create, MCP to enable/disable
        └── Agents        ← Full MCP control
            └── Tools     ← Full MCP control
```

## Setup Order

Follow this order when setting up a new hub:

### 1. Organization (UI)

**Already exists** - Created during wayai.pro signup.

If you need multiple organizations, contact support or sign up with different email.

### 2. Project (MCP)

```
1. get_workspace() → find organization_id
2. create_project(organization_id, "Project Name")
```

Or via UI:
```
1. Go to wayai.pro
2. Select your organization
3. Click "New Project"
4. Enter project name
5. Click "Create"
```

### 3. Hub (Full MCP)

**Create via MCP:**
```
create_hub(
  project_id,
  hub_name="My Hub",
  hub_type="user",  # or "workflow"
  hub_description="Description",
  ai_mode="Pilot+Copilot"
)
```

**Hub type guidance:**
- Use `user` for interactions centered on a PERSON (customer, employee, partner) - works with ALL channels
- Use `workflow` for processes centered on OBJECTS/TASKS (invoices, inventory) - **App channel only**

**Important:** If you need WhatsApp, Instagram, or Email channels, you MUST use `user` type.

**Examples:**
- Customer support → `user`
- HR employee support → `user`
- IT helpdesk → `user`
- Invoice processing → `workflow`
- Inventory management → `workflow`

**Update via MCP:**
```
update_hub(hub_id, ai_mode="Pilot+Copilot", ...)
```

**Delete (UI only):**
Hub deletion is destructive and must be done via UI at wayai.pro → Hub → Settings.

### 4. Connections (UI to create, MCP to manage)

**Create in UI:**
```
1. Go to wayai.pro → Hub → Connections
2. Click "Add Connection"
3. Select type (WhatsApp, Webhook, etc.)
4. Complete OAuth or enter credentials
5. Save
```

**Manage via MCP:**
```
enable_connection(hub_id, connection_id)
disable_connection(hub_id, connection_id)
sync_mcp_connection(hub_id, connection_id)  # For MCP servers
```

### 5. Agents (Full MCP)

```
create_agent(hub_id, agent_name="Order Taker", agent_role="Takes orders", ...)
update_agent(hub_id, agent_id, instructions="...")
delete_agent(hub_id, agent_id, confirm=true)
```

### 6. Tools (Full MCP)

```
add_native_tool(hub_id, agent_id, "web_search")
add_custom_tool(hub_id, agent_id, tool_name="check_order", ...)
enable_tool(hub_id, agent_id, tool_id)
```

## Complete Example: Pizza Ordering Hub

```
User: "I need to set up a pizza ordering hub with WhatsApp"

Claude: "Let me guide you through the setup:

**Step 1: Create Hub (UI)**
Since hubs must be created in the UI:
1. Go to wayai.pro → Your Project
2. Click 'New Hub'
3. Name: 'Pizza Orders'
4. Hub type: Choose 'user' (required for WhatsApp channel)
5. Enable MCP access in Hub Settings

I found a 'pizzeria' template. Would you like to use it?

[User creates hub and confirms hub_id]

**Step 2: Configure Hub (MCP)**"

Claude:
1. update_hub(hub_id, ai_mode="Pilot+Copilot",
              followup_message="Still there? Let me know if you need anything!")

"**Step 3: Add WhatsApp Connection (UI)**
You'll need WhatsApp to receive orders:
1. Go to Hub → Connections
2. Add WhatsApp Business
3. Complete Meta OAuth

[User completes OAuth]

**Step 4: Create Agents (MCP)**"

Claude:
1. create_agent(hub_id, "Order Taker",
              role="Takes pizza orders and confirms details",
              instructions="You are a friendly pizza order assistant...")

2. create_agent(hub_id, "Support Agent",
              role="Handles order issues and complaints",
              instructions="You help customers with order problems...")

"**Step 5: Add Tools (MCP)**"

Claude:
1. add_native_tool(hub_id, order_taker_id, "send_whatsapp_message")
2. add_custom_tool(hub_id, order_taker_id,
                  tool_name="create_order",
                  tool_description_ai="Creates a pizza order",
                  tool_method="POST",
                  tool_endpoint_template="/orders")

"**Step 6: Export to Markdown**"

Claude:
1. get_hub(hub_id) → full schema
2. Save to organizations/{org}/projects/{proj}/hubs/pizza-orders/
```

## Quick Reference: What Goes Where

| Need to... | Do this |
|------------|---------|
| Create org/project | UI |
| Create hub | UI |
| Delete hub | UI |
| Configure hub settings | MCP: `update_hub` |
| Add connection (OAuth) | UI |
| Enable/disable connection | MCP: `enable_connection` / `disable_connection` |
| Create agent | MCP: `create_agent` |
| Update agent | MCP: `update_agent` |
| Delete agent | MCP: `delete_agent` |
| Add tools | MCP: `add_native_tool` / `add_custom_tool` |
| Manage tools | MCP: `enable_tool` / `disable_tool` / `remove_tool` |
