# Credit Pricing BO BFF

Aplicação para realizar o proxy entre a aplicação de [front-end](https://gitlab.sicredi.net/precificacao/credit-pricing-bo-web) com o [back-end](https://gitlab.sicredi.net/precificacao/credit-pricing-bo-web). São feitos tratamentos necessárias para essas duas camadas conversarem.


## Comandos
- `npm run dev` Sobe a aplicação local e fica atualizando a mesma conforme percebe alterações nos arquivos.
- `npm run lint` Analisa padrões de escrita do código.
- `npm run test` Roda os testes. É gerado o coverage (interface de cobertura) através desse comando também.
- `npm run build` Gera o bundle da aplicação. Realiza conversões para javascript puro.
- `npm run start` Roda a aplicação em produção. Realiza o build da aplicação e roda em node.
- `npm run setup` Realiza a configuração inicial da aplicação. Limpa a aplicação configura tudo novamente.
- `npm run review` Faz a analise dos padrões de código e gera o bundle.
- `npm run clean` Remove dependências e builds.
