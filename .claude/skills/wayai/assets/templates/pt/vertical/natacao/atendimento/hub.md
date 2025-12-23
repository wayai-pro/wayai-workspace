---
name: "{NOME_ACADEMIA}"
description: "Agendamento de visitas para academia de natação"
ai_mode: Pilot+Copilot
hub_type: user
followup_message: "Oi! Ainda está interessado em conhecer a academia? Posso agendar uma visita gratuita para você!"
inactivity_interval: 10
agents:
  - name: Atendente
    role: Pilot
    model: gpt-4o
    instructions_file: atendente.md
    tools:
      native:
        - google_calendar_check_availability
        - google_calendar_create_event
        - google_calendar_update_event
        - google_calendar_delete_event
        - transfer_to_team
---

# Natação - Atendimento

Template para atendimento de academias de natação via WhatsApp, com foco em **agendar visitas** para converter interessados em alunos.

## Casos de Uso

- **Agendar visitas para conhecer a academia** (objetivo principal)
- Reagendar ou cancelar visitas
- Informar sobre modalidades e horários de aulas
- Esclarecer dúvidas sobre planos e preços
- Orientar sobre processo de matrícula
- Informar sobre regras da piscina e o que trazer

## Conexões Necessárias

| Conexão | Tipo | Finalidade |
|---------|------|------------|
| WhatsApp Business | whatsapp | Atendimento ao cliente |
| OpenAI ou OpenRouter | agent | LLM para o agente |
| Google Calendar | google_calendar | Agendamento de visitas |

## Agents

| Agent | Role | Instructions |
|-------|------|--------------|
| Atendente | Pilot | `atendente.md` |

---

## Checklist de Customização

- [ ] Substituir `{NOME_ACADEMIA}` pelo nome da academia
- [ ] Adicionar modalidades oferecidas (natação infantil, adulto, hidroginástica, etc.)
- [ ] Definir horários das turmas
- [ ] Configurar planos e preços (mensal, trimestral, anual)
- [ ] Informar horário de funcionamento
- [ ] Adicionar regras da piscina
- [ ] Definir requisitos para matrícula
- [ ] Configurar calendário do Google para agendamento de visitas
- [ ] Configurar equipe para transferência de atendimento
