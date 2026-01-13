/**
 * Mock Parse client initialization for Discord Bot
 */

// Mock initializeParse function
export function initializeParse(applicationId: string, javascriptKey: string, serverURL: string) {
  console.log('Mock Parse initialization - using mock data');
}

// Export mock Parse object
export const Parse = {
  initialize: (appId: string, jsKey: string) => console.log('Mock Parse initialized'),
  serverURL: '',
};

export default {
  initializeParse,
  Parse
};