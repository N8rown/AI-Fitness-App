#!/bin/bash
# Project setup script (optional)

set -e

echo "🏋️ AI Fitness App - Setup Script"
echo "=================================="

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

echo "✅ Docker found"

# Setup backend
echo ""
echo "Setting up backend..."
if [ ! -f "api/.env" ]; then
    cp api/.env.example api/.env
    echo "✅ Created api/.env (update with your secrets)"
else
    echo "✅ api/.env already exists"
fi

# Setup frontend
echo ""
echo "Setting up frontend..."
if [ ! -f "ai-fitness-web/.env.local" ]; then
    cp ai-fitness-web/.env.example ai-fitness-web/.env.local
    echo "✅ Created ai-fitness-web/.env.local"
else
    echo "✅ ai-fitness-web/.env.local already exists"
fi

echo ""
echo "=================================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update api/.env with your OpenAI API key (optional)"
echo "2. Run: docker-compose up"
echo "3. Open: http://localhost:5173"
echo ""
echo "For manual setup, see SETUP.md"
