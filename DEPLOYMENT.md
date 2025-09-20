# 🚀 Deployment Guide

This guide covers deploying your Interview Booking Application to various cloud platforms for production use.

## 🌐 Frontend Deployment

### 1. Vercel (Recommended for Frontend)

Vercel is the easiest platform for React applications with automatic deployments.

#### Setup Steps:
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Build the application
npm run build

# Deploy to Vercel
vercel --prod
```

#### Configuration:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables:
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=MockAce
```

#### Benefits:
- ✅ Automatic deployments from Git
- ✅ Global CDN
- ✅ SSL certificates
- ✅ Preview deployments
- ✅ Analytics included

### 2. Netlify

Great alternative to Vercel with similar features.

#### Setup Steps:
```bash
cd frontend
npm run build

# Drag dist folder to Netlify dashboard
# Or use Netlify CLI
netlify deploy --prod --dir=dist
```

#### Configuration:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18

### 3. AWS S3 + CloudFront

For enterprise applications requiring AWS integration.

#### Setup Steps:
```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://your-interview-app-bucket

# Build and sync
cd frontend
npm run build
aws s3 sync dist/ s3://your-interview-app-bucket --delete

# Create CloudFront distribution
# Point to S3 bucket origin
```

#### Benefits:
- ✅ Enterprise-grade reliability
- ✅ Advanced caching
- ✅ Cost-effective for high traffic
- ✅ AWS ecosystem integration

## 🖥️ Backend Deployment

### 1. Railway (Recommended for Backend)

Railway is excellent for Node.js applications with automatic deployments.

#### Setup Steps:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Navigate to backend
cd backend

# Initialize Railway project
railway init

# Deploy
railway up
```

#### Environment Variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-booking
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

#### Benefits:
- ✅ Automatic deployments
- ✅ Built-in MongoDB hosting
- ✅ SSL certificates
- ✅ Custom domains
- ✅ Monitoring included

### 2. Heroku

Classic platform for Node.js applications.

#### Setup Steps:
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
cd backend
heroku create your-interview-app-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git push heroku main
```

#### Add-ons:
```bash
# MongoDB Atlas
heroku addons:create mongolab:sandbox

# Redis for caching
heroku addons:create heroku-redis:hobby-dev
```

### 3. DigitalOcean App Platform

Great for developers who prefer DigitalOcean.

#### Setup Steps:
1. Connect your GitHub repository
2. Select backend directory
3. Choose Node.js environment
4. Set environment variables
5. Deploy automatically

#### Benefits:
- ✅ Automatic deployments
- ✅ Built-in monitoring
- ✅ Load balancing
- ✅ SSL certificates

### 4. AWS EC2

For full control and enterprise requirements.

#### Setup Steps:
```bash
# Launch EC2 instance (Ubuntu 22.04 LTS)
# Connect via SSH
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo
cd interview-booking-app/backend

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start dist/index.js --name "interview-booking-api"
pm2 startup
pm2 save
```

#### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🗄️ Database Deployment

### 1. MongoDB Atlas (Recommended)

Cloud-hosted MongoDB with automatic scaling.

#### Setup Steps:
1. Create MongoDB Atlas account
2. Create new cluster
3. Set up database access (username/password)
4. Set up network access (IP whitelist)
5. Get connection string

#### Connection String:
```
mongodb+srv://username:password@cluster.mongodb.net/interview-booking?retryWrites=true&w=majority
```

#### Benefits:
- ✅ Automatic backups
- ✅ Global distribution
- ✅ Built-in monitoring
- ✅ Automatic scaling

### 2. Railway MongoDB

Integrated MongoDB hosting with Railway.

```bash
# Add MongoDB to Railway project
railway add

# Select MongoDB
# Get connection string from Railway dashboard
```

### 3. Self-hosted MongoDB

For complete control and compliance.

