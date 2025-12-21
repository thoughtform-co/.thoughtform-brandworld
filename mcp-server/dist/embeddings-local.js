/**
 * Thoughtform Semantic Design System - Local Embeddings Module
 *
 * Uses Voyage AI for embeddings and local JSON storage.
 * No external database required.
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");
const EMBEDDINGS_DIR = path.join(ROOT_DIR, "semantic/embeddings");
// Configuration
let voyageApiKey = null;
let embeddingsIndex = null;
/**
 * Initialize the embeddings module
 */
export function initializeEmbeddings(config) {
    voyageApiKey = config.voyageKey;
    loadEmbeddingsIndex();
}
/**
 * Check if embeddings are configured
 */
export function isConfigured() {
    return voyageApiKey !== null;
}
/**
 * Load embeddings index from disk
 */
function loadEmbeddingsIndex() {
    const indexPath = path.join(EMBEDDINGS_DIR, "index.json");
    if (fs.existsSync(indexPath)) {
        try {
            embeddingsIndex = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
            console.error(`✓ Loaded ${embeddingsIndex?.count || 0} embeddings from local storage`);
        }
        catch (error) {
            console.error("⚠ Failed to load embeddings index:", error);
            embeddingsIndex = null;
        }
    }
    else {
        console.error("⚠ No embeddings index found. Run embed-corpus to generate.");
        embeddingsIndex = null;
    }
}
/**
 * Save embeddings index to disk
 */
function saveEmbeddingsIndex() {
    if (!embeddingsIndex)
        return;
    // Ensure directory exists
    if (!fs.existsSync(EMBEDDINGS_DIR)) {
        fs.mkdirSync(EMBEDDINGS_DIR, { recursive: true });
    }
    const indexPath = path.join(EMBEDDINGS_DIR, "index.json");
    embeddingsIndex.updated_at = new Date().toISOString();
    embeddingsIndex.count = embeddingsIndex.records.length;
    fs.writeFileSync(indexPath, JSON.stringify(embeddingsIndex, null, 2));
}
/**
 * Generate embedding using Voyage AI
 */
export async function generateEmbedding(text) {
    if (!voyageApiKey) {
        throw new Error("Voyage API key not configured");
    }
    const response = await fetch("https://api.voyageai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${voyageApiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "voyage-3-lite", // Good balance of quality and cost
            input: text,
            input_type: "document",
        }),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Voyage embedding error: ${error}`);
    }
    const data = await response.json();
    return data.data[0].embedding;
}
/**
 * Generate query embedding (optimized for search)
 */
export async function generateQueryEmbedding(text) {
    if (!voyageApiKey) {
        throw new Error("Voyage API key not configured");
    }
    const response = await fetch("https://api.voyageai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${voyageApiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "voyage-3-lite",
            input: text,
            input_type: "query", // Optimized for search queries
        }),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Voyage embedding error: ${error}`);
    }
    const data = await response.json();
    return data.data[0].embedding;
}
/**
 * Store an embedding record
 */
export async function storeEmbedding(record) {
    if (!embeddingsIndex) {
        embeddingsIndex = {
            version: "1.0.0",
            model: "voyage-3-lite",
            dimensions: 512, // voyage-3-lite dimensions
            count: 0,
            updated_at: new Date().toISOString(),
            records: [],
        };
    }
    // Generate embedding if not provided
    const embedding = record.embedding || await generateEmbedding(record.content);
    const id = `${record.category}-${record.source_id}`;
    // Check if record exists
    const existingIndex = embeddingsIndex.records.findIndex(r => r.id === id);
    const newRecord = {
        id,
        category: record.category,
        source_id: record.source_id,
        source_path: record.source_path,
        title: record.title,
        content: record.content,
        embedding,
        metadata: record.metadata || {},
        platforms: record.platforms || [],
        created_at: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
        embeddingsIndex.records[existingIndex] = newRecord;
    }
    else {
        embeddingsIndex.records.push(newRecord);
    }
    saveEmbeddingsIndex();
    return id;
}
/**
 * Search embeddings by similarity
 */
