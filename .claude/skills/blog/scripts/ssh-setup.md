# Configurar chave SSH com a Hostinger (passo a passo)

Isso permite publicar com `./deploy.sh` sem nunca digitar ou guardar senha.

## 1. Gerar o par de chaves

No seu computador (Linux/Mac: terminal; Windows: Git Bash, WSL, ou PowerShell
com OpenSSH):

```bash
ssh-keygen -t ed25519 -f ~/.ssh/hostinger_id_ed25519 -C "smartpetgadgets-deploy"
```

- Deixe a senha da chave em branco (Enter) para permitir automação, **ou**
  defina uma senha e use `ssh-agent` para não precisar digitá-la toda vez.
- Isso cria dois arquivos:
  - `~/.ssh/hostinger_id_ed25519` (privada — nunca compartilhe)
  - `~/.ssh/hostinger_id_ed25519.pub` (pública — essa você cadastra na Hostinger)

## 2. Cadastrar a chave pública na Hostinger

1. Acesse o **hPanel** → seu site (smartpetgadgets.com.br)
2. Vá em **Avançado → SSH Access** (ou **Contas SSH**, dependendo do plano)
3. Ative o acesso SSH, se ainda não estiver ativo
4. Em **Gerenciar chaves SSH**, cole o conteúdo de:
   ```bash
   cat ~/.ssh/hostinger_id_ed25519.pub
   ```
5. Anote o **host** e a **porta SSH** mostrados na mesma tela (a Hostinger
   costuma usar uma porta diferente de 22, ex: `65002`)

> Nem todo plano de hospedagem compartilhada da Hostinger libera acesso SSH.
> Se a opção não aparecer no hPanel, confirme com o suporte Hostinger se o
> seu plano inclui SSH — caso não inclua, use o fallback de senha com
> `sshpass` (ver SKILL.md), ou publique via File Manager manualmente.

## 3. Testar a conexão

```bash
ssh -i ~/.ssh/hostinger_id_ed25519 -p <porta> usuario@srv807.hstgr.io
```

Se conectar sem pedir senha, está pronto.

## 4. Configurar o `.env` do deploy

```bash
cp .claude/skills/blog/scripts/.env.example .claude/skills/blog/scripts/.env
```

Edite `.env` com:

```
SFTP_HOST=srv807.hstgr.io
SFTP_USER=usuario
SFTP_PORT=<porta>
SFTP_KEY_PATH=~/.ssh/hostinger_id_ed25519
```

## 5. Publicar

```bash
.claude/skills/blog/scripts/deploy.sh comedouro-cachorro
```
