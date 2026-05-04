#!/bin/bash

# Setup script for RentProof FastAPI Backend

echo "🚀 Setting up RentProof FastAPI Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "📖 Next steps:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Run the server: python main.py"
echo "3. Visit API docs: http://localhost:8000/docs"
echo ""
