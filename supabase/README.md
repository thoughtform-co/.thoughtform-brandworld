# Thoughtform Semantic Design System - Supabase Setup

This directory contains the database schema for the semantic design system's embedding infrastructure.

## Prerequisites

1. A Supabase project (create at [supabase.com](https://supabase.com))
2. pgvector extension enabled (included by default in Supabase)

## Setup

### 1. Run the Schema

Go to the SQL Editor in your Supabase dashboard and run `schema.sql`.

### 2. Environment Variables

Create a `.env.local` file in the workspace root with:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key      # For generating embeddings (semantic_embeddings)
VOYAGE_API_KEY=your-voyage-key      # For Captain's Log embeddings (voyage-3-lite)
WISPR_API_KEY=your-wispr-key        # For voice transcription (optional)
```

### 3. Initial Data Load

Run the embedding pipeline script:

```bash
cd mcp-server
npm run embed-corpus
```

## Tables

### `semantic_embeddings`
Stores all embedded content for semantic search:
- Philosophy descriptions
- Platform identity paragraphs
- Anchor definitions
- Pattern descriptions
- Reference entries

### `platform_fingerprints`
Stores platform identity vectors for drift detection:
- Composite embeddings from identity + anchor weights
- Used to validate new designs against platform character

### `design_decisions`
Audit trail for design decisions:
- Request context and embedding
- Detected platform and alignment score
- Activated anchors and selected patterns
- Drift score and validation status
- Human review notes

### `captains_log`
Voice-driven thought capture system (Star Trek-inspired):
- Raw and cleaned transcriptions
- Platform routing (thoughtform, atlas, ledger, astrolabe, starhaven, journal)
- Semantic embeddings for search (Voyage AI, 1024 dimensions)
- Anchor activations per entry
- Context types: insight, idea, frustration, breakthrough, question, reflection
- Tags for categorization
- Star Trek-style stardates

**Voice Command Triggers:**
| Trigger | Routes To |
|---------|-----------|
| "Captain's Log" | thoughtform |
| "Atlas entry" | atlas |
| "Ledger note" | ledger |
| "Astrolabe log" | astrolabe |
| "Starhaven log" | starhaven |
| "Journal this" | journal |

## Functions

### `search_semantic_embeddings(query_embedding, category?, platforms?, threshold?, count?)`
Search for similar content by embedding vector.

### `calculate_drift_score(request_embedding, platform)`
Calculate how far a design request drifts from a platform's fingerprint.

### `activate_anchors(query_embedding)`
Return anchor activation weights for a given request.

### `get_validation_status(drift_score)`
Convert drift score to validation status (approved/expansion/edge_case/violation).

### `search_captains_log(query_embedding, platform?, context?, threshold?, count?)`
Semantic search through Captain's Log entries by embedding vector.

### `get_recent_logs(platform?, count?)`
Get recent Captain's Log entries, optionally filtered by platform.

### `generate_stardate()`
Generate a Star Trek TNG-style stardate (e.g., "20256.8").

## Embedding Model

The schema is configured for OpenAI `text-embedding-ada-002` (1536 dimensions).

To use a different model, modify the vector dimensions in `schema.sql`:
- `vector(1536)` → `vector(768)` for smaller models
- `vector(1536)` → `vector(3072)` for larger models


