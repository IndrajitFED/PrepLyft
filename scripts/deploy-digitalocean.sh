#!/bin/bash

# 🚀 DigitalOcean Single Droplet Deployment Script
# Automates the deployment of Node.js backend and React frontend on a single droplet

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
DROPLET_IP=""
DOMAIN=""
PROJECT_NAME="interview-booking"
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"

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

# Check prerequisites
check_prerequisites() {
    log_header "Checking Prerequisites"
    
    # Check if user has SSH access
    if [ -z "$DROPLET_IP" ]; then
        read -p "Enter your DigitalOcean droplet IP address: " DROPLET_IP
    fi
    
    if [ -z "$DROPLET_IP" ]; then
        log_error "Droplet IP is required"
        exit 1
    fi
    
    log_success "Droplet IP: $DROPLET_IP"
}

# Test SSH connection
test_ssh() {
    log_header "Testing SSH Connection"
    
    log_info "Testing SSH connection to $DROPLET_IP..."
    
    if ssh -o ConnectTimeout=10 -o BatchMode=yes root@$DROPLET_IP exit 2>/dev/null; then
        log_success "SSH connection successful"
    else
        log_error "Cannot connect to droplet via SSH"
        log_info "Please ensure:"
        echo "1. Droplet is running"
        echo "2. SSH key is configured"
        echo "3. Firewall allows SSH (port 22)"
        exit 1
    fi
}

# Setup server environment
setup_server() {
    log_header "Setting up Server Environment"
    
    log_info "Installing system dependencies..."
    
    ssh root@$DROPLET_IP << 'EOF'
        # Update system
        apt update && apt upgrade -y
        
        # Install essential packages
        apt install -y curl wget git unzip software-properties-common ufw
        
        # Install Node.js 18
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt install -y nodejs
        
        # Install Nginx
        apt install -y nginx
        
        # Install MongoDB
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        apt update
        apt install -y mongodb-org
        
        # Start services
        systemctl start nginx mongod
        systemctl enable nginx mongod
        
        # Configure firewall
        ufw allow ssh
        ufw allow 'Nginx Full'
        ufw allow 5000
        ufw --force enable
        
        echo "✅ Server setup completed"
EOF
    
    log_success "Server environment setup completed"
}

# Configure MongoDB
setup_mongodb() {
    log_header "Configuring MongoDB"
    
    log_info "Setting up MongoDB database and user..."
    
    # Generate secure password
    DB_PASSWORD=$(openssl rand -base64 32)
    
    ssh root@$DROPLET_IP << EOF
        # Start MongoDB and create database
        mongosh << 'MONGO_EOF'
use interview_booking
db.createUser({
  user: "app_user",
  pwd: "$DB_PASSWORD",
  roles: ["readWrite"]
})
exit
MONGO_EOF
        
        echo "✅ MongoDB configured with password: $DB_PASSWORD"
EOF
    
    log_success "MongoDB configured successfully"
    log_info "Database password: $DB_PASSWORD"
}

# Deploy application
deploy_application() {
    log_header "Deploying Application"
    
    log_info "Uploading and building application..."
    
    # Create deployment package
    log_info "Creating deployment package..."
    tar -czf deployment.tar.gz --exclude=node_modules --exclude=.git --exclude=dist .
    
    # Upload to server
    log_info "Uploading to server..."
    scp deployment.tar.gz root@$DROPLET_IP:/root/
    
    # Extract and setup on server
    ssh root@$DROPLET_IP << 'EOF'
        cd /root
        tar -xzf deployment.tar.gz
        rm deployment.tar.gz
        
        # Install PM2
        npm install -g pm2
        
        echo "✅ Application uploaded"
EOF
    
    # Clean up local file
    rm deployment.tar.gz
    
    log_success "Application deployed successfully"
}

# Build and configure backend
setup_backend() {
    log_header "Setting up Backend"
    
    log_info "Building backend and configuring environment..."
    
    ssh root@$DROPLET_IP << EOF
        cd /root/interview-booking-project/backend
        
        # Install dependencies
        npm install
        
        # Create environment file
        cat > .env << 'ENV_EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://app_user:$DB_PASSWORD@localhost:27017/interview_booking
JWT_SECRET=$(openssl rand -base64 32)
FRONTEND_URL=http://$DROPLET_IP
CORS_ORIGIN=http://$DROPLET_IP
ENV_EOF
        
        # Build backend
        npm run build
        
        echo "✅ Backend configured and built"
EOF
    
    log_success "Backend setup completed"
}

# Build and configure frontend
setup_frontend() {
    log_header "Setting up Frontend"
    
    log_info "Building frontend..."
    
    ssh root@$DROPLET_IP << EOF
        cd /root/interview-booking-project/frontend
        
        # Install dependencies
        npm install
        
        # Create environment file
        cat > .env << 'ENV_EOF'
VITE_API_URL=http://$DROPLET_IP:5000/api
VITE_APP_NAME=MockAce
ENV_EOF
        
        # Build frontend
        npm run build
        
        echo "✅ Frontend configured and built"
EOF
    
    log_success "Frontend setup completed"
}

