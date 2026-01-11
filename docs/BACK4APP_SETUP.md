# Back4App Setup Guide

## Common Issues and Solutions

### 403 Unauthorized Error

If you're seeing a `403 Unauthorized` error, it usually means one of the following:

#### 1. Parse Classes Don't Exist Yet

Back4App requires you to create Parse classes before you can use them. The classes are created automatically when you first save data, but if you get a 403, you may need to create them manually.

**Solution:** Create the following classes in your Back4App dashboard:

1. Go to your Back4App dashboard
2. Navigate to **Database** → **Browser**
3. Click **Create a class** and create these classes:

##### AgentConfig
- `systemInstructions` (String)
- `allowedChannelIds` (Array)
- `ragEnabled` (Boolean)

##### KnowledgeChunk
- `content` (String)
- `embedding` (Array)
- `source` (String)

##### ConversationMemory
- `summary` (String)

**Note:** You can also let the app create them automatically when you first save data. The 403 error will go away once the classes exist.

#### 2. Wrong JavaScript Key

Make sure you're using the **JavaScript Key** (not the Master Key) in your admin console `.env.local` file.

**Check:**
- Admin Console uses: `NEXT_PUBLIC_BACK4APP_JS_KEY`
- Bot uses: `BACK4APP_MASTER_KEY`

These are different keys with different permissions.

#### 3. Permissions Not Set

In Back4App, make sure your Parse classes have the correct permissions:

1. Go to **Database** → **Browser**
2. Click on each class
3. Go to **Security** tab
4. Set permissions:
   - **Public Read**: `true` (or use authenticated users)
   - **Public Write**: `true` (or use authenticated users)

For development, you can use:
- **Public Read**: `true`
- **Public Write**: `true`

For production, use more restrictive permissions with authenticated users.

## Quick Fix Steps

1. **Verify your credentials in `.env.local` (admin) and `.env` (bot)**
2. **Create Parse classes in Back4App dashboard** (or let the app create them on first save)
3. **Check class permissions** in Back4App dashboard
4. **Restart your dev server** after making changes

## Testing Connection

The admin console will automatically test the connection on load. If you see:
- ✅ **Connected** (green dot) - Everything is working
- ❌ **Disconnected** (red dot) - Check the browser console for specific errors

## Environment Variables Checklist

### Admin Console (`.env.local`)
```bash
NEXT_PUBLIC_BACK4APP_APP_ID=your_app_id_here
NEXT_PUBLIC_BACK4APP_JS_KEY=your_javascript_key_here
NEXT_PUBLIC_BACK4APP_SERVER_URL=https://parseapi.back4app.com
```

### Discord Bot (`.env`)
```bash
BACK4APP_APP_ID=your_app_id_here
BACK4APP_MASTER_KEY=your_master_key_here
BACK4APP_SERVER_URL=https://parseapi.back4app.com
```

**Important:** 
- Admin uses **JavaScript Key** (client-side, less permissions)
- Bot uses **Master Key** (server-side, full permissions)
