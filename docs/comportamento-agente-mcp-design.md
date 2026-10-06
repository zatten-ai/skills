# Skill da Zatten: um dev sênior para agências — design

A skill pública da Zatten deixa de ser um manual técnico do MCP e passa a ser um
"dev sênior da Zatten" que a agência carrega no Claude Code, no Codex ou em
qualquer harness. A skill é **enxuta e estável**: diz o que é a Zatten, o que é o
MCP, quais regras protegem o cliente final, como o agente trabalha e onde está o
resto. **O resto mora na doc** (docs.zatten.com, Mintlify), que vira o cérebro:
produto, engenharia de IA, playbooks e API, escrita principalmente para IA. O
agente trabalha num **diretório da agência**, com uma pasta por cliente final
(contexto, memória datada e snapshots do projeto), mostra um plano e pede "sim"
antes de toda escrita, faz um diagnóstico na primeira vez que abre um cliente, e
nos pedidos complexos conduz rodadas de perguntas (o "grill" da Zatten).

Este documento saiu de uma sessão de perguntas e respostas (21 decisões). Ele é
autossuficiente: quem não esteve na sessão deve conseguir construir a partir dele.

---

## Termos

| Termo | Definição | Evitar |
|---|---|---|
| **agência** | O cliente da Zatten: quem usa a skill e tem vários projetos, um por cliente dela. | cliente, usuário |
| **cliente final** | O cliente da agência (a clínica, a imobiliária). Cada um é um projeto na Zatten. | cliente |
| **agente do cliente** | O assistente de IA (Claude Code, Codex, Cursor…) que a agência usa com a skill e o MCP. | agente da Zatten, bot |
| **atendente** | O agente de IA do projeto, que conversa com leads no WhatsApp; é o que o agente do cliente configura. | agente, bot |
| **doc** | A documentação da Zatten na Mintlify (docs.zatten.com), escrita principalmente para IA; a fonte da verdade sobre produto, API e estratégia. | skill, manual |
| **pasta do cliente** | `clientes/<cliente>/`: contexto, objetivos, memória e snapshots de um cliente final. | projeto |
| **AGENCIA.md** | O documento da agência (site, nicho, canal de vendas, preço que cobra, como trata os clientes), lido em toda sessão e compartilhado por todos os clientes. | perfil, contexto global |
| **escrita** | Uma chamada a `update_template` (ou uma ação de escrita na API do dia a dia). | salvar, publicar |
| **plano** | O resumo, antes de uma escrita, do que vai mudar e em qual cliente. | diff, preview |
| **diagnóstico** | A leitura completa de um projeto na primeira vez que o agente abre um cliente, comparada com as boas práticas da doc. Devolve uma lista priorizada e preenche o CLIENTE.md. | auditoria, análise |
| **mudança externa** | Alteração feita no projeto fora do agente (pelo painel, por outra pessoa), percebida pela `revision` diferente da última conhecida. | conflito |

---

## Por quê

Nas palavras do dono da Zatten:

> O nosso público-alvo são agências, donos de agências que querem vender solução
> de autoatendimento para os clientes deles. […] Cada um entra, abre um novo
> projeto, que é um cliente dele, cria o agente e as automações, e distribui para
> o cliente dele via white label. […] O objetivo é entregar uma ferramenta, a
> skill junto com o MCP, para que ele possa gerenciar toda a operação dele dentro
> do Codex, do Claude Code, de qualquer harness de IA. É como se eu tivesse
> transformado a Zatten num CRM AI First. […] É como se eu estivesse entregando
> um grande desenvolvedor sênior da Zatten para ele.

> Em vez de ficar criando uma skill muito complexa, atualizando e pedindo para o
> meu cliente atualizar, quero uma skill simples, que acessa a nossa
> documentação para ter a fonte da verdade.

A skill atual (v1) funciona, mas é um manual técnico do MCP: ensina blocos do
template, campos e armadilhas, e quase nada sobre como o agente se comporta com a
agência. Ela também precisa ser atualizada no computador de cada agência a cada
mudança no produto, e a atualização não é automática.

---

## Decisões travadas

### D1. A skill lê a doc pelo MCP da doc, com fetch como alternativa (Q1)

