---
name: "{NOME_EMPRESA}"
description: "Atendimento de pedidos para pizzaria"
ai_mode: Pilot+Copilot
hub_type: user
followup_message: "Oi! Ainda está aí? Posso ajudar com mais alguma coisa?"
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
        - name: consultar_cardapio
          description: Consulta cardápio e preços
          method: GET
          endpoint: /cardapio
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

| Agent | Role | Instructions |
|-------|------|--------------|
| Atendente | Pilot | `atendente.md` |

---

## Checklist de Customização

- [ ] Substituir `{NOME_EMPRESA}` pelo nome da pizzaria
- [ ] Adicionar cardápio completo com preços
- [ ] Definir área de entrega e taxas
- [ ] Configurar formas de pagamento aceitas
- [ ] Definir tempo médio de entrega
- [ ] Adicionar promoções ativas
