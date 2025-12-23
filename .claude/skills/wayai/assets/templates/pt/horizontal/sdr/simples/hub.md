---
name: "{NOME_EMPRESA} - SDR"
description: "Qualificação de leads inbound"
ai_mode: Pilot+Copilot
hub_type: user
followup_message: "Oi! Vi que você demonstrou interesse em {NOME_PRODUTO}. Posso te ajudar com alguma dúvida?"
inactivity_interval: 60
agents:
  - name: SDR
    role: Pilot
    model: gpt-4o
    instructions_file: sdr.md
    tools:
      native:
        - send_whatsapp_message
        - google_calendar_create_event
      custom:
        - name: criar_lead
          description: Cria ou atualiza lead no CRM
          method: POST
          endpoint: /leads
        - name: consultar_disponibilidade
          description: Consulta horários disponíveis para reunião
          method: GET
          endpoint: /calendario/disponibilidade
---

# SDR - Simples

Template para SDR (Sales Development Representative) focado em qualificação de leads inbound.

## Casos de Uso

- Qualificar leads vindos do site/anúncios
- Responder dúvidas sobre o produto
- Agendar reuniões com o time comercial
- Nutrir leads que não estão prontos

## Conexões Necessárias

| Conexão | Tipo | Finalidade |
|---------|------|------------|
| WhatsApp Business | whatsapp | Comunicação com leads |
| OpenAI ou OpenRouter | agent | LLM para o agente |
| Google Calendar | google_calendar | Agendamento de reuniões |
| Webhook (opcional) | webhook | Integração com CRM |

## Agents

| Agent | Role | Instructions |
|-------|------|--------------|
| SDR | Pilot | `sdr.md` |

---

## Checklist de Customização

- [ ] Substituir `{NOME_EMPRESA}` pelo nome da empresa
- [ ] Substituir `{NOME_PRODUTO}` pelo nome do produto
- [ ] Definir critérios BANT específicos
- [ ] Adicionar informações do produto
- [ ] Configurar respostas para objeções comuns
- [ ] Configurar integração com CRM (opcional)
- [ ] Conectar Google Calendar
