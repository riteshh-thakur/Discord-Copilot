# Back4App Deployment Guide

This guide will help you deploy the Discord Copilot Admin Console to Back4App.

## Prerequisites

1. **Back4App Account**: Sign up at [https://www.back4app.com](https://www.back4app.com)
2. **Back4App CLI** (optional but recommended): Install via npm
   ```bash
   npm install -g back4app-cli
   ```
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Methods

### Method 1: Deploy via Back4App Dashboard (Recommended)

#### Step 1: Prepare Your Code

1. **Build the application locally** (optional, but recommended for testing):
   ```bash
   cd admin
   npm install
   npm run build
   ```

2. **Ensure environment variables are set** in Back4App dashboard (see Step 3)

#### Step 2: Create a New App in Back4App

1. Log in to [Back4App Dashboard](https://dashboard.back4app.com)
2. Click **"Create a new app"**
3. Choose **"Hosting"** or **"Web App"** option
4. Select **"Node.js"** as the runtime
5. Give your app a name (e.g., `discord-copilot-admin`)

#### Step 3: Configure Environment Variables

In your Back4App app dashboard:

1. Go to **"App Settings"** → **"Environment Variables"**
2. Add the following environment variables:

   ```
   NEXT_PUBLIC_BACK4APP_APP_ID=your_app_id_here
   NEXT_PUBLIC_BACK4APP_JS_KEY=your_javascript_key_here
   NEXT_PUBLIC_BACK4APP_SERVER_URL=https://parseapi.back4app.com
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   NODE_ENV=production
   PORT=3000
   ```

   **Note**: You can find your App ID and JavaScript Key in:
   - Back4App Dashboard → Your App → App Settings → Security & Keys

#### Step 4: Connect Your Repository

1. In Back4App Dashboard, go to **"Deploy"** or **"Hosting"** section
2. Click **"Connect Repository"**
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Back4App to access your repositories
5. Select your repository
6. Set the **Root Directory** to `admin` (since your Next.js app is in the `admin` folder)
7. Set the **Build Command** to: `npm install && npm run build`
8. Set the **Start Command** to: `npm start`
9. Set the **Node Version** to: `18.x` or `20.x`

#### Step 5: Deploy

1. Click **"Deploy"** or **"Save"**
2. Back4App will automatically:
   - Clone your repository
   - Install dependencies
   - Build your Next.js app
   - Start the server

3. Wait for the deployment to complete (usually 3-5 minutes)
4. Your app will be available at: `https://your-app-name.back4app.io`

### Method 2: Deploy via Back4App CLI

#### Step 1: Install Back4App CLI

```bash
npm install -g back4app-cli
```

#### Step 2: Login to Back4App

```bash
b4a login
```

Enter your Back4App credentials when prompted.

#### Step 3: Initialize Your App

```bash
cd admin
b4a init
```

Follow the prompts to:
- Select or create an app
- Choose Node.js runtime
- Set build and start commands

#### Step 4: Configure Environment Variables

Create a `.env.production` file (or set them in Back4App dashboard):

```bash
# .env.production
NEXT_PUBLIC_BACK4APP_APP_ID=your_app_id
NEXT_PUBLIC_BACK4APP_JS_KEY=your_js_key
NEXT_PUBLIC_BACK4APP_SERVER_URL=https://parseapi.back4app.com
OPENROUTER_API_KEY=your_openrouter_key
NODE_ENV=production
PORT=3000
```

Set environment variables in Back4App:
```bash
b4a env set NEXT_PUBLIC_BACK4APP_APP_ID=your_app_id
b4a env set NEXT_PUBLIC_BACK4APP_JS_KEY=your_js_key
b4a env set NEXT_PUBLIC_BACK4APP_SERVER_URL=https://parseapi.back4app.com
b4a env set OPENROUTER_API_KEY=your_openrouter_key
b4a env set NODE_ENV=production
b4a env set PORT=3000
```

#### Step 5: Deploy

```bash
b4a deploy
```

The CLI will:
- Build your app
- Upload it to Back4App
- Start the server

### Method 3: Manual Deployment via Git Push

#### Step 1: Add Back4App as a Remote

1. Get your Back4App Git URL from the dashboard
2. Add it as a remote:

```bash
cd admin
git remote add back4app https://git.back4app.com/your-app-name.git
```

#### Step 2: Push to Back4App

```bash
git push back4app main
```

Back4App will automatically build and deploy your app.

## Post-Deployment Configuration

### 1. Custom Domain (Optional)

1. Go to **"App Settings"** → **"Custom Domain"**
2. Add your domain
3. Follow DNS configuration instructions

### 2. SSL Certificate

Back4App automatically provides SSL certificates for all apps. Your app will be accessible via HTTPS.

### 3. Environment Variables Verification

After deployment, verify that all environment variables are set correctly:

1. Go to **"App Settings"** → **"Environment Variables"**
2. Ensure all required variables are present
3. Restart the app if you made changes

### 4. Monitor Your App

1. Go to **"Logs"** section to view application logs
2. Check **"Metrics"** for performance data
3. Monitor **"Errors"** for any issues

## Troubleshooting

### Build Fails

**Issue**: Build command fails during deployment

**Solutions**:
- Check Node.js version (should be 18.x or 20.x)
- Verify all dependencies are in `package.json`
- Check build logs in Back4App dashboard
- Ensure `next.config.js` is properly configured

### Environment Variables Not Working

**Issue**: App can't access environment variables

**Solutions**:
- Verify variables are set in Back4App dashboard
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Restart the app after adding new variables
- Check variable names match exactly (case-sensitive)

### API Routes Not Working

**Issue**: `/api/*` routes return 404

**Solutions**:
- Ensure `output: 'standalone'` is set in `next.config.js`
- Verify the app is running in production mode
- Check server logs for errors
- Ensure API routes are in `src/app/api/` directory

### Three.js Background Not Loading

**Issue**: 3D background doesn't appear

**Solutions**:
- Check browser console for errors
- Verify Three.js is installed: `npm install three`
- Ensure WebGL is enabled in browser
- Check if there are any CORS issues

### Back4App Connection Issues

**Issue**: Can't connect to Back4App from deployed app

**Solutions**:
- Verify `NEXT_PUBLIC_BACK4APP_SERVER_URL` is correct
- Check App ID and JavaScript Key are correct
- Ensure Parse classes exist in Back4App
- Check class permissions (Public Read/Write)

## Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are configured
- [ ] `next.config.js` is properly set up
- [ ] Build completes successfully locally (`npm run build`)
- [ ] All dependencies are in `package.json`
- [ ] `.b4aignore` file excludes unnecessary files
- [ ] Back4App Parse classes are created (AgentConfig, KnowledgeChunk, ConversationMemory)
- [ ] Parse class permissions are set correctly
- [ ] OpenRouter API key is valid
- [ ] Git repository is up to date

## Updating Your Deployment

### Automatic Updates (Recommended)

If you connected your Git repository:
1. Push changes to your main branch
2. Back4App will automatically detect changes
3. It will rebuild and redeploy automatically

### Manual Updates

1. Make changes to your code
2. Commit and push to Git
3. In Back4App dashboard, click **"Redeploy"** or trigger a new deployment

## Performance Optimization

### 1. Enable Caching

Back4App automatically caches static assets. Ensure your `next.config.js` has proper cache headers.

### 2. Optimize Images

Since we set `images: { unoptimized: true }`, images won't be optimized by Next.js. Consider using a CDN or optimizing images manually.

### 3. Monitor Performance

- Use Back4App's built-in metrics
- Monitor response times
- Check memory and CPU usage
- Optimize based on metrics

## Support

If you encounter issues:

1. Check Back4App documentation: [https://docs.back4app.com](https://docs.back4app.com)
2. Review application logs in Back4App dashboard
3. Check Next.js deployment documentation
4. Contact Back4App support if needed

## Quick Reference

**Build Command**: `npm install && npm run build`  
**Start Command**: `npm start`  
**Node Version**: 18.x or 20.x  
**Port**: 3000 (automatically set by Back4App)  
**Root Directory**: `admin` (if deploying from monorepo)

---

**Note**: This deployment guide assumes you're deploying the admin console. The Discord bot (`bot/discord-copilot-bot.js`) should be deployed separately, typically on a server or platform like Heroku, Railway, or a VPS, as it requires a persistent connection to Discord.
