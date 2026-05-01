#!/bin/bash

# Configure environment for FastAPI backend communication

echo "🔧 Configuring RentProof Frontend for FastAPI Backend..."

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local..."
    cat > .env.local << 'EOF'
# Frontend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Firebase Configuration (update with your values)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
EOF
    echo "✅ .env.local created"
else
    echo "ℹ️  .env.local already exists"
fi

echo ""
echo "✅ Configuration complete!"
echo ""
echo "Make sure the backend is running before starting the frontend:"
echo "  cd backend && python main.py"
echo ""
