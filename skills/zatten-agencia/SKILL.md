---
name: zatten-agencia
description: Use quando o assunto for o NEGÓCIO da agência na Zatten — conhecer e documentar a agência (diagnóstico, AGENCIA.md), montar o SDR da própria agência (um agente que atende e qualifica os leads dela e marca reunião), a rotina da semana (clientes por estágio, propostas abertas, pendências), o relatório mensal para um cliente final, avaliar como um agente está indo, ou crescer (novos nichos, escalar). Parte do Zatten-OS; a configuração dos projetos é da zatten-ops e a venda a um cliente é da zatten-comercial.
compatibility: Precisa do MCP da Zatten e de acesso à rede para ler docs.zatten.com. Usa as regras da zatten-ops.
metadata:
  version: "4.0.0"
---

# Zatten-OS · Agência: o negócio da agência

Você ajuda o dono da agência a tocar o negócio: saber quem ela é, vender para ela
mesma (o SDR), acompanhar a carteira e mostrar resultado aos clientes. A agência
típica já tem carteira e processo comercial e quer transformar IA em receita
recorrente sem virar empresa de tecnologia.

**As regras da `zatten-ops` valem aqui por inteiro.** O conhecimento mora na doc:
`/vender/operar-a-agencia`, `/playbooks/nichos/agencias`, `/playbooks/entregar-ao-cliente`.

## Diagnóstico da agência → AGENCIA.md

No setup (passo 2) ou quando a pessoa pedir. Leia o site da agência e pergunte o
que faltar, até 3 perguntas por vez:

- o que vende hoje, para quais nichos, o ticket médio;
- quantos clientes ativos;
- como vende (canal, processo, quem vende);
- quanto quer cobrar pela solução de IA (setup e mensalidade) e quantos clientes
  quer colocar nela, até quando;
- como trata os clientes (tom, prazos, o que entrega todo mês).

Grave no `AGENCIA.md` (modelo em `zatten-ops/references/modelos.md`). Mostre o
resultado e pergunte se está certo. É a referência do SDR, das propostas e das
chamadas comerciais. Se a pessoa quiser pular, pule e volte a isso depois.

## SDR da agência

`/playbooks/nichos/agencias`. Um projeto cujo agente atende os leads da PRÓPRIA
agência: acolhe, qualifica (segmento, porte, se já investe em tráfego, urgência) e
marca a reunião ou passa ao comercial. É a primeira vitória do setup para conta sem
projeto.

1. Com o "sim": `create_project` ("SDR — <agência>") com os blocos do playbook,
   personalizado pelo `AGENCIA.md` (oferta, nicho, preço, tom).
2. Agenda: se a agência quer marcar reunião pelo agente, a agenda entra pelas
   **Integrações** do agente (`/engenharia-de-ia/tools/integracoes`). Conectar a
   conta é no painel: guie, e depois acrescente as tools ao agente.
3. `test_agent` com os casos do playbook até passar
   (`/trabalhar-com-ia/construir-o-agente-iterando`).
4. Para a pessoa, no painel: assinar, conectar o número da agência, publicar a
   versão N.

Dica para dar na primeira vez: as tools nativas da Zatten movem o lead no funil e
põem tags, então o funil do SDR mostra sozinho quem está qualificado.

## Rotina da semana

Quando a pessoa pedir "como estão as coisas" ou no começo da semana:

- `list_projects`: clientes por organização (estágio), WhatsApp desconectado,
  cobrança pendente, agentes com versão esperando publicação (`get_template` →
  `project.agent`).
- `comercial/historico.md` de cada cliente: propostas abertas e próximos passos
  vencidos.
- Pendências no painel anotadas nas memórias.

Devolva uma lista curta, priorizada, com o que é da pessoa e o que você pode fazer.

## Relatório mensal do cliente

`/vender/operar-a-agencia`. Com `get_metrics` do mês (e do anterior, para comparar):

1. Os números que o cliente entende: novos contatos (anúncio x orgânico), quanto a
   IA respondeu x a equipe, o funil hoje, conversões. Atualizados uma vez por dia;
   o custo de IA não vem (e nunca entra no relatório).
2. O que foi ajustado no mês (do Histórico da memória) e o que vem.
3. Copie `references/relatorio-mensal.html` para
   `comercial/relatorio-AAAA-MM.html` e preencha, com a marca da agência
   (`get_white_label`). Fale de atendimentos, agendamentos e vendas, não de tokens.

Mostre à pessoa antes de ela enviar.

## Avaliar um agente (SDR ou de cliente)

`get_metrics` (volume, IA x humano, funil) + `find_contacts` e a API do dia a dia
para ler algumas conversas + o LangSmith, se ligado. Devolva: o que está bom, o que
falha (com a conversa de exemplo, sem expor dado pessoal além do necessário) e até
3 ajustes. Ajustar é com a `zatten-ops`, numa versão nova e testada.

## Crescer

Quando a agência pedir ajuda para escalar, ou como chamada comercial (uma por
sessão, regra 17 da ops):

- nicho vizinho aos que ela domina (`/vender/oportunidades`, `/playbooks/...`);
- vender mais para a carteira (o diagnóstico de cada cliente vira lista de upsell);
- o próprio funil de prospecção dela: o SDR está rodando? quantos leads, quantas
  reuniões (`get_metrics` do projeto do SDR)?

## Relatório

```
Agência: <nome>
Feito: …
Para você: … (no painel ou na conversa com o cliente)
Sugestões (até 3): …
```

E `send_feedback`.
