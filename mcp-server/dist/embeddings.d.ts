/**
 * Thoughtform Semantic Design System - Embeddings Module
 *
 * Handles:
 * - OpenAI embedding generation
 * - Supabase pgvector operations
 * - Semantic search functions
 * - Drift detection
 */
export interface EmbeddingRecord {
    id?: string;
    category: "philosophy" | "platform_identity" | "anchor" | "pattern" | "reference" | "component" | "fingerprint";
    source_id: string;
    source_path?: string;
    title: string;
    content: string;
    embedding?: number[];
    metadata?: Record<string, unknown>;
    platforms?: string[];
}
export interface PlatformFingerprint {
    platform: string;
    version: string;
    identity_short: string;
    identity_extended: string;
    anchor_weights: Record<string, number>;
    fingerprint_embedding?: number[];
    keywords: string[];
    fingerprint_data: Record<string, unknown>;
}
export interface SearchResult {
    id: string;
    category: string;
    source_id: string;
    title: string;
    content: string;
    similarity: number;
    metadata: Record<string, unknown>;
}
export interface AnchorActivation {
    [anchor: string]: number;
}
export interface DesignDecision {
    request_text: string;
    request_embedding?: number[];
    detected_platform?: string;
    platform_alignment_score?: number;
    activated_anchors: AnchorActivation;
    selected_patterns: string[];
    suggested_components: string[];
    drift_score?: number;
    validation_status: "approved" | "expansion" | "edge_case" | "violation" | "pending";
    violated_antipatterns: string[];
}
/**
 * Initialize the embeddings module with credentials
 */
export declare function initializeEmbeddings(config: {
    supabaseUrl: string;
    supabaseKey: string;
    openaiKey: string;
}): void;
/**
 * Check if embeddings are configured
 */
export declare function isConfigured(): boolean;
/**
 * Generate embedding using OpenAI
 */
export declare function generateEmbedding(text: string): Promise<number[]>;
/**
 * Store an embedding record in Supabase
 */
export declare function storeEmbedding(record: EmbeddingRecord): Promise<string>;
/**
 * Store a platform fingerprint
 */
export declare function storeFingerprint(fingerprint: PlatformFingerprint): Promise<string>;
/**
 * Search for similar content
 */
export declare function searchEmbeddings(query: string, options?: {
    category?: string;
    platforms?: string[];
    threshold?: number;
    limit?: number;
}): Promise<SearchResult[]>;
/**
 * Calculate drift score for a design request against a platform
 */
export declare function calculateDrift(request: string, platform: string): Promise<number>;
/**
 * Activate anchors for a design request
 */
export declare function activateAnchors(request: string): Promise<AnchorActivation>;
/**
 * Detect the best matching platform for a request
 */
export declare function detectPlatform(request: string): Promise<{
    platform: string;
    score: number;
    runner_up?: {
        platform: string;
        score: number;
    };
}>;
/**
 * Log a design decision
 */
export declare function logDesignDecision(decision: DesignDecision): Promise<string>;
/**
 * Get validation status from drift score
 */
export declare function getValidationStatus(driftScore: number): "approved" | "expansion" | "edge_case" | "violation";
