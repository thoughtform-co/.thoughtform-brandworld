/**
 * Thoughtform Semantic Design System - Local Embeddings Module
 *
 * Uses Voyage AI for embeddings and local JSON storage.
 * No external database required.
 */
export interface EmbeddingRecord {
    id: string;
    category: "philosophy" | "platform_identity" | "anchor" | "pattern" | "reference" | "component" | "fingerprint";
    source_id: string;
    source_path?: string;
    title: string;
    content: string;
    embedding: number[];
    metadata?: Record<string, unknown>;
    platforms?: string[];
    created_at: string;
}
export interface EmbeddingsIndex {
    version: string;
    model: string;
    dimensions: number;
    count: number;
    updated_at: string;
    records: EmbeddingRecord[];
}
export interface SearchResult {
    id: string;
    category: string;
    source_id: string;
    title: string;
    content: string;
    similarity: number;
    metadata?: Record<string, unknown>;
}
export interface AnchorActivation {
    [anchor: string]: number;
}
/**
 * Initialize the embeddings module
 */
export declare function initializeEmbeddings(config: {
    voyageKey: string;
}): void;
/**
 * Check if embeddings are configured
 */
export declare function isConfigured(): boolean;
/**
 * Generate embedding using Voyage AI
 */
export declare function generateEmbedding(text: string): Promise<number[]>;
/**
 * Generate query embedding (optimized for search)
 */
export declare function generateQueryEmbedding(text: string): Promise<number[]>;
/**
 * Store an embedding record
 */
export declare function storeEmbedding(record: Omit<EmbeddingRecord, "id" | "embedding" | "created_at"> & {
    embedding?: number[];
}): Promise<string>;
/**
 * Search embeddings by similarity
 */
export declare function searchEmbeddings(query: string, options?: {
    category?: string;
    platforms?: string[];
    threshold?: number;
    limit?: number;
}): Promise<SearchResult[]>;
/**
 * Calculate drift score against platform fingerprint
 */
export declare function calculateDrift(request: string, platform: string): Promise<number>;
/**
 * Activate anchors based on request similarity
 */
export declare function activateAnchors(request: string): Promise<AnchorActivation>;
/**
 * Detect best platform for a request
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
 * Get validation status from drift score
 */
export declare function getValidationStatus(driftScore: number): "approved" | "expansion" | "edge_case" | "violation";
/**
 * Get embedding stats
 */
export declare function getStats(): {
    configured: boolean;
    count: number;
    categories: Record<string, number>;
};
export interface CaptainsLogEmbeddingRecord {
    id: string;
    platform: string;
    content: string;
    context_type?: string;
    stardate: string;
    tags: string[];
    embedding: number[];
    anchor_activations: Record<string, number>;
    created_at: string;
}
export interface CaptainsLogSearchResult {
    id: string;
    platform: string;
    content: string;
    context_type?: string;
    stardate: string;
    tags: string[];
    similarity: number;
    anchor_activations: Record<string, number>;
}
/**
 * Store a Captain's Log entry with embedding
 */
export declare function storeCaptainsLogEntry(entry: {
    id: string;
    platform: string;
    content: string;
    context_type?: string;
    stardate: string;
    tags: string[];
}): Promise<string>;
/**
 * Search Captain's Log entries by semantic similarity
 */
export declare function searchCaptainsLog(query: string, options?: {
    platform?: string;
    context?: string;
    threshold?: number;
    limit?: number;
}): Promise<CaptainsLogSearchResult[]>;
/**
 * Get recent Captain's Log entries
 */
export declare function getRecentCaptainsLogs(options?: {
    platform?: string;
    limit?: number;
}): Omit<CaptainsLogEmbeddingRecord, "embedding">[];
/**
 * Get Captain's Log stats
 */
export declare function getCaptainsLogStats(): {
    count: number;
    platforms: Record<string, number>;
    contexts: Record<string, number>;
};
