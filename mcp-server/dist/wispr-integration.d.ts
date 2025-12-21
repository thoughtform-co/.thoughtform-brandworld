/**
 * Wispr Flow Integration for Thoughtform Brand World
 *
 * Connects voice input to semantic design validation.
 * The SIGNAL anchor made manifest: "Information emerging from noise"
 *
 * Wispr Flow API: https://api-docs.wisprflow.ai/introduction
 */
export interface WisprConfig {
    apiKey: string;
    baseUrl?: string;
}
export interface WisprTranscription {
    text: string;
    confidence?: number;
    duration_ms?: number;
    auto_edits?: string[];
}
/**
 * WebSocket-based voice transcription for real-time design queries
 *
 * Use case: Dictate design intent while looking at references
 * Wispr cleans the input, then we pipe it through anchor activation
 */
export declare class WisprVoiceClient {
    private config;
    private ws;
    constructor(config: WisprConfig);
    /**
     * Initialize WebSocket connection for streaming audio
     * Returns processed text via callback
     */
    connect(onTranscription: (result: WisprTranscription) => void): Promise<void>;
    /**
     * Send audio chunk for transcription
     */
    sendAudio(audioData: ArrayBuffer): void;
    /**
     * Close connection
     */
    disconnect(): void;
}
/**
 * REST-based transcription for batch processing
 * Useful for: Processing recorded voice reference descriptions
 */
export declare function transcribeAudio(config: WisprConfig, audioBuffer: ArrayBuffer): Promise<WisprTranscription>;
/**
 * Voice-to-Design Pipeline
 *
 * The complete flow:
 * 1. Voice input → Wispr transcription (signal from noise)
 * 2. Clean text → Semantic anchor activation
 * 3. Activated anchors → Pattern suggestions
 * 4. Full validation → Design guidance
 *
 * This embodies the SIGNAL anchor: extracting meaning from voice noise,
 * just as the Ledger terminal extracts patterns from data noise.
 */
export interface VoiceDesignQuery {
    rawTranscription: string;
    cleanedText: string;
    autoEdits: string[];
    timestamp: Date;
}
export interface VoiceDesignResult {
    query: VoiceDesignQuery;
    validation: {
        platform: string;
        platformConfidence: number;
        driftScore: number;
        status: 'approved' | 'expansion' | 'edge_case' | 'violation';
    };
    activatedAnchors: Record<string, number>;
    suggestedPatterns: string[];
    suggestedComponents: string[];
}
/**
 * Process voice input through the full semantic design pipeline
 *
 * @example
 * const result = await processVoiceDesignQuery(wispr, {
 *   transcription: "This feels like an instrument panel, making invisible telemetry visible..."
 * });
 * // Returns activated anchors, platform detection, pattern suggestions
 */
export declare function createVoiceDesignPipeline(wisprConfig: WisprConfig, mcpTools: {
    activateAnchors: (request: string) => Promise<Record<string, number>>;
    detectPlatform: (request: string) => Promise<{
        platform: string;
        score: number;
    }>;
    validateDesign: (request: string, platform?: string) => Promise<unknown>;
}): {
    /**
     * Process a single voice query through semantic validation
     */
    processQuery(transcription: WisprTranscription): Promise<VoiceDesignResult>;
    /**
     * Stream voice input and get real-time semantic feedback
     */
    streamDesignSession(onResult: (result: VoiceDesignResult) => void): Promise<{
        stop: () => void;
    }>;
};
/**
 * Voice Reference Annotation
 *
 * For capturing semantic descriptions of visual references via voice.
 * Aligns with the reference library workflow:
 *
 * Reference → [Voice Description] → Anchor Scoring → Translation Selection
 */
export interface VoiceReferenceAnnotation {
    referenceId: string;
    transcriptions: WisprTranscription[];
    semanticExtraction: {
        function: string;
        relationship: string;
        revelation: string;
        tension: string;
        temperature: string;
    };
    anchorScores: Record<string, number>;
    suggestedDialects: string[];
    suggestedTranslations: string[];
}
/**
 * Guide prompts for voice-based reference annotation
 * These questions map to the Translation Protocol's extraction questions
 */
export declare const VOICE_ANNOTATION_PROMPTS: {
    readonly function: "Describe what this reference is for. What problem does it solve?";
    readonly relationship: "What connection does it create? Between what and what?";
    readonly revelation: "What does this make visible that was invisible before?";
    readonly tension: "What opposing forces does this hold in balance?";
    readonly temperature: "Describe its feeling: warm or cold? Ancient or futuristic? Technical or organic?";
};
/**
 * Example MCP tool definition for voice_design_query
 * Add this to the MCP server's tool list
 */
export declare const VOICE_DESIGN_QUERY_TOOL_SCHEMA: {
    readonly name: "voice_design_query";
    readonly description: "Process a voice transcription through the semantic design pipeline. Takes Wispr Flow transcription output and returns anchor activations, platform detection, and pattern suggestions. Embodies the SIGNAL anchor: extracting design meaning from voice.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly transcription: {
                readonly type: "string";
                readonly description: "The transcribed voice input (from Wispr Flow or similar)";
            };
            readonly context: {
                readonly type: "string";
                readonly description: "Optional context: what the user was looking at when speaking";
                readonly enum: readonly ["reference", "mockup", "component", "general"];
            };
        };
        readonly required: readonly ["transcription"];
    };
};
