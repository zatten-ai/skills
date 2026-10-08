# Modelos do comercial

Todos vão em `clientes/<organização>/<cliente>/comercial/`.

## diagnostico.md

```markdown
# Diagnóstico — <Nome do cliente> (AAAA-MM-DD)

## O negócio
- O que vende, para quem: …
- Site e redes: … (o que foi lido)
- Tamanho (equipe, unidades, faturamento aproximado, se disse): …

## Atendimento hoje
- Canais: WhatsApp (número próprio? app ou API?), Instagram, telefone…
- Volume: … conversas por dia/semana (medido ou estimado — dizer qual)
- Quem atende e em que horário: …
- Ferramentas (agenda, CRM, ERP): …

## Dores (com as palavras do cliente)
- "…"
- "…"

## Objetivo
- O que seria sucesso em 90 dias: …

## Encaixe
- Playbook do nicho: /playbooks/nichos/<nicho>
- O que dá para entregar já: …
- O que depende de integração ou do cliente: …
- Riscos: …
```

## viabilidade-AAAA-MM-DD.md (INTERNA)

```markdown
# Viabilidade — <Nome do cliente> (AAAA-MM-DD)

Interna da agência. Nunca vai para o cliente.

## Premissas (de onde veio cada número)
- Conversas por mês: … (medido em get_metrics | informado pelo cliente | estimado a partir de …)
- Plano da Zatten: … (zatten.com/planos, lido em AAAA-MM-DD)
- Modelo de IA: … ; custo por conversa: … (/trabalhar-com-ia/estimar-custo-de-ia)
- Mensagens da Meta: … (só conexão oficial; /comecar/custos-de-operacao)

## Custo mensal
| Item | Valor |
|---|---|
| Plano da Zatten | … |
| IA | … |
| Meta | … |
| **Total** | … |

## Preço e margem
| | Valor |
|---|---|
| Mensalidade cobrada | … |
| Custo mensal | … |
| **Margem por mês** | … (…%) |
| Implantação cobrada | … |
| Horas da agência na implantação | … |

## Com folga
- Se o volume dobrar: custo … , margem …
- Ponto em que a margem fica abaixo de …%: … conversas/mês

## Conclusão
Fecha | Fecha com ajuste (…) | Não fecha — porque …
```
