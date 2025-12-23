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

**Read `.claude/skills/wayai/SKILL.md` before making any changes.**

## Workflow

1. **Before changes**: Sync local workspace from remote (source of truth)
2. **Edit locally**: Make changes in `workspace/` files so user can review
3. **Apply to remote**: Use MCP tools to apply changes (follow SKILL.md workflows)
4. **After all changes**: Ask user if they want to sync local workspace with remote

## How to Sync

```bash
download_workspace()  # Returns URL
curl -L "<url>" -o workspace.zip && unzip -o workspace.zip -d ./
```

## Repository Structure

```
.claude/skills/wayai/     # WayAI skill - START HERE
├── SKILL.md              # Workflows and prerequisites
├── references/           # Detailed reference docs
└── assets/templates/     # Hub templates
workspace/                # Local copy of remote workspace
.mcp.json                 # MCP server configuration
```
EOF
```

### OpenAI Codex

Rename the skills folder, then create an `AGENTS.md` file:

```bash
mv .claude .codex
cat > AGENTS.md << 'EOF'
# WayAI Configuration

**Read `.codex/skills/wayai/SKILL.md` before making any changes.**

## Workflow

1. **Before changes**: Sync local workspace from remote (source of truth)
2. **Edit locally**: Make changes in `workspace/` files so user can review
3. **Apply to remote**: Use MCP tools to apply changes (follow SKILL.md workflows)
4. **After all changes**: Ask user if they want to sync local workspace with remote

## How to Sync

```bash
download_workspace()  # Returns URL
curl -L "<url>" -o workspace.zip && unzip -o workspace.zip -d ./
```

## Repository Structure

```
.codex/skills/wayai/      # WayAI skill - START HERE
├── SKILL.md              # Workflows and prerequisites
├── references/           # Detailed reference docs
└── assets/templates/     # Hub templates
workspace/                # Local copy of remote workspace
.mcp.json                 # MCP server configuration
```
EOF
```

### Cursor

Rename the skills folder, then create a similar instructions file:

```bash
mv .claude .cursor
```

## Keeping Updated

### Skill Updates

Get the latest skill files via MCP:

```bash
download_skill()  # Returns URL
curl -L "<url>" -o skill.zip && unzip -o skill.zip -d ./
```

### Repository Updates

Pull updates from the template repository:

```bash
# First time: add remote and merge with --allow-unrelated-histories
git remote add template https://github.com/wayai-resources/wayai.git
git fetch template && git merge template/main --allow-unrelated-histories
# Future updates: just fetch and merge
git fetch template && git merge template/main
```
