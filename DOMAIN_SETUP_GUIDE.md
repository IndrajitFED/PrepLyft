# 🌐 Domain Setup Guide

Complete guide for registering a cheap domain and configuring DNS for your Interview Booking Project.

## 🏷️ Cheap Domain Options

### 1. Namecheap (Recommended)
**Best for**: Budget-conscious users, excellent support

#### Pricing
- **.com**: $8.88/year (first year), $12.98/year (renewal)
- **.net**: $12.98/year
- **.org**: $9.98/year
- **.co**: $29.99/year

#### Features
- ✅ Free WHOIS privacy protection
- ✅ Easy DNS management
- ✅ 24/7 customer support
- ✅ Free email forwarding
- ✅ 2-factor authentication

#### Registration Steps
1. Visit [namecheap.com](https://www.namecheap.com/)
2. Search for your desired domain
3. Add to cart and proceed to checkout
4. Enable WHOIS privacy protection (free)
5. Complete payment
6. Verify email and activate domain

### 2. Cloudflare Registrar
**Best for**: Performance-focused users

#### Pricing
- **.com**: $9.15/year (at-cost pricing)
- **.net**: $12.15/year
- **.org**: $10.15/year

#### Features
- ✅ At-cost pricing (no markup)
- ✅ Free DNS service
- ✅ Excellent performance
- ✅ Built-in CDN
- ✅ Security features

### 3. Google Domains
**Best for**: Google ecosystem users

#### Pricing
- **.com**: $12/year
- **.app**: $20/year
- **.dev**: $12/year

#### Features
- ✅ Google integration
- ✅ Simple interface
- ✅ Free email forwarding
- ✅ DNS management

### 4. GoDaddy
**Best for**: Traditional hosting users

#### Pricing
- **.com**: $12.99/year (first year), $17.99/year (renewal)
- **.co**: $29.99/year

#### Features
- ✅ 24/7 phone support
- ✅ Domain parking options
- ✅ Website builder included
- ✅ Email hosting options

## 🎯 Domain Name Suggestions

### Interview/Education Focused
- `mockace.com` - Mock + Ace (excellent for interviews)
- `interviewhub.com` - Central hub for interviews
- `prepme.com` - Preparation focused
- `skillup.com` - Skill development
- `mentormatch.com` - Mentor matching
- `interviewprep.com` - Direct and clear

### Tech/Coding Focused
- `codeinterview.com` - Coding interviews
- `techprep.com` - Tech preparation
- `devinterview.com` - Developer interviews
- `codingace.com` - Coding excellence
- `techmentor.com` - Tech mentoring

### Generic/Professional
- `skillconnect.com` - Skill connection
- `expertmeet.com` - Expert meetings
- `learnconnect.com` - Learning connection
- `skillbridge.com` - Skill bridge
- `mentorlink.com` - Mentor linking

## 🔧 DNS Configuration

### For Vercel + Railway Setup

#### Step 1: Configure Vercel DNS
```bash
# In Vercel Dashboard
1. Go to your project settings
2. Navigate to "Domains"
3. Add your domain: yourdomain.com
4. Add www subdomain: www.yourdomain.com
5. Copy the DNS records provided
```

#### Step 2: Configure Railway DNS
```bash
# In Railway Dashboard
1. Go to your project settings
2. Navigate to "Domains"
3. Add custom domain: api.yourdomain.com
4. Copy the CNAME record provided
```

#### Step 3: Update DNS in Domain Registrar

**Namecheap DNS Configuration**:
```
Type    Host    Value                           TTL
A       @       76.76.19.61                    300
CNAME   www     cname.vercel-dns.com           300
CNAME   api     your-app.railway.app           300
```

**Cloudflare DNS Configuration**:
```
Type    Name    Content                         TTL
A       @       76.76.19.61                    Auto
CNAME   www     cname.vercel-dns.com           Auto
CNAME   api     your-app.railway.app           Auto
```

### For Custom Server Setup

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔒 SSL Certificate Setup

### Automatic SSL (Recommended)

#### Vercel
- SSL certificates are automatically provisioned
- Supports Let's Encrypt certificates
- Automatic renewal
- HTTP to HTTPS redirect

#### Railway
- SSL certificates are automatically provisioned
- Supports custom domains
- Automatic renewal
- HTTP to HTTPS redirect

#### Cloudflare
- Free SSL certificates
- Universal SSL enabled by default
- HTTP to HTTPS redirect
- SSL/TLS encryption mode: Full (strict)

### Manual SSL Setup

#### Let's Encrypt with Certbot
```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

#### SSL Configuration for Nginx
```nginx
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
```

## 🚀 Deployment with Custom Domain

### Step-by-Step Process

#### 1. Register Domain (5 minutes)
```bash
# Choose a domain registrar
# Complete registration process
# Enable WHOIS privacy protection
# Verify email activation
```

#### 2. Configure DNS (10 minutes)
```bash
# Update DNS records in registrar
# Point A record to Vercel IP: 76.76.19.61
# Add CNAME record for www subdomain
# Add CNAME record for api subdomain
```

#### 3. Update Environment Variables (5 minutes)
```bash
# Frontend (.env)
VITE_API_URL=https://api.yourdomain.com/api

# Backend (.env)
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

#### 4. Deploy Applications (10 minutes)
```bash
# Deploy frontend to Vercel
cd frontend
vercel --prod

# Deploy backend to Railway
cd backend
railway up

# Add custom domains in respective dashboards
```

#### 5. Verify Setup (5 minutes)
```bash
# Test domain resolution
nslookup yourdomain.com
dig yourdomain.com

# Test SSL certificate
curl -I https://yourdomain.com
openssl s_client -connect yourdomain.com:443

# Test application
curl https://yourdomain.com/api/health
```

## 📊 DNS Propagation

### Timeline
- **Immediate**: Changes saved in registrar
- **5-15 minutes**: Local DNS cache updates
- **1-24 hours**: Global DNS propagation
- **48 hours**: Complete propagation worldwide

### Check Propagation
```bash
# Check DNS propagation
nslookup yourdomain.com 8.8.8.8
nslookup yourdomain.com 1.1.1.1

# Online tools
# https://www.whatsmydns.net/
# https://dnschecker.org/
```

## 🔧 Troubleshooting

### Common Issues

#### Domain Not Resolving
```bash
# Check DNS records
dig yourdomain.com
nslookup yourdomain.com

# Verify registrar settings
# Check TTL values (use 300 for faster propagation)
```

#### SSL Certificate Issues
```bash
# Check certificate status
curl -I https://yourdomain.com

# Verify certificate details
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check certificate expiration
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

#### CORS Issues
```bash
# Update CORS configuration
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Test CORS
curl -H "Origin: https://yourdomain.com" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS https://api.yourdomain.com/api/health
```

#### Redirect Issues
```bash
# Check redirect configuration
curl -I http://yourdomain.com
curl -I https://yourdomain.com

# Verify www redirect
curl -I http://www.yourdomain.com
curl -I https://www.yourdomain.com
```

## 💰 Cost Breakdown

### Annual Domain Costs
- **Domain Registration**: $8.88 - $29.99/year
- **WHOIS Privacy**: Free (included)
- **SSL Certificate**: Free (Let's Encrypt)
- **DNS Service**: Free (Cloudflare) or $5-10/year
- **Total**: $8.88 - $39.99/year

### Monthly Hosting Costs
- **Frontend (Vercel)**: Free tier available
- **Backend (Railway)**: $5/month
- **Database (MongoDB Atlas)**: Free tier available
- **Total**: $5-25/month

## 🎯 Best Practices

### Domain Management
1. **Enable Auto-Renewal**: Prevent domain expiration
2. **Use Strong Passwords**: Protect registrar account
3. **Enable 2FA**: Add extra security
4. **Monitor Expiration**: Set up alerts
5. **Backup DNS Records**: Document all configurations

### DNS Optimization
1. **Use Low TTL**: 300 seconds for faster updates
2. **Enable DNSSEC**: Enhanced security
3. **Use CDN**: Cloudflare for better performance
4. **Monitor Uptime**: Use uptime monitoring services
5. **Regular Backups**: Export DNS configurations

### Security
1. **SSL/TLS**: Always use HTTPS
2. **Security Headers**: Implement security headers
3. **Regular Updates**: Keep DNS and SSL updated
4. **Monitor Logs**: Check access and error logs
5. **Backup Strategy**: Regular backups of configurations

## 📞 Support Resources

### Domain Registrar Support
- **Namecheap**: Live chat, ticket system
- **Cloudflare**: Community forum, documentation
- **Google Domains**: Email support, help center
- **GoDaddy**: 24/7 phone support

### Technical Support
- **Vercel**: Documentation, community forum
- **Railway**: Discord community, documentation
- **MongoDB Atlas**: Support portal, documentation

This guide provides everything you need to set up a professional domain for your Interview Booking Project at an affordable cost!
