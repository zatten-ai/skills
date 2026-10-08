# NOTICE

O zatten-grill é uma adaptação do grill-with-ui de Jason Ku (https://github.com/jasonku09/grill-with-ui), licença MIT (ver LICENSE).

Mudanças: interface em português, marca da Zatten, pasta de sessões própria.

Mudanças de segurança desta cópia: o servidor só aceita os Hosts `127.0.0.1:<porta>` e `localhost:<porta>` (contra DNS rebinding); toda rota além da página exige uma chave aleatória por servidor, que vai na URL da página (`?k=`) e em `server.json` (permissão 600); a página escapa o número da rodada. Testes em `test/` (`node --test test/`).
