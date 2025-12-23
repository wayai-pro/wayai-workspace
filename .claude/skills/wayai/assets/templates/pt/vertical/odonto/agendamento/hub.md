---
name: "{NOME_CLINICA}"
description: "Agendamento de consultas odontológicas"
ai_mode: Pilot+Copilot
hub_type: user
followup_message: "Oi! Vi que você estava agendando uma consulta. Posso ajudar?"
inactivity_interval: 10
agents:
  - name: Recepcionista
    role: Pilot
    model: gpt-4o
    instructions_file: recepcionista.md
    tools:
      native:
        - send_whatsapp_message
        - google_calendar_create_event
        - google_calendar_list_events
      custom:
        - name: consultar_agenda
          description: Consulta horários disponíveis
          method: GET
          endpoint: /agenda/disponibilidade
        - name: criar_agendamento
          description: Cria novo agendamento
          method: POST
          endpoint: /agendamentos
---

# Odonto - Agendamento

Template para agendamento de consultas em clínicas odontológicas via WhatsApp.

## Casos de Uso

- Agendar consultas e avaliações
- Remarcar ou cancelar consultas
- Tirar dúvidas sobre procedimentos
- Informar sobre valores e formas de pagamento
- Enviar lembretes de consulta

## Conexões Necessárias

| Conexão | Tipo | Finalidade |
|---------|------|------------|
| WhatsApp Business | whatsapp | Atendimento ao paciente |
| OpenAI ou OpenRouter | agent | LLM para o agente |
| Google Calendar | google_calendar | Gestão de agenda |
| Webhook (opcional) | webhook | Integração com sistema da clínica |

## Agents

| Agent | Role | Instructions |
|-------|------|--------------|
| Recepcionista | Pilot | `recepcionista.md` |

---

## Checklist de Customização

- [ ] Substituir `{NOME_CLINICA}` pelo nome da clínica
- [ ] Adicionar lista de procedimentos e valores
- [ ] Configurar horários de funcionamento
- [ ] Definir convênios aceitos
- [ ] Configurar agenda no Google Calendar
- [ ] Adicionar instruções de pré-consulta