**Decisão:** o plugin declara o servidor MCP da doc (`https://docs.zatten.com/mcp`,
público, sem login; ferramentas de busca e leitura de páginas). Quem não tem esse
MCP (instalou por `npx skills`, ou o harness não suporta) lê pelo
`https://docs.zatten.com/llms.txt` (índice) e pelas páginas em Markdown
(acrescentar `.md` à URL).

**Rejeitadas:**
- *Só llms.txt + `.md` por fetch:* funciona em todo lugar, mas perde a busca por
  significado e a leitura de várias páginas por chamada, que importam numa doc
  grande.
- *Só o MCP da doc:* deixaria de fora quem instala por `npx skills` ou usa harness
  sem MCP.

**Custo aceito:** dois caminhos descritos na skill; o nome das ferramentas do MCP
da doc é específico do site.

### D2. A skill carrega só o núcleo estável; todo o resto fica na doc (Q2)

**Decisão:** dentro da skill ficam o papel dela, o que é a Zatten, o que é o MCP,
as regras que protegem o cliente final (não misturar clientes, consentimento,
nunca publicar sem uma pessoa decidir, nunca apagar pelo navegador), o fluxo de
trabalho e o **mapa da doc** (as portas de entrada da Q13). Tudo que muda com o
produto vai para a doc.

**Por quê:** conteúdo buscado na rede pode estar fora do ar, desatualizado ou
adulterado (a Anthropic alerta para isso em skills que buscam URLs). As regras
que protegem o cliente final mudam pouco e não podem depender disso. A skill no
computador da agência também não se atualiza sozinha, então o que está nela é o
que não se corrige depressa.

**Rejeitadas:**
- *Só o papel e o endereço da doc, com as regras também na doc:* uma página fora
  do ar ou alterada desligaria as proteções.
- *Núcleo + cópia offline resumida da doc em `references/`:* a cópia envelhece no
  computador da agência e vira uma segunda fonte da verdade.

### D3. Um diretório da agência, com uma pasta por cliente final (Q3)

