# Plan: Integrate Resource (KB/Skills) Functionality into WayAI Skills and MCP Server

## Executive Summary

This plan adds resource management capabilities (knowledge bases and skills) to both:
1. **WayAI Claude Code Skill** - Documentation and workflows for Claude Code users
2. **WayAI MCP Server** - New tools for resource CRUD operations

---

## Changes from Review (PR #316)

This section documents all critical issues addressed from the review feedback:

### ✅ 1. Fixed Naming Confusion (Critical)
**Issue:** "Resource" term conflicted between MCP protocol resources and WayAI database resources.

**Resolution:**
- Created separate module `mcps/server/src/knowledge/` for knowledge base tools
- Renamed tools: `list_knowledge_bases`, `create_knowledge_base`, etc.
- Kept `mcps/server/src/resource/` for MCP protocol resources only
- Added clarification section in Phase 1 explaining the distinction

### ✅ 2. Acknowledged Existing Skill Tools (Critical)
**Issue:** Phase 1.4 incorrectly claimed skill CRUD tools were missing.

**Resolution:**
- Updated Phase 1.4 to document all existing skill tools:
  - `list_skills`, `get_skill`, `create_skill`, `update_skill`, `delete_skill`
  - `link_skill_to_agent`, `unlink_skill_from_agent`, `update_skill_agent_link`
- Marked Phase 1.4 as "No changes needed" in implementation order
- All tools fully implemented with Anthropic native integration support

### ✅ 3. Added Database Schema Verification (Critical)
**Issue:** Missing verification step for file content storage and folder hierarchy.

**Resolution:**
- Added Phase 0.0 with verification steps
- Documented file storage strategy:
  - Text files: `file.file_text` (TEXT column)
  - Binary files: `file.objects_fk` → `storage.objects` + bucket reference
- Documented folder hierarchy: `resource_folder.parent_folder_fk` for nesting
- Added RLS policy verification step

### ✅ 4. Documented File Content Storage Strategy (Important)
**Issue:** No clear strategy for handling binary files in workspace export.

**Resolution:**
- Added detailed file content strategy in Phase 0.6
- Documented implementation code for text vs binary file handling
- Text files: embed directly in zip
- Binary files: generate presigned URLs (24h expiry)

### ✅ 5. Answered Open Questions (Important)
**Q4 (Bidirectional sync):**
- **Decision:** Defer to Phase 0.7 (future)
- Export-only sufficient for v1
- Users can use MCP tools for direct updates

**Q5 (Binary files):**
- **Decision:** Option B - Presigned download URLs
- Best balance of accessibility and simplicity
- Avoids workspace bloat, preserves file formats
- 24h expiry acceptable for temporary exports

### 📋 Additional Improvements
- Renumbered all Phase 0 sections (0.0 → 0.7)
- Updated File Changes Summary to reflect new module structure
- Updated Implementation Order with Phase 0.0 prerequisite
- Clarified all "resource" references to "knowledge base" where appropriate

---

## Current State Analysis

### Existing Platform Functionality (Already Built)
- **Database Tables**: `resource`, `resource_folder`, `resource_file`, `agent_resource`, `resource_provider_sync`
- **Resource Types**: `knowledge` and `skill` unified under single `resource` table
- **Native Tools**: Agents have `list_resource_files`, `list_resource_folders`, `read_file`, `read_skill`
- **Edge Functions**: Full CRUD operations via `setup_operations/resourceOperations/`
- **Features**: MongoDB-style metadata filtering, skill ZIP upload, provider sync

### WayAI Skill (Current)
- **Version**: v3.3.0
- **Focus**: Hub, agent, tool, and connection management
- **Gap**: No documentation for resource/KB management workflows

### MCP Server (Current)
- **Skill Tools**: `list_skills`, `get_skill`, `download_skill` (already exist)
- **Gap**: No tools for KB management, no create/update/delete skill operations, no folder/file CRUD

---

## Implementation Plan

### Phase 0.0: Database Schema Verification

**Purpose:** Verify database schema structure before implementing export functionality.

**Verification Steps:**

