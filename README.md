# Explotools — Central de Ferramentas

Portal agregador das automações internas da Explotools. Cada card abre uma ferramenta que
vive e é publicada por conta própria; o status ao lado mostra se ela está ativa.

🔗 **No ar:** https://ramon-explotools.github.io/explotools-ferramentas/

📁 **Pasta canônica de edição (com `CLAUDE.md` completo sobre a plataforma):**
`Explotools\Claude\Central de Ferramentas\` — abra uma conversa do Claude Code lá para
editar o hub em si (o portal, não uma ferramenta específica).

## ⚠️ Princípio central: este repositório é SÓ um agregador

**Este repositório nunca contém código de nenhuma ferramenta — só o `index.html` do
portal, que tem uma lista de links.** Cada ferramenta mora na sua própria pasta em
`Explotools\Claude\<Nome>\`, com repositório e publicação (GitHub Pages / serviço local)
próprios.

Isso existe para que abrir uma conversa nova do Claude Code dentro da pasta de UMA
ferramenta permita editar só aquela ferramenta, e a mudança apareça automaticamente no hub
(porque o hub só linka, nunca copia) — sem risco de mexer numa coisa e quebrar outra.

**Se algum dia alguém colar arquivos de uma ferramenta dentro deste repositório de novo,
isso é um erro a corrigir** — mova o conteúdo para o repositório próprio da ferramenta e
deixe aqui só o link.

## Ferramentas (cards de projeto)

| Ferramenta | Onde mora (Drive) | Publicado em | Backend |
|-----------|-------|---------|---------|
| Cotação de Frete | `API Fretes\` | `explotools-frete-frontend` (Pages) | `explotools-frete-api` (Render) |
| Separação / Recebimento | `Estoque\micro_saas_ordem_coleta_codex\frontend\` | `explotools-coleta-frontend` (Pages) | `explotools-coleta-api` (Render) |
| Café com Sonda | `Podcast Quinzenl\` | serviço local (`127.0.0.1:8765`) | — |
| Acompanhamento de Fretes | `Acompanhamento de Fretes\` | `explotools-acompanhamento-fretes` (Pages) | Cloudflare KV |
| Controle de Tarefas | `Controle de Tarefas\` | `explotools-tarefas` (Pages) | Cloudflare KV |

## Ações rápidas (botões, não são cards de projeto)

| Ação | Onde mora (Drive) | Servido por |
|---|---|---|
| Cobranças vencidas | `Cobrancas em Atraso\` (`painel_cobrancas.py`) | serviço local do Café com Sonda (`127.0.0.1:8765/cobrancas`) |

Cada pasta acima tem seu próprio `CLAUDE.md` explicando como funciona, como publicar e
como se conecta a este hub.

## Como adicionar uma nova ferramenta

1. **Não** coloque os arquivos aqui. Crie (ou use) a pasta do projeto em
   `Explotools\Claude\<Nome>\`, publique de lá (repositório próprio + GitHub Pages, ou
   serviço local se for algo que roda no PC), e escreva um `CLAUDE.md` nessa pasta.
2. Volte aqui e adicione **só um objeto** no array `FERRAMENTAS` (ou `ACOES`, se for um
   botão de ação em vez de card de projeto) dentro do `index.html`, apontando `url` para
   onde a ferramenta foi publicada.
3. `git add . && git commit && git push` — o GitHub Pages deste hub republica sozinho.

## Notas

- Site estático servido pelo **GitHub Pages** (branch `main`, raiz). O `.nojekyll`
  impede o processamento Jekyll.
- Os backends em Render (free tier) hibernam após 15 min de inatividade — o primeiro
  acesso pode levar ~30s para o servidor acordar.
- Ferramentas hospedadas via GitHub Pages **precisam de repositório público** (Pages
  grátis não funciona em repo privado) — mas isso não significa expor segredos: dados
  sensíveis (ex. lista de clientes) ficam atrás de uma API própria, nunca no HTML público.
- **Nunca rode `git` dentro de uma pasta do Google Drive** (`G:\...`) — o Drive corrompe
  repositórios git. Cada ferramenta publicada via Pages tem um clone limpo em
  `C:\Users\ramon\Documents\<repo>\`; o fluxo de edição está documentado no `CLAUDE.md` de
  cada pasta-projeto.
