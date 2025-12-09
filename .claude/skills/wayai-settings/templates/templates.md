# Hub Templates

## Overview

Templates are pre-configured hub setups. Each template is a folder containing hub.md (settings + connections) and separate agent files.

## Structure

```
templates/
├── templates.md
├── pt/
│   ├── vertical/
│   │   ├── pizzaria/
│   │   │   └── pedidos/
│   │   │       ├── hub.md
│   │   │       └── atendente.md
│   │   └── odonto/
│   │       └── agendamento/
│   │           ├── hub.md
│   │           └── recepcionista.md
│   └── horizontal/
│       └── sdr/
│           └── simples/
│               ├── hub.md
│               └── sdr.md
├── en/
│   └── ...
└── es/
    └── ...
```

## Categories

### Vertical (Industry-Specific)

Templates for specific industries with specialized workflows and terminology.

Examples: pizzaria, clinica, imobiliaria, restaurante

### Horizontal (Cross-Industry)

Templates for functions that work across any industry.

Examples: sdr, suporte, onboarding, feedback

## Available Templates

### Portuguese (pt/)

| Category | Folder | Template | Description |
|----------|--------|----------|-------------|
| vertical | pizzaria | pedidos/ | Atendimento de pedidos |
| vertical | odonto | agendamento/ | Agendamento de consultas |
| horizontal | sdr | simples/ | Qualificação de leads |

### English (en/)

Coming soon.

### Spanish (es/)

Coming soon.

## Using Templates

### Step 1: Find a Template

```
User: "Preciso de um hub para pizzaria"

Claude:
1. Detect language → pt
2. Check templates/pt/vertical/pizzaria/
3. List available: pedidos/
4. "Encontrei o template de pizzaria 'pedidos'.
   Ele inclui um agente Atendente para receber pedidos via WhatsApp.
   Quer que eu use esse template?"
```

### Step 2: Read and Customize

```
1. Read hub.md and agent files from template folder
2. Replace placeholders:
   - {NOME_EMPRESA} → nome real
   - {CUSTOMIZE: ...} → conteúdo específico
3. Adjust agents/tools as needed
```

### Step 3: Create via MCP

```
1. create_hub() with template settings
2. create_agent() for each agent
3. add_native_tool() / add_custom_tool() for tools
4. Save to {org}/{project}/{hub}/
   - hub.md (hub settings + connections + agents index)
   - {agent-slug}.md for each agent
5. Update workspace.md
```

## Template Format

Templates are organized as a hub folder with separate agent files:

```
templates/pt/vertical/pizzaria/pedidos/
├── hub.md                  # Hub settings + connections + agents index
└── atendente.md            # Agent file
```

### hub.md

```markdown
---
name: "{NOME_EMPRESA}"
description: "Descrição do hub"
ai_mode: Pilot+Copilot
hub_type: user
followup_message: "Mensagem de follow-up"
inactivity_interval: 5
---

# Nome do Template

Descrição breve.

## Casos de Uso
- Caso 1
- Caso 2

## Conexões Necessárias

| Conexão | Tipo | Finalidade |
|---------|------|------------|
| WhatsApp Business | Canal | Atendimento |
| OpenAI | Agente | LLM |

## Agents

| Agent | Role | File |
|-------|------|------|
| Atendente | Pilot | `atendente.md` |
```

### {agent-slug}.md

```markdown
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
      description: Cria um novo pedido
      method: POST
      endpoint: /pedidos
---

{CUSTOMIZE: Instruções do agente}

Instruções aqui...
```

## Placeholders

| Placeholder | Description |
|-------------|-------------|
| `{NOME_EMPRESA}` | Nome da empresa |
| `{CUSTOMIZE: ...}` | Seção para customizar |
| `{OPCIONAL: ...}` | Seção opcional |
