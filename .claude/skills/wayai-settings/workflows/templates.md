# Using Templates

## Overview

Templates are pre-configured hub setups in `wayai-templates/`. They include hub settings, agents, and tool configurations for common use cases.

## Template Location

```
wayai-templates/
├── pizzeria/
│   ├── hub.md
│   └── agents/
│       ├── order-taker.md
│       └── support-agent.md
├── retail-store/
│   └── ...
└── saas-support/
    └── ...
```

## Proactive Template Matching

When a user describes their use case, check for matching templates:

```
User: "I need to set up a hub for pizza ordering"

Claude:
1. Check wayai-templates/ for relevant templates
2. Found: wayai-templates/pizzeria/

"I found a 'pizzeria' template that includes:
- Order Taker agent (takes orders, confirms details)
- Support Agent (handles issues, complaints)
- Pre-configured tools for order creation

Would you like to use it as a starting point?"
```

## Using a Template

### Step 1: Read Template Files

```
1. Read wayai-templates/{template}/hub.md
2. Read wayai-templates/{template}/agents/*.md
3. Note the hub settings, agents, and tools defined
```

### Step 2: Customize for User

```
- Replace placeholder business name
- Adjust instructions for user's specific needs
- Add/remove tools based on available connections
- Modify AI mode if needed
```

### Step 3: Create via MCP

```
1. User creates hub in UI (required)
2. update_hub() with template settings
3. create_agent() for each agent in template
4. add_native_tool() / add_custom_tool() for each tool
```

### Step 4: Save to User's Repository

```
1. Export final configuration to Markdown
2. Save to organizations/{org}/projects/{proj}/hubs/{hub}/
```

## Template Structure

### hub.md

```markdown
---
name: Pizzeria Hub
description: AI-powered pizza ordering and support
ai_mode: Pilot+Copilot
followup_message: "Still there? Let me know if you need help with your order!"
inactivity_interval: 5
---

# Pizzeria Hub

Complete hub template for pizza delivery businesses.

## Included Agents
- Order Taker: Handles pizza orders
- Support Agent: Resolves order issues

## Required Connections
- WhatsApp Business (for customer messaging)
- Webhook (for POS integration)
```

### agents/{agent-name}.md

```markdown
---
name: Order Taker
role: Takes pizza orders and confirms details
model: gpt-4o
temperature: 0.7
tools:
  native:
    - send_whatsapp_message
  custom:
    - name: create_order
      description: Creates a new pizza order
      method: POST
      endpoint: /orders
---

You are a friendly pizza order assistant for {BUSINESS_NAME}.

## Your Responsibilities
1. Greet customers warmly
2. Take their pizza order
3. Confirm order details
4. Process the order

## Menu Items
{CUSTOMIZE: Add your menu here}

## Tone
- Friendly and casual
- Efficient but not rushed
- Helpful with recommendations
```

## Creating Custom Templates

Save your hub configuration as a template for reuse:

### Step 1: Export Existing Hub

```
1. get_hub(hub_id) → get current configuration
2. get_agent(hub_id, agent_id, include_instructions=true) for each agent
3. Convert to Markdown templates
```

### Step 2: Save to templates/

```
templates/
└── my-custom-template/
    ├── hub.md
    └── agents/
        └── *.md
```

### Step 3: Add Placeholders

Replace specific values with placeholders for customization:
- `{BUSINESS_NAME}` - Business name
- `{CUSTOMIZE: ...}` - Sections to customize
- Remove `_wayai_id` fields (new IDs generated on creation)

## Syncing Templates

Official templates in `wayai-templates/` are synced from upstream:

```bash
git fetch upstream
git merge upstream/main
```

Your custom templates in `templates/` are preserved during sync.
