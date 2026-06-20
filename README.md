# Explotools — Central de Ferramentas

Portal agregador das automações internas da Explotools. Cada card abre uma ferramenta;
o status ao lado mostra se o backend daquela ferramenta está ativo.

🔗 **No ar:** https://ramon-explotools.github.io/explotools-ferramentas/

## Ferramentas

| Ferramenta | Pasta | Backend |
|-----------|-------|---------|
| Cotação de Frete | `ferramentas/fretes/` | `explotools-frete-api` (Render) |
| Ordem de Coleta | `ferramentas/estoque/` | `explotools-coleta-api` (Render) |
| Agenda | link externo | — (`explotools-agenda`) |

## Como adicionar uma nova ferramenta

1. Coloque os arquivos do frontend em `ferramentas/<nome>/`.
2. Adicione um objeto no array `FERRAMENTAS` dentro do `index.html`
   (nome, ícone, descrição, `url` e, se houver, `health` da API).
3. `git add . && git commit && git push` — o GitHub Pages republica sozinho.

## Notas

- Site estático servido pelo **GitHub Pages** (branch `main`, raiz). O `.nojekyll`
  impede o processamento Jekyll para que todas as pastas sejam servidas como estão.
- Os backends ficam no **Render free tier**, que hiberna após 15 min de inatividade —
  o primeiro acesso pode levar ~30s para o servidor acordar.
- A lista de clientes do Cotador de Frete é carregada da API (`/clientes`), e **não**
  fica embutida no HTML público, para não expor a carteira de clientes.
