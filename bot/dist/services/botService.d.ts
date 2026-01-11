/**
 * Bot Service for utility functions
 */
export declare function isAllowedChannel(channelId: string, allowedChannelIds: string[]): boolean;
export declare function checkRateLimit(channelId: string): boolean;
export declare function cleanMessage(message: string): string;
export declare function extractMentions(message: string): string[];
export declare function formatBotResponse(response: string): string;
export declare function splitLongMessage(message: string): string[];
//# sourceMappingURL=botService.d.ts.map