1. **Confirm File Content Storage**:
   - Text files: Stored in `file.file_text` (TEXT column)
   - Binary files: Stored in Supabase Storage, referenced via `file.objects_fk` → `storage.objects`
   - Bucket: Specified in `file.bucket` (e.g., 'resource', 'skills')
   - File path: Stored in `file.file_path`

2. **Confirm Folder Hierarchy**:
   - `resource_folder.parent_folder_fk` allows nested folders
   - Algorithm to reconstruct hierarchy:
     ```typescript
     // Start with root folders (parent_folder_fk IS NULL)
     // Recursively fetch children by parent_folder_fk
     // Build tree structure for export
     ```

3. **Verify RLS Policies**:
   - Check if user can query `resource`, `resource_folder`, `resource_file`, `file` tables
   - Determine if workspace export should use service role or user context
   - Test query access before implementing export handler

**Success Criteria:**
- File content retrieval method documented
- Folder hierarchy reconstruction algorithm defined
- RLS access confirmed for workspace export queries

---

### Phase 0.1: Include Resources in Workspace Export

**Current Workspace Structure:**
```
workspace/
├── workspace.md
├── last-sync.md
└── {org-slug}/
    └── {project-slug}/
        └── {hub-slug}/
            ├── hub.md
            └── {agent-slug}-instructions.md
```

**Gap:** Resources (KBs and skills) are NOT exported with the workspace.

#### 0.2 Enhanced Workspace Structure

**Proposed Structure:**
```
workspace/
├── workspace.md                          # Add resource summary
├── last-sync.md
└── {org-slug}/
    └── {project-slug}/
        └── {hub-slug}/
            ├── hub.md                    # Add linked resources section
            ├── {agent-slug}-instructions.md
            └── resources/
                ├── knowledge/            # Knowledge bases folder
                │   └── {kb-slug}/
                │       ├── resource.md   # KB metadata (name, description, schema)
                │       ├── {folder-slug}/# Nested folder structure
                │       │   └── {file}.md
                │       └── {file}.md     # Root-level files
                └── skills/               # Skills folder
                    └── {skill-slug}/
                        ├── SKILL.md      # Skill manifest
                        ├── references/
                        │   └── *.md
                        └── assets/
                            └── *.*
```

#### 0.3 Update Workspace Handler

**File: `supabase/functions/download/handlers/workspace.ts`**

Changes:
1. Fetch resources for each hub via `resource` table
2. Fetch folders via `resource_folder` table
3. Fetch files via `resource_file` table with file content
4. Generate `resource.md` for each resource
5. Recreate folder hierarchy in zip
6. Include file contents (text files) or reference URLs (binary)

#### 0.4 Create Resource Markdown Generators

**New Files in `supabase/functions/download/generators/`:**

| File | Purpose |
|------|---------|
| `resource-md.ts` | Generate `resource.md` with metadata and schema |
| `resource-file-md.ts` | Generate file content wrapper (for non-md files) |

**resource.md Format:**
```markdown
---
_wayai_id: "uuid"
resource_type: "knowledge" | "skill"
name: "Resource Name"
description: "Description"
folder_metadata_schema: { ... }
file_metadata_schema: { ... }
---

# Resource Name

Description here.

## Linked Agents
- Agent Name (priority: 1, enabled: true)

## Structure
- 📁 folder-name/ (3 files)
  - 📄 file1.md
  - 📄 file2.md
- 📄 root-file.md
```

#### 0.5 Update hub.md Generator

**File: `supabase/functions/download/generators/hub-md.ts`**

Add section:
```markdown
## Resources

### Knowledge Bases
| Name | Description | Files | Linked Agents |
|------|-------------|-------|---------------|
| Menu KB | Restaurant menu | 5 | Atendente |

### Skills
| Name | Version | Linked Agents |
|------|---------|---------------|
| order-taking | 1.0.0 | Atendente |
```

#### 0.6 Handle Large Files

**File Content Strategy (Based on Schema Verification):**

For workspace export:
- **Text files** (`file.file_text` is populated):
  - Include content directly in exported markdown files
  - No size limit for text content (stored as TEXT in DB)

- **Binary files** (`file.objects_fk` is populated):
  - **Small files (<100KB)**: Generate presigned download URLs (expires in 24h)
  - **Large files (≥100KB)**: Include only metadata + presigned URL
  - URL format: Reference `file.file_path` in `file.bucket`

