#!/bin/bash
# Context7 Documentation Fetcher
# Usage: ./fetch-docs.sh <library_name_or_id> [tokens]
#
# Examples:
#   ./fetch-docs.sh "next.js"
#   ./fetch-docs.sh "vercel/next.js" 10000
#   ./fetch-docs.sh "supabase" 5000

LIBRARY="$1"
TOKENS="${2:-5000}"

if [ -z "$LIBRARY" ]; then
  echo "Usage: ./fetch-docs.sh <library_name_or_id> [tokens]"
  echo ""
  echo "Examples:"
  echo "  ./fetch-docs.sh next.js"
  echo "  ./fetch-docs.sh vercel/next.js 10000"
  echo "  ./fetch-docs.sh supabase"
  exit 1
fi

# Check if it looks like a full ID (org/repo format)
if [[ "$LIBRARY" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ ]]; then
  # Direct library ID provided
  LIBRARY_ID="/$LIBRARY"
  echo "Using library ID: $LIBRARY_ID"
else
  # Search for the library first
  echo "Searching for library: $LIBRARY"
  
  SEARCH_RESULT=$(curl -s "https://context7.com/api/v1/search?query=$LIBRARY")
  
  # Extract the first result ID (prefer org/repo format over /websites/ or /llmstxt/)
  LIBRARY_ID=$(echo "$SEARCH_RESULT" | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//;s/"//')
  
  if [ -z "$LIBRARY_ID" ]; then
    echo "Error: No library found matching '$LIBRARY'"
    exit 1
  fi
  
  echo "Found: $LIBRARY_ID"
fi

URL="https://context7.com/api/v1${LIBRARY_ID}/llms.txt?tokens=$TOKENS"
echo "Fetching documentation from: $URL"
echo "---"

curl -s "$URL"
