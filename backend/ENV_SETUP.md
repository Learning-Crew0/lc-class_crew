# Environment Setup Guide

This guide will help you configure your environment variables for the LC Class Crew backend.

## 🚀 Quick Setup

### Step 1: Copy the Example File

```bash
cp .env.example .env
```

### Step 2: Edit the `.env` File

Open `.env` in your editor and update the values according to your environment.

## 📋 Required Configuration

### Minimum Required Variables

These variables **MUST** be set for the application to run:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lc-class-crew
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
```

## 🔧 Configuration Sections

### 1. Server Configuration

```env
NODE_ENV=development          # 'development', 'production', or 'test'
PORT=5000                     # Port number for the server
API_VERSION=v1                # API version prefix
```

**Development Settings:**
- `NODE_ENV=development` - Enables detailed error messages and stack traces
- Use `production` for live deployments

### 2. Database Configuration

#### Option A: Local MongoDB

```env
MONGODB_URI=mongodb://localhost:27017/lc-class-crew
```

**Prerequisites:**
- Install MongoDB locally: https://www.mongodb.com/try/download/community
- Start MongoDB service

#### Option B: MongoDB Atlas (Cloud)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lc-class-crew?retryWrites=true&w=majority
```

**Setup Steps:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Go to Database Access → Add New Database User
4. Go to Network Access → Add IP Address (0.0.0.0/0 for testing)
5. Click "Connect" → "Connect your application" → Copy connection string
6. Replace `<password>` with your database user password

### 3. JWT Configuration

Generate strong secrets using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this command twice to generate two different secrets:

```env
JWT_SECRET=generated-secret-1-here
JWT_REFRESH_SECRET=generated-secret-2-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

**⚠️ IMPORTANT:**
- Use different secrets for development and production
- Never commit actual secrets to version control
- Keep secrets at least 64 characters long

### 4. CORS Configuration

Add all frontend URLs that should be allowed to access your API:

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourapp.com
```

**Common Scenarios:**
- Next.js dev: `http://localhost:3000`
- Vite/React dev: `http://localhost:5173`
- Production: `https://your-domain.com`

### 5. File Upload Configuration

```env
MAX_FILE_SIZE=5242880              # 5MB in bytes
UPLOAD_DIR=uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp,application/pdf
```

**Storage Options:**

#### Local Storage (Default)
```env
STORAGE_TYPE=local
```

#### AWS S3 Storage
```env
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

**S3 Setup:**
1. Create AWS account: https://aws.amazon.com
2. Go to S3 → Create bucket
3. Go to IAM → Create user with S3 access
4. Generate access keys

### 6. Email Configuration (Optional)

#### Gmail Setup

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@lcclasscrew.com
```

**Gmail App Password:**
1. Enable 2FA on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate an app password
4. Use that password (not your regular password)

#### Other SMTP Providers

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
```

### 7. Admin Credentials

Default admin account created on first seed:

```env
ADMIN_EMAIL=admin@lcclasscrew.com
ADMIN_PASSWORD=changeme123
ADMIN_NAME=System Administrator
```

**⚠️ SECURITY:**
- Change these immediately after first login
- Use a strong password
- Never use default credentials in production

### 8. Payment Gateway (Optional)

#### Stripe
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Get keys from: https://dashboard.stripe.com/apikeys

#### PayPal
```env
PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-client-secret
PAYPAL_MODE=sandbox
```

Sandbox: https://developer.paypal.com/dashboard/

### 9. Third-Party Services (Optional)

#### Google OAuth
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
```

Setup: https://console.cloud.google.com/

#### Cloudinary (Image Hosting)
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Get credentials: https://cloudinary.com/console

## 🔒 Security Best Practices

### 1. Never Commit `.env` File

Ensure `.env` is in `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
```

### 2. Use Different Values Per Environment

**Development:**
```env
NODE_ENV=development
JWT_SECRET=dev-secret-key
MONGODB_URI=mongodb://localhost:27017/lc-class-crew-dev
```

**Production:**
```env
NODE_ENV=production
JWT_SECRET=strong-production-secret-key-64-chars-minimum
MONGODB_URI=mongodb+srv://...atlas-production-cluster
```

### 3. Generate Strong Secrets

```bash
# Generate a 64-byte random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use online tools (for non-critical secrets only)
# https://randomkeygen.com/
```

### 4. Rotate Secrets Regularly

- Change JWT secrets every 6 months
- Update database passwords quarterly
- Rotate API keys after team member changes

## 🧪 Testing Configuration

Create a separate `.env.test` for testing:

```env
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/lc-class-crew-test
JWT_SECRET=test-secret
LOG_LEVEL=error
```

## 🚀 Production Deployment

### Environment Variables on Render.com

1. Go to your service → Environment
2. Add each variable from `.env.example`
3. Use production values
4. Save and redeploy

### Environment Variables on Vercel

```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
# ... add all required variables
```

### Environment Variables on Railway

1. Go to your project → Variables
2. Click "RAW Editor"
3. Paste all variables
4. Deploy

### Environment Variables on Heroku

```bash
heroku config:set MONGODB_URI="your-uri"
heroku config:set JWT_SECRET="your-secret"
# ... add all required variables
```

## ✅ Verification

### Check Current Environment

```bash
# In your backend directory
node -e "require('dotenv').config(); console.log('PORT:', process.env.PORT)"
```

### Verify Database Connection

```bash
npm run dev
# Should see: "MongoDB connected: localhost" or your Atlas cluster
```

### Test All Variables

Create a test script `test-env.js`:

```javascript
require('dotenv').config();

const required = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

console.log('Checking required environment variables...\n');

required.forEach(key => {
  const value = process.env[key];
  const status = value ? '✅' : '❌';
  console.log(`${status} ${key}: ${value ? '(set)' : '(missing)'}`);
});
```

Run: `node test-env.js`

## 🆘 Troubleshooting

### Issue: "Cannot find module 'dotenv'"

```bash
npm install dotenv
```

### Issue: MongoDB connection failed

- Check if MongoDB is running: `mongosh`
- Verify connection string format
- Check firewall settings
- For Atlas: Verify IP whitelist

### Issue: JWT errors

- Ensure JWT_SECRET is set
- Check for typos in variable names
- Verify secrets are at least 32 characters

### Issue: CORS errors

- Add frontend URL to ALLOWED_ORIGINS
- Include protocol (http:// or https://)
- Separate multiple origins with commas

## 📚 Additional Resources

- [MongoDB Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [dotenv Documentation](https://github.com/motdotla/dotenv)

## 🔗 Quick Links

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Stripe Dashboard: https://dashboard.stripe.com/
- SendGrid: https://app.sendgrid.com/
- Cloudinary: https://cloudinary.com/console
- AWS Console: https://console.aws.amazon.com/

---

**Need Help?**
- Check `QUICK_START.md` for setup instructions
- See `README.md` for project overview
- Review `BEST_PRACTICES.md` for coding standards

