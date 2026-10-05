---
name: zatten
description: Use ao configurar um projeto da Zatten — criar ou alterar colunas do kanban, tags, propriedades personalizadas, follow-ups, webhooks, mensagens rápidas, ações, fluxos do Trigger Flow, departamentos ou o agente de IA. Também quando o pedido for do tipo "o cliente quer X no funil / no atendimento" e houver um projeto da Zatten envolvido.
---

# Configurar um projeto da Zatten

Um projeto da Zatten inteiro — funil, tags, propriedades, automações, fluxos e o
agente de IA — cabe num JSON. As ferramentas do MCP leem esse JSON e aplicam um
de volta.

Você precisa do servidor MCP da Zatten conectado. Se as ferramentas abaixo não
existirem, peça à pessoa para conectar em **Configurações → Conectar ferramentas
de IA**, no painel.

| Ferramenta | Para quê |
|---|---|
| `list_projects` | Descobrir os projetos e seus ids |
| `get_template` | Ler um projeto inteiro |
| `update_template` | Aplicar alterações |
| `whoami` | Ver em nome de qual conta você age |

## O ciclo

1. **`list_projects`** — sempre que a pessoa citar um projeto pelo nome. As
   outras ferramentas exigem o id **e** o nome exatos, e o servidor recusa se os
   dois não casarem. É a trava contra mexer no cliente errado; não tente
   adivinhar o id.
2. **`get_template`** — guarde a `revision` que vier.
3. Edite o que voltou.
4. **`update_template`** — com a `revision` da leitura e só os blocos que mudaram.
5. **Leia as `notes` da resposta.** É onde o servidor diz o que não fez e por quê.

A `revision` não é formalidade. Se alguém mexeu no projeto pelo painel entre a
sua leitura e a sua escrita, o servidor **recusa** em vez de sobrescrever. Quando
isso acontecer, leia de novo, refaça a edição sobre o estado novo e tente outra
vez — não force.

## Mande só o bloco que vai mexer

**Só os blocos presentes são considerados.** O que você não mandar não é tocado,
nem aparece como órfão.

Mexer só nas tags:

```json
{ "tags": [ … ] }
```

**Mas o bloco que você manda é declarado por inteiro.** Se enviar `tags` com uma
tag, as outras nove do projeto viram `orphans` — não somem, mas você declarou
uma lista de uma. Para acrescentar um item, pegue a lista que veio no
`get_template`, **acrescente**, e devolva a lista completa.

Prefira o envio parcial: o template inteiro são centenas de KB de ida e volta, e
cada bloco a mais é uma chance de alterar algo sem querer.

## A regra que governa tudo

**Cria o que falta, atualiza o que existe, NUNCA apaga.**

O que está no projeto e não está no template não é removido — volta em
`orphans[]`. Para apagar de verdade, é pelo painel.

A operação é idempotente: aplicar o mesmo template duas vezes não produz escrita
na segunda.

## Ler a resposta

```json
{
  "applied": { "created": 4, "updated": 2 },
  "changes": [{ "op": "create", "entity": "column", "key": "Agendado" }],
  "orphans": [{ "entity": "tag", "key": "urgente" }],
  "ambiguous": [{ "entity": "tag", "key": "follow-up", "count": 2 }],
  "notes": ["…"]
}
```

- `orphans` — existe no projeto, não no template. Intocado.
- `ambiguous` — duas linhas com o mesmo nome no projeto. **Nenhuma é tocada.**
  Não tente resolver sozinho: peça à pessoa para renomear uma delas no painel.
- `notes` — tudo que não foi feito. **Uma resposta de sucesso pode conter uma
  recusa.** Nunca dê a tarefa como pronta sem ler.

## Campo vazio significa "não trouxe", não "apague"

A leitura **esvazia de propósito** o que é infra ou credencial do cliente:

- `model.api_key` e a chave do LangSmith no config do agente
- `headers` de tools, MCPs e ações personalizadas
- `query_params` e `body_params` de ação personalizada
- `url` de webhooks, webhooks de integração e MCPs
- `webhook_url` de ação personalizada

A escrita **nunca grava esses campos vazios por cima**. É isso que torna seguro
o ciclo normal: ler, editar outra coisa, devolver — e a URL e os tokens que o
cliente configurou continuam lá.

**Mas preenchido MANDA.** Se você escrever uma `url`, ela é gravada — inclusive
por cima da que o cliente já tinha, sem pedir confirmação.

Então: **só preencha um endereço se a pessoa pediu para trocar aquele endereço,
e diga a ela que você vai trocar.** Um webhook aponta para o sistema do cliente;
trocá-lo por engano desvia os avisos dele, e nada na tela denuncia isso.

## Ligada ou desligada: PERGUNTE

Toda automação tem `status` (`ACTIVE`/`INACTIVE`):

- **campo ausente** = não mexe. O que está ligado continua ligado. É o padrão, e
  é o que fazer quando o assunto não veio à conversa.
- **campo presente** = manda.

Vale para follow-up, conversão, transferência por inatividade, webhook, webhook
de integração, MCP, fluxo e mensagem de fora do horário. Ação personalizada usa
`is_active`, booleano.

