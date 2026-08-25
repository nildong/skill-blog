# Smart Pet Gadgets — Blog

Conteúdo do blog [smartpetgadgets.com.br](https://smartpetgadgets.com.br), publicado via SFTP/SSH na Hostinger.

## Estrutura

- Cada post fica em uma pasta própria na raiz (`slug-do-post/index.html` + `slug-do-post/img/`)
- `autores/` — páginas de autor
- `briefs/` — briefs de conteúdo usados antes da escrita
- `calendars/` — calendários editoriais
- `cluster-*/` — clusters temáticos (pillar + artigos de suporte + relatórios de SEO/qualidade)
- `reports/` — auditorias de blog e SEO
- `.claude/skills/blog/` — skill de deploy (SFTP/SSH) usada para publicar no site

## Publicação

Publicação feita com a skill `/blog deploy`, que valida HTML/imagens/vídeos, gera `sitemap.xml` e envia os arquivos via SFTP/SSH.

Veja `.claude/skills/blog/SKILL.md` e `.claude/skills/blog/scripts/ssh-setup.md` para configuração de credenciais.
