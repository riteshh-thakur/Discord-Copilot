// Test Parse Master Key Issue
require('dotenv').config({ path: '.env.local' });

const { resolve, join } = require('path');

// Load environment from root
const projectRoot = resolve(__dirname, '..');
const envFile = join(projectRoot, '.env.local');

console.log('📁 Loading environment from:', envFile);
require('dotenv').config({ path: envFile });

const Parse = require('parse/node');

// Test Parse initialization
console.log('🔑 BACK4APP_APP_ID:', process.env.BACK4APP_APP_ID ? 'found' : 'missing');
console.log('🔑 BACK4APP_MASTER_KEY:', process.env.BACK4APP_MASTER_KEY ? 'found' : 'missing');

if (process.env.BACK4APP_APP_ID && process.env.BACK4APP_MASTER_KEY) {
  try {
    // Initialize Parse
    Parse.initialize(process.env.BACK4APP_APP_ID);
    Parse.serverURL = process.env.BACK4APP_SERVER_URL || 'https://parseapi.back4app.com';
    
    // Store master key
    globalThis.__PARSE_MASTER_KEY__ = process.env.BACK4APP_MASTER_KEY;
    console.log('✅ Parse initialized');
    console.log('🔑 Master key stored:', !!globalThis.__PARSE_MASTER_KEY__);
    
    // Test a simple query
    const TestObject = Parse.Object.extend('TestObject');
    const query = new Parse.Query(TestObject);
    
    // Override REST controller
    const CoreManager = Parse.CoreManager;
    const RESTController = CoreManager.get('RESTController');
    const originalRequest = RESTController.request;
    
    RESTController.request = function(method, url, data, options) {
      console.log('🔍 Request options:', !!options, 'useMasterKey:', options?.useMasterKey);
      console.log('🔑 Master key available:', !!globalThis.__PARSE_MASTER_KEY__);
      
      if (options && options.useMasterKey && globalThis.__PARSE_MASTER_KEY__) {
        options.headers = options.headers || {};
        options.headers['X-Parse-Master-Key'] = globalThis.__PARSE_MASTER_KEY__;
        console.log('✅ Master key header added');
      }
      return originalRequest.call(this, method, url, data, options);
    };
    
    // Try the query
    query.first({ useMasterKey: true }).then(() => {
      console.log('✅ Query successful');
    }).catch(error => {
      console.error('❌ Query failed:', error.message);
    });
    
  } catch (error) {
    console.error('❌ Parse initialization failed:', error.message);
  }
} else {
  console.error('❌ Missing credentials');
}