# Configure Nginx
setup_nginx() {
    log_header "Configuring Nginx"
    
    log_info "Setting up Nginx reverse proxy..."
    
    ssh root@$DROPLET_IP << EOF
        # Remove default site
        rm -f /etc/nginx/sites-enabled/default
        
        # Create new site configuration
        cat > /etc/nginx/sites-available/interview-booking << 'NGINX_EOF'
server {
    listen 80;
    server_name $DROPLET_IP $DOMAIN www.$DOMAIN;
    
    # Frontend (React)
    location / {
        root /root/interview-booking-project/frontend/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Authorization, Content-Type";
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5000/api/health;
        access_log off;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)\$ {
        root /root/interview-booking-project/frontend/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF
        
        # Enable site
        ln -sf /etc/nginx/sites-available/interview-booking /etc/nginx/sites-enabled/
        
        # Test configuration
        nginx -t
        
        # Restart Nginx
        systemctl restart nginx
        
        echo "✅ Nginx configured"
EOF
    
    log_success "Nginx configuration completed"
}

# Setup PM2
setup_pm2() {
    log_header "Setting up PM2 Process Manager"
    
    log_info "Configuring PM2 for application management..."
    
    ssh root@$DROPLET_IP << 'EOF'
        cd /root/interview-booking-project
        
        # Create PM2 ecosystem file
        cat > ecosystem.config.js << 'PM2_EOF'
module.exports = {
  apps: [
    {
      name: 'interview-booking-api',
      script: './backend/dist/index.js',
      cwd: '/root/interview-booking-project',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
PM2_EOF
        
        # Create logs directory
        mkdir -p logs
        
        # Start application with PM2
        pm2 start ecosystem.config.js
        
        # Save PM2 configuration
        pm2 save
        
        # Setup PM2 startup
        pm2 startup
        
        echo "✅ PM2 configured and application started"
EOF
    
    log_success "PM2 setup completed"
}

# Setup SSL (optional)
setup_ssl() {
    if [ ! -z "$DOMAIN" ]; then
        log_header "Setting up SSL Certificate"
        
        log_info "Installing Certbot and getting SSL certificate..."
        
        ssh root@$DROPLET_IP << EOF
            # Install Certbot
            apt install -y certbot python3-certbot-nginx
            
            # Get SSL certificate
            certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
            
            # Test auto-renewal
            certbot renew --dry-run
            
            echo "✅ SSL certificate configured"
EOF
        
        log_success "SSL certificate setup completed"
    else
        log_info "Skipping SSL setup (no domain provided)"
    fi
}

# Test deployment
test_deployment() {
    log_header "Testing Deployment"
    
    log_info "Testing application endpoints..."
    
    # Test backend health
    if curl -f -s "http://$DROPLET_IP/api/health" > /dev/null; then
        log_success "Backend API is responding"
    else
        log_warning "Backend API test failed"
    fi
    
    # Test frontend
    if curl -f -s "http://$DROPLET_IP" > /dev/null; then
        log_success "Frontend is accessible"
    else
        log_warning "Frontend test failed"
    fi
    
    # Check PM2 status
    ssh root@$DROPLET_IP "pm2 status"
}

# Show deployment summary
show_summary() {
    log_header "Deployment Summary"
    
    echo ""
    echo "🎉 Your Interview Booking Project is now live on DigitalOcean!"
    echo ""
    echo "📱 Application URLs:"
    echo "   Frontend: http://$DROPLET_IP"
    echo "   Backend API: http://$DROPLET_IP/api"
    echo "   Health Check: http://$DROPLET_IP/health"
    echo ""
    
    if [ ! -z "$DOMAIN" ]; then
        echo "🌐 Custom Domain:"
        echo "   https://$DOMAIN"
        echo "   https://www.$DOMAIN"
    fi
    
    echo ""
    echo "💰 Cost Breakdown:"
    echo "   DigitalOcean Droplet: \$6/month"
    echo "   Domain: \$8.88/year (\$0.74/month)"
    echo "   Total: \$6.74/month"
    echo ""
    echo "🔧 Management Commands:"
    echo "   Check status: ssh root@$DROPLET_IP 'pm2 status'"
    echo "   View logs: ssh root@$DROPLET_IP 'pm2 logs'"
    echo "   Restart app: ssh root@$DROPLET_IP 'pm2 restart interview-booking-api'"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Test your application thoroughly"
    echo "2. Configure domain DNS (if using custom domain)"
    echo "3. Set up monitoring and alerts"
    echo "4. Configure automated backups"
    echo ""
    log_success "Deployment completed successfully!"
}

# Main deployment function
deploy_digitalocean() {
    log_header "DigitalOcean Single Droplet Deployment"
    echo "This will deploy your Interview Booking Project to a single DigitalOcean droplet"
    echo ""
    
    # Get domain (optional)
    read -p "Enter your domain name (optional, press Enter to skip): " DOMAIN
    
    # Check prerequisites
    check_prerequisites
    
    # Test SSH connection
    test_ssh
    
    # Setup server
    setup_server
    
    # Configure MongoDB
    setup_mongodb
    
    # Deploy application
    deploy_application
    
    # Setup backend
    setup_backend
    
    # Setup frontend
    setup_frontend
    
    # Configure Nginx
    setup_nginx
    
    # Setup PM2
    setup_pm2
    
    # Setup SSL (if domain provided)
    setup_ssl
    
    # Test deployment
    test_deployment
    
    # Show summary
    show_summary
}

# Show help
show_help() {
    echo "🚀 DigitalOcean Single Droplet Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "This script deploys your Interview Booking Project to a single DigitalOcean droplet"
    echo ""
    echo "Prerequisites:"
    echo "- DigitalOcean droplet created"
    echo "- SSH access configured"
    echo "- Domain name (optional)"
    echo ""
    echo "Cost: \$6.74/month (droplet + domain)"
    echo ""
    echo "Options:"
    echo "  -h, --help       Show this help message"
    echo "  -i, --ip IP      Droplet IP address"
    echo "  -d, --domain     Domain name"
    echo ""
    echo "Example:"
    echo "  $0 -i 123.456.789.012 -d yourdomain.com"
    echo "  $0  # Interactive mode"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -i|--ip)
            DROPLET_IP="$2"
            shift 2
            ;;
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
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
deploy_digitalocean
