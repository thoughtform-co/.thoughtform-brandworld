-- Thoughtform Semantic Design System Schema
-- Requires pgvector extension for embeddings

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- SEMANTIC EMBEDDINGS TABLE
-- Stores all embedded content for semantic search
-- ============================================

CREATE TABLE IF NOT EXISTS semantic_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content identification
  category TEXT NOT NULL CHECK (category IN (
    'philosophy',
    'platform_identity', 
    'anchor',
    'pattern',
    'reference',
    'component',
    'fingerprint'
  )),
  
  -- Source reference
  source_id TEXT NOT NULL,          -- e.g., "astrolabe", "NAVIGATION", "ref-nasa-1969"
  source_path TEXT,                 -- File path in repo
  
  -- Content
  title TEXT NOT NULL,
  content TEXT NOT NULL,            -- The text that was embedded
  
  -- Embedding vector (1536 dimensions for OpenAI ada-002, adjust as needed)
  embedding vector(1536),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',      -- Additional searchable metadata
  
  -- Platform affinity (for filtering)
  platforms TEXT[] DEFAULT '{}',    -- Which platforms this applies to
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient search
CREATE INDEX IF NOT EXISTS idx_semantic_embeddings_category ON semantic_embeddings(category);
CREATE INDEX IF NOT EXISTS idx_semantic_embeddings_source_id ON semantic_embeddings(source_id);
CREATE INDEX IF NOT EXISTS idx_semantic_embeddings_platforms ON semantic_embeddings USING GIN(platforms);
CREATE INDEX IF NOT EXISTS idx_semantic_embeddings_metadata ON semantic_embeddings USING GIN(metadata);

-- Vector similarity search index (IVFFlat for larger datasets)
CREATE INDEX IF NOT EXISTS idx_semantic_embeddings_vector ON semantic_embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);


-- ============================================
-- PLATFORM FINGERPRINTS TABLE
-- Stores platform identity vectors for drift detection
-- ============================================

CREATE TABLE IF NOT EXISTS platform_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  platform TEXT UNIQUE NOT NULL,    -- astrolabe, atlas, ledger-dark, ledger-light, marketing
  version TEXT NOT NULL,
  
  -- Identity description (source for embedding)
  identity_short TEXT NOT NULL,
  identity_extended TEXT NOT NULL,
  
  -- Anchor weights (0-1 for each anchor)
  anchor_weights JSONB NOT NULL DEFAULT '{
    "NAVIGATION": 0,
    "INSTRUMENT": 0,
    "LIVING_GEOMETRY": 0,
    "GRADIENT": 0,
    "THRESHOLD": 0,
    "SIGNAL": 0
  }',
  
  -- Composite fingerprint embedding
  fingerprint_embedding vector(1536),
  
  -- Keywords for fallback matching
  keywords TEXT[] DEFAULT '{}',
  
  -- Full fingerprint data
  fingerprint_data JSONB NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_platform_fingerprints_platform ON platform_fingerprints(platform);
CREATE INDEX IF NOT EXISTS idx_platform_fingerprints_vector ON platform_fingerprints 
  USING ivfflat (fingerprint_embedding vector_cosine_ops)
  WITH (lists = 10);


-- ============================================
-- DESIGN DECISIONS TABLE
-- Audit trail for validated expansions and decisions
-- ============================================

CREATE TABLE IF NOT EXISTS design_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Request context
  request_text TEXT NOT NULL,
  request_embedding vector(1536),
  
  -- Platform context
  detected_platform TEXT,
  platform_alignment_score FLOAT,   -- 0-1, higher = better alignment
  
  -- Anchor activation
  activated_anchors JSONB NOT NULL DEFAULT '{}',  -- {"NAVIGATION": 0.8, "INSTRUMENT": 0.6, ...}
  
  -- Pattern selection
  selected_patterns TEXT[] DEFAULT '{}',
  suggested_components TEXT[] DEFAULT '{}',
  
  -- Validation results
  drift_score FLOAT,                -- 1 - cosine_similarity(request, fingerprint)
  validation_status TEXT CHECK (validation_status IN (
    'approved',      -- drift < 0.2
    'expansion',     -- drift 0.2-0.4, documented as valid expansion
    'edge_case',     -- drift 0.4-0.6, flagged for review
    'violation',     -- drift > 0.6
    'pending'        -- awaiting review
  )),
  
  violated_antipatterns TEXT[] DEFAULT '{}',
  
  -- Human review
  reviewed_by TEXT,
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_design_decisions_platform ON design_decisions(detected_platform);
CREATE INDEX IF NOT EXISTS idx_design_decisions_status ON design_decisions(validation_status);
CREATE INDEX IF NOT EXISTS idx_design_decisions_created ON design_decisions(created_at DESC);


