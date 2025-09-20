#!/bin/bash

# 💰 Budget Deployment Script for Interview Booking Project
# Deploys using Cloudflare + DigitalOcean for maximum cost efficiency

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="interview-booking"
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
DEPLOYMENT_TYPE=""

# Functions
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
    echo -e "${PURPLE}🚀 $1${NC}"
}

# Check dependencies
check_dependencies() {
    log_header "Checking Dependencies"
    
    local missing_deps=()
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing dependencies: ${missing_deps[*]}"
        log_info "Please install the missing dependencies and try again."
        exit 1
    fi
    
    log_success "All dependencies are installed"
}

# Deploy to Cloudflare Pages
deploy_cloudflare_pages() {
    log_header "Deploying Frontend to Cloudflare Pages (FREE)"
    
    log_info "Cloudflare Pages Setup Instructions:"
    echo "1. Go to https://pages.cloudflare.com/"
    echo "2. Click 'Connect to Git'"
    echo "3. Select your GitHub repository"
    echo "4. Configure build settings:"
    echo "   - Build command: npm run build"
    echo "   - Build output directory: dist"
    echo "   - Root directory: frontend"
    echo "5. Click 'Save and Deploy'"
    echo ""
    
    read -p "Press Enter when you've completed the Cloudflare Pages setup..."
    
    log_success "Frontend deployment to Cloudflare Pages configured"
}

# Deploy to DigitalOcean App Platform
deploy_digitalocean_app() {
    log_header "Deploying Backend to DigitalOcean App Platform"
    
    log_info "DigitalOcean App Platform Setup Instructions:"
    echo "1. Go to https://cloud.digitalocean.com/apps"
    echo "2. Click 'Create App'"
    echo "3. Connect your GitHub repository"
    echo "4. Configure backend service:"
    echo "   - Source directory: backend"
    echo "   - Build command: npm run build"
    echo "   - Run command: npm start"
    echo "   - Environment: Node.js"
    echo "   - Instance size: Basic ($5/month)"
    echo "5. Set environment variables:"
    echo "   - NODE_ENV=production"
    echo "   - PORT=8080"
    echo "   - MONGODB_URI=your-mongodb-uri"
    echo "   - JWT_SECRET=your-jwt-secret"
    echo "6. Click 'Create Resources'"
    echo ""
    
    read -p "Press Enter when you've completed the DigitalOcean setup..."
    
    log_success "Backend deployment to DigitalOcean configured"
}

# Deploy to Oracle Cloud Always Free
deploy_oracle_cloud() {
    log_header "Deploying to Oracle Cloud Always Free"
    
    log_info "Oracle Cloud Setup Instructions:"
    echo "1. Go to https://cloud.oracle.com/"
    echo "2. Create free account (credit card required for verification)"
    echo "3. Create Always Free ARM-based VM:"
    echo "   - Shape: VM.Standard.A1.Flex"
    echo "   - OCPUs: 2"
    echo "   - Memory: 12GB"
    echo "   - OS: Ubuntu 22.04 LTS"
    echo "4. Connect via SSH and run setup commands"
    echo ""
    
    log_info "Server setup commands (run on your Oracle Cloud VM):"
    echo ""
    echo "# Update system"
    echo "sudo dnf update -y"
    echo ""
    echo "# Install Node.js"
    echo "sudo dnf install nodejs npm git -y"
    echo ""
    echo "# Install PM2"
    echo "sudo npm install -g pm2"
    echo ""
    echo "# Clone repository"
    echo "git clone https://github.com/your-username/your-repo.git"
    echo "cd your-repo"
    echo ""
    echo "# Install dependencies and build"
    echo "npm install"
    echo "npm run build"
    echo ""
    echo "# Start services"
    echo "pm2 start backend/dist/index.js --name 'api'"
    echo "pm2 start 'npm run preview' --name 'frontend' --cwd frontend"
    echo "pm2 startup"
    echo "pm2 save"
    echo ""
    
    read -p "Press Enter when you've completed the Oracle Cloud setup..."
    
    log_success "Oracle Cloud deployment configured"
}

# Setup MongoDB Atlas
setup_mongodb() {
    log_header "Setting up MongoDB Atlas (FREE)"
    
    log_info "MongoDB Atlas Setup Instructions:"
    echo "1. Go to https://www.mongodb.com/cloud/atlas"
    echo "2. Click 'Try Free' and create account"
    echo "3. Create a free cluster (M0 Sandbox):"
    echo "   - Provider: AWS"
    echo "   - Region: Choose closest to your users"
    echo "   - Cluster Tier: M0 Sandbox (FREE)"
    echo "4. Create database user:"
    echo "   - Username: your-username"
    echo "   - Password: generate secure password"
    echo "5. Configure network access:"
    echo "   - Add IP address: 0.0.0.0/0 (for development)"
    echo "6. Get connection string"
    echo ""
    
    read -p "Enter your MongoDB Atlas connection string: " MONGODB_URI
    
    if [ -z "$MONGODB_URI" ]; then
        log_warning "MongoDB URI not provided. You can set it later in your deployment platform."
    else
        log_success "MongoDB URI configured"
    fi
}

