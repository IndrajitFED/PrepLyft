# 🚀 DigitalOcean Single Droplet Deployment Guide

Complete guide for deploying Node.js backend and React frontend on a single DigitalOcean droplet.

## 💰 **Cost Breakdown**

### **DigitalOcean Droplet Pricing:**
```
Basic Plan:    $4/month (512MB RAM, 1 vCPU, 10GB SSD)
Standard Plan: $6/month (1GB RAM, 1 vCPU, 25GB SSD) ← Recommended
CPU-Optimized: $12/month (2GB RAM, 1 vCPU, 25GB SSD)
```

### **Total Monthly Cost:**
- **Droplet**: $6/month (Standard plan)
- **Domain**: $8.88/year ($0.74/month)
- **Total**: **$6.74/month**

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                DigitalOcean Droplet                     │
│  ┌─────────────────┐    ┌─────────────────┐            │
│  │   Frontend      │    │   Backend       │            │
│  │   Nginx         │◄──►│   Node.js       │            │
│  │   (React)       │    │   (Express)     │            │
│  └─────────────────┘    └─────────────────┘            │
│           │                       │                    │
│           └───────────────────────┼────────────────────┘
│                                   │
│  ┌─────────────────┐    ┌─────────────────┐            │
│  │   PM2           │    │   MongoDB       │            │
│  │   (Process      │    │   (Database)    │            │
│  │    Manager)     │    │                 │            │
│  └─────────────────┘    └─────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

## 🚀 **Step-by-Step Deployment**

### **Step 1: Create DigitalOcean Droplet**

#### **1.1 Sign Up for DigitalOcean**
```bash
# Go to DigitalOcean
# Visit: https://www.digitalocean.com/
# Click "Sign Up" and create account
# Verify your email address
```

#### **1.2 Create Droplet**
```bash
# 1. Click "Create" → "Droplets"
# 2. Choose configuration:
#    - Image: Ubuntu 22.04 LTS
#    - Plan: Standard ($6/month)
#    - CPU: Regular Intel with SSD
#    - Size: $6/month (1GB RAM, 1 vCPU, 25GB SSD)
# 3. Authentication: SSH Key (recommended) or Password
# 4. Hostname: interview-booking-server
# 5. Click "Create Droplet"
```

#### **1.3 Get Droplet Information**
```bash
# After creation, you'll get:
# - IP Address: 123.456.789.012
# - Username: root
# - SSH Key or Password
```

### **Step 2: Connect to Droplet**

#### **2.1 SSH Connection**
```bash
# If using SSH key:
ssh root@YOUR_DROPLET_IP

# If using password:
ssh root@YOUR_DROPLET_IP
# Enter password when prompted
```

#### **2.2 Update System**
```bash
# Update package list
apt update

# Upgrade installed packages
apt upgrade -y

# Install essential packages
apt install -y curl wget git unzip software-properties-common
```

### **Step 3: Install Node.js and npm**

#### **3.1 Install Node.js 18**
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# Install Node.js
apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x
```

### **Step 4: Install and Configure Nginx**

#### **4.1 Install Nginx**
```bash
# Install Nginx
apt install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Check status
systemctl status nginx
```

#### **4.2 Configure Firewall**
```bash
# Install UFW (Uncomplicated Firewall)
apt install -y ufw

# Allow SSH, HTTP, and HTTPS
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 5000  # For backend API

# Enable firewall
ufw enable

# Check status
ufw status
```

### **Step 5: Install MongoDB**

#### **5.1 Install MongoDB**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -

# Create MongoDB list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package list
apt update

# Install MongoDB
apt install -y mongodb-org

# Start and enable MongoDB
systemctl start mongod
systemctl enable mongod

# Check status
systemctl status mongod
```

#### **5.2 Configure MongoDB**
```bash
# Start MongoDB shell
mongosh

# Create database and user
use interview_booking
db.createUser({
  user: "app_user",
  pwd: "your_secure_password",
  roles: ["readWrite"]
})

# Exit MongoDB shell
exit
```

### **Step 6: Deploy Backend Application**

#### **6.1 Clone Repository**
```bash
# Navigate to home directory
cd /root

# Clone your repository
git clone https://github.com/your-username/interview-booking-project.git

# Navigate to backend directory
cd interview-booking-project/backend
```

#### **6.2 Install Dependencies and Build**
```bash
# Install dependencies
npm install

# Create production environment file
nano .env
```

#### **6.3 Environment Configuration**
```bash
# Add to .env file:
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://app_user:your_secure_password@localhost:27017/interview_booking
JWT_SECRET=your_super_secure_jwt_secret_here
FRONTEND_URL=http://YOUR_DROPLET_IP
CORS_ORIGIN=http://YOUR_DROPLET_IP

# Save and exit (Ctrl+X, Y, Enter)
```

#### **6.4 Build Backend**
```bash
# Build the application
npm run build

# Test the build
npm start
# Press Ctrl+C to stop
```

### **Step 7: Deploy Frontend Application**

#### **7.1 Build Frontend**
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create production environment file
nano .env
```

#### **7.2 Frontend Environment Configuration**
```bash
# Add to .env file:
VITE_API_URL=http://YOUR_DROPLET_IP:5000/api
VITE_APP_NAME=MockAce

# Save and exit (Ctrl+X, Y, Enter)
```

#### **7.3 Build Frontend**
```bash
# Build the frontend
npm run build

