# UI Navigation

## When to Use Playwright

| Scenario | Use Playwright? |
|----------|-----------------|
| Settings operations (create/update) | NO - use WayAI MCP |
| Visual feedback after MCP operations | YES - but ask user first |
| UI-only operations (OAuth, delete hub) | YES - guide user through UI |
| User wants to see the result | YES - navigate and show |

## App Architecture

WayAI is a **single-page Next.js app** with no URL routing. All navigation is state-based via Zustand stores. The URL remains `platform.wayai.pro/` at all times.

## Top-Level Navigation

Located in the sidebar (vertical on desktop, bottom on mobile):

| Icon | Description |
|------|-------------|
| `user_chat` | User Chat conversations |
| `workflow` | Workflow conversations |
| `support` | Support conversations |
| `settings` | Settings interface |

**Note:** `settings_deprecated` exists but is being phased out - do not use.

## Settings Navigation Hierarchy

```
AllOrganizationsView (card grid)
└── OrganizationDetailView
    Tabs: projects, details, administrators
    └── ProjectDetailView
        Tabs: hubs, details, administrators
        └── HubDetailView
            Tabs: overview, connections, agents, state,
                  knowledge, evals, outbound, analytics, users, mcp
            └── AgentDetail / ConnectionDetail (within tabs)

UserSettingsView (accessible from any level)
    Tabs: profile, preferences, mcp-tokens, authorized-mcps
```

## Hub Detail Tabs

| Tab | Purpose |
|-----|---------|
| `overview` | Hub settings (name, description, type, AI mode, timezone) |
| `connections` | Channel connections (WhatsApp, Email, Instagram) |
| `agents` | AI agents configuration |
| `state` | Kanban status workflow states |
| `knowledge` | Knowledge base management |
| `evals` | Evaluation configurations |
| `outbound` | Outbound templates (WhatsApp templates) |
| `analytics` | Hub analytics and metrics |
| `users` | Hub user access management |
| `mcp` | MCP server configuration |

## Playwright Navigation Pattern

Since there are no URLs, navigation must be done by clicking elements:

### Navigate to Hub Settings

```
1. Click Settings icon in sidebar
2. Wait for AllOrganizationsView to load
3. Click organization card (by name)
4. Click "projects" tab
5. Click project card (by name)
6. Click "hubs" tab
7. Click hub card (by name)
8. Hub detail view loads with tabs
```

### Switch Hub Tabs

```
1. In HubDetailView, click tab name
2. Wait for tab content to load
```

### View Agent Details

```
1. Navigate to hub (see above)
2. Click "agents" tab
3. Click agent card to expand details
```

### Common Selectors

For Playwright automation, look for:
- Organization/Project/Hub cards: Card components with entity names
- Tabs: Tab triggers with tab names
- Settings icon: Navigation item with settings indicator
- Breadcrumb: Shows current navigation path

## Navigation Store Actions

These are the programmatic navigation methods:

```typescript
// Organization level
navigateToAllOrganizations()
navigateToOrganizationDetail(orgId, orgName)
setOrganizationDetailTab(tab) // 'projects' | 'details' | 'administrators'

// Project level
navigateToProjectDetail(projectId, projectName, orgId?, orgName?)
setProjectDetailTab(tab) // 'hubs' | 'details' | 'administrators'

// Hub level
navigateToHubDetail(hubId, hubName)
setHubDetailTab(tab) // 'overview' | 'connections' | 'agents' | etc.

// Selections within hub
selectAgent(agentId | null)
selectConnection(connectionId | null)

// User settings
navigateToUserSettings(tab?)
navigateBackFromUserSettings()
```

## Visual Feedback After MCP Operations

Combine MCP operations with Playwright navigation:

```
1. MCP operation (fast: ~200ms)
   create_agent(hub_id, ...) → returns agent_id

2. Playwright navigation (visual confirmation)
   - Navigate to hub
   - Click "agents" tab
   - Wait for new agent to appear
   - Take snapshot to confirm
```

See [workflows/visual-feedback.md](../workflows/visual-feedback.md) for detailed patterns.
