#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Local deploy to Firebase Hosting
# Usage:
#   FIREBASE_PROJECT_ID=your-project GEMINI_API_KEY=your-key ./deploy.sh
# ─────────────────────────────────────────────────────────────
set -e

if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌  GEMINI_API_KEY is not set."
  echo "    Usage: GEMINI_API_KEY=your-key FIREBASE_PROJECT_ID=your-project ./deploy.sh"
  exit 1
fi

if [ -z "$FIREBASE_PROJECT_ID" ]; then
  echo "❌  FIREBASE_PROJECT_ID is not set."
  echo "    Usage: GEMINI_API_KEY=your-key FIREBASE_PROJECT_ID=your-project ./deploy.sh"
  exit 1
fi

echo "▶  Building for production..."
npm run build

echo "▶  Deploying to Firebase Hosting (project: $FIREBASE_PROJECT_ID)..."
npx firebase deploy --only hosting --project "$FIREBASE_PROJECT_ID"

echo "✅  Deployed! Visit https://$FIREBASE_PROJECT_ID.web.app"
