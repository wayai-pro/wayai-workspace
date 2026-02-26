# WayAI

[WayAI](https://wayai.pro) is a platform for building AI-powered communication hubs that connect AI Assistants with human teams across channels like WhatsApp, Email, Instagram, and a native app. You can configure agents, tools, and connections to automate and augment conversations — all managed from a single hub.

By creating a repository from this template, you get a version-controlled workspace for your WayAI platform configuration. It serves as a shared environment where AI coding agents (Claude Code, Codex, Cursor, etc.) have full context about your hubs, agents, and tools — and can make changes directly on the platform through MCP. The local workspace stays in sync with the remote platform, so every configuration change is reviewable, trackable, and reversible through git.

## Quick Start

1. **Create repo from template** — Click "Use this template" on GitHub
2. **Clone your repo** — `git clone https://github.com/<you>/wayai.git`
3. **Install the WayAI CLI** — `npm install -g @wayai/cli@latest`
4. **Authenticate the CLI** — `wayai login` (opens browser for OAuth)
5. **Link your organization** — `wayai init` (creates `.wayai.yaml` with your org ID)
6. **Start your AI tool** — Run `claude` or `codex` in the repo directory
7. **Authenticate MCP** — On first run, you'll be prompted to authorize the WayAI MCP connection via OAuth (this gives the AI tool access to manage your hubs)

The **CLI** syncs hub configuration between local files and the platform (`wayai pull` / `wayai push`). The **MCP connection** lets AI tools manage hubs, connections, analytics, and other operations that don't have file equivalents.

## AI Tool Setup

This template uses the [Agent Skills](https://agentskills.io) open standard.

| Tool | Status | Setup |
|------|--------|-------|
| **Claude Code** | Ready to use | `CLAUDE.md` and `.claude/skills/` are included |
| **OpenAI Codex** | Rename + copy | `mv .claude .codex && cp CLAUDE.md AGENTS.md` (update paths inside) |
| **Cursor** | Rename + copy | `mv .claude .cursor && cp CLAUDE.md .cursorrules` (update paths inside) |

## Keeping Updated

Pull updates from the template repository to get the latest skill files, instructions, and templates:

```bash
# First time
git remote add template https://github.com/wayai-pro/wayai-workspace.git
git fetch template && git merge template/main --allow-unrelated-histories
# Future updates
git fetch template && git merge template/main
```
