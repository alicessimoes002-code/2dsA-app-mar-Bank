# MaréBank

Aplicação frontend local para gestão financeira pessoal.

## Prerequisitos

1. Clone o repositório.
2. Entre na pasta do projeto.
3. Instale as dependências: `npm install`.

## Executar localmente

```bash
npm run dev
```

Abra a URL local exibida pelo Vite para usar a aplicação.

## Persistência

Os dados da aplicação ficam salvos no `localStorage` do navegador, então não dependem de backend externo.

## Estrutura principal

- `src/pages`: telas da aplicação.
- `src/lib/local-data.js`: dados e autenticação locais.
- `src/api/localClient.js`: cliente local usado pela app.
