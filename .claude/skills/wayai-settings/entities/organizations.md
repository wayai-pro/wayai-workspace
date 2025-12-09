# Organizations

## Overview

Organizations are the top-level entity in WayAI. They represent a company or team and contain billing, user management, and projects.

```
Organization (you are here)
└── Project
    └── Hub
        ├── Connections
        └── Agents → Tools
```

## MCP vs UI

| Operation | MCP | UI | Details |
|-----------|-----|----|---------|
| List organizations | `get_workspace` | - | Returns all orgs you have access to |
| View organization | `get_workspace` | - | Included in workspace response |
| Create organization | - | wayai.pro signup | Created during account signup |
| Update organization | - | wayai.pro → Settings | Name, billing, plan |
| Delete organization | - | wayai.pro → Settings | Requires owner role |
| Manage users | - | wayai.pro → Team | Invite, remove, change roles |

## Fields

| Field | Type | Editable | Description |
|-------|------|----------|-------------|
| `_wayai_id` | string | NO | System ID - DO NOT EDIT |
| `name` | string | UI only | Organization display name |

## Markdown Template

```markdown
---
_wayai_id: {organization_id}
name: {name}
---

# {name}
```

## File Location

```
organizations/
└── {org-name-slugified}/
    └── org.md
```

## Examples

**Discovering your organizations:**
```
User: "What organizations do I have access to?"

Claude:
1. get_workspace() → returns workspace with organizations
2. List organizations with their projects and hubs
```

**Creating a new organization:**
```
User: "I need to create a new organization"

Claude: "Organizations are created during signup at wayai.pro.
        If you need a second organization, sign up with a different email
        or contact support to add one to your account."
```
