# Skills da Zatten

Skills de agente para trabalhar com a [Zatten](https://zatten.com) — a
plataforma de atendimento por WhatsApp com IA.

Um projeto da Zatten inteiro (funil, tags, propriedades, automações, fluxos e o
agente de IA) cabe num JSON. Estas skills ensinam o seu assistente a ler e
alterar esse JSON com segurança.

## Instalar

**Claude Code**

```
claude plugin marketplace add feliperaitano123/skills
claude plugin install zatten@zatten
```

**Outros agentes** (Codex, Cursor, Gemini CLI…)

```
npx skills add feliperaitano123/skills --skill zatten
```

Use apenas um dos métodos.

## Conectar

A skill sozinha não acessa nada: ela precisa do servidor MCP da Zatten
conectado, que é quem carrega as suas credenciais.

No painel da Zatten, vá em **Configurações → Conectar ferramentas de IA**, crie
uma conexão e cole o prompt de instalação no seu assistente. Ele configura tudo
e confirma listando os seus projetos.

## Skills

| Skill | O que faz |
|---|---|
| [`zatten`](skills/zatten/SKILL.md) | Configurar um projeto: funil, tags, propriedades, automações, fluxos e o agente de IA |

## O que estas skills nunca fazem

Por desenho, e não por esquecimento:

- **Apagar** qualquer coisa — o que sai do template volta como "órfão", intacto
- **Publicar** a versão do agente de IA
- **Enviar** template do WhatsApp para revisão da Meta

Os três são decisão de uma pessoa, no painel.
