# ☁️ Single Cloud Platform Deployment Guide

Complete guide for deploying your Interview Booking Project on **one cloud platform** with cheap domain setup.

## 🎯 **Best Single Cloud Options**

### **Option 1: Google Cloud Platform (GCP) - Recommended**

**Why GCP is the best single cloud choice:**
- ✅ **$300 free credit** for 90 days
- ✅ **Always Free tier** after credit expires
- ✅ **Cloud Run**: Serverless containers (pay per request)
- ✅ **Cloud SQL**: Managed database
- ✅ **Cloud Storage**: File storage
- ✅ **Cloud CDN**: Global content delivery

### **Option 2: AWS (Alternative)**

**AWS benefits:**
- ✅ **12-month free tier**
- ✅ **EC2**: Virtual machines
- ✅ **RDS**: Managed database
- ✅ **S3**: File storage
- ✅ **CloudFront**: Global CDN

### **Option 3: Azure (Alternative)**

**Azure benefits:**
- ✅ **$200 free credit** for 30 days
- ✅ **App Service**: Managed web apps
- ✅ **Azure SQL**: Managed database
- ✅ **Blob Storage**: File storage
- ✅ **Azure CDN**: Global content delivery

## 💰 **Cost Comparison (Single Cloud)**

| Platform | Free Tier | After Free Tier | Domain | Total/Month |
|----------|-----------|-----------------|---------|-------------|
| **GCP** | $300 credit (90 days) | $10-25/month | $12.99/year | $10-25/month |
| **AWS** | 12 months free | $15-35/month | $12.99/year | $15-35/month |
| **Azure** | $200 credit (30 days) | $12-30/month | $12.99/year | $12-30/month |

## 🚀 **GCP Deployment (Recommended)**

### **Architecture:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   Cloud Run     │◄──►│   Cloud Run     │◄──►│   Cloud SQL     │
│   (React)       │    │   (Node.js)     │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Cloud CDN     │
                    │   (Global)      │
                    └─────────────────┘
```

### **Step 1: Setup GCP Project**

```bash
# 1. Go to Google Cloud Console
# Visit: https://console.cloud.google.com/

# 2. Create new project
# Click "Create Project"
# Enter project name: "interview-booking"
# Click "Create"

# 3. Enable billing (required for free tier)
# Go to "Billing"
# Link your credit card (won't be charged during free tier)
```

### **Step 2: Enable Required APIs**

```bash
# Enable these APIs in GCP Console:
# 1. Cloud Run API
# 2. Cloud SQL API
# 3. Cloud Build API
# 4. Cloud Storage API
# 5. Cloud CDN API

# Or use gcloud CLI:
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable storage.googleapis.com
```

### **Step 3: Deploy Backend to Cloud Run**

```bash
# 1. Install Google Cloud CLI
# Download from: https://cloud.google.com/sdk/docs/install

# 2. Authenticate
gcloud auth login
gcloud config set project your-project-id

