# Hub Templates

## Overview

Templates are pre-configured hub setups. Each template is a single file containing hub settings and all agents.

## Structure

```
templates/
├── templates.md
├── pt/
│   ├── vertical/
│   │   ├── pizzaria/
│   │   │   ├── pedidos.md
│   │   │   └── completo.md
│   │   └── clinica/
│   │       └── agendamento.md
│   └── horizontal/
│       ├── sdr/
│       │   └── simples.md
│       └── suporte/
│           └── geral.md
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
| vertical | pizzaria | pedidos.md | Atendimento de pedidos |
| vertical | odonto | agendamento.md | Agendamento de consultas |
| horizontal | sdr | simples.md | Qualificação de leads |

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
3. List available: pedidos.md, completo.md
4. "Encontrei templates de pizzaria. Qual você prefere?
   - pedidos: foco em atendimento de pedidos
   - completo: jornada completa (pedidos + suporte + pós-venda)"
```

### Step 2: Read and Customize

```
1. Read the template file
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
```

## Template Format

```markdown
---
name: "{NOME_EMPRESA} - Template"
description: "Descrição do hub"
ai_mode: Pilot+Copilot
hub_type: user
---

# Nome do Template

Descrição breve.

## Casos de Uso
- Caso 1
- Caso 2

## Conexões Necessárias
- Tipo 1
- Tipo 2

---

## Agentes

### Agente 1

**Configuração:**
```yaml
name: Nome
role: Pilot
model: gpt-4o
temperature: 0.7
tools:
  native:
    - tool_id
```

**Instruções:**

Instruções aqui...
```

## Placeholders

| Placeholder | Description |
|-------------|-------------|
| `{NOME_EMPRESA}` | Nome da empresa |
| `{CUSTOMIZE: ...}` | Seção para customizar |
| `{OPCIONAL: ...}` | Seção opcional |
