---
name: blog-deploy
description: Publica um post de blog (pasta com index.html + img/) no site smartpetgadgets.com.br hospedado na Hostinger, via SFTP/SSH. Roda validações (HTML, imagens, vídeos), gera sitemap.xml e envia os arquivos com um único comando. Use quando o usuário disser "publica o blog", "sobe pra Hostinger", "deploy do blog", "/blog deploy".
---

# Blog Deploy — Hostinger

Publica pastas de post (`index.html` + `img/`) no `public_html` do site na
Hostinger via SFTP/SSH, sem colocar senha ou chave no prompt/skill.

## Fluxo

```
Claude Code
    │
    │ executa
    ▼
scripts/deploy.sh <pasta-do-post>
    │
    ├── SFTP_HOST      (env / .env)
    ├── SFTP_USER      (env / .env)
    ├── SFTP_KEY_PATH  (env / .env)  ← preferencial
    └── SFTP_PORT      (env / .env)
    │
    ▼
Hostinger (public_html/<post>/)
```

O script faz, em ordem:

1. Verifica se `index.html` existe e tem `<title>`
2. Verifica se todas as imagens referenciadas no HTML existem na pasta local
3. Avisa (não bloqueia) se houver vídeos embutidos
4. Gera/atualiza `sitemap.xml` na raiz do blog, com todas as pastas publicadas
5. Conecta na Hostinger via SFTP/SSH e envia os arquivos (`rsync` sobre SSH)
6. Imprime a URL final publicada

## Uso

```bash
cd .claude/skills/blog/scripts
./deploy.sh comedouro-cachorro
```

Ou, de outro diretório:

```bash
.claude/skills/blog/scripts/deploy.sh comedouro-cachorro
```

Para publicar em uma subpasta remota diferente do nome local:

```bash
.claude/skills/blog/scripts/deploy.sh comedouro-cachorro blog/comedouro-cachorro
```

## Configuração de credenciais (uma única vez)

As credenciais **nunca** ficam no script nem no prompt. Duas formas de fornecê-las:

### Opção A — arquivo `.env` local (mais simples)

```bash
cp .claude/skills/blog/scripts/.env.example .claude/skills/blog/scripts/.env
# edite .env com host, usuário e caminho da chave SSH
```

O `.env` está no `.gitignore` da pasta — nunca é versionado.

### Opção B — exportar no shell antes de rodar

```bash
export SFTP_HOST=srv807.hstgr.io
export SFTP_USER=usuario_ftp
export SFTP_KEY_PATH=~/.ssh/hostinger_id_ed25519
.claude/skills/blog/scripts/deploy.sh comedouro-cachorro
```

## Autenticação recomendada: chave SSH (sem senha)

Ver `scripts/ssh-setup.md` para o passo a passo completo de:
1. Gerar o par de chaves no seu computador
2. Cadastrar a chave pública no hPanel da Hostinger
3. Testar a conexão

Com a chave configurada, `SFTP_PASSWORD` nunca precisa existir em lugar nenhum.

## Fallback: senha (não recomendado)

Só use se não for possível configurar chave SSH. Requer `sshpass` instalado:

```bash
export SFTP_PASSWORD='sua-senha'
.claude/skills/blog/scripts/deploy.sh comedouro-cachorro
```

A senha fica só na variável de ambiente da sessão atual — nunca é escrita em
disco pelo script.
