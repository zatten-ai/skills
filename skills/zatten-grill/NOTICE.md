# NOTICE

O zatten-grill é uma adaptação do grill-with-ui de Jason Ku (https://github.com/jasonku09/grill-with-ui), licença MIT (ver LICENSE).

Mudanças: interface em português, marca da Zatten, pasta de sessões própria.

Mudanças de segurança desta cópia: o servidor só aceita os Hosts `127.0.0.1:<porta>` e `localhost:<porta>` (contra DNS rebinding); toda rota além da página exige uma chave aleatória por servidor, que vai na URL da página (`?k=`) e em `server.json`, que nasce com permissão 600 (a linha `ready`, que vai para logs, sai sem a chave; a URL completa vem do comando `url`); a comparação da chave é por bytes e não derruba o servidor; o corpo dos envios tem teto de 1 MB; um erro inesperado responde 500 em vez de encerrar o processo; as pastas de sessão são criadas com permissão 700; a página escapa o número da rodada. Testes: `node --test test/server.test.mjs test/security.test.mjs`.