# Setup domain with Cloudflare
setup_domain() {
    log_header "Setting up Domain with Cloudflare (FREE)"
    
    log_info "Domain and Cloudflare Setup Instructions:"
    echo "1. Buy domain from Namecheap ($8.88/year) or use existing domain"
    echo "2. Go to https://dash.cloudflare.com/"
    echo "3. Add your domain to Cloudflare"
    echo "4. Update nameservers in your domain registrar:"
    echo "   - Copy nameservers from Cloudflare"
    echo "   - Update in Namecheap/domain registrar"
    echo "5. Configure DNS records:"
    echo "   - A     @       76.76.19.61 (Cloudflare Pages)"
    echo "   - CNAME www     your-app.pages.dev"
    echo "   - CNAME api     your-backend.ondigitalocean.app"
    echo "6. Enable SSL/TLS:"
    echo "   - SSL/TLS mode: Full (strict)"
    echo "   - Always Use HTTPS: On"
    echo ""
    
    read -p "Do you want to setup a custom domain? (y/n): " setup_domain
    
    if [ "$setup_domain" = "y" ]; then
        log_info "Domain setup instructions provided above"
    else
        log_info "Using free subdomains:"
        echo "- Frontend: your-app.pages.dev"
        echo "- Backend: your-backend.ondigitalocean.app"
    fi
}

# Show cost breakdown
show_cost_breakdown() {
    log_header "Cost Breakdown"
    
    case "$DEPLOYMENT_TYPE" in
        "cloudflare-digitalocean")
            echo "💰 Cloudflare + DigitalOcean Costs:"
            echo "   - Frontend (Cloudflare Pages): FREE"
            echo "   - Backend (DigitalOcean App): $5/month"
            echo "   - Database (MongoDB Atlas): FREE"
            echo "   - Domain (Namecheap): $8.88/year"
            echo "   - Total: $5.74/month"
            ;;
        "oracle-cloud")
            echo "💰 Oracle Cloud Always Free Costs:"
            echo "   - Frontend (Oracle VM): FREE"
            echo "   - Backend (Oracle VM): FREE"
            echo "   - Database (MongoDB Atlas): FREE"
            echo "   - Domain (Namecheap): $8.88/year"
            echo "   - Total: $0.74/month"
            ;;
    esac
    
    echo ""
    echo "📊 Scaling Costs:"
    echo "   - 1K users: Same cost"
    echo "   - 10K users: $12/month (DigitalOcean) or $0.74/month (Oracle)"
    echo "   - 100K users: $25/month (DigitalOcean) or $0.74/month (Oracle)"
    echo ""
    echo "🚀 Benefits:"
    echo "   - No surprise bills"
    echo "   - Predictable pricing"
    echo "   - Global CDN (Cloudflare)"
    echo "   - Professional infrastructure"
}

# Show deployment summary
show_summary() {
    log_header "Deployment Summary"
    
    echo ""
    echo "🎉 Your Interview Booking Project deployment is configured!"
    echo ""
    
    case "$DEPLOYMENT_TYPE" in
        "cloudflare-digitalocean")
            echo "📱 Frontend: Cloudflare Pages (FREE)"
            echo "🔧 Backend: DigitalOcean App Platform ($5/month)"
            echo "💾 Database: MongoDB Atlas (FREE)"
            echo "🌐 CDN: Cloudflare (FREE)"
            ;;
        "oracle-cloud")
            echo "📱 Frontend: Oracle Cloud VM (FREE)"
            echo "🔧 Backend: Oracle Cloud VM (FREE)"
            echo "💾 Database: MongoDB Atlas (FREE)"
            echo "🌐 CDN: Cloudflare (FREE)"
            ;;
    esac
    
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Complete the platform-specific setup instructions above"
    echo "2. Configure your domain (optional)"
    echo "3. Test your deployment"
    echo "4. Set up monitoring and alerts"
    echo "5. Share with users!"
    echo ""
    log_success "Budget deployment configuration completed!"
}

# Main deployment function
deploy_budget() {
    local deployment_type="$1"
    DEPLOYMENT_TYPE="$deployment_type"
    
    log_header "Budget Deployment for Interview Booking Project"
    
    case "$deployment_type" in
        "cloudflare-digitalocean")
            echo "Deploying with Cloudflare Pages + DigitalOcean App Platform"
            echo "Cost: $5.74/month (includes domain)"
            ;;
        "oracle-cloud")
            echo "Deploying with Oracle Cloud Always Free"
            echo "Cost: $0.74/month (includes domain)"
            ;;
        *)
            log_error "Unknown deployment type: $deployment_type"
            exit 1
            ;;
    esac
    
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Setup MongoDB
    setup_mongodb
    
    # Deploy based on type
    case "$deployment_type" in
        "cloudflare-digitalocean")
            deploy_cloudflare_pages
            deploy_digitalocean_app
            ;;
        "oracle-cloud")
            deploy_oracle_cloud
            ;;
    esac
    
    # Setup domain
    setup_domain
    
    # Show cost breakdown
    show_cost_breakdown
    
    # Show summary
    show_summary
}

# Show help
show_help() {
    echo "💰 Interview Booking Project - Budget Deployment Script"
    echo ""
    echo "Usage: $0 <deployment-type>"
    echo ""
    echo "Deployment Types:"
    echo "  cloudflare-digitalocean    Cloudflare Pages + DigitalOcean App Platform"
    echo "  oracle-cloud              Oracle Cloud Always Free"
    echo ""
    echo "Cost Comparison:"
    echo "  cloudflare-digitalocean    $5.74/month (professional)"
    echo "  oracle-cloud              $0.74/month (free tier)"
    echo ""
    echo "Requirements:"
    echo "- Node.js and npm installed"
    echo "- Git repository with your code"
    echo "- GitHub account"
    echo "- Domain (optional, $8.88/year)"
    echo ""
    echo "Examples:"
    echo "  $0 cloudflare-digitalocean"
    echo "  $0 oracle-cloud"
}

# Parse command line arguments
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

case $1 in
    cloudflare-digitalocean|oracle-cloud)
        deploy_budget "$1"
        ;;
    -h|--help)
        show_help
        ;;
    *)
        log_error "Unknown deployment type: $1"
        show_help
        exit 1
        ;;
esac
