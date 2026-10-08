# Modelos dos arquivos da agência

Use estes modelos ao montar o diretório da agência e a pasta de cada cliente.
Preencha o que souber; deixe `(perguntar)` no que faltar.

## Estrutura

```
<diretório da agência>/
  AGENTS.md            regras fixas (lido por Codex, Cursor e outros)
  CLAUDE.md            uma linha: "Leia AGENTS.md."
  AGENCIA.md           quem é a agência
  .gitignore           .env
  clientes/
    <cliente>/         nome curto, minúsculo, com hífen (ex.: clinica-sorriso)
      CLIENTE.md
      MEMORIA.md
      snapshots/       AAAA-MM-DD_HHMM_<assunto>.json (sem chaves)
      .env             ZATTEN_API_KEY=...    (API do dia a dia, se for usar)
                       LANGSMITH_API_KEY=... (traces do agente, se o LangSmith estiver ligado)
```

## AGENTS.md

```markdown
# Regras desta agência para o assistente

- Este diretório guarda os clientes da agência que operam na Zatten. Use a skill `zatten-os`.
- Um cliente por vez. Outro cliente só como leitura, citado.
- Plano e "sim" antes de qualquer alteração (MCP, API ou navegador).
- Nunca mostre nem grave chaves. Snapshots sem chaves ("<removido>"). Chave só no `.env` da pasta do cliente.
- Testar o agente executa as tools dele: "sim" antes de entrar em modo de teste. Publicar é sempre de uma pessoa.
- Pelo navegador: nunca apague nada nem mexa na conexão do WhatsApp.
- Contexto da agência: AGENCIA.md. Contexto de cada cliente: clientes/<cliente>/.
```

## AGENCIA.md

```markdown
# <Nome da agência>

- Site: <url>
- Nicho(s) que atende: …
- Canal de vendas: …
- Quanto cobra por projeto (faixa): …
- Como trata os clientes (tom, prazos, o que entrega todo mês): …
- Observações: …
```

## CLIENTE.md

```markdown
# <Nome do cliente>

- project_id: <uuid>
- Nome exato do projeto na Zatten: <como aparece em list_projects>
- Nicho: …
- Objetivo do atendimento: …
- Público e tom: …
- Regras do cliente (o que nunca fazer, horários, preços que pode citar): …
- Conexão do WhatsApp: oficial | coexistência | não oficial
- Organização (pasta do painel): …
- Motor do agente: LangChain Agent | motor antigo (migrar)
```

## MEMORIA.md

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
`### AAAA-MM-DD HH:MM — mudança externa`, com o que mudou.
