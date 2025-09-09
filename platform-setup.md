# TNT Platform Detection Setup Guide

## Automatic Platform Detection System

Your TNT pricing tools now automatically detect user sources and display the appropriate interface:

### 🎯 **Access URLs for Different Platforms**

#### **Retail Customers (Standard Rates)**
- `https://your-domain.com/` - Default retail interface
- `https://your-domain.com/?type=retail` - Force retail mode
- `https://your-domain.com/pricing` - Retail pricing page

#### **GNET Partners (Commission Rates)**
- `https://gnet.your-domain.com/` - GNET subdomain
- `https://your-domain.com/?partner=gnet` - GNET parameter
- `https://your-domain.com/?source=gnet` - GNET source tracking
- `https://your-domain.com/partner` - Partner portal path

#### **Capital One Corporate (Groundspan)**
- `https://corporate.your-domain.com/` - Corporate subdomain  
- `https://capitalone.your-domain.com/` - Client-specific subdomain
- `https://your-domain.com/?client=capitalone` - Corporate parameter
- `https://your-domain.com/?platform=groundspan` - Groundspan tracking
- `https://your-domain.com/corporate` - Corporate portal path

### 📱 **Detection Methods (Automatic)**

1. **URL Parameters** (Highest Priority)
   - `?platform=gnet` → GNET Partner Portal
   - `?client=capitalone` → Capital One Corporate
   - `?source=partner` → GNET Partner Portal
   - `?corporate=true` → Corporate Interface

2. **Subdomains**
   - `gnet.tntlimousine.com` → GNET Portal
   - `corporate.tntlimousine.com` → Corporate Portal
   - `capitalone.tntlimousine.com` → Capital One Interface

3. **URL Paths**
   - `/gnet/` or `/partner/` → GNET Portal
   - `/corporate/` or `/groundspan/` → Corporate Portal

4. **Referrer Detection**
   - From `gnet.com` → GNET Portal
   - From `capitalone.com` → Corporate Portal
   - From search engines → Retail Interface

### 🔧 **Setup Instructions**

#### **1. Deploy Files**
```
/tnt-pricing/
├── platform-redirect.html (main entry point)
├── adaptive-pricing-tool.html (unified tool)
├── js/platform-detection.js (detection logic)
├── js/airport-zone-pricing.js (zone rates)
└── js/driver-portal-sync.js (portal integration)
```

#### **2. Configure DNS/Hosting**
Set up subdomains to point to your pricing tool:
- `gnet.tntlimousine.com` → `/platform-redirect.html`
- `corporate.tntlimousine.com` → `/platform-redirect.html`
- `capitalone.tntlimousine.com` → `/platform-redirect.html`

#### **3. Link Integration**
Update your website links:

**For Retail Customers:**
```html
<a href="/pricing">Get Quote</a>
```

**For GNET Partners:**
```html  
<a href="/?partner=gnet">Partner Portal</a>
```

**For Corporate Clients:**
```html
<a href="/?client=capitalone">Corporate Booking</a>
```

### 🎨 **Platform Differences**

#### **Retail Interface**
- ✅ Full transparent pricing breakdown
- ✅ Discount information and promotions
- ✅ Standard TNT branding
- ✅ Multiple booking options

#### **GNET Partner Interface**  
- ✅ Commission tracking display (12%-15%)
- ✅ Partner-specific branding colors
- ✅ Export to GNET system button
- ✅ Partner commission calculations
- ❌ No discount promotions (partner rates)

#### **Capital One Corporate Interface**
- ✅ Corporate premium rates ($10+ higher)
- ✅ Capital One branding elements  
- ✅ Monthly billing information
- ✅ Simplified rate display (no breakdown)
- ❌ No service area restrictions
- ❌ No promotional discounts

### 🔍 **Testing URLs**

Test each platform access method:

```bash
# Retail (default)
https://your-domain.com/

# GNET Partner Portal
https://your-domain.com/?partner=gnet
https://gnet.your-domain.com/

# Capital One Corporate
https://your-domain.com/?client=capitalone  
https://corporate.your-domain.com/
```

### 📊 **Analytics Tracking**

The system automatically sets these variables for tracking:
- `window.currentPlatform` - Current platform (retail/gnet/groundspan)
- Platform-specific CSS classes on `<body>`
- localStorage platform preference storage

### 🔒 **Security Considerations**

1. **Rate Protection**: Each platform shows only appropriate rates
2. **Feature Isolation**: Platform-specific features are hidden from other users
3. **Session Management**: Platform preference stored in user session
4. **Access Logging**: Platform detection events logged to console

### 🚀 **Go Live Checklist**

- [ ] Deploy all files to web server
- [ ] Configure subdomain DNS records
- [ ] Test all platform access methods
- [ ] Verify rate calculations for each platform
- [ ] Update existing website links
- [ ] Train staff on new platform-specific features
- [ ] Monitor analytics for platform usage

Your customers will now automatically see the right interface based on how they access your pricing tool!