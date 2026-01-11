/**
 * Back4App Parse client initialization for Admin Console
 */

import Parse from 'parse';
import { initializeParse } from '../../../shared/utils/back4app';

// Initialize Parse with environment variables
export function initParse() {
  const applicationId = process.env.NEXT_PUBLIC_BACK4APP_APP_ID!;
  const javascriptKey = process.env.NEXT_PUBLIC_BACK4APP_JS_KEY!;
  const serverURL = process.env.NEXT_PUBLIC_BACK4APP_SERVER_URL!;
  
  initializeParse(applicationId, javascriptKey, serverURL);
}

// Export Parse for direct use if needed
export { Parse };
