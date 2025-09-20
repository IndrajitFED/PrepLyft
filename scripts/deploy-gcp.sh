#!/bin/bash

# ☁️ Google Cloud Platform Deployment Script
# Deploys your Interview Booking Project to GCP with GoDaddy domain

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
REGION="us-central1"
DOMAIN=""

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

# Check if gcloud is installed
check_gcloud() {
    log_header "Checking Google Cloud CLI"
    
    if ! command -v gcloud &> /dev/null; then
        log_error "Google Cloud CLI not found"
        log_info "Please install Google Cloud CLI:"
        echo "1. Go to: https://cloud.google.com/sdk/docs/install"
        echo "2. Download and install for your operating system"
        echo "3. Run 'gcloud init' to authenticate"
        exit 1
    fi
    
    log_success "Google Cloud CLI is installed"
}

# Setup GCP project
setup_gcp_project() {
    log_header "Setting up GCP Project"
    
    log_info "GCP Project Setup Instructions:"
    echo "1. Go to https://console.cloud.google.com/"
    echo "2. Create a new project:"
    echo "   - Click 'Create Project'"
    echo "   - Enter project name: interview-booking"
    echo "   - Click 'Create'"
    echo "3. Enable billing (required for free tier)"
    echo "4. Get your project ID"
    echo ""
    
    read -p "Enter your GCP Project ID: " PROJECT_ID
    
    if [ -z "$PROJECT_ID" ]; then
        log_error "Project ID is required"
        exit 1
    fi
    
    # Set project
    gcloud config set project $PROJECT_ID
    
    log_success "GCP project configured: $PROJECT_ID"
}

# Enable required APIs
enable_apis() {
    log_header "Enabling Required APIs"
    
    log_info "Enabling GCP APIs..."
    
    gcloud services enable run.googleapis.com
    gcloud services enable sqladmin.googleapis.com
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable storage.googleapis.com
    
    log_success "APIs enabled successfully"
}

# Deploy backend to Cloud Run
deploy_backend() {
    log_header "Deploying Backend to Cloud Run"
    
    cd "$BACKEND_DIR"
    
    log_info "Building and deploying backend..."
    
    gcloud run deploy interview-booking-api \
        --source . \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 5000 \
        --memory 1Gi \
        --cpu 1 \
        --min-instances 0 \
        --max-instances 10 \
        --set-env-vars="NODE_ENV=production,PORT=5000"
    
    # Get backend URL
    BACKEND_URL=$(gcloud run services describe interview-booking-api --region=$REGION --format="value(status.url)")
    
    log_success "Backend deployed to: $BACKEND_URL"
    
    cd ..
}

# Deploy frontend to Cloud Run
deploy_frontend() {
    log_header "Deploying Frontend to Cloud Run"
    
    cd "$FRONTEND_DIR"
    
    # Build frontend
    log_info "Building frontend..."
    npm run build
    
    # Create Dockerfile for frontend
    log_info "Creating frontend Dockerfile..."
    cat > Dockerfile << 'EOF'
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
    
    # Create nginx configuration
    log_info "Creating nginx configuration..."
    cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files \$uri \$uri/ /index.html;
        }
        
        location /api {
            proxy_pass $BACKEND_URL;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF
    
    # Deploy frontend
    log_info "Deploying frontend..."
    gcloud run deploy interview-booking-frontend \
        --source . \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 80 \
        --memory 512Mi \
        --cpu 0.5 \
        --min-instances 0 \
        --max-instances 5
    
    # Get frontend URL
    FRONTEND_URL=$(gcloud run services describe interview-booking-frontend --region=$REGION --format="value(status.url)")
    
    log_success "Frontend deployed to: $FRONTEND_URL"
    
    cd ..
}

