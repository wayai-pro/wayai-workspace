# WayAI Settings Template

<!-- v1.0.0 -->

Manage your WayAI hub configurations using VS Code, Claude Code, and version control.

## Quick Start

1. Click **"Use this template"** to create your own repo
2. Clone your new repo locally
3. Open in VS Code with Claude Code extension
4. Claude will prompt for WayAI authentication
5. Say "Set up my workspace" to export your hubs

## What's Included

```
your-repo/
├── .mcp.json                      # MCP pre-configured for WayAI
├── .claude/
│   └── skills/
│       └── wayai-settings/        # Skill for managing configurations
├── wayai-templates/               # Official templates (auto-updated)
├── organizations/                 # Your WayAI configurations (you own this)
└── templates/                     # Your custom templates (you own this)
```

## How It Works

- **Claude is the sync engine** - no webhooks or complex infrastructure
- **Database is source of truth** - Markdown files are working copies
- **MCP tools** - Claude reads/writes your WayAI configuration
- **Beautiful preview** - Use Shift+Cmd+V to preview any .md file

## Example Workflows

### Export Your Hubs

```
You: "Set up my workspace"
Claude: [Fetches your WayAI hubs and creates Markdown files]
```

### Edit an Agent

```
You: "Change the order-taker agent to use gpt-4o-mini"
Claude: [Updates the agent via MCP, saves updated Markdown]
```

### Bulk Updates

```
You: "Update all agents to use temperature 0.5"
Claude: [Finds all agents, updates each one, saves all files]
```

### Create from Template

```
You: "Create a support hub using the pizzeria template for Mario's Pizza"
Claude: [Creates hub with customized agents from template]
```

## Connections

Connections (WhatsApp, webhooks, etc.) require OAuth or credentials and must be set up in the WayAI UI. Claude will guide you through the steps.

## Keeping Updated

Claude can sync skill files and templates directly from WayAI's MCP server:

### Sync Skill

```
You: "Update my WayAI skill"
Claude: [Reads from wayai://skill/*] → Updates .claude/skills/wayai-settings/
```

### Sync Templates

```
You: "Update WayAI templates"
Claude: [Reads from wayai://template/*] → Updates wayai-templates/
```

### Use Templates (Always Current)

When creating from a template, Claude reads the latest version directly:

```
You: "Create a hub using the pizzeria template"
Claude: [Read wayai://template/pizzeria/*] → Creates hub with latest template
```

Your configurations in `organizations/` and `templates/` are never touched.

## Documentation

- [SKILL.md](.claude/skills/wayai-settings/SKILL.md) - How Claude manages your configs
- [schema-reference.md](.claude/skills/wayai-settings/schema-reference.md) - YAML field reference
- [connection-guides.md](.claude/skills/wayai-settings/connection-guides.md) - Setup guides for connections

## Support

- [WayAI Documentation](https://docs.wayai.pro)
- [WayAI Platform](https://wayai.pro)
