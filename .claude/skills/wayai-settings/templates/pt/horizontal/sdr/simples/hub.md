---
name: "{NOME_EMPRESA} - SDR"
description: "Qualificação de leads inbound"
ai_mode: Pilot+Copilot
hub_type: user
followup_message: "Oi! Vi que você demonstrou interesse em {NOME_PRODUTO}. Posso te ajudar com alguma dúvida?"
inactivity_interval: 60
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

| Agent | Role | File |
|-------|------|------|
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