**Implementation:**

```typescript
// Check if file has text content
if (file.file_text) {
  // Embed text directly
  zipFile.file(`${path}/${file.resource_file_title}`, file.file_text);
} else if (file.objects_fk) {
  // Generate presigned URL from storage
  const url = await getPresignedUrl(file.bucket, file.file_path);
  // Include reference in resource.md
}
```

#### 0.7 Bidirectional Sync (Future)

Consider workspace upload to sync local changes back:
- Parse `resource.md` files
- Detect new/modified/deleted resources
- Apply changes via edge functions

---

### Phase 1: Extend MCP Server with Knowledge Base Tools

**CRITICAL: Naming Clarification**

⚠️ **AVOID CONFUSION:** The term "resource" has two distinct meanings in this codebase:

1. **MCP Protocol Resources** (`mcps/server/src/resource/tools.ts`):
   - MCP spec resources for exposing read-only content (e.g., `wayai://platform`)
   - Tools: `list_resources`, `read_resource` (already implemented)
   - These expose URIs like `wayai://platform` for Claude Code to read

2. **WayAI Database Resources** (table: `resource`):
   - Knowledge bases (`resource_type='knowledge'`) and skills (`resource_type='skill'`)
   - These are the entities being added to workspace export and MCP server

**Phase 1 Solution:** Create a separate module `mcps/server/src/knowledge/` for knowledge base management tools to avoid naming conflicts with existing MCP resource tools.

---

#### 1.1 Create Knowledge Base Management Module (`mcps/server/src/knowledge/`)

**New File: `mcps/server/src/knowledge/tools.ts`**

Register these tools (note: "kb" prefix to distinguish from MCP protocol resources):

| Tool | Description | Access |
|------|-------------|--------|
| `list_knowledge_bases` | List all knowledge bases for a hub | read |
| `get_knowledge_base` | Get KB details with folder/file structure | read |
| `create_knowledge_base` | Create new knowledge base | write |
| `update_knowledge_base` | Update KB name/description/metadata | write |
| `delete_knowledge_base` | Delete KB (with confirmation) | write |

**Implementation Pattern:**
```typescript
// Follow existing pattern from skill/tools.ts
export function registerKnowledgeBaseTools(server: McpServer, getContext: () => KnowledgeBaseToolsContext) {
  server.tool('list_knowledge_bases', 'List knowledge bases in a hub', { hub_id: z.string() }, async ({ hub_id }) => {
    const ctx = getContext();
    const hub = await getHub(ctx, hub_id, 'read');
    // Call edge function: setup_operations with table='resource' and filter resource_type='knowledge'
  });
}
```

#### 1.2 Create Folder Management Tools

**Add to `knowledge/tools.ts`:**

| Tool | Description | Access |
|------|-------------|--------|
| `list_folders` | List folders in a knowledge base | read |
| `get_folder` | Get folder details | read |
| `create_folder` | Create folder (supports nesting) | write |
| `update_folder` | Update folder name/description/metadata | write |
| `delete_folder` | Delete folder (warns if has contents) | write |

#### 1.3 Create File Management Tools

**Add to `knowledge/tools.ts`:**

| Tool | Description | Access |
|------|-------------|--------|
| `list_files` | List files (with metadata filtering) | read |
| `get_file` | Get file details and content/URL | read |
| `upload_file` | Upload file content | write |
| `update_file` | Update file metadata/tags | write |
| `delete_file` | Delete file | write |

#### 1.4 Verify Existing Skill Tools

**Status: Skill tools already fully implemented in `skill/tools.ts`**

✅ **All skill CRUD operations exist:**

| Tool | Status | Description |
|------|--------|-------------|
| `list_skills` | ✅ Implemented | List skills in a hub (line 66) |
| `get_skill` | ✅ Implemented | Get skill details with SKILL.md content and linked agents (line 111) |
| `create_skill` | ✅ Implemented | Create skill from SKILL.md + files, auto-upload to Anthropic (line 154) |
| `update_skill` | ✅ Implemented | Update skill display name, description, or SKILL.md (line 208) |
| `delete_skill` | ✅ Implemented | Delete skill with confirmation (line 262) |
| `link_skill_to_agent` | ✅ Implemented | Link skill to agent with native integration toggle (line 316) |
| `unlink_skill_from_agent` | ✅ Implemented | Unlink skill from agent (line 427) |
| `update_skill_agent_link` | ✅ Implemented | Update native integration toggle for skill-agent link (line 365) |

