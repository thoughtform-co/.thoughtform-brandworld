/**
 * Captain's Log System
 *
 * Voice-driven thought capture with platform routing.
 * Star Trek-inspired logging for the Thoughtform journey.
 *
 * "Captain's Log, Stardate 20256.8: The Cardinals are crystallizing..."
 */
export type Platform = 'thoughtform' | 'atlas' | 'ledger' | 'astrolabe' | 'starhaven' | 'journal';
export type ContextType = 'insight' | 'idea' | 'frustration' | 'breakthrough' | 'question' | 'reflection';
export type Source = 'voice' | 'mcp' | 'manual';
export interface LogEntry {
    rawTranscription: string;
    cleanedContent: string;
    platform: Platform;
    triggerPhrase: string | null;
    contextType: ContextType | null;
    tags: string[];
    source: Source;
    sessionId?: string;
    stardate: string;
}
export interface ParsedCommand {
    platform: Platform;
    triggerPhrase: string;
    content: string;
}
/**
 * Generate a Star Trek TNG-style stardate.
 *
 * Format: YYYYD.D where:
 * - YYYY is the current year
 * - D.D is the day fraction of the year (0.0 to 9.9)
 *
 * Example: December 21, 2025 → "20259.6"
 */
export declare function generateStardate(date?: Date): string;
/**
 * Format a stardate for display with the classic prefix.
 * "Stardate 20259.6"
 */
export declare function formatStardate(stardate: string): string;
/**
 * Parse voice transcription to extract platform routing and content.
 *
 * @param transcription - Raw voice transcription (from Wispr Flow or manual input)
 * @returns ParsedCommand with platform, trigger phrase, and cleaned content
 *
 * @example
 * parseVoiceCommand("Captain's Log: The Cardinals are crystallizing...")
 * // → { platform: 'thoughtform', triggerPhrase: "Captain's Log", content: "The Cardinals are crystallizing..." }
 */
export declare function parseVoiceCommand(transcription: string): ParsedCommand;
/**
 * Detect the context type of an entry based on its content.
 *
 * @param content - The cleaned content of the log entry
 * @returns Detected context type or null if ambiguous
 */
export declare function detectContextType(content: string): ContextType | null;
/**
 * Extract tags from content.
 * Supports #hashtag format and [[wiki-link]] format.
 *
 * @param content - The content to extract tags from
 * @returns Array of extracted tags (without # or [[ ]])
 */
export declare function extractTags(content: string): string[];
/**
 * Create a complete log entry from a transcription.
 *
 * @param transcription - Raw voice transcription
 * @param options - Optional overrides for platform, context, source
 * @returns Complete LogEntry ready for storage
 */
export declare function createLogEntry(transcription: string, options?: {
    platform?: Platform;
    contextType?: ContextType;
    source?: Source;
    sessionId?: string;
}): LogEntry;
/**
 * Get human-readable description of a platform.
 */
export declare function getPlatformDescription(platform: Platform): string;
/**
 * Get all available platforms with descriptions.
 */
export declare function getAllPlatforms(): Array<{
    id: Platform;
    name: string;
    description: string;
}>;
/**
 * Validate that a string is a valid platform.
 */
export declare function isValidPlatform(value: string): value is Platform;
/**
 * Validate that a string is a valid context type.
 */
export declare function isValidContextType(value: string): value is ContextType;
/**
 * Validate that a string is a valid source.
 */
export declare function isValidSource(value: string): value is Source;
/**
 * Generate a unique session ID for grouping related entries.
 * Format: YYYYMMDD-HHMM-XXXX where XXXX is random hex.
 */
export declare function generateSessionId(): string;
export declare const CaptainsLog: {
    parseVoiceCommand: typeof parseVoiceCommand;
    detectContextType: typeof detectContextType;
    extractTags: typeof extractTags;
    createLogEntry: typeof createLogEntry;
    generateStardate: typeof generateStardate;
    formatStardate: typeof formatStardate;
    generateSessionId: typeof generateSessionId;
    getPlatformDescription: typeof getPlatformDescription;
    getAllPlatforms: typeof getAllPlatforms;
    isValidPlatform: typeof isValidPlatform;
    isValidContextType: typeof isValidContextType;
    isValidSource: typeof isValidSource;
    TRIGGER_PATTERNS: Record<string, Platform>;
    CONTEXT_PATTERNS: Record<string, ContextType>;
};
export default CaptainsLog;
