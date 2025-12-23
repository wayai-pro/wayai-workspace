# Hub Templates

Reference for WayAI hub templates.

## Table of Contents
- [Available Templates](#available-templates)
- [Template Structure](#template-structure)
- [Hub File Format](#hub-file-format)
- [Agent Instructions Format](#agent-instructions-format)
- [Placeholders](#placeholders)
- [MCP Access](#mcp-access)

---

## Available Templates

| Template | Type | Description |
|----------|------|-------------|
| pt-vertical-pizzaria-pedidos | vertical | Pizza shop orders via WhatsApp |
| pt-vertical-odonto-agendamento | vertical | Dental clinic scheduling via WhatsApp |
| pt-vertical-natacao-atendimento | vertical | Swimming academy visit scheduling via WhatsApp |
| pt-horizontal-sdr-simples | horizontal | Sales lead qualification |

**Template Types:**
- `vertical` - Industry-specific (pizzaria, odonto, natacao, etc.)
- `horizontal` - Cross-industry functions (SDR, support, etc.)

---

## Template Structure

Each template contains a hub config and agent instruction files (workspace format):

```
{lang}/{type}/{category}/{variant}/
├── hub.md                    # Hub config + agents config in frontmatter
└── {agent-slug}.md           # Agent instructions only
```

**Example:** `pt/vertical/pizzaria/pedidos/`
```
├── hub.md                    # Hub settings + agent config (model, tools)
└── atendente.md              # Agent instructions
```

**Benefits of this structure:**
- Matches `download_workspace()` output format
- Hub file is the source of truth for configuration
- Agent instructions are separate for easy editing
- Simple flat structure (no nested folders)

---

## Hub File Format

YAML frontmatter with hub settings and agents config, plus Markdown body.

### Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Hub name (use `{NOME_EMPRESA}` placeholder) |
| `description` | string | Brief description |
| `ai_mode` | string | `Pilot+Copilot`, `Pilot`, `Copilot`, `Turned Off` |
| `hub_type` | string | `user` or `workflow` |
| `followup_message` | string | Message sent after inactivity |
| `inactivity_interval` | number | Minutes before followup |
| `agents` | array | Agent configurations (see below) |

### Agent Configuration (in hub.md)

Each agent in the `agents` array:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Agent display name |
| `role` | string | `Pilot`, `Copilot`, `Specialist for Pilot`, etc. |
| `model` | string | LLM model (e.g., `gpt-4o`) |
| `instructions_file` | string | Path to instructions file |
| `tools.native` | array | Native tool IDs |
| `tools.custom` | array | Custom tool definitions |

### Example

```yaml
---
name: "{NOME_EMPRESA}"
description: "Atendimento de pedidos para pizzaria"
ai_mode: Pilot+Copilot
hub_type: user
followup_message: "Oi! Ainda está aí?"
inactivity_interval: 5
agents:
  - name: Atendente
    role: Pilot
    model: gpt-4o
    instructions_file: atendente.md
    tools:
      native:
        - send_whatsapp_message
      custom:
        - name: criar_pedido
          description: Cria um novo pedido no sistema
          method: POST
          endpoint: /pedidos
---

# Pizzaria - Pedidos

Template para atendimento de pedidos de pizzaria via WhatsApp.

## Casos de Uso
...

## Conexões Necessárias
| Conexão | Tipo | Finalidade |
|---------|------|------------|
| WhatsApp Business | whatsapp | Atendimento ao cliente |
| OpenAI ou OpenRouter | agent | LLM para os agentes |

## Agents
| Agent | Role | Instructions |
|-------|------|--------------|
| Atendente | Pilot | `atendente.md` |

## Checklist de Customização
- [ ] Substituir `{NOME_EMPRESA}` pelo nome da pizzaria
- [ ] Adicionar cardápio completo com preços
```

---

## Agent Instructions Format

Located at `{agent-slug}.md` (e.g., `atendente.md`). Contains minimal frontmatter + full agent prompt.

### Frontmatter

```yaml
---
agent_name: "Atendente"
---
```

### Structure

```markdown
---
agent_name: "Atendente"
---

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
| `{NOME_ACADEMIA}` | Academy name | "Academia AquaFit" |
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
- `{CUSTOMIZE: Modalidades e Horários}` - Class schedules
- `{CUSTOMIZE: Planos e Preços}` - Plans and pricing

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
# Hub config (includes agent config)
Read("./templates/pt/vertical/pizzaria/pedidos/hub.md")

# Agent instructions
Read("./templates/pt/vertical/pizzaria/pedidos/atendente.md")
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
   - `Read("./templates/pt/.../hub.md")` - hub config + agent config
   - `Read("./templates/pt/.../{agent}.md")` - agent instructions
5. Replace placeholders (`{NOME_EMPRESA}`, etc.)
6. Customize `{CUSTOMIZE: ...}` sections in instructions
7. Create hub and agent via MCP tools
