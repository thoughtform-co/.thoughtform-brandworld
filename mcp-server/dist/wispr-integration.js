/**
 * Wispr Flow Integration for Thoughtform Brand World
 *
 * Connects voice input to semantic design validation.
 * The SIGNAL anchor made manifest: "Information emerging from noise"
 *
 * Wispr Flow API: https://api-docs.wisprflow.ai/introduction
 */
/**
 * WebSocket-based voice transcription for real-time design queries
 *
 * Use case: Dictate design intent while looking at references
 * Wispr cleans the input, then we pipe it through anchor activation
 */
export class WisprVoiceClient {
    config;
    ws = null;
    constructor(config) {
        this.config = {
            baseUrl: 'wss://api.wisprflow.ai',
            ...config,
        };
    }
    /**
     * Initialize WebSocket connection for streaming audio
     * Returns processed text via callback
     */
    async connect(onTranscription) {
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Send audio chunk for transcription
     */
    sendAudio(audioData) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(audioData);
        }
    }
    /**
     * Close connection
     */
    disconnect() {
        this.ws?.close();
        this.ws = null;
    }
}
/**
 * REST-based transcription for batch processing
 * Useful for: Processing recorded voice reference descriptions
 */
export async function transcribeAudio(config, audioBuffer) {
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
 * Process voice input through the full semantic design pipeline
 *
 * @example
 * const result = await processVoiceDesignQuery(wispr, {
 *   transcription: "This feels like an instrument panel, making invisible telemetry visible..."
 * });
 * // Returns activated anchors, platform detection, pattern suggestions
 */
export function createVoiceDesignPipeline(wisprConfig, mcpTools) {
    return {
        /**
         * Process a single voice query through semantic validation
         */
        async processQuery(transcription) {
            const query = {
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
            const validation = await mcpTools.validateDesign(query.cleanedText, platform.platform);
            return {
                query,
                validation: {
                    platform: platform.platform,
                    platformConfidence: platform.score,
                    driftScore: validation.drift_score,
                    status: validation.validation_status,
                },
                activatedAnchors: anchors,
                suggestedPatterns: validation.suggested_patterns,
                suggestedComponents: validation.suggested_components,
            };
        },
        /**
         * Stream voice input and get real-time semantic feedback
         */
        async streamDesignSession(onResult) {
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
 * Guide prompts for voice-based reference annotation
 * These questions map to the Translation Protocol's extraction questions
 */
export const VOICE_ANNOTATION_PROMPTS = {
    function: "Describe what this reference is for. What problem does it solve?",
    relationship: "What connection does it create? Between what and what?",
    revelation: "What does this make visible that was invisible before?",
    tension: "What opposing forces does this hold in balance?",
    temperature: "Describe its feeling: warm or cold? Ancient or futuristic? Technical or organic?",
};
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
};