-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to search embeddings by similarity
CREATE OR REPLACE FUNCTION search_semantic_embeddings(
  query_embedding vector(1536),
  match_category TEXT DEFAULT NULL,
  match_platforms TEXT[] DEFAULT NULL,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  category TEXT,
  source_id TEXT,
  title TEXT,
  content TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    se.id,
    se.category,
    se.source_id,
    se.title,
    se.content,
    1 - (se.embedding <=> query_embedding) AS similarity,
    se.metadata
  FROM semantic_embeddings se
  WHERE 
    (match_category IS NULL OR se.category = match_category)
    AND (match_platforms IS NULL OR se.platforms && match_platforms)
    AND (1 - (se.embedding <=> query_embedding)) > match_threshold
  ORDER BY se.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


-- Function to calculate drift score against platform fingerprint
CREATE OR REPLACE FUNCTION calculate_drift_score(
  request_embedding vector(1536),
  target_platform TEXT
)
RETURNS FLOAT
LANGUAGE plpgsql
AS $$
DECLARE
  platform_embedding vector(1536);
  drift FLOAT;
BEGIN
  SELECT fingerprint_embedding INTO platform_embedding
  FROM platform_fingerprints
  WHERE platform = target_platform;
  
  IF platform_embedding IS NULL THEN
    RETURN 1.0;  -- Maximum drift if platform not found
  END IF;
  
  -- Drift = 1 - cosine_similarity
  drift := 1 - (1 - (request_embedding <=> platform_embedding));
  
  RETURN drift;
END;
$$;


-- Function to activate anchors based on request similarity
CREATE OR REPLACE FUNCTION activate_anchors(
  query_embedding vector(1536)
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  anchor_record RECORD;
  result JSONB := '{}';
  similarity FLOAT;
BEGIN
  FOR anchor_record IN 
    SELECT source_id, embedding
    FROM semantic_embeddings
    WHERE category = 'anchor'
  LOOP
    similarity := 1 - (query_embedding <=> anchor_record.embedding);
    result := result || jsonb_build_object(anchor_record.source_id, round(similarity::numeric, 3));
  END LOOP;
  
  RETURN result;
END;
$$;


-- Function to get validation status based on drift score
CREATE OR REPLACE FUNCTION get_validation_status(drift_score FLOAT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  IF drift_score < 0.2 THEN
    RETURN 'approved';
  ELSIF drift_score < 0.4 THEN
    RETURN 'expansion';
  ELSIF drift_score < 0.6 THEN
    RETURN 'edge_case';
  ELSE
    RETURN 'violation';
  END IF;
END;
$$;


-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_semantic_embeddings_updated_at
  BEFORE UPDATE ON semantic_embeddings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_fingerprints_updated_at
  BEFORE UPDATE ON platform_fingerprints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- ROW LEVEL SECURITY (Optional)
-- ============================================

-- Enable RLS on tables
ALTER TABLE semantic_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_decisions ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access" ON semantic_embeddings
  FOR SELECT USING (true);

CREATE POLICY "Allow read access" ON platform_fingerprints
  FOR SELECT USING (true);

CREATE POLICY "Allow read access" ON design_decisions
  FOR SELECT USING (true);

-- Insert/Update policies (adjust based on your auth setup)
CREATE POLICY "Allow insert" ON semantic_embeddings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert" ON platform_fingerprints
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert" ON design_decisions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update" ON semantic_embeddings
  FOR UPDATE USING (true);

CREATE POLICY "Allow update" ON platform_fingerprints
  FOR UPDATE USING (true);

CREATE POLICY "Allow update" ON design_decisions
  FOR UPDATE USING (true);


-- ============================================
-- CAPTAIN'S LOG TABLE
-- Voice-driven thought capture with platform routing
-- Star Trek-inspired logging for the Thoughtform journey
-- ============================================

CREATE TABLE IF NOT EXISTS captains_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Entry content
  raw_transcription TEXT NOT NULL,      -- Original voice transcription
  cleaned_content TEXT NOT NULL,        -- Processed/cleaned content
  
  -- Routing
  platform TEXT NOT NULL CHECK (platform IN (
    'thoughtform',   -- General Thoughtform insights
    'atlas',         -- Atlas creature/entity ideas
    'ledger',        -- Ledger terminal/financial thoughts
    'astrolabe',     -- Astrolabe/Canon navigation ideas
    'starhaven',     -- Starhaven creative works
    'journal'        -- Personal journey entries
  )),
  trigger_phrase TEXT,                  -- "Captain's Log", "Atlas entry", etc.
  
  -- Semantic
  embedding vector(1024),               -- Voyage AI voyage-3-lite dimensions
  anchor_activations JSONB DEFAULT '{}', -- {"NAVIGATION": 0.8, "SIGNAL": 0.6, ...}
  
  -- Context
  context_type TEXT CHECK (context_type IN (
    'insight',       -- Realization or understanding
    'idea',          -- New concept or possibility
    'frustration',   -- Challenge or barrier
    'breakthrough',  -- Major unlock
    'question',      -- Open inquiry
    'reflection'     -- Looking back on journey
  )),
  tags TEXT[] DEFAULT '{}',
  
  -- Source
  source TEXT NOT NULL CHECK (source IN ('voice', 'mcp', 'manual')),
  session_id TEXT,                      -- Group related entries
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  stardate TEXT                         -- Star Trek-style stardate (fun!)
);

-- Indexes for Captain's Log
CREATE INDEX IF NOT EXISTS idx_captains_log_platform ON captains_log(platform);
CREATE INDEX IF NOT EXISTS idx_captains_log_context ON captains_log(context_type);
CREATE INDEX IF NOT EXISTS idx_captains_log_created ON captains_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_captains_log_tags ON captains_log USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_captains_log_session ON captains_log(session_id);

-- Vector similarity search index for Captain's Log
CREATE INDEX IF NOT EXISTS idx_captains_log_vector ON captains_log 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

-- Enable RLS on Captain's Log
ALTER TABLE captains_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access" ON captains_log
  FOR SELECT USING (true);

CREATE POLICY "Allow insert" ON captains_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update" ON captains_log
  FOR UPDATE USING (true);


-- ============================================
-- CAPTAIN'S LOG HELPER FUNCTIONS
-- ============================================

-- Function to search Captain's Log by semantic similarity
CREATE OR REPLACE FUNCTION search_captains_log(
  query_embedding vector(1024),
  match_platform TEXT DEFAULT NULL,
  match_context TEXT DEFAULT NULL,
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  platform TEXT,
  cleaned_content TEXT,
  context_type TEXT,
  stardate TEXT,
  created_at TIMESTAMPTZ,
  similarity FLOAT,
  anchor_activations JSONB,
  tags TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cl.id,
    cl.platform,
    cl.cleaned_content,
    cl.context_type,
    cl.stardate,
    cl.created_at,
    1 - (cl.embedding <=> query_embedding) AS similarity,
    cl.anchor_activations,
    cl.tags
  FROM captains_log cl
  WHERE 
    cl.embedding IS NOT NULL
    AND (match_platform IS NULL OR cl.platform = match_platform)
    AND (match_context IS NULL OR cl.context_type = match_context)
    AND (1 - (cl.embedding <=> query_embedding)) > match_threshold
  ORDER BY cl.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


-- Function to get recent log entries
CREATE OR REPLACE FUNCTION get_recent_logs(
  entry_platform TEXT DEFAULT NULL,
  entry_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  platform TEXT,
  cleaned_content TEXT,
  context_type TEXT,
  stardate TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cl.id,
    cl.platform,
    cl.cleaned_content,
    cl.context_type,
    cl.stardate,
    cl.created_at,
    cl.tags
  FROM captains_log cl
  WHERE (entry_platform IS NULL OR cl.platform = entry_platform)
  ORDER BY cl.created_at DESC
  LIMIT entry_count;
END;
$$;


-- Function to generate a stardate (Star Trek TNG-style)
-- Format: YYYYD.D where YYYY is year and D.D is day fraction
CREATE OR REPLACE FUNCTION generate_stardate()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  current_year INT;
  day_of_year INT;
  total_days INT;
  stardate_fraction NUMERIC;
BEGIN
  current_year := EXTRACT(YEAR FROM NOW());
  day_of_year := EXTRACT(DOY FROM NOW());
  
  -- Leap year check
  IF (current_year % 4 = 0 AND current_year % 100 != 0) OR (current_year % 400 = 0) THEN
    total_days := 366;
  ELSE
    total_days := 365;
  END IF;
  
  -- Calculate fraction of year (0-9.9)
  stardate_fraction := ROUND((day_of_year::NUMERIC / total_days) * 10, 1);
  
  RETURN current_year || stardate_fraction;
END;
$$;

