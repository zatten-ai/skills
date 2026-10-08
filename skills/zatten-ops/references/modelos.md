# Modelos dos arquivos da agência

Use estes modelos ao montar o diretório da agência e a pasta de cada cliente.
Preencha o que souber; deixe `(perguntar)` no que faltar.

## Estrutura

```
<diretório da agência>/
  AGENTS.md            regras fixas (lido por Codex, Cursor e outros)
  CLAUDE.md            uma linha: "Leia AGENTS.md."
  AGENCIA.md           quem é a agência, progresso do setup, dicas e chamadas
  .gitignore           .env
  clientes/
    <organização>/     o nome da organização no painel (o estágio do cliente)
      <cliente>/       nome curto, minúsculo, com hífen (ex.: clinica-sorriso)
        CLIENTE.md
        operacao/
          MEMORIA.md
          snapshots/   AAAA-MM-DD_HHMM_<assunto>.json (sem chaves)
          .env         ZATTEN_API_KEY=..., LANGSMITH_API_KEY=... (só se for usar)
        comercial/
          diagnostico.md
          proposta-AAAA-MM-DD.html
          viabilidade-AAAA-MM-DD.md   interna, nunca vai ao cliente
          historico.md
```

## .gitignore

```
.env
**/.env
```

## AGENTS.md

```markdown
# Regras desta agência para o assistente

- Este diretório guarda a agência e os clientes dela na Zatten. Use as skills do
  Zatten-OS: `zatten-ops` (operar), `zatten-comercial` (vender),
  `zatten-agencia` (o negócio da agência), `zatten-grill` (decisões grandes).
- Um cliente por vez. Outro cliente só como leitura, citado.
- Plano e "sim" antes de qualquer alteração (MCP, API ou navegador).
- Nunca mostre nem grave chaves. Snapshots sem chaves ("<removido>"). Chave só no
  `.env` da pasta do cliente.
- Testar o agente executa as tools dele: "sim" antes de entrar em modo de teste.
  Publicar, assinar e conectar o WhatsApp são sempre de uma pessoa.
- Pelo navegador: nunca apague nada nem mexa na conexão do WhatsApp.
- As pastas seguem as organizações do painel: `clientes/<organização>/<cliente>/`.
- Um commit por mudança aplicada.
- Contexto da agência: AGENCIA.md. Contexto de cada cliente: a pasta dele.
```

## AGENCIA.md

```markdown
# <Nome da agência>

## Quem é
- Site: <url>
- O que vende hoje: …
- Nichos que atende: …
- Ticket médio por cliente: …
- Clientes ativos: <quantos> (em quais nichos)

## Como vende
- Canal (tráfego, indicação, conteúdo, outbound…): …
- Processo comercial (quem vende, quantas etapas, reunião?): …

## A solução de IA
- Quanto cobra: setup … / mensalidade …
- Meta: quantos clientes na solução, até quando: …
- Organizações de estágio no painel: Prospects / Implantação / Produção (ou as que a agência usa)

## Como trata os clientes
- Tom: …
- Prazos: …
- O que entrega todo mês (relatório, reunião…): …
- Observações: …

## Setup
- [ ] Conta e conexão
- [ ] Diagnóstico da agência
- [ ] Organizações e pastas
- [ ] Primeira vitória (SDR da agência ou demo)
- [ ] Assinatura e WhatsApp

## Dicas dadas
(um conceito por linha, com a data: o assistente não repete)

## Chamadas recusadas
(a chamada e a data: ela volta só depois de 30 dias)
```

## CLIENTE.md

```markdown
# <Nome do cliente>

- project_id: <uuid> (ou "ainda sem projeto")
- Nome exato do projeto na Zatten: <como aparece em list_projects>
- Estágio (organização): <Prospects | Implantação | Produção | …>
- Site: <url>
- Logo: <url ou arquivo, se a agência passou>
- Nicho: …
- Objetivo do atendimento: …
- Público e tom: …
- Regras do cliente (o que nunca fazer, horários, preços que pode citar): …
- Conexão do WhatsApp: oficial | não oficial | ainda não conectado
- Motor do agente: LangChain Agent | motor antigo (migrar)
```

## operacao/MEMORIA.md

```markdown
# Memória — <Nome do cliente>

## Vigente
(o que vale hoje; reescreva quando mudar)
- revision conhecida: <revision do último get_template>
- Versão do agente: publicada <N>, mais nova <M>
- Último snapshot: snapshots/<arquivo>.json
- Decisões em vigor: …
- Pendências no painel: …

## Histórico
(só acrescente; a mais recente no fim)

### AAAA-MM-DD HH:MM — <assunto>
- Pedido: …
- Feito: …
- Testado: … (casos, versão)
- Não feito (e por quê): …
- Para fazer no painel: …
- Snapshot: snapshots/<arquivo>.json
```

Mudança feita por outra pessoa no painel entra no Histórico como
`### AAAA-MM-DD HH:MM — mudança externa`, com o que mudou. Mudança de organização
entra como `### AAAA-MM-DD HH:MM — mudou para <organização>`.

## comercial/historico.md

```markdown
# Histórico comercial — <Nome do cliente>

(só acrescente; a mais recente no fim)

### AAAA-MM-DD — <reunião | proposta | follow-up | fechou | perdeu>
- O que aconteceu: …
- Próximo passo: … (até quando)
```
