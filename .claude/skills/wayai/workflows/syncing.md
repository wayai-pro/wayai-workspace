# Syncing

## Overview

This repository is forked from `wayai-resources/wayai-settings-template`. Sync to get the latest skill updates and official templates.

## What Syncs From Upstream

| Directory | Source | Description |
|-----------|--------|-------------|
| `.claude/skills/wayai/` | upstream | Skill documentation |
| `wayai-templates/` | upstream | Official hub templates |

## What Stays Local

| Directory | Owner | Description |
|-----------|-------|-------------|
| `organizations/` | you | Your hub configurations |
| `templates/` | you | Your custom templates |

## First-Time Setup

Add the upstream remote (only needed once):

```bash
git remote add upstream https://github.com/wayai-resources/wayai-settings-template.git
```

Verify:
```bash
git remote -v
# Should show:
# origin    https://github.com/YOUR-ORG/YOUR-REPO.git (fetch)
# origin    https://github.com/YOUR-ORG/YOUR-REPO.git (push)
# upstream  https://github.com/wayai-resources/wayai-settings-template.git (fetch)
# upstream  https://github.com/wayai-resources/wayai-settings-template.git (push)
```

## Syncing Updates

### Automatic (Recommended)

```
User: "Update my WayAI skill" or "Sync with latest templates"

Claude:
1. git fetch upstream
2. git merge upstream/main --no-edit
3. Report changes
```

### Manual

```bash
# Fetch latest from upstream
git fetch upstream

# Merge into your branch
git merge upstream/main --no-edit

# Push to your origin
git push origin main
```

## Handling Conflicts

### Skill Files Conflict

If conflicts occur in `.claude/skills/wayai/`:

```
<<<<<<< HEAD
Your local changes
=======
Upstream changes
>>>>>>> upstream/main
```

**Resolution:** Prefer upstream for skill files (they have the latest features).

```bash
# Accept upstream version
git checkout --theirs .claude/skills/wayai/
git add .claude/skills/wayai/
git commit -m "Sync skill from upstream"
```

### Template Conflicts

If conflicts occur in `wayai-templates/`:

**Resolution:** Prefer upstream for official templates.

```bash
git checkout --theirs wayai-templates/
git add wayai-templates/
git commit -m "Sync templates from upstream"
```

### Hub Config Conflicts

If conflicts occur in `organizations/`:

**Resolution:** These are YOUR configurations. Keep your version.

```bash
git checkout --ours organizations/
git add organizations/
git commit -m "Keep local hub configurations"
```

## Sync Schedule

Recommended sync frequency:
- **Weekly** for active development
- **Before major changes** to ensure latest features
- **When announced** for breaking changes

## Checking for Updates

```bash
# See what would be merged
git fetch upstream
git log HEAD..upstream/main --oneline
```

## Version Tracking

The skill version is noted at the top of SKILL.md:

```markdown
<!-- v1.2.0 -->
```

Check this after syncing to see the new version.

## Example Sync Session

```
User: "Sync my repo with latest WayAI updates"

Claude:
1. Check upstream: git fetch upstream
2. See changes: git log HEAD..upstream/main --oneline

   Found 3 new commits:
   - abc1234 feat: add new export workflow
   - def5678 fix: tool parameter docs
   - ghi9012 update pizzeria template

3. Merge: git merge upstream/main --no-edit

   No conflicts. Merged successfully.

4. Report:
   "Synced with upstream. Updates:
   - New export workflow documentation
   - Fixed tool parameter docs
   - Updated pizzeria template

   Skill version: v1.3.0 (was v1.2.0)"
```