# Setup Cloud SQL database
setup_database() {
    log_header "Setting up Cloud SQL Database"
    
    log_info "Creating Cloud SQL instance..."
    
    # Create Cloud SQL instance
    gcloud sql instances create interview-booking-db \
        --database-version=POSTGRES_13 \
        --tier=db-f1-micro \
        --region=$REGION \
        --storage-type=SSD \
        --storage-size=10GB \
        --root-password=temp-password-123
    
    # Create database
    log_info "Creating database..."
    gcloud sql databases create interview_booking \
        --instance=interview-booking-db
    
    # Create user
    log_info "Creating database user..."
    gcloud sql users create app_user \
        --instance=interview-booking-db \
        --password=secure-password-123
    
    # Get connection name
    CONNECTION_NAME=$(gcloud sql instances describe interview-booking-db --format="value(connectionName)")
    
    log_success "Database created successfully"
    log_info "Connection name: $CONNECTION_NAME"
    
    # Update backend with database connection
    log_info "Updating backend environment variables..."
    gcloud run services update interview-booking-api \
        --region=$REGION \
        --set-env-vars="DATABASE_URL=postgresql://app_user:secure-password-123@/interview_booking?host=/cloudsql/$CONNECTION_NAME"
}

# Setup domain
setup_domain() {
    log_header "Setting up Domain"
    
    log_info "Domain Setup Instructions:"
    echo "1. Go to https://www.godaddy.com/"
    echo "2. Search for your desired domain"
    echo "3. Purchase domain (.com for $12.99/year)"
    echo "4. Enable domain privacy protection"
    echo ""
    
    read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN
    
    if [ -z "$DOMAIN" ]; then
        log_warning "No domain provided. You can set it up later."
        return
    fi
    
    log_info "Configuring custom domain in GCP..."
    
    # Map custom domain to frontend
    gcloud run domain-mappings create \
        --service=interview-booking-frontend \
        --domain=$DOMAIN \
        --region=$REGION
    
    # Map API subdomain
    gcloud run domain-mappings create \
        --service=interview-booking-api \
        --domain=api.$DOMAIN \
        --region=$REGION
    
    log_success "Custom domain configured: $DOMAIN"
    
    # Show DNS configuration
    log_info "DNS Configuration for GoDaddy:"
    echo "Type    Name    Value"
    echo "A       @       $FRONTEND_URL"
    echo "CNAME   www     $FRONTEND_URL"
    echo "CNAME   api     $BACKEND_URL"
}

# Show deployment summary
show_summary() {
    log_header "Deployment Summary"
    
    echo ""
    echo "🎉 Your Interview Booking Project is now deployed on Google Cloud Platform!"
    echo ""
    echo "📱 Frontend: $FRONTEND_URL"
    echo "🔧 Backend:  $BACKEND_URL"
    echo "💾 Database: Cloud SQL (PostgreSQL)"
    echo ""
    
    if [ ! -z "$DOMAIN" ]; then
        echo "🌐 Custom Domain: https://$DOMAIN"
        echo "🔗 API Endpoint: https://api.$DOMAIN"
    fi
    
    echo ""
    echo "💰 Cost Breakdown:"
    echo "   - Free Tier: $0 for 90 days ($300 credit)"
    echo "   - After Free Tier: $18-33/month"
    echo "   - Domain: $12.99/year (GoDaddy)"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Configure your domain DNS (if using custom domain)"
    echo "2. Test your application"
    echo "3. Set up monitoring and alerts"
    echo "4. Configure environment variables"
    echo "5. Set up SSL certificates (automatic with Cloud Run)"
    echo ""
    log_success "GCP deployment completed successfully!"
}

# Main deployment function
deploy_gcp() {
    log_header "Google Cloud Platform Deployment"
    echo "This will deploy your Interview Booking Project to GCP"
    echo ""
    
    # Check gcloud
    check_gcloud
    
    # Setup project
    setup_gcp_project
    
    # Enable APIs
    enable_apis
    
    # Deploy backend
    deploy_backend
    
    # Deploy frontend
    deploy_frontend
    
    # Setup database
    setup_database
    
    # Setup domain
    setup_domain
    
    # Show summary
    show_summary
}

# Show help
show_help() {
    echo "☁️ Google Cloud Platform Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "This script deploys your Interview Booking Project to Google Cloud Platform"
    echo ""
    echo "Requirements:"
    echo "- Google Cloud CLI installed"
    echo "- GCP project with billing enabled"
    echo "- Domain from GoDaddy (optional)"
    echo ""
    echo "Cost:"
    echo "- Free Tier: $0 for 90 days ($300 credit)"
    echo "- After Free Tier: $18-33/month"
    echo ""
    echo "Options:"
    echo "  -h, --help       Show this help message"
    echo ""
    echo "Example:"
    echo "  $0"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
deploy_gcp