```bash
# Install MongoDB on Ubuntu
sudo apt update
sudo apt install mongodb

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongosh
use interview-booking
db.createUser({
  user: "interview_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})
```

## 🔐 Domain & SSL Setup

### 1. Domain Registration

Popular domain registrars:
- **Namecheap**: Affordable domains
- **GoDaddy**: Wide selection
- **Google Domains**: Clean interface
- **Cloudflare**: Built-in security

### 2. DNS Configuration

#### A Record (for EC2):
```
Type: A
Name: @
Value: your-ec2-ip
TTL: 300
```

#### CNAME Record (for subdomains):
```
Type: CNAME
Name: api
Value: your-backend-domain.com
TTL: 300
```

### 3. SSL Certificates

#### Automatic (Recommended):
- Vercel, Netlify, Railway provide automatic SSL
- Let's Encrypt for self-hosted solutions

#### Manual SSL:
```bash
# Generate CSR
openssl req -new -newkey rsa:2048 -keyout private.key -out request.csr

# Install certificate
# Configure web server (Nginx/Apache)
```

## 📊 Monitoring & Analytics

### 1. Application Monitoring

#### PM2 (for EC2):
```bash
pm2 monit
pm2 logs
pm2 status
```

#### Railway Dashboard:
- Built-in monitoring
- Logs and metrics
- Performance insights

### 2. Database Monitoring

#### MongoDB Atlas:
- Performance advisor
- Query analysis
- Index recommendations

#### Self-hosted:
```bash
# MongoDB profiler
db.setProfilingLevel(1)

# Check slow queries
db.system.profile.find().pretty()
```

### 3. Uptime Monitoring

#### UptimeRobot:
- Free uptime monitoring
- Email/SMS alerts
- Response time tracking

#### Pingdom:
- Advanced monitoring
- Real user monitoring
- Performance insights

## 💰 Cost Optimization

### 1. Frontend Hosting Costs

| Platform | Free Tier | Paid Plans |
|----------|-----------|-------------|
| Vercel | ✅ 100GB bandwidth | $20/month |
| Netlify | ✅ 100GB bandwidth | $19/month |
| AWS S3 | ✅ 5GB storage | $0.023/GB |
| GitHub Pages | ✅ Unlimited | Free |

### 2. Backend Hosting Costs

| Platform | Free Tier | Paid Plans |
|----------|-----------|-------------|
| Railway | ✅ $5 credit | $5/month |
| Heroku | ✅ 550-1000 hours | $7/month |
| DigitalOcean | ❌ | $5/month |
| AWS EC2 | ✅ 750 hours | $3.50/month |

### 3. Database Costs

| Platform | Free Tier | Paid Plans |
|----------|-----------|-------------|
| MongoDB Atlas | ✅ 512MB | $9/month |
| Railway MongoDB | ✅ $5 credit | $5/month |
| Self-hosted | ✅ | Server costs |

## 🚀 Production Checklist

### Before Deployment:
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] API endpoints tested
- [ ] Frontend builds successfully
- [ ] SSL certificates ready
- [ ] Domain DNS configured
- [ ] Monitoring setup
- [ ] Backup strategy defined

### After Deployment:
- [ ] Health checks passing
- [ ] SSL working correctly
- [ ] Database connections stable
- [ ] Performance monitoring active
- [ ] Error logging configured
- [ ] User registration tested
- [ ] Session booking tested
- [ ] Notifications working

## 🔧 Troubleshooting

### Common Issues:

#### 1. CORS Errors
```typescript
// Backend CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

#### 2. Database Connection Issues
```typescript
// Check MongoDB connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
```

#### 3. Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Environment Variables
```bash
# Check environment variables
echo $NODE_ENV
echo $MONGODB_URI
echo $JWT_SECRET
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [AWS EC2 User Guide](https://docs.aws.amazon.com/ec2)
- [Nginx Configuration](https://nginx.org/en/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)

---

**Happy Deploying! 🚀** 