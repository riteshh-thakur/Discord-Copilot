# Troubleshooting Guide

## Memory Initialization Fails After Creating Classes

If you've created the Parse classes in Back4App but still get "Failed to create memory" errors, check the following:

### 1. Verify Class Permissions

In Back4App Dashboard:
1. Go to **Database** → **Browser**
2. Click on **ConversationMemory** class
3. Click on **Security** tab
4. Ensure these settings:
   - **Public Read**: `true` ✅
   - **Public Write**: `true` ✅

**Important:** Without Public Write enabled, you cannot create new records from the client.

### 2. Verify JavaScript Key

1. Go to **Server Settings** → **Security & Keys**
2. Copy the **JavaScript Key** (not Master Key)
3. Verify it matches your `.env.local` file:
   ```
   NEXT_PUBLIC_BACK4APP_JS_KEY=your_javascript_key_here
   ```

### 3. Check Class Structure

Verify the `ConversationMemory` class has:
- Field: `summary` (type: **String**)
- No required fields (or make sure `summary` is optional)

### 4. Test Connection

Open browser console and check for:
- ✅ `Back4App initialized successfully`
- ✅ `Back4App connection test successful`
- ❌ Any 403 or permission errors

### 5. Common Error Codes

- **Error 101**: Object not found (class doesn't exist or wrong name)
- **Error 119**: Permission denied (write permissions not enabled)
- **Error 403**: Unauthorized (wrong key or permissions)

### 6. Quick Fix Checklist

- [ ] Classes created: `AgentConfig`, `ConversationMemory`, `KnowledgeChunk`
- [ ] All classes have **Public Read: true**
- [ ] All classes have **Public Write: true**
- [ ] JavaScript Key is correct in `.env.local`
- [ ] Server URL is correct: `https://parseapi.back4app.com`
- [ ] Restarted dev server after changing `.env.local`

### 7. Still Not Working?

1. **Check browser console** for detailed error messages
2. **Verify in Back4App dashboard** that you can manually create a record
3. **Try using Master Key temporarily** (for testing only, not production)
4. **Check Back4App app status** - ensure it's not paused or deleted

## Testing the Connection

After fixing permissions, try:
1. Refresh the admin console
2. Check the connection status indicator (top right)
3. Try "Initialize Memory" again
4. Check browser console for success messages
