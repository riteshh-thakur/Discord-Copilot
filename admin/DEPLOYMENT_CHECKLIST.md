# Back4App Deployment Checklist

Use this checklist to ensure a smooth deployment to Back4App.

## Pre-Deployment

- [ ] **Code is ready**
  - [ ] All features tested locally
  - [ ] Build completes successfully: `npm run build`
  - [ ] No TypeScript errors
  - [ ] No linting errors

- [ ] **Environment Variables Prepared**
  - [ ] `NEXT_PUBLIC_BACK4APP_APP_ID` - Your Back4App App ID
  - [ ] `NEXT_PUBLIC_BACK4APP_JS_KEY` - Your Back4App JavaScript Key
  - [ ] `NEXT_PUBLIC_BACK4APP_SERVER_URL` - Usually `https://parseapi.back4app.com`
  - [ ] `OPENROUTER_API_KEY` - Your OpenRouter API key
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`

- [ ] **Back4App Setup**
  - [ ] Back4App account created
  - [ ] Parse classes created:
    - [ ] `AgentConfig`
    - [ ] `KnowledgeChunk`
    - [ ] `ConversationMemory`
  - [ ] Class permissions set (Public Read/Write for required fields)

- [ ] **Git Repository**
  - [ ] Code pushed to Git (GitHub/GitLab/Bitbucket)
  - [ ] Repository is accessible
  - [ ] Main branch is up to date

## Deployment Configuration

- [ ] **Back4App App Settings**
  - [ ] App created in Back4App dashboard
  - [ ] Runtime: Node.js
  - [ ] Node version: 18.x or 20.x
  - [ ] Root directory: `admin` (if deploying from monorepo)
  - [ ] Build command: `npm install && npm run build`
  - [ ] Start command: `npm start`
  - [ ] Port: 3000 (or auto)

- [ ] **Environment Variables Set**
  - [ ] All variables added in Back4App dashboard
  - [ ] Variables verified (no typos)
  - [ ] Sensitive keys are secure

## Deployment Steps

- [ ] **Connect Repository**
  - [ ] Git provider connected (GitHub/GitLab/Bitbucket)
  - [ ] Repository selected
  - [ ] Branch selected (usually `main` or `master`)

- [ ] **Deploy**
  - [ ] Deployment triggered
  - [ ] Build logs monitored
  - [ ] Deployment completed successfully

## Post-Deployment

- [ ] **Verify Deployment**
  - [ ] App URL accessible
  - [ ] Homepage loads correctly
  - [ ] No console errors in browser
  - [ ] Back4App connection status shows "Connected"

- [ ] **Test Features**
  - [ ] System Instructions can be edited and saved
  - [ ] Memory can be viewed and edited
  - [ ] Discord Settings can be configured
  - [ ] Knowledge Base can be accessed
  - [ ] PDF upload works
  - [ ] Search functionality works

- [ ] **Monitor**
  - [ ] Check application logs
  - [ ] Monitor error rates
  - [ ] Check performance metrics
  - [ ] Verify API routes work (`/api/embeddings`, `/api/parse-pdf`)

## Troubleshooting

If deployment fails:

1. **Check Build Logs**
   - Review error messages in Back4App dashboard
   - Common issues: missing dependencies, build errors

2. **Verify Environment Variables**
   - Ensure all variables are set correctly
   - Check for typos in variable names
   - Verify values are correct

3. **Check Node Version**
   - Ensure Node.js version is 18.x or 20.x
   - Update if necessary

4. **Verify File Structure**
   - Ensure `next.config.js` exists
   - Check `package.json` has correct scripts
   - Verify all dependencies are listed

5. **Test Locally First**
   - Run `npm run build` locally
   - Fix any errors before deploying

## Quick Commands

```bash
# Test build locally
cd admin
npm install
npm run build

# Check for errors
npm run lint

# Run deployment script
./deploy.sh
```

## Support Resources

- **Back4App Docs**: https://docs.back4app.com
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Full Deployment Guide**: `/docs/BACK4APP_DEPLOYMENT.md`

---

**Note**: Keep this checklist updated as you deploy new versions!