# 3. Build and deploy backend
cd backend
gcloud run deploy interview-booking-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 5000 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### **Step 4: Deploy Frontend to Cloud Run**

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Create Dockerfile for frontend
cat > Dockerfile << 'EOF'
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# 3. Create nginx.conf
cat > nginx.conf << 'EOF'
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
            try_files $uri $uri/ /index.html;
        }
        
        location /api {
            proxy_pass https://your-backend-url.run.app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

# 4. Deploy frontend
gcloud run deploy interview-booking-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80 \
  --memory 512Mi \
  --cpu 0.5 \
  --min-instances 0 \
  --max-instances 5
```

### **Step 5: Setup Cloud SQL Database**

```bash
# 1. Create Cloud SQL instance
gcloud sql instances create interview-booking-db \
  --database-version=POSTGRES_13 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB

# 2. Create database
gcloud sql databases create interview_booking \
  --instance=interview-booking-db

# 3. Create user
gcloud sql users create app_user \
  --instance=interview-booking-db \
  --password=your-secure-password

# 4. Get connection string
gcloud sql instances describe interview-booking-db \
  --format="value(connectionName)"
```

### **Step 6: Configure Environment Variables**

```bash
# Set backend environment variables
gcloud run services update interview-booking-api \
  --region=us-central1 \
  --set-env-vars="NODE_ENV=production,PORT=5000,MONGODB_URI=your-connection-string,JWT_SECRET=your-jwt-secret,FRONTEND_URL=https://your-frontend-url.run.app"

# Set frontend environment variables
gcloud run services update interview-booking-frontend \
  --region=us-central1 \
  --set-env-vars="VITE_API_URL=https://your-backend-url.run.app/api"
```

## 🌐 **Domain Setup with GoDaddy**

### **Step 1: Buy Domain from GoDaddy**

```bash
# 1. Go to GoDaddy
# Visit: https://www.godaddy.com/

# 2. Search for domain
# Enter your desired domain name
# Choose .com extension ($12.99/year)

# 3. Complete purchase
# Add to cart and checkout
# Enable domain privacy protection
```

### **Step 2: Configure DNS in GoDaddy**

```bash
# DNS Configuration in GoDaddy:
Type    Name    Value                           TTL
A       @       your-frontend-ip               600
CNAME   www     your-frontend-url.run.app      600
CNAME   api     your-backend-url.run.app       600

# Get IP addresses:
gcloud run services describe interview-booking-frontend \
  --region=us-central1 \
  --format="value(status.url)"
```

### **Step 3: Setup Custom Domain in GCP**

```bash
# 1. Map custom domain to Cloud Run
gcloud run domain-mappings create \
  --service=interview-booking-frontend \
  --domain=yourdomain.com \
  --region=us-central1

# 2. Map API subdomain
gcloud run domain-mappings create \
  --service=interview-booking-api \
  --domain=api.yourdomain.com \
  --region=us-central1
```

## 🔧 **Alternative: AWS Deployment**

### **AWS Architecture:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   S3 + CloudFront│◄──►│   EC2/ECS       │◄──►│   RDS           │
│   (React)       │    │   (Node.js)     │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **AWS Deployment Steps:**

```bash
# 1. Create EC2 instance
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t2.micro \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx

# 2. Setup application
ssh -i your-key.pem ec2-user@your-instance-ip
sudo yum update -y
sudo yum install nodejs npm git -y
git clone your-repo
cd interview-booking-project
npm install
npm run build

# 3. Start with PM2
sudo npm install -g pm2
pm2 start backend/dist/index.js --name "api"
pm2 startup
pm2 save

# 4. Setup Nginx
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 💰 **Cost Breakdown**

### **GCP Costs (After Free Tier):**
```
Cloud Run (Backend):     $5-10/month
Cloud Run (Frontend):    $2-5/month
Cloud SQL:               $10-15/month
Cloud CDN:               $1-3/month
Total:                   $18-33/month
```

### **AWS Costs (After Free Tier):**
```
EC2 (t2.micro):          $8-10/month
RDS (db.t2.micro):       $15-20/month
S3 + CloudFront:         $2-5/month
Total:                   $25-35/month
```

### **Domain Costs:**
```
GoDaddy (.com):          $12.99/year
Namecheap (.com):        $8.88/year
Cloudflare Registrar:    $9.15/year
```

## 🚀 **Quick Start Commands**

### **GCP Quick Deploy:**

```bash
# 1. Setup GCP project
gcloud init

# 2. Deploy backend
cd backend
gcloud run deploy --source .

# 3. Deploy frontend
cd ../frontend
npm run build
gcloud run deploy --source .

# 4. Setup domain
gcloud run domain-mappings create --service=your-service --domain=yourdomain.com
```

### **AWS Quick Deploy:**

```bash
# 1. Create EC2 instance
aws ec2 run-instances --image-id ami-0c02fb55956c7d316 --instance-type t2.micro

# 2. Deploy application
ssh ec2-user@your-instance-ip
git clone your-repo
cd your-repo
npm install
npm run build
pm2 start backend/dist/index.js
```

## 🔒 **Security Setup**

### **SSL Certificates:**
```bash
# GCP: Automatic SSL with Cloud Run
# AWS: Use AWS Certificate Manager
# Azure: Automatic SSL with App Service
```

### **Firewall Rules:**
```bash
# GCP: Configure VPC firewall rules
# AWS: Configure Security Groups
# Azure: Configure Network Security Groups
```

## 📊 **Monitoring Setup**

### **GCP Monitoring:**
```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com

# Setup alerts
gcloud alpha monitoring policies create \
  --policy-from-file=monitoring-policy.yaml
```

### **AWS Monitoring:**
```bash
# Enable CloudWatch
aws cloudwatch put-metric-alarm \
  --alarm-name "High CPU Usage" \
  --alarm-description "Alarm when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

## 🎯 **Recommendation**

### **Best Single Cloud Choice: Google Cloud Platform**

**Why GCP:**
1. **$300 free credit** for 90 days
2. **Always Free tier** after credit expires
3. **Cloud Run**: Pay only for what you use
4. **Easy deployment**: Simple CLI commands
5. **Integrated services**: Everything works together
6. **Good documentation**: Excellent guides and examples

**Total Cost:**
- **Free Tier**: $0 for 90 days
- **After Free Tier**: $18-33/month
- **Domain**: $8.88-12.99/year

This gives you a professional, scalable application on a single cloud platform with predictable costs!

## 🎉 **Ready to Deploy?**

Choose your preferred cloud platform and follow the step-by-step instructions above. GCP is recommended for the best balance of features, cost, and ease of use.
