# WayAI

Template for managing WayAI hub configurations with AI coding tools.

## Quick Start

1. **Create repo from template** - Click "Use this template" on GitHub
2. **Clone your repo** - `git clone https://github.com/<you>/wayai.git`
3. **Add your MCP token** - Edit `.mcp.json` with your token from [platform.wayai.pro](https://platform.wayai.pro) → Settings → MCP Access (⚠️ Don't commit tokens to git)
4. **Set up AI instructions** - Create `CLAUDE.md` or `AGENTS.md` (see below)
5. **Start your AI tool** - Run `claude` or `codex` in the repo directory

## AI Tool Setup

This template uses the [Agent Skills](https://agentskills.io) open standard.

### Claude Code

Skills are ready to use in `.claude/skills/`. Create a `CLAUDE.md` file at the root:

```bash
cat > CLAUDE.md << 'EOF'
# WayAI Configuration

Use the wayai skill to manage hub configurations.

## ⚠️ Before Making Changes

**Always read `.claude/skills/wayai/SKILL.md` before creating or modifying hubs/agents.**
It contains step-by-step workflows, including steps that require user action in the UI before proceeding.

## Repository Structure

```
.claude/skills/wayai/     # WayAI skill (Agent Skills format)
├── SKILL.md              # Main skill documentation (READ THIS FIRST)
├── references/           # Detailed reference docs
└── assets/templates/     # Hub templates
.mcp.json                 # MCP server configuration
```

## Available Commands

- `get_workspace()` - List all organizations, projects, and hubs
- `get_hub(hub_id)` - Get hub details with agents and tools
- `create_hub(...)` - Create a new hub
- `create_agent(...)` - Add an agent to a hub
- `update_agent_instructions(...)` - Update agent instructions

## Workflows

### View workspace
"Show my workspace" or "List my hubs"

### Create a hub
"Create a customer support hub" - Uses templates from `assets/templates/`

### Update agent instructions
"Update the Pilot agent instructions" - Downloads, edits, and uploads instructions

## Keeping Updated

### Skill Updates
```bash
download_skill()  # Returns URL
curl -L "<url>" -o skill.zip && unzip -o skill.zip -d ./
```

### Repository Updates
```bash
# First time: add remote and merge with --allow-unrelated-histories
git remote add template https://github.com/wayai-resources/wayai.git
git fetch template && git merge template/main --allow-unrelated-histories
# Future updates: just fetch and merge
git fetch template && git merge template/main
```

## Documentation

See `.claude/skills/wayai/SKILL.md` for complete reference.
EOF
```

### OpenAI Codex

Rename the skills folder, then create an `AGENTS.md` file:

```bash
mv .claude .codex
cat > AGENTS.md << 'EOF'
# WayAI Configuration

Use the wayai skill to manage hub configurations.

## ⚠️ Before Making Changes

**Always read `.codex/skills/wayai/SKILL.md` before creating or modifying hubs/agents.**
It contains step-by-step workflows, including steps that require user action in the UI before proceeding.

## Repository Structure

```
.codex/skills/wayai/      # WayAI skill (Agent Skills format)
├── SKILL.md              # Main skill documentation (READ THIS FIRST)
├── references/           # Detailed reference docs
└── assets/templates/     # Hub templates
.mcp.json                 # MCP server configuration
```

## Available Commands

- `get_workspace()` - List all organizations, projects, and hubs
- `get_hub(hub_id)` - Get hub details with agents and tools
- `create_hub(...)` - Create a new hub
- `create_agent(...)` - Add an agent to a hub
- `update_agent_instructions(...)` - Update agent instructions

## Workflows

### View workspace
"Show my workspace" or "List my hubs"

### Create a hub
"Create a customer support hub" - Uses templates from `assets/templates/`

### Update agent instructions
"Update the Pilot agent instructions" - Downloads, edits, and uploads instructions

## Keeping Updated

### Skill Updates
```bash
download_skill()  # Returns URL
curl -L "<url>" -o skill.zip && unzip -o skill.zip -d ./
```

### Repository Updates
```bash
# First time: add remote and merge with --allow-unrelated-histories
git remote add template https://github.com/wayai-resources/wayai.git
git fetch template && git merge template/main --allow-unrelated-histories
# Future updates: just fetch and merge
git fetch template && git merge template/main
```

## Documentation

See `.codex/skills/wayai/SKILL.md` for complete reference.
EOF
```

### Cursor

Rename the skills folder:

```bash
mv .claude .cursor
```

Then create a similar instructions file for Cursor.