**No changes needed for Phase 1.4** - skill management tools are complete with full Anthropic native integration support.

#### 1.5 Agent-Knowledge Base Link Tools

**Add to `knowledge/tools.ts`:**

| Tool | Description | Access |
|------|-------------|--------|
| `link_kb_to_agent` | Link knowledge base to agent | write |
| `unlink_kb_from_agent` | Remove knowledge base from agent | write |
| `list_agent_knowledge_bases` | List KBs linked to agent | read |
| `update_agent_kb_link` | Update priority/enabled for KB-agent link | write |

**Note:** Skill-to-agent linking tools already exist (see Phase 1.4).

---

### Phase 2: Update WayAI Skill Documentation

#### 2.1 Add Resources Reference Document

**New File: `references/resources.md`**

Contents:
- Resource types (knowledge vs skill)
- Resource hierarchy: Resource → Folders → Files
- Metadata schema configuration
- MongoDB-style filtering syntax
- Agent linking and priority

#### 2.2 Update SKILL.md

Add sections:
- Quick decision matrix for resources
- MCP tools quick reference for resource operations
- Resource management workflow

#### 2.3 Add Knowledge Base Reference

**New File: `references/knowledge-base.md`**

Contents:
- Creating a knowledge base
- Organizing with folders
- Uploading files
- Linking to agents
- Searching and filtering

#### 2.4 Update Existing References

**Update `mcp-operations.md`:**
- Add resource operations section
- Add folder operations section
- Add file operations section
- Add agent-resource operations section

**Update `native-tools.md`:**
- Document native resource tools for agents:
  - `list_resource_files`
  - `list_resource_folders`
  - `read_file`
  - `read_skill`
  - `read_skill_file`

---

### Phase 3: Add Skill Templates

#### 3.1 Create Skill Template Structure

**New Directory: `assets/templates/skills/`**

```
assets/templates/skills/
├── basic/
│   ├── SKILL.md           # Minimal skill template
│   └── references/
│       └── example.md
└── advanced/
    ├── SKILL.md           # Full skill template with sections
    ├── references/
    │   ├── guide.md
    │   └── api.md
    └── assets/
        └── data.json
```

#### 3.2 Skill Template Contents

**Basic SKILL.md Template:**
```markdown
---
name: "{SKILL_NAME}"
description: "{SKILL_DESCRIPTION}"
---

# {SKILL_NAME}

## When to Use
{CUSTOMIZE: Describe when this skill should be invoked}

## Workflow
{CUSTOMIZE: Step-by-step workflow}

## Reference Documentation
- [Example](references/example.md)
```

---

### Phase 4: Integration Testing

#### 4.1 MCP Server Tests

Add tests for:
- Resource CRUD operations
- Folder CRUD operations
- File upload/download
- Agent-resource linking
- Access control (read_only vs read_write)

#### 4.2 Edge Function Tests

Verify:
- `resourceOperations` handles all new operations
- Proper RLS enforcement
- Metadata filtering works correctly

---

## File Changes Summary

### MCP Server (`mcps/server/`)

| File | Action | Description |
|------|--------|-------------|
| `src/knowledge/tools.ts` | Create | Knowledge base, folder, file, agent-KB link tools |
| `src/skill/tools.ts` | ✅ No change | All skill CRUD tools already exist |
| `src/server.ts` | Update | Register new knowledge base tools |
| `src/types.ts` | Update | Add knowledge base-related types |
| `src/resource/tools.ts` | ✅ No change | MCP protocol resource tools (existing) |

### WayAI Skill (`repositories/wayai/.claude/skills/wayai/`)

