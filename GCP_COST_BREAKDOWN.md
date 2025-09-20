# 💰 GCP Cost Breakdown - Pay As You Use

Detailed breakdown of Google Cloud Platform costs after the free tier expires.

## 🆓 **Free Tier (First 90 Days)**

### **What's Included:**
- **$300 credit** for 90 days
- **Cloud Run**: 2 million requests/month FREE
- **Cloud SQL**: db-f1-micro instance FREE
- **Cloud Storage**: 5GB FREE
- **Cloud CDN**: 1GB egress FREE

### **Your App Usage (Estimated):**
```
Cloud Run (Backend):    $0 (within free limits)
Cloud Run (Frontend):   $0 (within free limits)
Cloud SQL:              $0 (db-f1-micro is free)
Cloud Storage:          $0 (5GB is plenty)
Cloud CDN:              $0 (1GB is plenty)
Total:                  $0/month
```

## 💸 **After Free Tier Expires**

### **Pay-As-You-Use Pricing:**

#### **Cloud Run (Backend)**
```
CPU Time:               $0.00002400 per vCPU-second
Memory:                 $0.00000250 per GB-second
Requests:               $0.40 per million requests
Network Egress:         $0.12 per GB

Example (1K users/month):
- CPU Time:             2 hours = $0.17
- Memory:               2GB × 2 hours = $0.04
- Requests:             100K requests = $0.04
- Network:              1GB egress = $0.12
Total Backend:          $0.37/month
```

#### **Cloud Run (Frontend)**
```
CPU Time:               $0.00002400 per vCPU-second
Memory:                 $0.00000250 per GB-second
Requests:               $0.40 per million requests
Network Egress:         $0.12 per GB

Example (1K users/month):
- CPU Time:             1 hour = $0.09
- Memory:               0.5GB × 1 hour = $0.01
- Requests:             50K requests = $0.02
- Network:              2GB egress = $0.24
Total Frontend:         $0.36/month
```

#### **Cloud SQL (Database)**
```
db-f1-micro:            FREE (Always Free)
db-g1-small:            $7.67/month (if you upgrade)
db-n1-standard-1:       $24.27/month (if you upgrade)

Your App:               $0/month (db-f1-micro is sufficient)
```

#### **Cloud Storage**
```
Standard Storage:       $0.020 per GB/month
Network Egress:         $0.12 per GB

Example (1GB storage):
- Storage:              1GB × $0.020 = $0.02
- Egress:               0.5GB × $0.12 = $0.06
Total Storage:          $0.08/month
```

## 📊 **Real Cost Examples**

### **Scenario 1: Small App (100 users/month)**
```
Cloud Run (Backend):    $0.15/month
Cloud Run (Frontend):   $0.10/month
Cloud SQL:              $0/month (free tier)
Cloud Storage:          $0.05/month
Total:                  $0.30/month
```

### **Scenario 2: Medium App (1,000 users/month)**
```
Cloud Run (Backend):    $0.37/month
Cloud Run (Frontend):   $0.36/month
Cloud SQL:              $0/month (free tier)
Cloud Storage:          $0.08/month
Total:                  $0.81/month
```

### **Scenario 3: Growing App (10,000 users/month)**
```
Cloud Run (Backend):    $3.70/month
Cloud Run (Frontend):   $3.60/month
Cloud SQL:              $0/month (free tier)
Cloud Storage:          $0.80/month
Total:                  $8.10/month
```

### **Scenario 4: Popular App (100,000 users/month)**
```
Cloud Run (Backend):    $37/month
Cloud Run (Frontend):   $36/month
Cloud SQL:              $0/month (free tier)
Cloud Storage:          $8/month
Total:                  $81/month
```

## 🎯 **Your Actual Costs (Realistic Estimate)**

### **For Interview Booking Project:**

#### **Month 1-3: FREE**
- **Cost**: $0/month
- **Users**: 0-1,000
- **Reason**: $300 free credit covers everything

#### **Month 4-6: Low Usage**
- **Cost**: $1-5/month
- **Users**: 100-1,000
- **Breakdown**:
  - Cloud Run: $0.50-2.00
  - Cloud SQL: $0 (free tier)
  - Storage: $0.10-0.50

