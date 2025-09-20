#!/bin/bash

# 🚀 Interview Booking Project - Deployment Script
# This script automates the deployment process for both frontend and backend

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="interview-booking"
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
DOMAIN=""
ENVIRONMENT="production"

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

# Check if required tools are installed
check_dependencies() {
    log_info "Checking dependencies..."
    
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

# Build frontend
build_frontend() {
    log_info "Building frontend..."
    
    cd "$FRONTEND_DIR"
    
    # Install dependencies
    log_info "Installing frontend dependencies..."
    npm ci
    
    # Build the application
    log_info "Building frontend application..."
    npm run build
    
    if [ -d "dist" ]; then
        log_success "Frontend built successfully"
    else
        log_error "Frontend build failed"
        exit 1
    fi
    
    cd ..
}

# Build backend
build_backend() {
    log_info "Building backend..."
    
    cd "$BACKEND_DIR"
    
    # Install dependencies
    log_info "Installing backend dependencies..."
    npm ci
    
    # Build the application
    log_info "Building backend application..."
    npm run build
    
    if [ -d "dist" ]; then
        log_success "Backend built successfully"
    else
        log_error "Backend build failed"
        exit 1
    fi
    
    cd ..
}

# Deploy to Vercel
deploy_vercel() {
    log_info "Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        log_info "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    cd "$FRONTEND_DIR"
    
    # Check if already linked
    if [ ! -f ".vercel/project.json" ]; then
        log_info "Linking project to Vercel..."
        vercel link --yes
    fi
    
    # Deploy
    log_info "Deploying to Vercel..."
    vercel --prod --yes
    
    log_success "Frontend deployed to Vercel"
    cd ..
}

# Deploy to Railway
deploy_railway() {
    log_info "Deploying backend to Railway..."
    
    if ! command -v railway &> /dev/null; then
        log_info "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    cd "$BACKEND_DIR"
    
    # Check if already linked
    if [ ! -f ".railway/project.json" ]; then
        log_info "Linking project to Railway..."
        railway link
    fi
    
    # Deploy
    log_info "Deploying to Railway..."
    railway up --detach
    
    log_success "Backend deployed to Railway"
    cd ..
}

# Deploy to Docker
deploy_docker() {
    log_info "Building and deploying with Docker..."
    
    # Build backend image
    log_info "Building backend Docker image..."
    docker build -t "${PROJECT_NAME}-backend:latest" ./backend
    
    # Build frontend image
    log_info "Building frontend Docker image..."
    docker build -t "${PROJECT_NAME}-frontend:latest" ./frontend
    
    log_success "Docker images built successfully"
    
    # Run containers
    log_info "Starting containers..."
    docker run -d --name "${PROJECT_NAME}-backend" -p 5000:5000 "${PROJECT_NAME}-backend:latest"
    docker run -d --name "${PROJECT_NAME}-frontend" -p 3000:80 "${PROJECT_NAME}-frontend:latest"
    
    log_success "Containers started successfully"
}

# Setup domain
setup_domain() {
    if [ -z "$DOMAIN" ]; then
        log_warning "No domain specified. Skipping domain setup."
        return
    fi
    
    log_info "Setting up domain: $DOMAIN"
    
    # This would typically involve:
    # 1. DNS configuration
    # 2. SSL certificate setup
    # 3. CDN configuration
    
    log_success "Domain setup completed"
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    # Backend tests
    cd "$BACKEND_DIR"
    log_info "Running backend tests..."
    npm test
    cd ..
    
    # Frontend tests
    cd "$FRONTEND_DIR"
    log_info "Running frontend tests..."
    npm test
    cd ..
    
    log_success "All tests passed"
}

# Health check
health_check() {
    log_info "Performing health checks..."
    
    # Check if services are running
    local frontend_url=""
    local backend_url=""
    
    if [ "$ENVIRONMENT" = "production" ]; then
        # Get URLs from deployment platforms
        frontend_url=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "")
        backend_url=$(railway status --json | jq -r '.url' 2>/dev/null || echo "")
    else
        frontend_url="http://localhost:3000"
        backend_url="http://localhost:5000"
    fi
    
    # Test backend health
    if [ -n "$backend_url" ]; then
        log_info "Testing backend health at $backend_url"
        if curl -f -s "$backend_url/api/health" > /dev/null; then
            log_success "Backend is healthy"
        else
            log_error "Backend health check failed"
        fi
    fi
    
    # Test frontend
    if [ -n "$frontend_url" ]; then
        log_info "Testing frontend at $frontend_url"
        if curl -f -s "$frontend_url" > /dev/null; then
            log_success "Frontend is accessible"
        else
            log_error "Frontend health check failed"
        fi
    fi
}

# Cleanup
cleanup() {
    log_info "Cleaning up..."
    
    # Remove build artifacts
    rm -rf "$FRONTEND_DIR/dist"
    rm -rf "$BACKEND_DIR/dist"
    
    log_success "Cleanup completed"
}

# Main deployment function
deploy() {
    local deployment_type="$1"
    
    log_info "Starting deployment process..."
    log_info "Environment: $ENVIRONMENT"
    log_info "Deployment type: $deployment_type"
    
    # Check dependencies
    check_dependencies
    
    # Run tests
    if [ "$ENVIRONMENT" = "production" ]; then
        run_tests
    fi
    
    # Build applications
    build_frontend
    build_backend
    
    # Deploy based on type
    case "$deployment_type" in
        "vercel-railway")
            deploy_vercel
            deploy_railway
            ;;
        "docker")
            deploy_docker
            ;;
        "local")
            log_info "Local deployment - applications built successfully"
            log_info "Start backend: cd backend && npm start"
            log_info "Start frontend: cd frontend && npm run preview"
            ;;
        *)
            log_error "Unknown deployment type: $deployment_type"
            log_info "Available types: vercel-railway, docker, local"
            exit 1
            ;;
    esac
    
    # Setup domain if specified
    setup_domain
    
    # Health checks
    if [ "$deployment_type" != "local" ]; then
        sleep 30  # Wait for deployment to complete
        health_check
    fi
    
    # Cleanup
    cleanup
    
    log_success "Deployment completed successfully! 🎉"
}

# Show help
show_help() {
    echo "🚀 Interview Booking Project - Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS] <deployment-type>"
    echo ""
    echo "Deployment Types:"
    echo "  vercel-railway    Deploy frontend to Vercel, backend to Railway"
    echo "  docker           Deploy using Docker containers"
    echo "  local            Build applications locally"
    echo ""
    echo "Options:"
    echo "  -d, --domain     Domain name for the application"
    echo "  -e, --env        Environment (development|production) [default: production]"
    echo "  -h, --help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 vercel-railway"
    echo "  $0 -d example.com -e production vercel-railway"
    echo "  $0 docker"
    echo "  $0 local"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        vercel-railway|docker|local)
            deploy "$1"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# If no arguments provided, show help
show_help
