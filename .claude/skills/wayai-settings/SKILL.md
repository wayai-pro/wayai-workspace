---
name: wayai-settings
description: Manage WayAI hub configurations via Markdown with YAML frontmatter. Use for creating, updating, and exporting hubs, agents, and tools.
---

<!-- v1.1.0 -->

# WayAI Settings Skill

## Key Behaviors

1. **ALWAYS fetch before edit** - MCP returns JSON, convert to Markdown
2. **Convert JSON to Markdown** using the templates below
3. **Use `include_instructions=true`** only when editing agent instructions
4. **Guide user through UI** for connections (OAuth, credentials)
5. **Use MCP Resources** for latest skill/templates (see Syncing section)

## MCP Resources

The WayAI MCP server provides these resources:

| Resource | Description |
|----------|-------------|
| `wayai://index` | List all available resources and versions |
| `wayai://skill/{filename}` | Skill files (SKILL.md, schema-reference.md, connection-guides.md) |
| `wayai://config/{filename}` | Config files (.mcp.json) |
| `wayai://template/{name}/{file}` | Official hub templates |

## Syncing Skill & Templates

When user asks to update skill or templates, sync from MCP Resources:

### Update Skill Files

```
User: "Update my WayAI skill" or "Sync skill"

Claude:
1. Read wayai://index to check version
2. Read wayai://skill/SKILL.md
3. Write to .claude/skills/wayai-settings/SKILL.md
4. Read wayai://skill/schema-reference.md
5. Write to .claude/skills/wayai-settings/schema-reference.md
6. Read wayai://skill/connection-guides.md
7. Write to .claude/skills/wayai-settings/connection-guides.md
8. Report: "Updated skill to version X.Y.Z"
```

### Update Templates

```
User: "Update WayAI templates" or "Sync templates"

Claude:
1. Read wayai://index to get template list
2. For each template:
   - Read wayai://template/{name}/{file}
   - Write to wayai-templates/{name}/{file}
3. Report: "Updated X templates"
```

### Using Templates

When creating a hub from a template, always read from MCP Resources (not local files):

```
User: "Create a hub using the pizzeria template"

Claude:
1. Read wayai://template/pizzeria/hub.md
2. Read wayai://template/pizzeria/agents/*.md
3. Customize for user's business
4. Create via MCP tools (create_hub, create_agent, etc.)
5. Save to organizations/{org}/projects/{proj}/hubs/{hub}/
```

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
