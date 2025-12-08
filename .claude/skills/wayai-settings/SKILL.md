---
name: wayai-settings
description: Manage WayAI hub configurations via Markdown with YAML frontmatter. Use for creating, updating, and exporting hubs, agents, and tools.
---

# WayAI Settings Skill

## Key Behaviors

1. **ALWAYS fetch before edit** - MCP returns JSON, convert to Markdown
2. **Convert JSON to Markdown** using the templates below
3. **Use `include_instructions=true`** only when editing agent instructions
4. **Guide user through UI** for connections (OAuth, credentials)

## Markdown Templates

Convert MCP JSON responses to Markdown files:

### Agent Template

```markdown
---
_wayai_id: {agent_id}
name: {name}
role: {role}
model: {model}
temperature: {temperature}
tools:
  native: {native_tools array}
  custom: {custom_tools array}
---

{instructions}
```

### Hub Template

```markdown
---
_wayai_id: {hub_id}
name: {name}
description: {description}
ai_mode: {ai_mode}
followup_message: {followup_message}
inactivity_interval: {inactivity_interval}
---

# {name}

{description}
```

### Organization Template

```markdown
---
_wayai_id: {organization_id}
name: {name}
---

# {name}
```

### Project Template

```markdown
---
_wayai_id: {project_id}
name: {name}
---

# {name}
```

## File Structure

Write Markdown files to:

```
organizations/
└── {org-name-slugified}/
    ├── org.md
    └── projects/
        └── {project-name-slugified}/
            ├── project.md
            └── hubs/
                └── {hub-name-slugified}/
                    ├── hub.md
                    └── agents/
                        └── {agent-name-slugified}.md
```

## System Fields

Fields prefixed with `_wayai_` are system-managed. Users should NOT edit these.
Claude uses them to match files to database records.

## Connections (UI Only)

Connections contain credentials and require OAuth flows. When a tool needs a connection:

```
Claude: "The send_whatsapp_message tool requires a WhatsApp connection.

        To set this up:
        1. Go to wayai.pro → Your Hub → Settings → Connections
        2. Click Add Connection → WhatsApp Business
        3. Complete the Meta OAuth flow
        4. Return here when done

        Let me know when you've completed this!"
```

## Workflow

```
BEFORE making ANY changes:
1. Fetch current state: get_hub(hub_id) ← returns JSON
2. Convert JSON to Markdown files using template
3. Show diff if changes detected since last export

AFTER making ANY changes:
4. All write operations return updated JSON
5. Update local Markdown files from JSON
```

See [schema-reference.md](schema-reference.md) for full schema details.
See [connection-guides.md](connection-guides.md) for UI workflows.
