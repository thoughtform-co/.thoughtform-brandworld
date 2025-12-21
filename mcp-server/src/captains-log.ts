/**
 * Captain's Log System
 * 
 * Voice-driven thought capture with platform routing.
 * Star Trek-inspired logging for the Thoughtform journey.
 * 
 * "Captain's Log, Stardate 20256.8: The Cardinals are crystallizing..."
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type Platform = 
  | 'thoughtform'  // General Thoughtform insights
  | 'atlas'        // Atlas creature/entity ideas
  | 'ledger'       // Ledger terminal/financial thoughts
  | 'astrolabe'    // Astrolabe/Canon navigation ideas
  | 'starhaven'    // Starhaven creative works
  | 'journal';     // Personal journey entries

export type ContextType = 
  | 'insight'      // Realization or understanding
  | 'idea'         // New concept or possibility
  | 'frustration'  // Challenge or barrier
  | 'breakthrough' // Major unlock
  | 'question'     // Open inquiry
  | 'reflection';  // Looking back on journey

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

// ─── Trigger Patterns ─────────────────────────────────────────────────────────

/**
 * Voice command triggers mapped to platforms.
 * Case-insensitive matching with common transcription variants.
 */
const TRIGGER_PATTERNS: Record<string, Platform> = {
  // Thoughtform (general)
  "captain's log": 'thoughtform',
  "captains log": 'thoughtform',
  "captain log": 'thoughtform',
  "thoughtform log": 'thoughtform',
  "log entry": 'thoughtform',
  
  // Atlas
  "atlas entry": 'atlas',
  "atlas log": 'atlas',
  "atlas note": 'atlas',
  "creature entry": 'atlas',
  "entity entry": 'atlas',
  
  // Ledger
  "ledger note": 'ledger',
  "ledger log": 'ledger',
  "ledger entry": 'ledger',
  "terminal note": 'ledger',
  
  // Astrolabe
  "astrolabe log": 'astrolabe',
  "astrolabe entry": 'astrolabe',
  "astrolabe note": 'astrolabe',
  "canon entry": 'astrolabe',
  "navigation log": 'astrolabe',
  
  // Starhaven
  "starhaven log": 'starhaven',
  "starhaven entry": 'starhaven',
  "starhaven note": 'starhaven',
  "creative log": 'starhaven',
  
  // Journal (personal journey)
  "journal this": 'journal',
  "journal entry": 'journal',
  "personal log": 'journal',
  "journey log": 'journal',
};

/**
 * Context detection patterns.
 * These words/phrases hint at the type of entry.
 */
const CONTEXT_PATTERNS: Record<string, ContextType> = {
  // Insight indicators
  "i realized": 'insight',
  "i'm realizing": 'insight',
  "it clicked": 'insight',
  "the insight is": 'insight',
  "i understand now": 'insight',
  "i see now": 'insight',
  
  // Idea indicators
  "what if": 'idea',
  "idea:": 'idea',
  "new idea": 'idea',
  "i'm thinking": 'idea',
  "maybe we could": 'idea',
  "concept:": 'idea',
  
  // Frustration indicators
  "frustrated": 'frustration',
  "struggling with": 'frustration',
  "barrier:": 'frustration',
  "the problem is": 'frustration',
  "stuck on": 'frustration',
  "can't figure out": 'frustration',
  
  // Breakthrough indicators
  "breakthrough": 'breakthrough',
  "finally": 'breakthrough',
  "it works": 'breakthrough',
  "solved it": 'breakthrough',
  "the unlock": 'breakthrough',
  "everything clicked": 'breakthrough',
  
  // Question indicators
  "question:": 'question',
  "i wonder": 'question',
  "how do we": 'question',
  "what happens if": 'question',
  "need to explore": 'question',
  
  // Reflection indicators
  "looking back": 'reflection',
  "reflecting on": 'reflection',
  "in retrospect": 'reflection',
  "the journey": 'reflection',
  "evolution of": 'reflection',
};

