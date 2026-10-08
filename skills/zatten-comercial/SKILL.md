---
name: zatten-comercial
description: Use quando a agência quiser VENDER a solução de atendimento com IA a um cliente — diagnosticar um possível cliente, montar uma demo para ele, fazer uma proposta, calcular se a conta fecha (custo, preço, margem), responder objeção, fazer follow-up de proposta ou achar oportunidades de venda na carteira e em nichos novos. Parte do Zatten-OS; a configuração dos projetos é da zatten-ops.
compatibility: Precisa do MCP da Zatten e de acesso à rede para ler docs.zatten.com. Usa as regras da zatten-ops.
metadata:
  version: "4.0.0"
---

# Zatten-OS · Comercial: vender a solução da agência

A agência sabe vender; o que trava é mostrar a solução funcionando e saber se a
conta fecha. Esta skill ajuda nas duas coisas. Quanto mais a agência vende, mais
clientes ela atende — e cada cliente é um projeto na Zatten.

**As regras da `zatten-ops` valem aqui por inteiro** (plano e "sim", um cliente por
vez, credenciais, nada de apagar, testar executa as tools). O conhecimento mora na
aba **Vender** da doc (`/vender/visao-geral`); leia a página da etapa antes de agir.

## A jornada

```
diagnóstico → demo → proposta + viabilidade → follow-up → fechou (move_project) → entrega (zatten-ops)
```

Tudo do cliente fica em `clientes/<organização>/<cliente>/comercial/`. Todo mundo é
cliente: o estágio é a organização ("Prospects" → "Implantação" → "Produção").
Cliente que ainda não tem projeto: crie a pasta na organização de estágio inicial e
o `CLIENTE.md` com "project_id: ainda sem projeto".

## 1. Diagnóstico do cliente

`/vender/diagnostico-do-cliente`. Leia o site (e o Instagram, se a agência passar).
Pergunte o que faltar, em no máximo 3 perguntas por vez: o que vende, como atende
hoje, volume, quem atende, ferramentas, dores, objetivo. Grave em
`comercial/diagnostico.md` (`references/modelos.md`) e preencha o `CLIENTE.md`.
Escolha o playbook do nicho (`/playbooks/nichos/...`).

## 2. Demo

`/vender/demo`. Com o "sim":

1. Organização de estágio: se "Prospects" (ou a da agência) não existe,
   `create_organization`.
2. `create_project` nessa organização, com os blocos do playbook e o nome do
   cliente. Diga que o projeto nasce com a assinatura pendente e fica na conta.
3. O agente com o que veio do diagnóstico e do site; `test_agent` até responder bem
   (`/trabalhar-com-ia/construir-o-agente-iterando`). Na demo, deixe de fora tools
   que agem em sistema real do cliente, ou use um ambiente de teste dele.
4. Diga como mostrar: o chat de teste do painel na reunião, ou você rodando
   `test_agent` com as perguntas do cliente.

## 3. Proposta + viabilidade

`/vender/proposta` e `/vender/viabilidade`. Dois arquivos, sempre separados:

- **Viabilidade (interna)**, ANTES da proposta: `comercial/viabilidade-AAAA-MM-DD.md`.
  Custo da Zatten + IA + Meta → preço → margem. **Só número medido ou informado**:
  volume pelo `get_metrics` (se já houver projeto) ou pelo cliente; preço do plano
  em zatten.com/planos lido nesta conversa; custo de IA por
  `/trabalhar-com-ia/estimar-custo-de-ia`. O que não souber, pergunte. Se não
  fecha, diga.
- **Proposta (para o cliente)**: copie `references/proposta.html` para
  `comercial/proposta-AAAA-MM-DD.html` e preencha. A marca é a da **agência**:
  `get_white_label` (logo, `primary_color` em `{{COR}}`, nome, contato). O preço sai
  do `AGENCIA.md` e da viabilidade. Escreva com as palavras do cliente, 100% sobre
  ele. **Nunca** entram custo da Zatten, consumo de IA ou margem. Não deixe `{{ }}`
  no arquivo.

Mostre a proposta à pessoa antes de ela enviar. Para PDF: abrir no navegador →
imprimir → Salvar como PDF (A4).

## 4. Objeções e follow-up

- Objeção do cliente: `/vender/objecoes`. Responda com o recurso que sustenta a
  resposta (transbordo, pausa humana, teste antes de publicar, LangSmith), nunca com
  promessa que o produto não cumpre.
- Follow-up: `/vender/follow-up`. Registre tudo em `comercial/historico.md`. Proposta
  sem resposta há 5 dias é uma chamada comercial possível (regra 17 da ops).

## 5. Fechou

1. `move_project` para a organização de implantação (com "sim"), e `git mv` da pasta.
2. `historico.md`: "fechou", com valor e data.
3. Para a pessoa, no painel: assinar o projeto e conectar o WhatsApp
   (`/comecar/conexoes-whatsapp`).
4. Daqui em diante é a `zatten-ops`: o onboarding em `/playbooks/entregar-ao-cliente`.

Não fechou: `historico.md` com o motivo. A demo fica parada na conta; se a agência
quiser apagar, é no painel (guie).

## Oportunidades

`/vender/oportunidades`. Na carteira: o diagnóstico de cada cliente
(`/trabalhar-com-ia/diagnostico`) vira lista do que vender a mais (follow-up,
anúncios Click-to-WhatsApp, agendamento, reengajamento). Fora dela: nichos vizinhos
aos que a agência já domina, a partir do `AGENCIA.md` e dos playbooks.

## Quando oferecer o grill

Proposta grande (vários serviços, várias unidades, integração com sistema do
cliente): ofereça a `zatten-grill` para fechar o escopo em rodadas antes de
escrever a proposta. O documento final vai para `comercial/`.

## Relatório

```
Cliente: <nome> (estágio: <organização>)
Feito: … (diagnóstico, demo vN, proposta, viabilidade)
Viabilidade: margem de …/mês por cliente (premissas: …)
Para você: … (revisar e enviar a proposta, mostrar a demo, assinar…)
Próximo passo comercial: … (até quando)
```

E `send_feedback`.