**Ao criar uma automação nova, pergunte se ela deve nascer ligada.** Se não
perguntar, omita o `status`: ela nasce desligada, que é o lado seguro.

Ligar faz a automação agir sobre conversa real — follow-up manda mensagem para
lead, transferência por inatividade joga a conversa para um humano. Nunca ligue
algo "para já ficar pronto".

**Ligar exige endereço.** Webhook, webhook de integração, MCP e ação
personalizada só aceitam `ACTIVE` se já houver uma URL. Sem ela o pedido é
recusado, com nota.

## As armadilhas

Estas não se deduzem do JSON. Errar aqui produz um projeto que parece
configurado e não funciona.

### Propriedade personalizada

`is_enum` e `values` **andam juntos**. Mandar `values` sem `is_enum: true` cria
opções que a tela ignora e que o agente não recebe.

```json
{ "name": "Avaliação", "slug": "avaliacao", "scope": "lead",
  "is_enum": true,
  "values": [{ "value": "Ótimo" }, { "value": "Ruim" }] }
```

Uma propriedade **já preenchida como texto livre não pode virar enum** — os
valores digitados ficariam fora da lista. A API recusa com a contagem de
contatos afetados. Não insista; crie outra propriedade.

`scope` é o vínculo: `"lead"` fica no contato para sempre, `"conversation"` some
quando a conversa encerra. Tags também têm.

Criar uma propriedade **não** dá ao agente uma ferramenta para preenchê-la. Ela
precisa ser acrescentada em `langchain.config.tools`.

### Mensagem rápida

Bloco é `{"type": "TEXT", "text": "..."}` — maiúsculo, e o campo é `text`.
Comando **sem barra** e em minúsculas: `"chegada"`, não `"/chegada"`.

### Follow-up e re-engajamento

Em `method: "RE_ENGAGEMENT"`, o `delay` são os **minutos antes de a janela
oficial do WhatsApp fechar**, não uma espera. `delay_unit` é sempre `MINUTES`.
Em `FOLLOW_UP` é uma espera normal.

O template do WhatsApp que o follow-up dispara vai em **`template_name`**, pelo
nome. Se o nome não existir no projeto, o follow-up entra **sem template** (e
não envia nada), com nota.

### Fluxos do Trigger Flow

As referências vão por **nome**, nunca por id:

```json
{ "id": "a1", "kind": "action", "type": "lead.move_column",
  "config": { "column_id": "Pós-consulta" } }
```

- `""` numa coluna ou tag significa "qualquer", e é preservado.
- Responsável não viaja — é uma pessoa.
- Fluxo cujo alvo não existe **não é criado**, e sai em `notes`.
- Fluxo que já existe **não tem o grafo reescrito**: o desenho é do canvas. Só o
  `status` muda por aqui.
- Não mande `execution_plan`; é derivado.

### Departamento

`should_send_name` diz se a mensagem leva o nome de quem atende. Os **membros
não viajam** — um departamento criado nasce vazio, e alguém precisa adicionar as
pessoas no painel.

### Ação personalizada

É uma chamada HTTP. `method` viaja normalmente; `webhook_url`, `headers`,
`query_params` e `body_params` seguem a regra do campo vazio acima. O `value` de
um parâmetro aceita `{{variáveis}}` do lead.

Uma ação criada nasce **pendente**: sem URL e desativada, até alguém configurar.

### O agente de IA

Mudar `langchain.config` **cria uma versão nova e NÃO publica**. Quem publica é
uma pessoa, no painel. **Diga isso a quem pediu** — senão a pessoa acha que já
está valendo.

A descrição editável de uma ferramenta da Zatten mora em **`_zatten.note`**, não
em `description` — essa é composta e é sobrescrita na primeira edição pelo
painel.

Aprovação humana (`human_approval`) fica sempre desligada: a tela para aprovar
ainda não existe, e ligar faria o agente travar esperando alguém.

## O que não dá para fazer por aqui

- **Apagar** qualquer coisa.
- **Renomear** coluna, tag ou departamento — sem chave estável, some um e nasce
  outro. Propriedade e skill, que têm `slug`, renomeiam normalmente.
- **Publicar** a versão do agente.
- **Enviar template do WhatsApp para a Meta.** Criar um template manda conteúdo
  para revisão humana sob a conta do cliente e conta para a nota de qualidade
  dele — é decisão de uma pessoa, no painel.
- Atualizar template do WhatsApp já criado; o estado dele é da Meta.
- Membros de departamento, campanhas, mini-apps, conexão do WhatsApp.
- `llm_attendant.functions`: viaja e é ignorada, porque carrega URL e alvo do
  projeto de origem.

Precisou de uma dessas: diga à pessoa o que fazer no painel, com o caminho.

## Como trabalhar

**Antes de editar**, leia e veja o que já existe. Reaproveite nomes existentes em
vez de criar parecidos — "Agendado" e "Agendados" viram duas colunas.

**Mude só o que o pedido pede.**

**Depois de aplicar**, leia as `notes` e confira. Se algo disser que não foi
feito, resolva ou explique — nunca dê como pronto.

**Ao terminar**, diga o que ficou para a pessoa fazer no painel: publicar a
versão do agente, preencher URL de webhook, ligar as automações.
