# Security Guide

## Protecting Secrets

**IMPORTANT**: Never commit secrets, API keys, or sensitive information to Git!

### What Should Never Be Committed

- `.env` files (environment variables)
- API keys (Discord Bot Token, OpenRouter API Key, Back4App keys)
- Private keys and certificates
- Passwords and authentication tokens
- Database credentials

### How to Handle Secrets

1. **Use `.env` files** (already in `.gitignore`)
   - Create `.env` files locally
   - Add them to `.gitignore`
   - Never commit them

2. **Use Environment Variables in Production**
   - Set environment variables in your hosting platform (Back4App, Heroku, etc.)
   - Never hardcode secrets in your code

3. **Use `.env.example` Files**
   - Create `.env.example` with placeholder values
   - Commit `.env.example` to show what variables are needed
   - Document what each variable is for

### If You Accidentally Commit a Secret

1. **Remove the file from git**:
   ```bash
   git rm --cached path/to/.env
   ```

2. **Remove from git history**:
   ```bash
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch path/to/.env' \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Rotate the secret**:
   - Generate a new API key/token
   - Update it in all places (local `.env`, production environment)
   - The old secret is compromised and should not be used

4. **Force push** (if already pushed):
   ```bash
   git push --force origin main
   ```
   ⚠️ **Warning**: Only do this if you're sure no one else has pulled the changes!

### Current `.gitignore` Protection

The repository includes a comprehensive `.gitignore` that excludes:
- All `.env` files
- `node_modules/`
- Build artifacts
- IDE files
- OS-specific files

### Best Practices

1. ✅ Always check `git status` before committing
2. ✅ Review `git diff` to see what you're committing
3. ✅ Use environment variables for all secrets
4. ✅ Create `.env.example` files as templates
5. ✅ Rotate secrets immediately if exposed
6. ❌ Never commit `.env` files
7. ❌ Never hardcode secrets in source code
8. ❌ Never share secrets in chat, email, or documentation

### GitHub Secret Scanning

GitHub automatically scans for secrets in commits. If you see a warning:
- The secret has been detected
- You must remove it from history
- Rotate the secret immediately
- Follow the steps above to clean your repository

---

**Remember**: Once a secret is committed and pushed, consider it compromised. Always rotate secrets that have been exposed!
