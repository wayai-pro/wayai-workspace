# Projects

## Overview

Projects are logical groupings of hubs within an organization. Use them to organize hubs by team, client, or purpose.

```
Organization
└── Project (you are here)
    └── Hub
        ├── Connections
        └── Agents → Tools
```

## MCP vs UI

| Operation | MCP | UI | Details |
|-----------|-----|----|---------|
| List projects | `get_workspace` | - | Returns all projects in your orgs |
| View project | `get_project(project_id)` | - | Get project details |
| Create project | `create_project(organization_id, project_name)` | wayai.pro | Full MCP support |
| Update project | - | wayai.pro → Project Settings | Name only |
| Delete project | - | wayai.pro → Project Settings | Deletes all hubs inside |

## Fields

| Field | Type | Editable | Description |
|-------|------|----------|-------------|
| `_wayai_id` | string | NO | System ID - DO NOT EDIT |
| `name` | string | UI only | Project display name |

## Markdown Template

```markdown
---
_wayai_id: {project_id}
name: {name}
---

# {name}
```

## File Location

```
organizations/
└── {org-name-slugified}/
    └── projects/
        └── {project-name-slugified}/
            └── project.md
```

## MCP Tools

### get_project
Get project details.
```
get_project(project_id)
```

### create_project
Create a new project in an organization.
```
create_project(
  organization_id,  # Required
  project_name      # Required
)
```

## Examples

**Discovering your projects:**
```
User: "What projects do I have?"

Claude:
1. get_workspace() → returns workspace hierarchy
2. List projects grouped by organization
```

**Creating a new project:**
```
User: "I need a new project for customer support"

Claude:
1. get_workspace() → find organization_id
2. create_project(organization_id, "Customer Support")
3. Save to organizations/{org}/projects/customer-support/project.md

"Project 'Customer Support' created! Would you like me to create a hub inside it?"
```
