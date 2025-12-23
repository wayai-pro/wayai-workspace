# WayAI Settings

Manage your WayAI hub configurations with Claude Code.

## What's Included

- `.claude/skills/wayai/` - Claude Code skill for configuring hubs, agents, and tools via MCP
- `.mcp.json` - MCP server configuration

## Getting Started

1. **Create repo from template** - Click "Use this template" on GitHub
2. **Clone your repo** - `git clone https://github.com/<you>/wayai-settings.git`
3. **Add your MCP token** - Get token from [platform.wayai.pro](https://platform.wayai.pro) → Settings → MCP Access
4. **Start Claude Code** - Run `claude` in the repo directory

## Usage

Ask Claude to help manage your WayAI configuration:

```
"Show my workspace"
"Create a new hub for customer support"
"Update the Pilot agent instructions"
"Add web_search tool to the agent"
```

## Downloads

All downloads return a URL. Use `curl` to save to disk, then extract or read as needed.

### Workspace

Export your hub configurations as Markdown files:

```bash
download_workspace()  # Returns URL
curl -L "<url>" -o workspace.zip && unzip -o workspace.zip -d ./
```

Creates `./workspace/` folder - keep this structure for version control:

```
workspace/
├── workspace.md
├── last-sync.md
└── {org}/{project}/{hub}/
    ├── hub.md
    └── {agent}.md
```

### Templates

Hub templates are bundled in the skill at `.claude/skills/wayai/assets/templates/`.

```
.claude/skills/wayai/assets/templates/
├── index.json
└── {lang}/{type}/{category}/{variant}/
    ├── hub.md
    └── {agent}.md
```

To use templates, read them directly from the skill:
```
Read("assets/templates/index.json")
Read("assets/templates/pt/vertical/pizzaria/pedidos/hub.md")
```

### Skill Updates

Get the latest skill files:

```bash
download_skill()  # Returns URL
curl -L "<url>" -o skill.zip && unzip -o skill.zip -d ./
```

## Documentation

See `.claude/skills/wayai/SKILL.md` for complete documentation.