| File | Action | Description |
|------|--------|-------------|
| `SKILL.md` | Update | Add resource section, update tools table |
| `references/resources.md` | Create | Resource system documentation |
| `references/knowledge-base.md` | Create | KB creation/management guide |
| `references/mcp-operations.md` | Update | Add resource operations |
| `references/native-tools.md` | Update | Document resource native tools |
| `assets/templates/skills/` | Create | Skill templates |

### Edge Functions (`supabase/functions/`)

| File | Action | Description |
|------|--------|-------------|
| `download/handlers/workspace.ts` | Update | Add resource fetching and export |
| `download/generators/resource-md.ts` | Create | Generate resource.md files |
| `download/generators/hub-md.ts` | Update | Add resources section |
| `setup_operations/resourceOperations/` | Verify | Ensure all operations work |

---

## Implementation Order

1. **Phase 0.0**: Database schema verification (prerequisite)
2. **Phase 0.1-0.6**: Workspace export with resources (high priority)
3. **Phase 1.1-1.3**: Knowledge base/folder/file tools in MCP server
4. **Phase 1.4**: ✅ Skip - skill tools already complete
5. **Phase 1.5**: Agent-KB linking tools
6. **Phase 2.1-2.4**: Skill documentation
7. **Phase 3**: Skill templates
8. **Phase 4**: Testing
9. **Phase 0.7**: Bidirectional sync (future)

---

## Dependencies

- Edge functions already support all resource operations
- Database schema already complete
- No database migrations required

---

## Success Criteria

1. **Workspace export includes resources** - KBs and skills exported with folder/file structure
2. Claude Code users can manage KB/skills via MCP tools
3. All resource CRUD operations available in MCP server
4. Comprehensive documentation in wayai skill
5. Skill templates available for rapid skill creation
6. All tests pass

---

## Resolved Questions & Decisions

### Q1: Should skill ZIP upload be a single tool or multi-step?
**Decision:** ✅ Already resolved - `create_skill` accepts files array parameter for multi-file skills.

### Q2: Should we add `sync_skill_to_provider` for Anthropic native integration?
**Decision:** ✅ Already resolved - `create_skill` auto-uploads to Anthropic if hub has Anthropic connection. `update_skill` syncs changes.

### Q3: Priority for metadata schema editor support?
**Decision:** Low priority - metadata schemas are JSONB fields editable via `update_knowledge_base`. UI editor can be added later if needed.

### Q4: **Workspace upload** - Should we implement bidirectional sync?
**Decision:**
- **Phase 0.7 (Future)**: Defer bidirectional sync to future phase
- **Rationale**:
  - Export-only is sufficient for v1 (read workspace, make edits locally)
  - Upload requires complex conflict resolution (local vs remote changes)
  - Users can use MCP tools to create/update resources directly
- **Future implementation**: Consider workspace upload as separate feature with:
  - Git-like diff/merge for conflict resolution
  - Dry-run mode to preview changes
  - Resource-level granularity (upload individual KBs/skills)

### Q5: **Binary files** - How to handle non-text files in workspace export?
**Decision:** **Option B: Include presigned download URLs only**

**Rationale:**
- ✅ Works for all file sizes (no bloat in workspace zip)
- ✅ Avoids base64 encoding overhead
- ✅ Files remain in original format (no conversion)
- ✅ Simple implementation via Supabase Storage `createSignedUrl()`
- ⚠️ URLs expire (24h default) - acceptable for temporary workspace exports

**Implementation:**
```typescript
// In workspace export handler
if (file.objects_fk) {
  // Binary file in storage
  const url = await supabase.storage
    .from(file.bucket)
    .createSignedUrl(file.file_path, 24 * 60 * 60); // 24h expiry

  // Add reference in resource.md
  fileList += `- [${file.resource_file_title}](${url.data.signedUrl}) (expires in 24h)\n`;
} else if (file.file_text) {
  // Text file - embed directly
  zipFile.file(`${filePath}`, file.file_text);
}
```

**Trade-offs considered:**
- ❌ Option A (base64): Bloats workspace size, requires decoding
- ❌ Option C (skip binaries): Loses important content (images, PDFs in docs)
- ✅ Option B (presigned URLs): Best balance of accessibility and simplicity

---

## Version Targeting

- **MCP Server**: Update to expose resource tools
- **WayAI Skill**: Update to v3.4.0 with resource documentation
