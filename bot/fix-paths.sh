#!/bin/bash

# Fix module paths in compiled JavaScript files
echo "🔧 Fixing bot module paths..."

cd "$(dirname "$0")/dist"

# Fix index.js (uses ../../shared)
find . -name "*.js" -exec sed -i '' 's|@shared/utils/back4app|../../shared/utils/back4app|g' bot/src/index.js \;
find . -name "*.js" -exec sed -i '' 's|@shared/types|../../shared/types|g' bot/src/index.js \;
find . -name "*.js" -exec sed -i '' 's|@shared/utils/constants|../../shared/utils/constants|g' bot/src/index.js \;

# Fix other files (use ../../../shared)
find . -name "*.js" -exec sed -i '' 's|@shared/utils/back4app|../../../shared/utils/back4app|g' bot/src/handlers/messageHandler.js bot/src/services/llmService.js bot/src/services/botService.js \;
find . -name "*.js" -exec sed -i '' 's|@shared/types|../../../shared/types|g' bot/src/handlers/messageHandler.js bot/src/services/llmService.js \;
find . -name "*.js" -exec sed -i '' 's|@shared/utils/constants|../../../shared/utils/constants|g' bot/src/handlers/messageHandler.js bot/src/services/llmService.js bot/src/services/botService.js \;

# Fix Parse serverURL issue - remove the line since Parse.js handles it automatically
sed -i '' '/Object.defineProperty(Parse, "serverURL"/d' shared/utils/back4app.js
sed -i '' '/Parse.serverURL = serverURL/d' shared/utils/back4app.js

# Fix global scope issue for master key
sed -i '' 's|global.__PARSE_MASTER_KEY__|globalThis.__PARSE_MASTER_KEY__|g' shared/utils/back4app.js

# Fix master key header assignment - remove duplicate and fix properly
sed -i '' 's#options\.headers\[.X-Parse-Master-Key.\] = masterKey;#options.headers = options.headers || {}; options.headers["X-Parse-Master-Key"] = masterKey;#g' shared/utils/back4app.js

# Remove duplicate header assignment lines (pattern with exact match)
sed -i '' '/options\.headers = options\.headers || {};$/N; s/options\.headers = options\.headers || {};\n *options\.headers = options\.headers || {};/options.headers = options.headers || {};/' shared/utils/back4app.js

# Add debug logging for master key
sed -i '' '/globalThis.__PARSE_MASTER_KEY__ = masterKey;/a\
    console.log("🔑 Master key stored globally:", !!masterKey);' shared/utils/back4app.js

echo "✅ Bot module paths fixed!"
