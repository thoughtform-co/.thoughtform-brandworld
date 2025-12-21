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
export class WisprVoiceClient {
  private config: WisprConfig;
  private ws: WebSocket | null = null;

  constructor(config: WisprConfig) {
    this.config = {
      baseUrl: 'wss://api.wisprflow.ai',
      ...config,
    };
  }

  /**
   * Initialize WebSocket connection for streaming audio
   * Returns processed text via callback
   */
  async connect(onTranscription: (result: WisprTranscription) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${this.config.baseUrl}/ws`);
        
        this.ws.onopen = () => {
          // Send auth headers
          this.ws?.send(JSON.stringify({
            type: 'auth',
            api_key: this.config.apiKey,
          }));
          resolve();
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'transcription') {
            onTranscription({
              text: data.text,
              confidence: data.confidence,
              auto_edits: data.auto_edits,
            });
          }
        };

        this.ws.onerror = (error) => {
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send audio chunk for transcription
   */
  sendAudio(audioData: ArrayBuffer): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(audioData);
    }
  }

  /**
   * Close connection
   */
  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }
}

/**
 * REST-based transcription for batch processing
 * Useful for: Processing recorded voice reference descriptions
 */
export async function transcribeAudio(
  config: WisprConfig,
  audioBuffer: ArrayBuffer,
): Promise<WisprTranscription> {
  const response = await fetch(`${config.baseUrl || 'https://api.wisprflow.ai'}/api`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'audio/webm', // or audio/wav, audio/mp3
    },
    body: audioBuffer,
  });

  if (!response.ok) {
    throw new Error(`Wispr API error: ${response.status}`);
  }

  return response.json();
}

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
export function createVoiceDesignPipeline(
  wisprConfig: WisprConfig,
  mcpTools: {
    activateAnchors: (request: string) => Promise<Record<string, number>>;
    detectPlatform: (request: string) => Promise<{ platform: string; score: number }>;
    validateDesign: (request: string, platform?: string) => Promise<unknown>;
  },
) {
  return {
    /**
     * Process a single voice query through semantic validation
     */
    async processQuery(transcription: WisprTranscription): Promise<VoiceDesignResult> {
      const query: VoiceDesignQuery = {
        rawTranscription: transcription.text,
        cleanedText: transcription.text, // Wispr already cleans
        autoEdits: transcription.auto_edits || [],
        timestamp: new Date(),
      };

      // Run semantic pipeline
      const [anchors, platform] = await Promise.all([
        mcpTools.activateAnchors(query.cleanedText),
        mcpTools.detectPlatform(query.cleanedText),
      ]);

      const validation = await mcpTools.validateDesign(
        query.cleanedText,
        platform.platform,
      ) as {
        drift_score: number;
        validation_status: string;
        suggested_patterns: string[];
        suggested_components: string[];
      };

      return {
        query,
        validation: {
          platform: platform.platform,
          platformConfidence: platform.score,
          driftScore: validation.drift_score,
          status: validation.validation_status as VoiceDesignResult['validation']['status'],
        },
        activatedAnchors: anchors,
        suggestedPatterns: validation.suggested_patterns,
        suggestedComponents: validation.suggested_components,
      };
    },

    /**
     * Stream voice input and get real-time semantic feedback
     */
    async streamDesignSession(
      onResult: (result: VoiceDesignResult) => void,
    ): Promise<{ stop: () => void }> {
      const client = new WisprVoiceClient(wisprConfig);
      
      await client.connect(async (transcription) => {
        // Only process complete sentences (simple heuristic)
        if (transcription.text.includes('.') || transcription.text.includes('?')) {
          const result = await this.processQuery(transcription);
          onResult(result);
        }
      });

      return {
        stop: () => client.disconnect(),
      };
    },
  };
}

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
    function: string;      // What is this FOR?
    relationship: string;  // What connection does it create?
    revelation: string;    // What does it make visible?
    tension: string;       // What opposing forces does it hold?
    temperature: string;   // Where on key gradients?
  };
  anchorScores: Record<string, number>;
  suggestedDialects: string[];
  suggestedTranslations: string[];
}

/**
 * Guide prompts for voice-based reference annotation
 * These questions map to the Translation Protocol's extraction questions
 */
export const VOICE_ANNOTATION_PROMPTS = {
  function: "Describe what this reference is for. What problem does it solve?",
  relationship: "What connection does it create? Between what and what?",
  revelation: "What does this make visible that was invisible before?",
  tension: "What opposing forces does this hold in balance?",
  temperature: "Describe its feeling: warm or cold? Ancient or futuristic? Technical or organic?",
} as const;

/**
 * Example MCP tool definition for voice_design_query
 * Add this to the MCP server's tool list
 */
export const VOICE_DESIGN_QUERY_TOOL_SCHEMA = {
  name: "voice_design_query",
  description: "Process a voice transcription through the semantic design pipeline. Takes Wispr Flow transcription output and returns anchor activations, platform detection, and pattern suggestions. Embodies the SIGNAL anchor: extracting design meaning from voice.",
  inputSchema: {
    type: "object",
    properties: {
      transcription: {
        type: "string",
        description: "The transcribed voice input (from Wispr Flow or similar)",
      },
      context: {
        type: "string",
        description: "Optional context: what the user was looking at when speaking",
        enum: ["reference", "mockup", "component", "general"],
      },
    },
    required: ["transcription"],
  },
} as const;

