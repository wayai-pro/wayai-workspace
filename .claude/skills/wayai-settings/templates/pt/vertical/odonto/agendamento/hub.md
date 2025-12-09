---
name: "{NOME_CLINICA}"
description: "Agendamento de consultas odontológicas"
ai_mode: Pilot+Copilot
hub_type: user
followup_message: "Oi! Vi que você estava agendando uma consulta. Posso ajudar?"
inactivity_interval: 10
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

| Agent | Role | File |
|-------|------|------|
| Recepcionista | Pilot | `recepcionista.md` |

---

## Checklist de Customização

- [ ] Substituir `{NOME_CLINICA}` pelo nome da clínica
- [ ] Adicionar profissionais e especialidades
- [ ] Definir procedimentos e valores
- [ ] Configurar informações da clínica (endereço, horário)
- [ ] Listar convênios aceitos
- [ ] Conectar Google Calendar com agenda da clínica
- [ ] Configurar webhook do sistema (opcional)