# The built files will be in the 'dist' directory
ls -la dist/
```

### **Step 8: Configure Nginx**

#### **8.1 Create Nginx Configuration**
```bash
# Remove default configuration
rm /etc/nginx/sites-enabled/default

# Create new configuration
nano /etc/nginx/sites-available/interview-booking
```

#### **8.2 Nginx Configuration Content**
```nginx
server {
    listen 80;
    server_name YOUR_DROPLET_IP yourdomain.com www.yourdomain.com;
    
    # Frontend (React)
    location / {
        root /root/interview-booking-project/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
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
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        root /root/interview-booking-project/frontend/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### **8.3 Enable Site Configuration**
```bash
# Enable the site
ln -s /etc/nginx/sites-available/interview-booking /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### **Step 9: Install and Configure PM2**

#### **9.1 Install PM2**
```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
```

#### **9.2 Create PM2 Ecosystem File**
```bash
# Navigate to project root
cd /root/interview-booking-project

# Create PM2 configuration
nano ecosystem.config.js
```

#### **9.3 PM2 Configuration Content**
```javascript
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
```

#### **9.4 Start Application with PM2**
```bash
# Create logs directory
mkdir -p logs

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown by the command

# Check PM2 status
pm2 status
pm2 logs
```

### **Step 10: Setup SSL Certificate (Optional but Recommended)**

#### **10.1 Install Certbot**
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx
```

#### **10.2 Get SSL Certificate**
```bash
# If you have a domain name:
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose redirect option (2 - redirect HTTP to HTTPS)
```

#### **10.3 Auto-renewal Setup**
```bash
# Test auto-renewal
certbot renew --dry-run

# Certbot will automatically renew certificates
```

### **Step 11: Domain Setup (Optional)**

#### **11.1 Buy Domain**
```bash
# Go to Namecheap (recommended)
# Visit: https://www.namecheap.com/
# Search for your domain
# Purchase domain (.com for $8.88/year)
```

#### **11.2 Configure DNS**
```bash
# In Namecheap DNS settings, add:
Type    Host    Value
A       @       YOUR_DROPLET_IP
CNAME   www     yourdomain.com
```

#### **11.3 Update Nginx Configuration**
```bash
# Update server_name in Nginx config
nano /etc/nginx/sites-available/interview-booking

# Change server_name line to:
server_name YOUR_DROPLET_IP yourdomain.com www.yourdomain.com;

# Test and restart Nginx
nginx -t
systemctl restart nginx
```

### **Step 12: Final Testing and Monitoring**

#### **12.1 Test Application**
```bash
# Test backend API
curl http://YOUR_DROPLET_IP:5000/api/health

# Test frontend
curl http://YOUR_DROPLET_IP

# Test through browser
# Visit: http://YOUR_DROPLET_IP
```

#### **12.2 Setup Monitoring**
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs

# Monitor system resources
htop
```

#### **12.3 Setup Log Rotation**
```bash
# Install logrotate
apt install -y logrotate

# Create logrotate configuration
nano /etc/logrotate.d/interview-booking

# Add content:
/root/interview-booking-project/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    copytruncate
}
```

## 🔧 **Maintenance Commands**

### **Application Management**
```bash
# Restart application
pm2 restart interview-booking-api

# Stop application
pm2 stop interview-booking-api

# View logs
pm2 logs interview-booking-api

# Monitor resources
pm2 monit
```

### **System Updates**
```bash
# Update system packages
apt update && apt upgrade -y

# Update Node.js (if needed)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
```

### **Backup Database**
```bash
# Create backup
mongodump --db interview_booking --out /root/backups/$(date +%Y%m%d)

# Restore backup
mongorestore --db interview_booking /root/backups/20240101/interview_booking
```

## 🚨 **Security Checklist**

### **Firewall Configuration**
```bash
# Check firewall status
ufw status

# Allow only necessary ports
ufw allow ssh
ufw allow 'Nginx Full'
ufw deny 5000  # Block direct access to backend
```

### **SSH Security**
```bash
# Change SSH port (optional)
nano /etc/ssh/sshd_config
# Change: Port 22 to Port 2222

# Restart SSH
systemctl restart ssh

# Update firewall
ufw allow 2222
ufw deny 22
```

### **MongoDB Security**
```bash
# Edit MongoDB config
nano /etc/mongod.conf

# Add security section:
security:
  authorization: enabled

# Restart MongoDB
systemctl restart mongod
```

## 📊 **Performance Optimization**

### **Nginx Optimization**
```bash
# Edit Nginx config
nano /etc/nginx/nginx.conf

# Add to http block:
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

# Restart Nginx
systemctl restart nginx
```

### **Node.js Optimization**
```bash
# Set Node.js environment variables
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=512"
```

## 🎉 **Deployment Complete!**

### **Your Application URLs:**
- **Frontend**: http://YOUR_DROPLET_IP
- **Backend API**: http://YOUR_DROPLET_IP/api
- **Health Check**: http://YOUR_DROPLET_IP/health

### **Total Cost:**
- **DigitalOcean Droplet**: $6/month
- **Domain**: $8.88/year ($0.74/month)
- **Total**: **$6.74/month**

### **Next Steps:**
1. Test your application thoroughly
2. Set up monitoring and alerts
3. Configure automated backups
4. Set up SSL certificate (if using domain)
5. Monitor performance and optimize as needed

Your Interview Booking Project is now live on a professional, scalable infrastructure!
