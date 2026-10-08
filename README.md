# Zatten-OS

A skill para operar a [Zatten](https://zatten.com) — a plataforma de
atendimento por WhatsApp com IA — de dentro do seu assistente (Claude Code,
Codex, Cursor e outros).

Com as skills e o MCP da Zatten, o assistente cria projetos, configura funil,
tags, propriedades, automações e fluxos, monta e testa o agente de IA, investiga
conversas e diagnostica clientes — e ajuda a vender: demo, proposta, viabilidade,
o SDR da própria agência e o relatório mensal. Sempre com um plano e o seu "sim"
antes de alterar qualquer coisa. O conhecimento de produto vem de
[docs.zatten.com](https://docs.zatten.com), que a skill consulta a cada tarefa.

## Instalar

**Claude Code**

```
claude plugin marketplace add zatten-ai/zatten-os
claude plugin install zatten-os@zatten-os
```

**Outros agentes** (Codex, Cursor, Gemini CLI…)

```
npx skills add zatten-ai/zatten-os --skill '*' -g
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
| [`zatten-ops`](skills/zatten-ops/SKILL.md) | Operar: criar, configurar, testar e diagnosticar projetos; o setup da primeira vez |
| [`zatten-comercial`](skills/zatten-comercial/SKILL.md) | Vender: diagnóstico do cliente, demo, proposta e viabilidade |
| [`zatten-agencia`](skills/zatten-agencia/SKILL.md) | O negócio da agência: diagnóstico, SDR da agência, rotina e relatório mensal |
| [`zatten-grill`](skills/zatten-grill/SKILL.md) | Decisões grandes em rodadas de perguntas, numa página com a marca da Zatten |

## O que estas skills nunca fazem

Por desenho, e não por esquecimento:

- **Apagar** qualquer coisa — o que sai do template volta como "órfão", intacto
- **Publicar** a versão do agente de IA (ela testa a versão nova, mas quem
  publica é você)
- **Enviar** template do WhatsApp para revisão da Meta

Os três são decisão de uma pessoa, no painel.
