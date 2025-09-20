# 🚀 Quick Start Deployment Guide

Get your Interview Booking Project deployed in under 30 minutes!

## ⚡ 30-Minute Deployment

### Prerequisites
- GitHub account
- Domain name (optional)
- Credit card for hosting (some free tiers available)

### Step 1: Prepare Your Code (5 minutes)

```bash
# 1. Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Set up environment variables
cp env.production.example .env
# Edit .env with your production values
```

### Step 2: Deploy Backend to Railway (10 minutes)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Deploy backend
cd backend
railway init
railway up

# 4. Set environment variables
railway variables set NODE_ENV=production
railway variables set MONGODB_URI=your-mongodb-uri
railway variables set JWT_SECRET=your-jwt-secret
railway variables set FRONTEND_URL=https://your-domain.com
```

### Step 3: Deploy Frontend to Vercel (10 minutes)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy frontend
cd frontend
vercel --prod

# 3. Set environment variables
vercel env add VITE_API_URL
# Enter: https://your-railway-app.railway.app/api

vercel env add VITE_APP_NAME
# Enter: MockAce
```

### Step 4: Configure Domain (5 minutes)

```bash
# 1. Add custom domain in Vercel dashboard
# 2. Add custom domain in Railway dashboard
# 3. Update DNS records in your domain registrar:

# DNS Records:
# A     @       76.76.19.61
# CNAME www     cname.vercel-dns.com
# CNAME api     your-app.railway.app
```

### Step 5: Verify Deployment

```bash
# Test your deployment
curl https://your-domain.com/api/health
curl https://your-domain.com
```

## 🐳 Docker Deployment (Alternative)

### Quick Docker Setup

```bash
# 1. Build and start all services
docker-compose up -d

# 2. Check status
docker-compose ps

# 3. View logs
docker-compose logs -f

# 4. Stop services
docker-compose down
```

### Docker Commands

```bash
# Build images
npm run docker:build

# Start services
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down

# Restart services
npm run docker:restart
```

## 🔧 Automated Deployment Script

### Use the deployment script

```bash
# Deploy to Vercel + Railway
npm run deploy:vercel-railway

# Deploy with Docker
npm run deploy:docker

# Build locally
npm run deploy:local

# Production deployment
npm run deploy:production
```

### Custom deployment

```bash
# With custom domain
./scripts/deploy.sh -d yourdomain.com vercel-railway

# Development environment
./scripts/deploy.sh -e development vercel-railway

# Docker with custom configuration
./scripts/deploy.sh docker
```

## 📊 Monitoring Setup

### Basic Monitoring

```bash
# Start monitoring stack
docker-compose up -d prometheus grafana

# Access Grafana
open http://localhost:3001
# Login: admin / your-grafana-password

# Access Prometheus
open http://localhost:9090
```

### Health Checks

```bash
# Check application health
npm run health:check

# Manual health check
curl -f http://localhost:5000/api/health
curl -f http://localhost:3000/health
```

## 🔒 Security Checklist

### Before Going Live

- [ ] Change default JWT secret
- [ ] Set strong database passwords
- [ ] Enable HTTPS (automatic with Vercel/Railway)
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Configure error monitoring (Sentry)

### Environment Variables to Update

```bash
# Critical security variables
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
RAZORPAY_KEY_SECRET=your-razorpay-secret
GOOGLE_CLIENT_SECRET=your-google-secret
```

## 💰 Cost Breakdown

### Free Tier (Recommended for MVP)
- **Frontend**: Vercel Free (100GB bandwidth)
- **Backend**: Railway Free ($5 credit monthly)
- **Database**: MongoDB Atlas Free (512MB)
- **Domain**: $8.88/year (Namecheap)
- **Total**: ~$8.88/year

### Production Tier
- **Frontend**: Vercel Pro ($20/month)
- **Backend**: Railway Pro ($5/month)
- **Database**: MongoDB Atlas M2 ($9/month)
- **Domain**: $8.88/year
- **Total**: ~$35/month

## 🚨 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check logs
railway logs

# Verify environment variables
railway variables

# Test locally
cd backend && npm start
```

#### Frontend build fails
```bash
# Check build logs
vercel logs

# Test build locally
cd frontend && npm run build

# Check for TypeScript errors
npm run type-check
```

#### Domain not working
```bash
# Check DNS propagation
nslookup your-domain.com

# Verify SSL certificate
curl -I https://your-domain.com

# Check CORS configuration
curl -H "Origin: https://your-domain.com" -X OPTIONS https://api.your-domain.com/api/health
```

#### Database connection issues
```bash
# Verify MongoDB URI
echo $MONGODB_URI

# Test connection
mongosh "$MONGODB_URI"

# Check network access in MongoDB Atlas
```

### Getting Help

1. **Check logs**: Always check application logs first
2. **Verify configuration**: Ensure all environment variables are set
3. **Test locally**: Reproduce issues locally if possible
4. **Community support**: Check GitHub issues and discussions
5. **Documentation**: Refer to platform-specific docs (Vercel, Railway)

## 🎯 Next Steps

### After Deployment

1. **Set up monitoring**: Configure alerts and dashboards
2. **Backup strategy**: Set up database backups
3. **Performance optimization**: Monitor and optimize
4. **Security audit**: Regular security reviews
5. **User feedback**: Collect and implement feedback

### Scaling Considerations

1. **Database optimization**: Add indexes and optimize queries
2. **Caching**: Implement Redis for frequently accessed data
3. **CDN**: Use Cloudflare for global content delivery
4. **Load balancing**: Consider multiple backend instances
5. **Monitoring**: Set up comprehensive monitoring

## 📞 Support

### Platform Support
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Railway**: [docs.railway.app](https://docs.railway.app)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

### Project Support
- **GitHub Issues**: Create an issue for bugs
- **Documentation**: Check the comprehensive guides
- **Community**: Join discussions for help

Your Interview Booking Project is now live and ready to help candidates ace their interviews! 🎉
