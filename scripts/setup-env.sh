#!/bin/bash

# 🔐 Environment Setup Script
# This script helps you set up environment variables securely

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_header() {
    echo -e "${BLUE}🔐 $1${NC}"
}

setup_backend_env() {
    log_header "Setting up Backend Environment Variables"
    
    # Create .env file for backend
    cat > backend/.env << 'EOF'
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://indrajitshinde234_db_user:gBmcCasNcxVR1hm8@interviewprep.0hx9pkr.mongodb.net/?retryWrites=true&w=majority&appName=InterviewPrep

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email Configuration (for production)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# Google Calendar API (for mentor calendar integration)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/mentor-calendar/callback

# Google Service Account (Alternative - for server-to-server auth)
# GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}

# Google Application Default Credentials
# GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_RCoLR9QellVUtF
RAZORPAY_KEY_SECRET=IGTN9UfkeDMvx3TNKpDYhHuO
EOF
    
    log_success "Backend .env file created"
}

setup_frontend_env() {
    log_header "Setting up Frontend Environment Variables"
    
    # Create .env file for frontend
    cat > frontend/.env << 'EOF'
# Frontend Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MockAce
EOF
    
    log_success "Frontend .env file created"
}

show_instructions() {
    log_header "Environment Setup Instructions"
    
    echo ""
    echo "🔐 Your environment files have been created:"
    echo "   - backend/.env"
    echo "   - frontend/.env"
    echo ""
    echo "⚠️  IMPORTANT SECURITY NOTES:"
    echo "   1. These .env files are already in .gitignore (they won't be committed)"
    echo "   2. Never commit .env files to version control"
    echo "   3. Use different credentials for production"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Update the JWT_SECRET with a secure random string"
    echo "   2. Update Google OAuth credentials if needed"
    echo "   3. Update MongoDB URI if using a different database"
    echo "   4. Test your application"
    echo ""
    echo "🔧 Generate a secure JWT secret:"
    echo "   node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    echo ""
}

# Main execution
log_header "Environment Setup for Interview Booking Project"

setup_backend_env
setup_frontend_env
show_instructions

log_success "Environment setup completed!"
