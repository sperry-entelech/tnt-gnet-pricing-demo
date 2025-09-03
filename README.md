# TNT Limousine - GNET Partnership Pricing Demo

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sperry-entelech/tnt-gnet-pricing-demo)

A professional pricing calculator demonstrating the integration between TNT Limousine's transportation services and the GNET affiliate platform. This middleware solution bridges GNET's booking system with TNT's FastTrak Invision dispatch software and Zoho CRM.

## 🚀 Live Demo

**[View Live Demo →](https://tnt-gnet-pricing-demo.vercel.app)** *(Available after deployment)*

## 📋 Project Overview

This pricing calculator serves as a **middleware solution** that:

- **Provides transparent pricing** with detailed cost breakdowns
- **Integrates GNET branding** for partnership visibility  
- **Connects to existing systems** (FastTrak Invision + Zoho CRM)
- **Supports affiliate functionality** for commission tracking
- **Offers real-time quotes** for all TNT Limousine services

## 🎯 Key Features

### **Comprehensive Vehicle Fleet**
- **Sedan (04/05)** - 3 passengers
- **Transit** - 12-15 passengers  
- **Executive Mini Bus (09)** - 12 passengers
- **Mini Bus Sofa (01)** - 10 passengers
- **Stretch Limo (03)** - 8 passengers
- **Sprinter Limo (02)** - 10 passengers
- **Limo Bus (10)** - 18 passengers

### **Service Types**
- **Hourly Service** - Round trip with 3-hour minimum
- **Point-to-Point** - Direct transfers with flat pricing
- **Airport Transfers** - RIC, DCA, IAD, BWI, Charlottesville/Williamsburg

### **Dynamic Pricing Features**
- **Detailed Cost Breakdown** - Base rate, gratuity, fuel, mileage shown separately
- **Automatic Discounts** - 10% Mon-Thu, 10% for 6+ hours, 15% last-minute
- **Surcharges** - Holiday +25%, After-hours +$20 (11pm-6am)
- **Real-time Calculations** - Instant quote generation

### **GNET Integration Ready**
- **Partnership Branding** - GNET-themed UI elements
- **API-Ready Structure** - Prepared for booking submissions
- **System Integration** - References to FastTrak and Zoho connectivity
- **Affiliate Messaging** - Built-in partnership communication

## 🛠 Technical Specifications

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Responsiveness**: Mobile-first responsive design
- **Performance**: Optimized for fast loading and SEO
- **Accessibility**: WCAG compliant form elements
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Deploy to Vercel

### **Method 1: One-Click Deploy**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sperry-entelech/tnt-gnet-pricing-demo)

### **Method 2: Vercel CLI**
```bash
# Clone repository
git clone https://github.com/sperry-entelech/tnt-gnet-pricing-demo.git
cd tnt-gnet-pricing-demo

# Deploy to Vercel
npx vercel --prod
```

### **Method 3: GitHub Integration**
1. Connect your GitHub account to Vercel
2. Import this repository
3. Deploy automatically on each commit

## 📁 Project Structure

```
tnt-gnet-pricing-demo/
├── index.html              # Main pricing calculator
├── vercel.json             # Vercel deployment configuration  
├── package.json            # Project metadata
├── README.md               # This documentation
├── docs/
│   ├── DEPLOYMENT.md       # Deployment instructions
│   ├── API-INTEGRATION.md  # Future API integration guide
│   └── PRICING-DETAILS.md  # Detailed pricing breakdown
└── assets/                 # Future assets folder
    └── images/             # Logo and branding assets
```

## 💼 Business Integration

### **Current Systems**
- **FastTrak Invision** - TNT's dispatch management system
- **Zoho CRM** - Customer relationship management  
- **Manual Pricing** - Current Excel-based pricing (being replaced)

### **GNET Partnership Benefits**
- **Automated Quote Generation** - Real-time pricing for affiliate partners
- **Streamlined Booking Process** - Direct integration with TNT systems
- **Commission Tracking** - Built-in affiliate revenue management
- **Professional Presentation** - White-label partnership branding

### **Future Enhancements**
- **API Endpoints** - RESTful API for programmatic access
- **Real-time Availability** - Live vehicle and driver availability
- **Booking Submissions** - Direct booking creation in FastTrak
- **Payment Processing** - Integrated payment gateway
- **Multi-language Support** - Spanish and other languages

## 🔧 Configuration

### **Pricing Updates**
All pricing data is stored in JavaScript objects within `index.html`. To update:

1. **Vehicle Rates** - Modify the `pricingData.vehicles` object
2. **Discounts** - Update `pricingData.surcharges.discounts`  
3. **Airport Rates** - Edit individual vehicle `airportRates`
4. **Surcharges** - Adjust `afterHourPickupFee` and other fees

### **Branding Customization**
- **Colors** - Update CSS variables in the `<style>` section
- **Logo** - Modify `.logo` class content  
- **Partnership Badge** - Edit `.partner-badge` content
- **Contact Info** - Update phone and email in results section

## 📞 Contact Information

**TNT Limousine**
- **Phone**: (804) 972-4550
- **Email**: info@tntlimousine.com
- **Service Area**: Richmond, VA and surrounding regions

**Technical Support**
- **Repository**: [GitHub Issues](https://github.com/sperry-entelech/tnt-gnet-pricing-demo/issues)
- **Development**: Entelech Solutions

## 📄 License

Copyright © 2025 TNT Limousine. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.

---

**Ready to deploy?** Click the Vercel deploy button above or follow the deployment instructions in `docs/DEPLOYMENT.md`.