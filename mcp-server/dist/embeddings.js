/**
 * Thoughtform Semantic Design System - Embeddings Module
 *
 * Handles:
 * - OpenAI embedding generation
 * - Supabase pgvector operations
 * - Semantic search functions
 * - Drift detection
 */
import { createClient } from "@supabase/supabase-js";
// Configuration
let supabaseClient = null;
let openaiApiKey = null;
/**
 * Initialize the embeddings module with credentials
 */
export function initializeEmbeddings(config) {
    supabaseClient = createClient(config.supabaseUrl, config.supabaseKey);
    openaiApiKey = config.openaiKey;
}
/**
 * Check if embeddings are configured
 */
export function isConfigured() {
    return supabaseClient !== null && openaiApiKey !== null;
}
/**
 * Generate embedding using OpenAI
 */
export async function generateEmbedding(text) {
    if (!openaiApiKey) {
        throw new Error("OpenAI API key not configured");
    }
    const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "text-embedding-ada-002",
            input: text,
        }),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI embedding error: ${error}`);
    }
    const data = await response.json();
    return data.data[0].embedding;
}
/**
 * Store an embedding record in Supabase
 */
export async function storeEmbedding(record) {
    if (!supabaseClient) {
        throw new Error("Supabase not configured");
    }
    // Generate embedding if not provided
    if (!record.embedding) {
        record.embedding = await generateEmbedding(record.content);
    }
    const { data, error } = await supabaseClient
        .from("semantic_embeddings")
        .upsert({
        category: record.category,
        source_id: record.source_id,
        source_path: record.source_path,
        title: record.title,
        content: record.content,
        embedding: record.embedding,
        metadata: record.metadata || {},
        platforms: record.platforms || [],
    }, { onConflict: "source_id" })
        .select("id")
        .single();
    if (error) {
        throw new Error(`Supabase error: ${error.message}`);
    }
    return data.id;
}
/**
 * Store a platform fingerprint
 */
export async function storeFingerprint(fingerprint) {
    if (!supabaseClient) {
        throw new Error("Supabase not configured");
    }
    // Generate embedding from identity text
    const embeddingText = `${fingerprint.identity_short} ${fingerprint.identity_extended}`;
    const embedding = await generateEmbedding(embeddingText);
    const { data, error } = await supabaseClient
        .from("platform_fingerprints")
        .upsert({
        platform: fingerprint.platform,
        version: fingerprint.version,
        identity_short: fingerprint.identity_short,
        identity_extended: fingerprint.identity_extended,
        anchor_weights: fingerprint.anchor_weights,
        fingerprint_embedding: embedding,
        keywords: fingerprint.keywords,
        fingerprint_data: fingerprint.fingerprint_data,
    }, { onConflict: "platform" })
        .select("id")
        .single();
    if (error) {
        throw new Error(`Supabase error: ${error.message}`);
    }
    return data.id;
}
/**
 * Search for similar content
 */
export async function searchEmbeddings(query, options = {}) {
    if (!supabaseClient) {
        throw new Error("Supabase not configured");
    }
    const queryEmbedding = await generateEmbedding(query);
    const threshold = options.threshold ?? 0.7;
    const limit = options.limit ?? 10;
    const { data, error } = await supabaseClient.rpc("search_semantic_embeddings", {
        query_embedding: queryEmbedding,
        match_category: options.category || null,
        match_platforms: options.platforms || null,
        match_threshold: threshold,
        match_count: limit,
    });
    if (error) {
        throw new Error(`Search error: ${error.message}`);
    }
    return data;
}
/**
 * Calculate drift score for a design request against a platform
 */
export async function calculateDrift(request, platform) {
    if (!supabaseClient) {
        throw new Error("Supabase not configured");
    }
    const requestEmbedding = await generateEmbedding(request);
    const { data, error } = await supabaseClient.rpc("calculate_drift_score", {
        request_embedding: requestEmbedding,
        target_platform: platform,
    });
    if (error) {
        throw new Error(`Drift calculation error: ${error.message}`);
    }
    return data;
}
/**
 * Activate anchors for a design request
 */
export async function activateAnchors(request) {
    if (!supabaseClient) {
        throw new Error("Supabase not configured");
    }
    const requestEmbedding = await generateEmbedding(request);
    const { data, error } = await supabaseClient.rpc("activate_anchors", {
        query_embedding: requestEmbedding,
    });
    if (error) {
        throw new Error(`Anchor activation error: ${error.message}`);
    }
    return data;
}
/**
 * Detect the best matching platform for a request
 */
export async function detectPlatform(request) {
    if (!supabaseClient) {
        throw new Error("Supabase not configured");
    }
    const requestEmbedding = await generateEmbedding(request);
    // Get all platform fingerprints
    const { data: fingerprints, error } = await supabaseClient
        .from("platform_fingerprints")
        .select("platform, fingerprint_embedding");
    if (error) {
        throw new Error(`Platform detection error: ${error.message}`);
    }
    if (!fingerprints || fingerprints.length === 0) {
        throw new Error("No platform fingerprints found");
    }
    // Calculate similarity to each platform
    const scores = fingerprints.map((fp) => ({
        platform: fp.platform,
        score: cosineSimilarity(requestEmbedding, fp.fingerprint_embedding),
    }));
    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);
    return {
        platform: scores[0].platform,
        score: scores[0].score,
        runner_up: scores.length > 1 ? scores[1] : undefined,
    };
}
/**
 * Log a design decision
 */
export async function logDesignDecision(decision) {
    if (!supabaseClient) {
        throw new Error("Supabase not configured");
    }
    // Generate embedding for the request if not provided
    if (!decision.request_embedding) {
        decision.request_embedding = await generateEmbedding(decision.request_text);
    }
    const { data, error } = await supabaseClient
        .from("design_decisions")
        .insert({
        request_text: decision.request_text,
        request_embedding: decision.request_embedding,
        detected_platform: decision.detected_platform,
        platform_alignment_score: decision.platform_alignment_score,
        activated_anchors: decision.activated_anchors,
        selected_patterns: decision.selected_patterns,
        suggested_components: decision.suggested_components,
        drift_score: decision.drift_score,
        validation_status: decision.validation_status,
        violated_antipatterns: decision.violated_antipatterns,
    })
        .select("id")
        .single();
    if (error) {
        throw new Error(`Decision logging error: ${error.message}`);
    }
    return data.id;
}
/**
 * Get validation status from drift score
 */
export function getValidationStatus(driftScore) {
    if (driftScore < 0.2)
        return "approved";
    if (driftScore < 0.4)
        return "expansion";
    if (driftScore < 0.6)
        return "edge_case";
    return "violation";
}
/**
 * Helper: Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a, b) {
    if (a.length !== b.length) {
        throw new Error("Vectors must have same length");
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