export async function searchEmbeddings(query, options = {}) {
    if (!embeddingsIndex || embeddingsIndex.records.length === 0) {
        return [];
    }
    const queryEmbedding = await generateQueryEmbedding(query);
    const threshold = options.threshold ?? 0.5;
    const limit = options.limit ?? 10;
    // Filter records
    let records = embeddingsIndex.records;
    if (options.category) {
        records = records.filter(r => r.category === options.category);
    }
    if (options.platforms && options.platforms.length > 0) {
        records = records.filter(r => r.platforms?.some(p => options.platforms.includes(p)) ||
            r.platforms?.includes("shared"));
    }
    // Calculate similarities
    const results = records
        .map(record => ({
        id: record.id,
        category: record.category,
        source_id: record.source_id,
        title: record.title,
        content: record.content,
        similarity: cosineSimilarity(queryEmbedding, record.embedding),
        metadata: record.metadata,
    }))
        .filter(r => r.similarity >= threshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    return results;
}
/**
 * Calculate drift score against platform fingerprint
 */
export async function calculateDrift(request, platform) {
    if (!embeddingsIndex) {
        return 0.5; // Neutral if no embeddings
    }
    const requestEmbedding = await generateQueryEmbedding(request);
    // Find platform fingerprint
    const fingerprint = embeddingsIndex.records.find(r => r.category === "fingerprint" && r.source_id === platform);
    if (!fingerprint) {
        return 0.5; // Neutral if no fingerprint
    }
    const similarity = cosineSimilarity(requestEmbedding, fingerprint.embedding);
    return 1 - similarity; // Drift = 1 - similarity
}
/**
 * Activate anchors based on request similarity
 */
export async function activateAnchors(request) {
    if (!embeddingsIndex) {
        return {};
    }
    const requestEmbedding = await generateQueryEmbedding(request);
    const activations = {};
    // Find all anchor embeddings
    const anchors = embeddingsIndex.records.filter(r => r.category === "anchor");
    for (const anchor of anchors) {
        const similarity = cosineSimilarity(requestEmbedding, anchor.embedding);
        activations[anchor.source_id] = Math.round(similarity * 1000) / 1000;
    }
    return activations;
}
/**
 * Detect best platform for a request
 */
export async function detectPlatform(request) {
    if (!embeddingsIndex) {
        return { platform: "astrolabe", score: 0.5 };
    }
    const requestEmbedding = await generateQueryEmbedding(request);
    // Find all fingerprint embeddings
    const fingerprints = embeddingsIndex.records.filter(r => r.category === "fingerprint");
    if (fingerprints.length === 0) {
        return { platform: "astrolabe", score: 0.5 };
    }
    // Calculate similarity to each platform
    const scores = fingerprints.map(fp => ({
        platform: fp.source_id,
        score: cosineSimilarity(requestEmbedding, fp.embedding),
    }));
    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);
    return {
        platform: scores[0].platform,
        score: Math.round(scores[0].score * 1000) / 1000,
        runner_up: scores.length > 1 ? {
            platform: scores[1].platform,
            score: Math.round(scores[1].score * 1000) / 1000,
        } : undefined,
    };
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
 * Get embedding stats
 */
export function getStats() {
    if (!embeddingsIndex) {
        return { configured: false, count: 0, categories: {} };
    }
    const categories = {};
    for (const record of embeddingsIndex.records) {
        categories[record.category] = (categories[record.category] || 0) + 1;
    }
    return {
        configured: true,
        count: embeddingsIndex.records.length,
        categories,
    };
}
/**
 * Helper: Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a, b) {
    if (a.length !== b.length) {
        throw new Error(`Vector length mismatch: ${a.length} vs ${b.length}`);
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0)
        return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
// ─── Captain's Log Embedding Functions ────────────────────────────────────────
const CAPTAINS_LOG_PATH = path.join(ROOT_DIR, "captains-log-embeddings.json");
let captainsLogIndex = null;
/**
 * Load Captain's Log embeddings index from disk
 */
function loadCaptainsLogIndex() {
    if (fs.existsSync(CAPTAINS_LOG_PATH)) {
        try {
            captainsLogIndex = JSON.parse(fs.readFileSync(CAPTAINS_LOG_PATH, "utf-8"));
            console.error(`✓ Loaded ${captainsLogIndex?.count || 0} Captain's Log embeddings`);
        }
        catch (error) {
            console.error("⚠ Failed to load Captain's Log index:", error);
            captainsLogIndex = null;
        }
    }
}
/**
 * Save Captain's Log embeddings index to disk
 */
function saveCaptainsLogIndex() {
    if (!captainsLogIndex)
        return;
    captainsLogIndex.updated_at = new Date().toISOString();
    captainsLogIndex.count = captainsLogIndex.records.length;
    fs.writeFileSync(CAPTAINS_LOG_PATH, JSON.stringify(captainsLogIndex, null, 2));
}
/**
 * Store a Captain's Log entry with embedding
 */
export async function storeCaptainsLogEntry(entry) {
    // Initialize index if needed
    if (!captainsLogIndex) {
        loadCaptainsLogIndex();
        if (!captainsLogIndex) {
            captainsLogIndex = {
                version: "1.0.0",
                model: "voyage-3-lite",
                count: 0,
                updated_at: new Date().toISOString(),
                records: [],
            };
        }
    }
    // Generate embedding
    const embedding = await generateEmbedding(entry.content);
    // Get anchor activations
    const anchor_activations = await activateAnchors(entry.content);
    // Check if record exists
    const existingIndex = captainsLogIndex.records.findIndex(r => r.id === entry.id);
    const record = {
        id: entry.id,
        platform: entry.platform,
        content: entry.content,
        context_type: entry.context_type,
        stardate: entry.stardate,
        tags: entry.tags,
        embedding,
        anchor_activations,
        created_at: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
        captainsLogIndex.records[existingIndex] = record;
    }
    else {
        captainsLogIndex.records.push(record);
    }
    saveCaptainsLogIndex();
    return entry.id;
}
/**
 * Search Captain's Log entries by semantic similarity
 */
export async function searchCaptainsLog(query, options = {}) {
    // Initialize index if needed
    if (!captainsLogIndex) {
        loadCaptainsLogIndex();
    }
    if (!captainsLogIndex || captainsLogIndex.records.length === 0) {
        return [];
    }
    const queryEmbedding = await generateQueryEmbedding(query);
    const threshold = options.threshold ?? 0.4; // Lower threshold for Captain's Log
    const limit = options.limit ?? 10;
    // Filter records
    let records = captainsLogIndex.records;
    if (options.platform) {
        records = records.filter(r => r.platform === options.platform);
    }
    if (options.context) {
        records = records.filter(r => r.context_type === options.context);
    }
    // Calculate similarities
    const results = records
        .map(record => ({
        id: record.id,
        platform: record.platform,
        content: record.content,
        context_type: record.context_type,
        stardate: record.stardate,
        tags: record.tags,
        similarity: cosineSimilarity(queryEmbedding, record.embedding),
        anchor_activations: record.anchor_activations,
    }))
        .filter(r => r.similarity >= threshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    return results;
}
/**
 * Get recent Captain's Log entries
 */
export function getRecentCaptainsLogs(options = {}) {
    // Initialize index if needed
    if (!captainsLogIndex) {
        loadCaptainsLogIndex();
    }
    if (!captainsLogIndex || captainsLogIndex.records.length === 0) {
        return [];
    }
    const limit = options.limit ?? 20;
    let records = captainsLogIndex.records;
    if (options.platform) {
        records = records.filter(r => r.platform === options.platform);
    }
    // Sort by stardate descending and take limit
    return records
        .sort((a, b) => b.stardate.localeCompare(a.stardate))
        .slice(0, limit)
        .map(({ embedding, ...rest }) => rest); // Remove embedding from response
}
/**
 * Get Captain's Log stats
 */
export function getCaptainsLogStats() {
    if (!captainsLogIndex) {
        loadCaptainsLogIndex();
    }
    if (!captainsLogIndex) {
        return { count: 0, platforms: {}, contexts: {} };
    }
    const platforms = {};
    const contexts = {};
    for (const record of captainsLogIndex.records) {
        platforms[record.platform] = (platforms[record.platform] || 0) + 1;
        if (record.context_type) {
            contexts[record.context_type] = (contexts[record.context_type] || 0) + 1;
        }
    }
    return {
        count: captainsLogIndex.records.length,
        platforms,
        contexts,
    };
}
