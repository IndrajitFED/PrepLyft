#!/bin/bash

# 🔐 Real Credentials Setup Script
# This script helps you set up your actual Google OAuth credentials
# Run this AFTER you've cloned the repository and want to use real credentials

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

setup_real_credentials() {
    log_header "Setting up Real Google OAuth Credentials"
    
    echo ""
    echo "📝 Please enter your Google OAuth credentials:"
    echo ""
    
    # Get Google Client ID
    read -p "Google Client ID: " GOOGLE_CLIENT_ID
    if [ -z "$GOOGLE_CLIENT_ID" ]; then
        log_error "Google Client ID cannot be empty"
        exit 1
    fi
    
    # Get Google Client Secret
    read -s -p "Google Client Secret: " GOOGLE_CLIENT_SECRET
    echo ""
    if [ -z "$GOOGLE_CLIENT_SECRET" ]; then
        log_error "Google Client Secret cannot be empty"
        exit 1
    fi
    
    # Get MongoDB URI
    read -p "MongoDB URI (press Enter to use default): " MONGODB_URI
    if [ -z "$MONGODB_URI" ]; then
        MONGODB_URI="mongodb+srv://indrajitshinde234_db_user:gBmcCasNcxVR1hm8@interviewprep.0hx9pkr.mongodb.net/?retryWrites=true&w=majority&appName=InterviewPrep"
    fi
    
    # Generate secure JWT secret
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    log_info "Creating backend .env file with real credentials..."
    
    # Create backend .env file with real credentials
    cat > backend/.env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=${MONGODB_URI}

# JWT Configuration
JWT_SECRET=${JWT_SECRET}

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email Configuration (for production)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# Google Calendar API (for mentor calendar integration)
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
GOOGLE_REDIRECT_URI=http://localhost:5000/api/mentor-calendar/callback

# Google Service Account (Alternative - for server-to-server auth)
# GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}

# Google Application Default Credentials
# GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_RCoLR9QellVUtF
RAZORPAY_KEY_SECRET=IGTN9UfkeDMvx3TNKpDYhHuO
EOF
    
    log_success "Backend .env file created with real credentials"
    
    # Create frontend .env file
    cat > frontend/.env << EOF
# Frontend Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MockAce
EOF
    
    log_success "Frontend .env file created"
}

show_security_notes() {
    log_header "Security Notes"
    
    echo ""
    echo "🔒 IMPORTANT SECURITY REMINDERS:"
    echo "   1. Your .env files are in .gitignore (they won't be committed)"
    echo "   2. Never share your .env files or commit them to version control"
    echo "   3. Use different credentials for production deployment"
    echo "   4. Keep your Google OAuth credentials secure"
    echo ""
    echo "🚀 Your application is now ready to run with real credentials!"
    echo ""
}

# Main execution
log_header "Real Credentials Setup for Interview Booking Project"

# Check if Node.js is available for JWT secret generation
if ! command -v node &> /dev/null; then
    log_error "Node.js is required to generate JWT secret"
    log_info "Please install Node.js and try again"
    exit 1
fi

setup_real_credentials
show_security_notes

log_success "Real credentials setup completed!"
