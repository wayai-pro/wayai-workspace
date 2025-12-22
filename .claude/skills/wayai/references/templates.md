# Hub Templates

Reference for WayAI hub templates.

## Table of Contents
- [Available Templates](#available-templates)
- [Template Structure](#template-structure)
- [Hub File Format](#hub-file-format)
- [Agent Config Format](#agent-config-format)
- [Agent Instructions Format](#agent-instructions-format)
- [Placeholders](#placeholders)
- [MCP Access](#mcp-access)

---

## Available Templates

| Template | Type | Description |
|----------|------|-------------|
| pt-vertical-pizzaria-pedidos | vertical | Pizza shop orders via WhatsApp |
| pt-vertical-odonto-agendamento | vertical | Dental clinic scheduling via WhatsApp |
| pt-horizontal-sdr-simples | horizontal | Sales lead qualification |

**Template Types:**
- `vertical` - Industry-specific (pizzaria, odonto, etc.)
- `horizontal` - Cross-industry functions (SDR, support, etc.)

---

## Template Structure

Each template contains a hub config and one or more agents:

```
{lang}/{type}/{category}/{variant}/
├── hub.md                          # Hub configuration
└── agents/
    └── {agent-name}/
        ├── config.md               # Agent config (~25 lines)
        └── instructions.md         # Agent prompt (can be 500+ lines)
```

**Example:** `pt/vertical/pizzaria/pedidos/`
```
├── hub.md
└── agents/
    └── atendente/
        ├── config.md
        └── instructions.md
```

**Benefits of this structure:**
- Config stays small and scannable
- Instructions can scale to 5k+ tokens
- Multiple agents per hub organized cleanly
- Different iteration cycles: config rarely changes, instructions change often

---

## Hub File Format

YAML frontmatter + Markdown body.

### Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Hub name (use `{NOME_EMPRESA}` placeholder) |
| `description` | string | Brief description |
| `ai_mode` | string | `Pilot+Copilot`, `Pilot`, `Copilot`, `Turned Off` |
| `hub_type` | string | `user` or `workflow` |
| `followup_message` | string | Message sent after inactivity |
| `inactivity_interval` | number | Minutes before followup |

### Example

```yaml
---
name: "{NOME_EMPRESA}"
description: "Atendimento de pedidos para pizzaria"
ai_mode: Pilot+Copilot
hub_type: user
followup_message: "Oi! Ainda está aí?"
inactivity_interval: 5
---
```

### Body Sections

- **Casos de Uso** - Use cases
- **Conexões Necessárias** - Required connections table
- **Agents** - Agent list with roles and files
- **Checklist de Customização** - Customization checklist

---

## Agent Config Format

Located at `agents/{name}/config.md`. Contains YAML frontmatter + brief description.

### Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Agent display name |
| `role` | string | `Pilot`, `Copilot`, `Specialist for Pilot`, etc. |
| `model` | string | LLM model (e.g., `gpt-4o`) |
| `temperature` | number | 0.0 to 2.0 |
| `tools.native` | array | Native tool IDs |
| `tools.custom` | array | Custom tool definitions |

### Example

```yaml
---
name: Atendente
role: Pilot
model: gpt-4o
temperature: 0.7
tools:
  native:
    - send_whatsapp_message
  custom:
    - name: criar_pedido
      description: Cria um novo pedido no sistema
      method: POST
      endpoint: /pedidos
---

# Atendente

Atendente virtual para receber pedidos de pizza via WhatsApp.

## Customization Checklist

- [ ] Replace `{NOME_EMPRESA}` in instructions
- [ ] Update menu with actual prices
- [ ] Configure delivery areas
```

---

## Agent Instructions Format

Located at `agents/{name}/instructions.md`. Contains the full agent prompt.

### Structure

```markdown
# Instructions

[Opening statement with {NOME_EMPRESA} placeholder]

## Seus Objetivos
1. Objective 1
2. Objective 2

## {CUSTOMIZE: Section Name}
[Content requiring customization]

## Fluxo de Atendimento
1. Step 1
2. Step 2

## Tom de Voz
- Style guideline 1
- Style guideline 2

## Exemplo de Conversa
[Example dialogue]
```

### Body Sections

- **Seus Objetivos** - Agent objectives
- **{CUSTOMIZE: Section}** - Customizable content sections
- **Fluxo de Atendimento** - Workflow steps
- **Tom de Voz** - Tone and style guidelines
- **Exemplo de Conversa** - Example conversation

---

## Placeholders

Replace these when customizing templates:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{NOME_EMPRESA}` | Company/business name | "Pizzaria do João" |
| `{NOME_CLINICA}` | Clinic name | "Clínica OdontoSorriso" |
| `{NOME_PRODUTO}` | Product name | "CRM Pro" |
| `{CUSTOMIZE: Section}` | Section requiring customization | Menu, prices, hours |
| `R$ XX` | Price placeholder | "R$ 45,00" |
| `[lista]` | List to be filled | Neighborhoods, services |

### Customization Markers

Sections marked `{CUSTOMIZE: ...}` require business-specific content:
- `{CUSTOMIZE: Cardápio}` - Menu and prices
- `{CUSTOMIZE: Informações de Entrega}` - Delivery info
- `{CUSTOMIZE: Serviços}` - Available services
- `{CUSTOMIZE: Horários}` - Business hours

---

## MCP Access

### List Templates

**Resource:**
```
templates://index
```

**Tool (alternative):**
```
get_templates()
```

Returns JSON with all available templates (v2.0 format).

### Download All Templates

**Tool:**
```
download_templates()
```

Returns a signed URL (valid for 5 minutes) to download all templates as a zip file.

**Download and extract:**
```bash
curl -L "<url>" -o templates.zip
unzip -o templates.zip -d ./
```

Creates a `./templates/` folder. Then read files locally:

**Examples:**
```
# Hub config
Read("./templates/pt/vertical/pizzaria/pedidos/hub.md")

# Agent config
Read("./templates/pt/vertical/pizzaria/pedidos/agents/atendente/config.md")

# Agent instructions
Read("./templates/pt/vertical/pizzaria/pedidos/agents/atendente/instructions.md")
```

### MCP Prompts

Multi-language guided workflows:

| Language | Create Hub | Edit Hub |
|----------|------------|----------|
| Portuguese | `criar-hub` | `editar-hub` |
| English | `create-hub` | `edit-hub` |
| Spanish | `crear-hub` | `editar-hub-es` |

---

## Quick Reference

**Workflow:**
1. Check if `./templates/` folder exists
2. If not: `download_templates()` → curl → unzip
3. List templates: `templates://index` or `get_templates()`
4. Read local files:
   - `Read("./templates/pt/.../hub.md")`
   - `Read("./templates/pt/.../agents/{name}/config.md")`
   - `Read("./templates/pt/.../agents/{name}/instructions.md")`
5. Replace placeholders (`{NOME_EMPRESA}`, etc.)
6. Customize `{CUSTOMIZE: ...}` sections in instructions
7. Create hub and agent via MCP tools