#### **Month 7-12: Growing**
- **Cost**: $5-15/month
- **Users**: 1,000-5,000
- **Breakdown**:
  - Cloud Run: $2.00-8.00
  - Cloud SQL: $0 (free tier)
  - Storage: $0.50-2.00

#### **Year 2+: Established**
- **Cost**: $15-35/month
- **Users**: 5,000-20,000
- **Breakdown**:
  - Cloud Run: $8.00-25.00
  - Cloud SQL: $0-15.00 (if you upgrade)
  - Storage: $2.00-5.00

## 💡 **Cost Optimization Tips**

### **1. Stay Within Free Limits**
```bash
# Cloud Run Free Tier:
# - 2 million requests/month
# - 400,000 GB-seconds of memory
# - 200,000 vCPU-seconds

# Cloud SQL Free Tier:
# - db-f1-micro instance (1 vCPU, 0.6GB RAM)
# - 10GB storage
# - No network egress charges
```

### **2. Optimize Your App**
```bash
# Backend Optimization:
- Use efficient database queries
- Implement caching
- Optimize images and assets
- Use CDN for static content

# Frontend Optimization:
- Compress images
- Minify CSS/JS
- Use lazy loading
- Implement service workers
```

### **3. Monitor Usage**
```bash
# Set up billing alerts:
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT \
  --budget-amount=10USD \
  --budget-display-name="Monthly Budget"
```

### **4. Use Appropriate Instance Sizes**
```bash
# Start small and scale up:
# Cloud Run: 0.5 vCPU, 512MB RAM (minimum)
# Cloud SQL: db-f1-micro (free tier)

# Only upgrade when needed:
# Cloud Run: 1 vCPU, 1GB RAM (when you have traffic)
# Cloud SQL: db-g1-small (when you need more performance)
```

## 📈 **Scaling Costs**

### **When to Upgrade:**

#### **Cloud Run Upgrades:**
```
Current: 0.5 vCPU, 512MB RAM
Upgrade when: >1000 concurrent users
Cost increase: +50-100%
```

#### **Cloud SQL Upgrades:**
```
Current: db-f1-micro (FREE)
Upgrade when: >10,000 users or slow queries
Cost increase: +$7.67/month (db-g1-small)
```

#### **Storage Upgrades:**
```
Current: 5GB (FREE)
Upgrade when: >5GB needed
Cost increase: +$0.020 per GB/month
```

## 🎯 **Realistic Cost Projection**

### **Year 1:**
```
Months 1-3:   $0/month (free credit)
Months 4-6:   $2/month (low usage)
Months 7-9:   $5/month (growing)
Months 10-12: $10/month (established)
Average:      $4.25/month
```

### **Year 2:**
```
Months 13-15: $15/month
Months 16-18: $20/month
Months 19-21: $25/month
Months 22-24: $30/month
Average:      $22.50/month
```

### **Total Cost Over 2 Years:**
```
Year 1:       $51 (average $4.25/month)
Year 2:       $270 (average $22.50/month)
Total:        $321 over 2 years
```

## 🚨 **Important Notes**

### **Billing Alerts:**
```bash
# Set up alerts to avoid surprises:
1. Go to GCP Console > Billing
2. Set up budget alerts at $5, $10, $20
3. Get email notifications when approaching limits
```

### **Free Tier Limits:**
```bash
# These are PER MONTH limits:
- Cloud Run: 2M requests, 400K GB-seconds
- Cloud SQL: 1 instance, 10GB storage
- Cloud Storage: 5GB
- Cloud CDN: 1GB egress
```

### **Always Free Services:**
```bash
# These NEVER expire:
- Cloud Run: 2M requests/month
- Cloud SQL: db-f1-micro instance
- Cloud Storage: 5GB
- Cloud CDN: 1GB egress
```

## 🎉 **Conclusion**

**Your actual costs will be much lower than $18-33/month!**

**Realistic costs:**
- **Month 1-3**: $0 (free credit)
- **Month 4-12**: $2-10/month
- **Year 2+**: $15-30/month

**This is still much cheaper than:**
- Vercel + Railway: $25-100/month
- AWS: $30-80/month
- Azure: $25-70/month

**GCP gives you the best value with pay-as-you-use pricing!**