// ─── Stardate Generator ───────────────────────────────────────────────────────

/**
 * Generate a Star Trek TNG-style stardate.
 * 
 * Format: YYYYD.D where:
 * - YYYY is the current year
 * - D.D is the day fraction of the year (0.0 to 9.9)
 * 
 * Example: December 21, 2025 → "20259.6"
 */
export function generateStardate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);
  
  const dayOfYear = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalDays = Math.floor(
    (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Calculate fraction of year (0-9.9)
  const fraction = Math.round((dayOfYear / totalDays) * 100) / 10;
  
  return `${year}${fraction.toFixed(1)}`;
}

/**
 * Format a stardate for display with the classic prefix.
 * "Stardate 20259.6"
 */
export function formatStardate(stardate: string): string {
  return `Stardate ${stardate}`;
}

// ─── Voice Command Parser ─────────────────────────────────────────────────────

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
export function parseVoiceCommand(transcription: string): ParsedCommand {
  const normalized = transcription.toLowerCase().trim();
  
  // Try to match trigger phrases (longest match first for specificity)
  const triggers = Object.keys(TRIGGER_PATTERNS).sort((a, b) => b.length - a.length);
  
  for (const trigger of triggers) {
    const triggerIndex = normalized.indexOf(trigger);
    
    if (triggerIndex !== -1) {
      // Found a trigger - extract content after it
      const afterTrigger = transcription.slice(triggerIndex + trigger.length).trim();
      
      // Remove leading punctuation (colon, dash, etc.)
      const content = afterTrigger.replace(/^[:\-–—,.\s]+/, '').trim();
      
      // Get the original case trigger phrase from the transcription
      const originalTrigger = transcription.slice(triggerIndex, triggerIndex + trigger.length);
      
      return {
        platform: TRIGGER_PATTERNS[trigger],
        triggerPhrase: originalTrigger,
        content: content || transcription, // Fall back to full text if no content after trigger
      };
    }
  }
  
  // No trigger found - default to thoughtform
  return {
    platform: 'thoughtform',
    triggerPhrase: '',
    content: transcription.trim(),
  };
}

// ─── Context Detection ────────────────────────────────────────────────────────

/**
 * Detect the context type of an entry based on its content.
 * 
 * @param content - The cleaned content of the log entry
 * @returns Detected context type or null if ambiguous
 */
export function detectContextType(content: string): ContextType | null {
  const normalized = content.toLowerCase();
  
  // Check each pattern (longer patterns first for specificity)
  const patterns = Object.keys(CONTEXT_PATTERNS).sort((a, b) => b.length - a.length);
  
  for (const pattern of patterns) {
    if (normalized.includes(pattern)) {
      return CONTEXT_PATTERNS[pattern];
    }
  }
  
  return null;
}

// ─── Tag Extraction ───────────────────────────────────────────────────────────

/**
 * Extract tags from content.
 * Supports #hashtag format and [[wiki-link]] format.
 * 
 * @param content - The content to extract tags from
 * @returns Array of extracted tags (without # or [[ ]])
 */
export function extractTags(content: string): string[] {
  const tags: string[] = [];
  
  // Match #hashtags (alphanumeric and hyphens)
  const hashtagMatches = content.match(/#[\w-]+/g);
  if (hashtagMatches) {
    tags.push(...hashtagMatches.map(t => t.slice(1))); // Remove #
  }
  
  // Match [[wiki-links]]
  const wikiMatches = content.match(/\[\[[\w\s-]+\]\]/g);
  if (wikiMatches) {
    tags.push(...wikiMatches.map(t => t.slice(2, -2).trim())); // Remove [[ ]]
  }
  
  // Deduplicate and lowercase
  return [...new Set(tags.map(t => t.toLowerCase()))];
}

// ─── Full Entry Creation ──────────────────────────────────────────────────────

/**
 * Create a complete log entry from a transcription.
 * 
 * @param transcription - Raw voice transcription
 * @param options - Optional overrides for platform, context, source
 * @returns Complete LogEntry ready for storage
 */
export function createLogEntry(
  transcription: string,
  options: {
    platform?: Platform;
    contextType?: ContextType;
    source?: Source;
    sessionId?: string;
  } = {}
): LogEntry {
  // Parse the voice command
  const parsed = parseVoiceCommand(transcription);
  
  // Use overrides if provided, otherwise use parsed/detected values
  const platform = options.platform ?? parsed.platform;
  const content = parsed.content;
  
  // Detect context if not provided
  const contextType = options.contextType ?? detectContextType(content);
  
  // Extract tags from content
  const tags = extractTags(content);
  
  return {
    rawTranscription: transcription,
    cleanedContent: content,
    platform,
    triggerPhrase: parsed.triggerPhrase || null,
    contextType,
    tags,
    source: options.source ?? 'mcp',
    sessionId: options.sessionId,
    stardate: generateStardate(),
  };
}

// ─── Platform Descriptions ────────────────────────────────────────────────────

/**
 * Get human-readable description of a platform.
 */
export function getPlatformDescription(platform: Platform): string {
  const descriptions: Record<Platform, string> = {
    thoughtform: 'General Thoughtform insights and philosophy',
    atlas: 'Atlas creature bestiary and entity concepts',
    ledger: 'Ledger terminal aesthetics and financial interfaces',
    astrolabe: 'Astrolabe navigation system and Canon knowledge base',
    starhaven: 'Starhaven creative works and art direction',
    journal: 'Personal journey entries and reflections',
  };
  return descriptions[platform];
}

/**
 * Get all available platforms with descriptions.
 */
export function getAllPlatforms(): Array<{ id: Platform; name: string; description: string }> {
  return [
    { id: 'thoughtform', name: 'Thoughtform', description: 'General insights and philosophy' },
    { id: 'atlas', name: 'Atlas', description: 'Creature bestiary and entity concepts' },
    { id: 'ledger', name: 'Ledger', description: 'Terminal aesthetics and financial interfaces' },
    { id: 'astrolabe', name: 'Astrolabe', description: 'Navigation system and Canon knowledge base' },
    { id: 'starhaven', name: 'Starhaven', description: 'Creative works and art direction' },
    { id: 'journal', name: 'Journal', description: 'Personal journey entries and reflections' },
  ];
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validate that a string is a valid platform.
 */
export function isValidPlatform(value: string): value is Platform {
  return ['thoughtform', 'atlas', 'ledger', 'astrolabe', 'starhaven', 'journal'].includes(value);
}

/**
 * Validate that a string is a valid context type.
 */
export function isValidContextType(value: string): value is ContextType {
  return ['insight', 'idea', 'frustration', 'breakthrough', 'question', 'reflection'].includes(value);
}

/**
 * Validate that a string is a valid source.
 */
export function isValidSource(value: string): value is Source {
  return ['voice', 'mcp', 'manual'].includes(value);
}

// ─── Session Management ───────────────────────────────────────────────────────

/**
 * Generate a unique session ID for grouping related entries.
 * Format: YYYYMMDD-HHMM-XXXX where XXXX is random hex.
 */
export function generateSessionId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toISOString().slice(11, 16).replace(':', '');
  const random = Math.random().toString(16).slice(2, 6);
  return `${date}-${time}-${random}`;
}

// ─── Export Utilities ─────────────────────────────────────────────────────────

export const CaptainsLog = {
  parseVoiceCommand,
  detectContextType,
  extractTags,
  createLogEntry,
  generateStardate,
  formatStardate,
  generateSessionId,
  getPlatformDescription,
  getAllPlatforms,
  isValidPlatform,
  isValidContextType,
  isValidSource,
  TRIGGER_PATTERNS,
  CONTEXT_PATTERNS,
};

export default CaptainsLog;

