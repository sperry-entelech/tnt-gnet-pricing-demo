# Deployment Guide

This guide covers multiple deployment options for the TNT-GNET Pricing Demo.

## 🚀 Vercel Deployment (Recommended)

### **Option 1: One-Click Deploy**
The fastest way to deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sperry-entelech/tnt-gnet-pricing-demo)

### **Option 2: GitHub Integration**
Best for ongoing development:

1. **Connect GitHub to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"

2. **Import Repository**:
   - Select `sperry-entelech/tnt-gnet-pricing-demo`
   - Click "Import"
   - Use default settings
   - Deploy

3. **Automatic Updates**:
   - Every commit to `main` branch auto-deploys
   - Preview deployments for pull requests
   - Custom domains supported

### **Option 3: Vercel CLI**
For developers who prefer command line:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Clone repository
git clone https://github.com/sperry-entelech/tnt-gnet-pricing-demo.git
cd tnt-gnet-pricing-demo

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## 🔧 Configuration Options

### **Environment Variables**
No environment variables required for basic deployment. For future API integrations:

```bash
# Example future variables
FASTTRAK_API_URL=https://api.fasttrak.com
ZOHO_CRM_TOKEN=your_zoho_token
GNET_API_KEY=your_gnet_key
```

### **Custom Domain**
1. Go to Vercel dashboard
2. Select your project
3. Navigate to "Settings" > "Domains"  
4. Add custom domain (e.g., `pricing.tntlimousine.com`)

### **Performance Settings**
The included `vercel.json` optimizes for:
- **Static file serving** with edge caching
- **Security headers** for production
- **SPA routing** support

## 🌐 Alternative Deployment Options

### **Netlify**
```bash
# Netlify CLI deployment
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir .
```

### **GitHub Pages**
1. Go to repository Settings > Pages
2. Select source: "Deploy from a branch" 
3. Choose branch: `main`
4. Folder: `/ (root)`
5. Save

### **Firebase Hosting**
```bash
# Firebase CLI setup
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### **AWS S3 + CloudFront**
```bash
# AWS CLI deployment
aws s3 sync . s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## 🔒 Security Considerations

### **HTTPS Enforcement**
- Vercel automatically provides SSL certificates
- All traffic redirected to HTTPS
- HSTS headers included

### **Content Security Policy**
Current headers in `vercel.json`:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`

For enhanced security, consider adding:
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline'"
}
```

### **Rate Limiting**
For production API integrations, implement:
- Request rate limiting
- API key authentication
- Input validation and sanitization

## 📊 Monitoring & Analytics

### **Vercel Analytics**
Enable in Vercel dashboard:
1. Go to project settings
2. Navigate to "Analytics"
3. Enable Web Analytics
4. Add tracking code if needed

### **Google Analytics**
Add to `index.html` before closing `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🐛 Troubleshooting

### **Common Issues**

**Build Failures**:
- Check `vercel.json` syntax
- Verify all files are committed to Git
- Review build logs in Vercel dashboard

**404 Errors**:
- Ensure `index.html` exists in root directory
- Check `routes` configuration in `vercel.json`

**Slow Loading**:
- Enable compression in `vercel.json`
- Optimize images and assets
- Use CDN for large files

**Mobile Issues**:
- Test responsive design on multiple devices
- Verify viewport meta tag
- Check touch event handling

### **Support Resources**

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: [Repository Issues](https://github.com/sperry-entelech/tnt-gnet-pricing-demo/issues)
- **TNT Support**: info@tntlimousine.com

## 🔄 Update Process

### **Content Updates**
1. Edit `index.html` locally
2. Test changes locally (open in browser)
3. Commit and push to GitHub
4. Vercel auto-deploys within 30 seconds

### **Pricing Updates**
To update vehicle rates or discounts:
1. Locate `pricingData` object in `index.html`
2. Modify rates as needed
3. Test calculations locally
4. Deploy via Git commit

### **Branding Updates**
To customize GNET partnership elements:
1. Update CSS variables for colors
2. Modify `.partner-badge` content
3. Edit partnership messaging in results section
4. Test visual consistency across devices

---

**Need help?** Contact the development team or create a GitHub issue for technical support.