**Decisão:** a agência trabalha num diretório só, com `clientes/<cliente>/` para
cada cliente final. O agente trabalha com **um cliente ativo por vez**, declarado
no início. Outro cliente só entra como leitura, e citado explicitamente ("usando
o follow-up da Clínica A como referência").

**Rejeitadas:**
- *Um diretório por cliente:* separa melhor, mas exige que a agência saiba gerenciar
  vários projetos e perde o "faz para a Clínica B o mesmo que fiz para a Clínica A".
- *Sem pastas, contexto só na Zatten:* não guarda memória nem objetivos.

**Risco controlado por regra:** misturar clientes. O MCP já trava id + nome do
projeto; a pasta do cliente guarda o `project_id`, então o agente não adivinha.

### D4. A doc continua num repositório próprio, com rotina de atualização (Q4)

**Decisão:** a doc fica onde está (repositório separado, ligado à Mintlify). A
atualização vem de uma rotina a criar (agente da Mintlify guiado por
`.mintlify/AGENTS.md`, ou rotina própria, diária/semanal).

**Rejeitadas:**
- *Doc numa pasta do repositório do app, atualizada no mesmo PR:* era a
  recomendação (elimina a deriva). Preferiu-se manter separado.
- *Rascunhar neste repositório de skills:* criaria uma terceira cópia.

**Risco aceito:** deriva entre o código e a doc, entre uma execução da rotina e
outra. Já aconteceu: o `/skill.md` gerado pela Mintlify cita `GET /kanban/columns`,
que não existe (o certo é `GET /kanban`).

### D5. A pasta do cliente tem CLIENTE.md, MEMORIA.md e snapshots/ (Q5, Q7, Q10)

**Decisão:**

```
clientes/<cliente>/
  CLIENTE.md      project_id, nome exato do projeto, nicho, objetivos, regras do cliente
  MEMORIA.md      ## Vigente   (o que vale hoje; reescrito quando muda;
                                inclui a última revision conhecida)
                  ## Histórico (só acrescenta; uma entrada datada por evento)
  snapshots/      AAAA-MM-DD_HHMM_<assunto>.json — o template lido DEPOIS de cada escrita
  .env            chave da API do dia a dia (ver D10); nunca versionado
                  (snapshots/ sem credenciais: chaves trocadas por "<removido>")
```

**Cada entrada do Histórico** traz: data, o pedido, o que mudou, o que não foi
feito e por quê, o que ficou para fazer no painel, e o nome do snapshot.

**Detecção de mudança externa (pedido explícito na Q7):** ao abrir um cliente, o
agente chama `get_template` e compara a `revision` com a última registrada no
Vigente.
- Igual: nada mudou.
- Diferente: diff contra o último snapshot. Registra "mudança externa" no
  Histórico, atualiza o Vigente e grava um snapshot novo.

**Por que o snapshot é DEPOIS e não antes:** para dizer "alguém mexeu no painel"
com precisão, o agente precisa do último estado que ele conhece, que é o de depois
da própria escrita. O "antes" da escrita seguinte é o "depois" da anterior, então
basta um snapshot por escrita. Como a resposta de `update_template` não traz a
`revision` nova, a releitura também é o que fornece essa revision.

**Por que comparar com o snapshot, e não com o Vigente:** o Vigente é texto
escrito pelo agente, não o JSON, e não dá para comparar programaticamente.

**Rejeitadas:**
- *Só CLIENTE.md, com tudo junto:* o agente reescreveria o contexto ao anotar uma
  decisão.
- *Sem snapshots:* a Zatten versiona só o agente LangChain, não colunas, tags e
  automações. Sem snapshot não há desfazer.
- *Snapshot antes e depois:* redundante.
- *Comparar com o snapshot de antes:* obriga o agente a separar o que ele mesmo
  mudou do que outra pessoa mudou, e ele erraria.
- *Só registrar a revision, sem diff:* a agência saberia que mudou, mas não o quê.

**Custo aceito:** uma leitura a mais por escrita (centenas de KB); dados do
negócio do cliente final no disco da agência.

**Credenciais (decidido em 06/10/2026, revisto no mesmo dia):** o `get_template`
devolve URLs, headers e chaves preenchidos, e fica assim (sem a credencial a
agência não sabe qual chave está configurada). Mas a chave nunca vai para o disco:
o snapshot é gravado com todo `api_key`, os valores de `headers` e os
`query_params`/`body_params` trocados por `"<removido>"`; endereços ficam. Ao
desfazer por snapshot, os campos com o marcador são omitidos (mandar o marcador
grava o marcador; `""` numa chave de IA apaga a chave). O `.env` fica no
`.gitignore`. Nunca mostrar uma chave na conversa; no diff, só dizer que mudou.

### D6. No navegador, tudo com um "sim" por ação, menos apagar e mexer na conexão do WhatsApp (Q6)

**Decisão:** com navegador (Claude in Chrome e similares), o agente pode fazer o
que o MCP bloqueia: publicar a versão do agente, migrar para o LangChain Agent,
enviar template à Meta, gerenciar membros de departamento e campanhas. Para cada
ação ele mostra o que vai clicar, **confere o nome do projeto na tela** e espera
um "sim". Para **apagar** qualquer coisa ou **mexer na conexão do WhatsApp**, o
agente só guia a pessoa, passo a passo.

**Por que conferir na tela:** o projeto aberto no painel **não aparece na URL**
(fica no localStorage do navegador). Só a tela diz em qual cliente o agente está.

**Rotas do painel:**
- `/project`: publicar e migrar
- `/project/templates`: templates da Meta
- `/crm/departments`: membros de departamento
- `/crm/campaigns`: campanhas
- `/meta`: conexão do WhatsApp

**Rejeitadas:**
- *Qualquer coisa, inclusive apagar:* irreversível e com URL que não identifica o
  cliente.
- *Nada pelo navegador:* desperdiça exatamente o que trava a agência hoje.

### D7. Antes de toda escrita pelo MCP, plano e "sim" (Q8)

**Decisão:** sempre. O plano diz o cliente, o que muda e o que liga ou desliga.
Várias mudanças pedidas juntas viram **um plano só**. Um "pode aplicar sem
perguntar" vale só para aquele pedido. A mesma regra vale no navegador (D6) e na
escrita da API do dia a dia (D10).

**Rejeitadas:**
- *Só em ação de risco:* depende de o modelo classificar o risco, e é aí que ele
  erra. Uma lista de tags com um item a menos parece inofensiva e vira órfãos.
- *Nunca pedir:* não há desfazer automático.

### D8. Diagnóstico na primeira vez; até 3 sugestões por pedido; grill para pedidos complexos (Q9)

**Decisão:**

1. **Diagnóstico.** Na primeira vez que o agente abre um cliente (não existe
   `clientes/<cliente>/`), ele:
   - lê o projeto;
   - lê na doc as boas práticas do que o projeto usa;
   - devolve uma lista priorizada **sem aplicar nada**;
   - preenche o CLIENTE.md e pergunta o que não dá para inferir.

   Exemplos de achados:
   - "ainda no motor antigo; migrar para o LangChain Agent";
   - "LangSmith desligado";
   - "follow-up sem template do WhatsApp não envia nada";
   - "propriedade Convênio é texto livre; deveria ser lista";
   - "buffer curto: três mensagens seguidas recebem três respostas".
2. **No dia a dia,** o agente faz o pedido e, ao final, lista até 3
   recomendações da doc com o porquê, sem aplicar.
3. **Pedidos complexos ou diagnóstico:** o agente pergunta "quer que eu crie um
   artefato para discutirmos, ou vamos direto ao ponto?". Se a resposta for o
   artefato, conduz rodadas de perguntas no estilo deste documento (ver D9). As
   respostas viram o documento do cliente e o plano de mudanças.

   Mudanças pontuais vão direto, sem rodadas.

**Rejeitadas:**
- *Aplicar melhorias junto e avisar:* mistura mudança pedida com não pedida e
  torna o "sim" menos informado.
- *Só o pedido:* desperdiça o "dev sênior".

### D9. O grill da Zatten: página onde o harness suporta, rodadas no chat onde não (Q11)

**Decisão:** uma segunda skill no mesmo plugin (`zatten-grill`), fork do
grill-with-ui com a marca da Zatten e em português. Quando o harness não suporta a
página, o mesmo método roda no chat:
- rodadas de perguntas;
- recomendação com o porquê;
- documento do cliente no fim, em `clientes/<cliente>/`.

**Licença:** o grill-with-ui é MIT (copyright de Jason Ku). O fork pode ser feito,
mas tem de manter o aviso de copyright e de licença.

**Restrição técnica:** o grill-with-ui depende de Node e de uma página local, e
escuta os envios pelo Monitor do Claude Code. No Codex e no Cursor roda em "modo
de espera", que é mais frágil. Nesta sessão, o monitor expirou a cada 30 minutos.

**Rejeitadas:**
- *Só a página:* deixa de fora harnesses sem Node ou sem Monitor.
- *Só no chat:* perde a experiência que a Zatten quer mostrar.

**Custo aceito:** dois caminhos e um fork a manter.

### D10. API do dia a dia: leitura livre, escrita com "sim", nada de mensagem em lote (Q14, Q17)

**Decisão:** o agente usa a API pública do zatten-server
(`api.zatten.com/api/v1`, header `x-api-key`, chave por projeto). Ela serve para o
dia a dia:
- ler o lead, o histórico e o kanban, e fazer análises;
- ligar ou desligar a IA de um lead;
- disparar automação.

Regras:
- **Leitura:** livre.
- **Escrita num lead:** o "sim" da D7, mostrando **o lead e o conteúdo exatos**.
- **Ação em vários leads:** o "sim" vem com a lista e a contagem.
- **Mensagem para vários leads:** nunca pela API. Isso é campanha, e campanha tem
  tela própria, com template aprovado e relatório. Mandar em loop pela API pode
  derrubar a nota de qualidade do número.
- **Chave:** no `.env` da pasta do cliente, nunca versionado (`.gitignore` na raiz).
- **Detalhes dos endpoints:** na doc (D2), não na skill.

**Rejeitadas:**
- *Leitura e escrita sem regra extra:* trata campanha como se fosse uma mensagem.
- *Só leitura:* a agência pediu escrita (desligar a IA, disparar automação).
- *Fora da primeira versão.*

**Pré-requisito:** corrigir antes um problema de autenticação no zatten-server.
Foi identificado na sessão e está registrado fora deste repositório, por ser
público.

### D11. A doc se organiza por intenção, em 6 portas (Q13)

**Decisão:** é a árvore abaixo. É o "grande cérebro" e precisa ser **completa e
100% baseada no que o app e o site têm**.

1. **Começar.** O que é a Zatten. Agência, cliente final, projeto, white-label.
   Como tratar um cliente. Planos e custos: link para `zatten.com/planos`, custo de
   tokens por provider (BYOK) e custo de mensagem da Meta com link oficial.
   Conexões do WhatsApp: oficial, coexistência, não oficial.
2. **Trabalhar com IA.** A skill, o MCP, as regras, como o agente deve agir, a API
   para agentes.
3. **Produto.** Uma página por recurso: funil, tags, propriedades, follow-up e
   reengajamento, webhooks, webhooks de integração, ações personalizadas, fluxos
   (Trigger Flow), departamentos, mensagens rápidas, campanhas, templates da Meta,
   white-label, métricas. Cada página segue a mesma estrutura:
   - **O que é**
   - **Como configurar no painel**
   - **Como configurar pelo MCP**
   - **Armadilhas**

   As armadilhas que hoje estão na skill v1 migram para essas páginas.
4. **Engenharia de IA.**
   - LangChain Agent x motor antigo, e como migrar (a Zatten quer a maioria no
     LangChain Agent);
   - providers (o que é OpenAI, o que é OpenRouter) e modelos;
   - como fazer um bom prompt;
   - tools (o que são, as nativas da Zatten, HTTP, MCP, Composio) e skills;
   - pausa humana;
   - buffer (espera para agregar mensagens);
   - LangSmith e observabilidade (o que é, como ligar, como usar a API dele).
5. **Playbooks.** Por nicho (clínicas, imobiliárias, advocacia, academias, cursos,
   SAC: há modelos prontos no app) e por objetivo (agendar, qualificar,
   reengajar).
6. **API.** A referência atual, reorganizada.

**Recursos da Mintlify a usar:**
- `description` em toda página (alimenta o `llms.txt`, e hoje nenhuma página tem);
- `markdown.instructions` no `docs.json`;
- `<Visibility for="agents">` para detalhes só para máquina;
- títulos em forma de pergunta;
- um termo por conceito;
- números e exemplos concretos.

**O `/skill.md` gerado pela Mintlify** deve ser sobrescrito (via
`.mintlify/skills/`) para não competir com a skill oficial.

**Rejeitadas:**
- *Manter as abas atuais e acrescentar duas:* o mapa da skill ficaria apontando
  para dezenas de páginas soltas.
- *Duas docs, uma para humanos e outra para IA:* dobra a manutenção; a Mintlify
  resolve na mesma página.

### D12. A doc é escrita na ordem em que a skill precisa (Q16)

**Decisão:** Trabalhar com IA + Começar → Produto → Engenharia de IA → Playbooks
→ API reorganizada. Cada porta publicada já melhora o agente da agência. Preços
entram como link para a fonte (site, Meta), nunca copiados, porque mudam.

**Rejeitadas:**
- *Reescrita completa antes de publicar:* atrasa tudo e impede testar a skill
  contra a doc real.
- *Valor primeiro (Engenharia de IA e Playbooks):* sem o chão, o agente recomenda
  bem e configura mal.

**Custo aceito:** um período com a doc metade nova, metade velha.

### D13. O plugin declara só o MCP da doc; o da Zatten vem do prompt do painel (Q19)

**Decisão:** o MCP da doc não tem segredo e pode ir escrito no plugin, que o sobe
sozinho. O MCP da Zatten exige o token da agência, e o repositório é público.
Por isso ele continua vindo do prompt de instalação do painel (**Configurações →
Conectar ferramentas de IA**), que já entrega o token da conta certa.

**Rejeitadas:**
- *Os dois no plugin, com o token numa variável de ambiente:* é o passo técnico
  que a agência erra, e a variável não diz qual conta está conectada.
- *Nenhum no plugin.*

**Custo aceito:** quem instala só o plugin ainda precisa colar o prompt do painel.

---

## Escolhas de rotina

- **Relatório depois de uma escrita (Q12):**
  - sempre na mesma ordem: **Feito / Não feito (e por quê) / Ficou de fora sem ser
    apagado / Para você fazer no painel**;
  - termos do painel, não do JSON (por exemplo, "ficou de fora sem ser apagado" em
    vez de "orphans");
  - a mesma entrada vai para o Histórico da MEMORIA.md.
- **Primeiro uso do diretório da agência (Q15):** a skill monta a estrutura
  completa com um **mini onboarding**:
  - uma apresentação curta da Zatten;
  - onde ver preços;
  - o que dá para fazer com a skill e como ela ajuda.

  Ela cria:
  - `AGENTS.md`, com as regras fixas, e `CLAUDE.md` apontando para ele (o Claude
    Code lê `CLAUDE.md`; o Codex e o Cursor leem `AGENTS.md`);
  - `AGENCIA.md`;
  - `clientes/`;
  - `.gitignore` (`.env`, chaves).

  E sugere `git init`, sem depender dele.
- **AGENCIA.md (Q15, Q18):** fica na raiz do diretório da agência. Traz o site da
  agência (o agente pode ler o site para completar), o nicho, o canal de vendas,
  por quanto vende e como trata os clientes. É lido em toda sessão. Se um dia a
  agência tiver mais de um diretório, vai para `~/.zatten/`.
- **Versão da skill (Q20):**
  - a skill tem um número de versão, e uma página da doc diz a versão atual; se a
    da skill for menor, o agente avisa e mostra o comando para atualizar;
  - o onboarding pede para ligar o auto-update do marketplace no Claude Code. Ele
    vem desligado para marketplaces de terceiros; `claude plugin update
    zatten@zatten` atualiza à mão.
- **Idioma (Q21):** a skill e a doc em português; o agente responde no idioma da
  agência.

---

## Fatos verificados

Estabelecidos explorando, não perguntando:

**A doc hoje (docs.zatten.com):**
- Já serve:
  - `/llms.txt`, com 54 páginas e o spec da API;
  - `/llms-full.txt` (~95 KB);
  - as páginas em `.md`;
  - `/skill.md` (gerado pela Mintlify, com erros);
  - `/.well-known/agent-skills/index.json`;
  - um MCP público em `/mcp`, sem login, com as ferramentas
    `search_docs_zatten` e `query_docs_filesystem_docs_zatten`.
- O menu contextual está ligado.
- Nenhuma página tem `description`; o `docs.json` não tem `description` nem
  `markdown.instructions`.
- O fonte da doc não está em nenhum repositório local.

**Recursos da Mintlify para IA:**
- `llms.txt` e `llms-full.txt`;
- exportação em Markdown (`.md` ou `Accept: text/markdown`);
- `<Visibility for="agents">`;
- MCP em `/mcp`;
- `skill.md`, que pode ser sobrescrito em `.mintlify/skills/<nome>/SKILL.md`;
- agente que abre PRs seguindo `.mintlify/AGENTS.md` (ignora `CLAUDE.md`);
- automações por agenda, push ou merge (planos pagos).

**Skills e plugins:**
- **Spec aberta (agentskills.io):** `name` e `description` obrigatórios;
  `compatibility` serve para declarar que a skill precisa de rede; o corpo
  recomendado fica abaixo de 500 linhas e cerca de 5000 tokens; referências a um
  nível de profundidade.
- **Codex:** recomenda pôr os gatilhos no início da `description`.
- **Plugin do Claude Code:** declara MCPs (`.mcp.json` ou `mcpServers`), que sobem
  ao ativar.
- **Auto-update:** vem desligado para marketplaces de terceiros.
- **`npx skills`:** sempre manual (`npx skills update`).

**O MCP da Zatten:**
- quatro ferramentas: `list_projects`, `get_template`, `update_template` e
  `whoami`;
- `whoami` e `list_projects` devolvem `can_write`;
- a resposta de `update_template` não traz `revision` nova, de propósito;
- quando faltam templates da Meta, a nota do motor sugere
  `submit_meta_templates: true`, opção que o MCP não expõe (corrigir a nota ou
  avisar na doc);
- coluna, tag e departamento **renomeiam** pelo `slug` (a skill v1 diz que não);
- se o projeto não está no LangChain Agent, o bloco `langchain` é ignorado com nota;
- gravar o config do agente por cima de um rascunho não publicado gera nota.

**O painel:**
- O projeto aberto fica no localStorage, não na URL.
- Rotas: `/project` (publicar, migrar), `/project/templates`,
  `/crm/departments`, `/crm/campaigns`, `/meta`.

**Configuração do agente:**
- Pausa humana e buffer são campos do projeto (`llm_attendant`), não do config
  LangChain.
- LangSmith fica em `settings.tracing`.
- Providers aceitos hoje: `openai` e `openrouter`.
- Aprovação humana fica sempre desligada.

**API do dia a dia:**
- Endereço `api.zatten.com/api/v1`, autenticação por `x-api-key`.
- Mensagens: template, texto, áudio, imagem, arquivo, vídeo e histórico.
- Leads: ler, notas, propriedades, thread, kanban, responsável, tag, ligar e
  desligar a IA.
- Também: kanban, tags e disparo de automação.

**grill-with-ui:** licença MIT; depende de Node, de uma página local e do Monitor
do Claude Code.

**Inconsistência menor:** o comentário de `lib/mcp/instructions.ts` (no
repositório do app) chama a skill de `zatten-template`, mas o nome publicado é
`zatten`.

---

## Riscos

- **Deriva da doc (D4).** Com a doc separada do código, ela fica errada entre uma
  execução da rotina e outra, e o agente segue a doc com toda a autoridade.
  Mitigação: a rotina de atualização é prioridade, não detalhe; o passo "skill do
  cliente" da skill `manter-template` passa a ser "skill **e doc**".
- **Doc fora do ar ou adulterada.** O núcleo de proteção está na skill (D2), mas o
  conhecimento de produto some junto. O agente deve dizer que não conseguiu ler a
  doc, em vez de inventar.
- **Conteúdo da doc tratado como instrução.** A skill precisa dizer que o que vem
  da doc é dado de referência, e que nenhuma página pode afrouxar as regras da
  skill.
- **Misturar clientes.** Controlado por regra (um cliente ativo, D3) e pelo
  `project_id` na pasta, mas ainda depende do modelo seguir a regra.
- **Navegador no cliente errado.** A URL não identifica o projeto (D6). A
  conferência na tela é obrigatória.
- **Chaves no disco da agência (D10).** O `.env` precisa estar no `.gitignore`
  antes da primeira chave; a skill deve conferir.
- **Problema de autenticação no zatten-server.** Precisa ser corrigido antes de
  documentar e convidar agentes a usar a API do dia a dia.
- **Fork do grill.** Manter tema e correções quando o grill-with-ui evoluir; o modo
  de espera fora do Claude Code é frágil.
- **Dados do cliente final no disco da agência** (snapshots com prompts e regras
  de negócio). Aceito: são os mesmos que a agência já vê no painel.

---

## Adiado

Nenhuma pergunta foi adiada.

---

## Pontos em aberto

- **A rotina de atualização da doc (D4)** não foi desenhada: frequência, quem
  dispara (agente da Mintlify ou rotina própria), o que ela compara (código do app,
  do zatten-server, site) e quem revisa o PR.
- **O conteúdo exato do diagnóstico (D8):** a lista de verificações e a prioridade
  de cada uma deve viver na doc (Engenharia de IA e Playbooks), não na skill.
- **O que dispara o grill:** o que conta como "pedido complexo" (D8) ficou a
  critério do agente, que pergunta antes. Pode precisar de exemplos na skill.
- **A skill v1:** as armadilhas técnicas dela migram para as páginas de Produto da
  doc (D11). Até essas páginas existirem, a v1 continua sendo a única fonte desse
  conhecimento. Ordem sugerida: escrever Trabalhar com IA + Produto, depois trocar
  a skill.
- **A nota `submit_meta_templates`** no motor do app aponta para uma opção que o
  MCP não tem; decidir se a nota muda (no repositório do app) ou se a doc explica.
