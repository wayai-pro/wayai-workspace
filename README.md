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

## Updating the Skill

Get the latest skill files via MCP:

```bash
# In Claude Code, run:
download_skill()

# Then download and extract:
curl -L "<url>" -o skill.zip
unzip -o skill.zip -d ./
```

## Documentation

See `.claude/skills/wayai/SKILL.md` for complete documentation.
