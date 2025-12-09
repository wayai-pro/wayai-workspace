---
name: "{NOME_EMPRESA}"
description: "Atendimento de pedidos para pizzaria"
ai_mode: Pilot+Copilot
hub_type: user
followup_message: "Oi! Ainda está aí? Posso ajudar com mais alguma coisa?"
inactivity_interval: 5
---

# Pizzaria - Pedidos

Template para atendimento de pedidos de pizzaria via WhatsApp.

## Casos de Uso

- Receber pedidos de pizza
- Tirar dúvidas sobre cardápio
- Informar tempo de entrega
- Modificar pedidos antes do preparo

## Conexões Necessárias

| Conexão | Tipo | Finalidade |
|---------|------|------------|
| WhatsApp Business | whatsapp | Atendimento ao cliente |
| OpenAI ou OpenRouter | agent | LLM para os agentes |
| Webhook (opcional) | webhook | Integração com sistema de pedidos |

## Agents

| Agent | Role | File |
|-------|------|------|
| Atendente | Pilot | `atendente.md` |

---

## Checklist de Customização

- [ ] Substituir `{NOME_EMPRESA}` pelo nome da pizzaria
- [ ] Atualizar cardápio com pizzas e preços reais
- [ ] Configurar informações de entrega (taxa, raio, horário)
- [ ] Definir formas de pagamento aceitas
- [ ] Configurar webhook do sistema de pedidos (opcional)
