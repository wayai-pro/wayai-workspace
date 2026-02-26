# Hub Templates

Catalog of available WayAI hub templates.

For file formats and structure details, see [template-structure.md](template-structure.md).

---

## Available Templates

| Template | Type | Description | Hub | Agent Instructions |
|----------|------|-------------|-----|-------------------|
| Pizzaria - Pedidos | vertical | Atendimento de pedidos via WhatsApp | `assets/templates/pt/vertical/pizzaria/pedidos/hub.md` | `assets/templates/pt/vertical/pizzaria/pedidos/atendente-instructions.md` |
| Odonto - Agendamento | vertical | Agendamento de consultas odontológicas | `assets/templates/pt/vertical/odonto/agendamento/hub.md` | `assets/templates/pt/vertical/odonto/agendamento/recepcionista-instructions.md` |
| Natação - Atendimento | vertical | Agendamento de visitas em academias | `assets/templates/pt/vertical/natacao/atendimento/hub.md` | `assets/templates/pt/vertical/natacao/atendimento/atendente-instructions.md` |
| SDR - Simples | horizontal | Qualificação de leads inbound | `assets/templates/pt/horizontal/sdr/simples/hub.md` | `assets/templates/pt/horizontal/sdr/simples/sdr-instructions.md` |

**Template Types:**
- `vertical` - Industry-specific (pizzaria, odonto, natacao, etc.)
- `horizontal` - Cross-industry functions (SDR, support, etc.)

---

## Quick Reference

**Workflow:**
1. Find matching template in the table above
2. Read template files using the paths shown in the table
3. Copy to workspace: `workspace/{project}/{hub}/`
4. Replace placeholders (`{NOME_EMPRESA}`, etc.) - see [template-structure.md](template-structure.md#placeholders)
5. Customize `{CUSTOMIZE: ...}` sections in instructions
6. Add connections to `wayai.yaml` (auto-created from org credentials during push)
7. `wayai push` → creates agents, tools, states, and connections on the hub
