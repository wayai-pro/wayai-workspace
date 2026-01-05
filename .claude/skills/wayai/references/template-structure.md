# Template Structure

Reference for WayAI hub template file formats and conventions.

## Table of Contents
- [Metadata](#metadata)
- [Directory Structure](#directory-structure)
- [Hub File Format](#hub-file-format)
- [Agent Instructions Format](#agent-instructions-format)
- [Placeholders](#placeholders)

---

## Metadata

**Schema Version**: 2.1

**ID Reference Notes**:
- `connector_id`: Production UUIDs identifying connector types (OpenAI, WhatsApp, etc.). These are fixed IDs from the WayAI database, not placeholders.
- `tool_native_id`: Production UUIDs identifying specific native tools. These are fixed IDs from the WayAI database.

---

## Directory Structure

Each template contains a hub config and agent instruction files (workspace format):

```
{lang}/{type}/{category}/{variant}/
├── hub.md                           # Hub config + agents config in frontmatter
└── {agent-slug}-instructions.md     # Agent instructions only
```

**Example:** `pt/vertical/pizzaria/pedidos/`
```
├── hub.md                           # Hub settings + agent config (model, tools)
└── atendente-instructions.md        # Agent instructions
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
| `agent_name` | string | Agent display name |
| `agent_role` | string | `Pilot`, `Copilot`, `Specialist for Pilot`, etc. |
| `model` | string | LLM model (e.g., `gpt-4o`) |
| `instructions_file` | string | Path to instructions file (`{agent-slug}-instructions.md`) |
| `tools.native` | array | Native tools grouped by connector |
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
connections:
  - connector_name: WhatsApp
    connector_id: "uuid-from-database"
    connector_type: Channel
agents:
  - agent_name: "Atendente"
    agent_role: Pilot
    model: gpt-4o
    instructions_file: atendente-instructions.md
    tools:
      native:
        - connector_name: Wayai Conversation
          connector_id: "uuid-from-database"
          tools:
            - tool_name: Close Conversation
              tool_native_id: "uuid-from-database"
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
| Atendente | Pilot | `atendente-instructions.md` |

## Checklist de Customização
- [ ] Substituir `{NOME_EMPRESA}` pelo nome da pizzaria
- [ ] Adicionar cardápio completo com preços
```

---

## Agent Instructions Format

Located at `{agent-slug}-instructions.md` (e.g., `atendente-instructions.md`). Contains minimal frontmatter + full agent prompt.

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
