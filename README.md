# Grupo Logger

Site institucional em HTML, CSS e TypeScript, com Vite.

## Desenvolvimento

Com Node.js 24 instalado:

```sh
npm ci
npm run dev
```

## Publicação na Netlify

Importe este repositório e selecione a branch `main`. O arquivo `netlify.toml`
configura o comando `npm run build` e a pasta de publicação `dist`.

O código JavaScript do site é gerado a partir de `script.ts` pelo Vite.
O arquivo `script.js` da raiz é uma versão anterior e não é carregado pelo site.

## Formulário

O formulário ainda simula o envio: não salva nem encaminha mensagens.
É necessário integrar o recebimento antes de disponibilizá-lo para contatos reais.
