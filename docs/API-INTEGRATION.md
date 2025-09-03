# API Integration Guide

Future roadmap for integrating the TNT-GNET Pricing Demo with backend systems and external APIs.

## 🏗 Architecture Overview

### **Current State**
- **Frontend-Only**: Static HTML with JavaScript calculations
- **No Backend**: All pricing logic handled client-side
- **Manual Booking**: Phone/email contact for reservations

### **Planned Integration**
```
GNET Platform → TNT Pricing API → FastTrak Invision → Zoho CRM
     ↓              ↓                    ↓            ↓
  Quote Request   Price Calc        Dispatch      Customer Data
  Booking Submit  Availability      Scheduling    Lead Tracking
```

## 🔌 API Endpoints (Future Implementation)

### **Pricing API**
```javascript
// GET /api/pricing/calculate
{
  "serviceType": "hourly|point-to-point|airport",
  "vehicleType": "sedan|transit|limo-bus|...",
  "hours": 4,
  "pickupDate": "2025-01-15",
  "pickupTime": "14:00",
  "airport": "DCA", // for airport service
  "discountCodes": ["GNET10", "MONDAY"]
}

// Response
{
  "success": true,
  "quote": {
    "vehicleName": "Sedan (04/05)",
    "serviceType": "Hourly Service",
    "totalPrice": 360.00,
    "breakdown": [
      {"item": "Base Rate (4 hrs)", "amount": 240},
      {"item": "Gratuity (4 hrs)", "amount": 48},
      {"item": "Fuel Surcharge (4 hrs)", "amount": 40},
      {"item": "Mileage Charge (4 hrs)", "amount": 72},
      {"item": "Monday-Thursday Discount", "amount": -40}
    ],
    "quoteId": "TNT-2025-001234",
    "validUntil": "2025-01-16T14:00:00Z"
  }
}
```

### **Availability API**
```javascript
// GET /api/availability/check
{
  "vehicleType": "sedan",
  "date": "2025-01-15",
  "startTime": "14:00",
  "endTime": "18:00"
}

// Response
{
  "available": true,
  "vehicles": [
    {
      "unitNo": "04",
      "driverName": "John Smith",
      "availableFrom": "13:30",
      "availableUntil": "22:00"
    }
  ],
  "alternativeOptions": [...]
}
```

### **Booking API**
```javascript
// POST /api/booking/create
{
  "quoteId": "TNT-2025-001234",
  "customerInfo": {
    "name": "Jane Doe",
    "phone": "(555) 123-4567",
    "email": "jane@example.com",
    "affiliateId": "GNET-12345"
  },
  "serviceDetails": {
    "pickupAddress": "123 Main St, Richmond, VA",
    "dropoffAddress": "Richmond International Airport",
    "specialInstructions": "Flight monitoring required"
  }
}

// Response
{
  "success": true,
  "bookingId": "TNT-BK-2025-001234",
  "confirmationNumber": "TNT001234",
  "fastTrakJobId": "FT-789456",
  "zohoLeadId": "ZH-456789",
  "estimatedTotal": 360.00,
  "paymentRequired": 72.00, // 20% deposit
  "status": "confirmed"
}
```

## 🔧 Integration Points

### **1. FastTrak Invision Integration**
**Purpose**: Dispatch management and driver assignment

**Capabilities**:
- Create dispatch jobs from bookings
- Real-time vehicle tracking
- Driver communication system
- Route optimization
- Job status updates

**API Requirements**:
```javascript
// Example FastTrak integration
const fastTrakPayload = {
  jobType: "limousine_service",
  vehicleRequired: "sedan_04",
  pickupDateTime: "2025-01-15T14:00:00",
  pickupLocation: customerData.pickupAddress,
  dropoffLocation: customerData.dropoffAddress,
  customerName: customerData.name,
  customerPhone: customerData.phone,
  specialInstructions: customerData.instructions,
  estimatedDuration: bookingData.hours,
  rateQuoted: bookingData.totalPrice
};
```

### **2. Zoho CRM Integration**
**Purpose**: Customer relationship management and lead tracking

**Capabilities**:
- Automatic lead creation
- Customer history tracking
- Follow-up scheduling
- Commission tracking for GNET
- Reporting and analytics

**Data Flow**:
```javascript
// Zoho CRM lead creation
const zohoLead = {
  "Lead_Source": "GNET_Partner",
  "Company": "GNET Platform",
  "First_Name": customerData.firstName,
  "Last_Name": customerData.lastName,
  "Email": customerData.email,
  "Phone": customerData.phone,
  "Lead_Status": "Quote_Requested",
  "Description": `Service: ${serviceType}, Vehicle: ${vehicleType}, Total: $${totalPrice}`,
  "Custom_Fields": {
    "Quote_ID": quoteId,
    "Affiliate_Partner": "GNET",
    "Service_Date": pickupDate,
    "Quoted_Amount": totalPrice
  }
};
```

### **3. GNET Platform Integration**
**Purpose**: Affiliate partnership and commission tracking

**Webhook Endpoints**:
- **Quote Generated**: Notify GNET of new quotes
- **Booking Confirmed**: Commission calculation trigger  
- **Service Completed**: Final commission settlement
- **Cancellation**: Commission adjustment

**Commission Structure**:
```javascript
const commissionRules = {
  "tiers": [
    {"volume": "0-10", "rate": 0.05},      // 5% for 1-10 bookings/month
    {"volume": "11-25", "rate": 0.075},    // 7.5% for 11-25 bookings/month  
    {"volume": "26+", "rate": 0.10}        // 10% for 26+ bookings/month
  ],
  "bonuses": {
    "firstBooking": 25.00,                 // $25 bonus for first booking
    "monthlyTarget": 100.00                // $100 bonus for 20+ bookings/month
  }
};
```

## 🔐 Authentication & Security

### **API Authentication**
```javascript
// JWT Token-based authentication
const headers = {
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json",
  "X-API-Key": process.env.TNT_API_KEY,
  "X-Partner-ID": "GNET"
};
```

### **Security Measures**
- **HTTPS Only**: All API communications encrypted
- **Rate Limiting**: Prevent API abuse (100 requests/minute)
- **Input Validation**: Sanitize all user inputs
- **API Keys**: Partner-specific authentication
- **Audit Logging**: Track all booking and pricing requests

### **Data Privacy**
- **PII Encryption**: Customer data encrypted at rest
- **GDPR Compliance**: Right to deletion and data portability
- **Retention Policy**: Customer data retained per business requirements
- **Access Controls**: Role-based API access

## 📊 Monitoring & Analytics

### **Metrics to Track**
- **Quote Conversion Rate**: Quotes → Bookings
- **Partner Performance**: GNET booking volume and revenue
- **Popular Services**: Most requested vehicle types and routes
- **Pricing Effectiveness**: Discount usage and impact
- **System Performance**: API response times and uptime

### **Reporting Dashboard**
```javascript
// Example analytics endpoint
// GET /api/analytics/partner/gnet
{
  "period": "2025-01",
  "totalQuotes": 1250,
  "totalBookings": 187,
  "conversionRate": 0.1496,
  "totalRevenue": 45670.00,
  "totalCommission": 4567.00,
  "topVehicles": ["sedan", "limo-bus", "sprinter-limo"],
  "topRoutes": ["to-airport", "hourly-corporate", "point-to-point"]
}
```

## 🛠 Implementation Phases

### **Phase 1: Basic API (Months 1-2)**
- ✅ Pricing calculation API
- ✅ Quote generation and storage
- ✅ Basic booking creation
- ✅ FastTrak integration setup

### **Phase 2: Full Integration (Months 3-4)**
- 🔄 Real-time availability checking
- 🔄 Zoho CRM synchronization  
- 🔄 GNET webhook integration
- 🔄 Commission tracking system

### **Phase 3: Advanced Features (Months 5-6)**
- ⏳ Mobile app API support
- ⏳ Payment processing integration
- ⏳ Advanced analytics dashboard
- ⏳ Multi-language support

### **Phase 4: Optimization (Ongoing)**
- ⏳ Performance optimization
- ⏳ Additional partner integrations
- ⏳ Advanced booking features
- ⏳ AI-powered pricing optimization

## 🧪 Testing Strategy

### **API Testing**
- **Unit Tests**: Individual endpoint functionality
- **Integration Tests**: Cross-system data flow
- **Load Tests**: High-volume request handling
- **Security Tests**: Penetration testing and vulnerability scanning

### **Partner Testing**
- **Sandbox Environment**: Full GNET integration testing
- **Mock Data**: Realistic test scenarios
- **Error Handling**: Graceful failure management
- **Performance Monitoring**: Response time optimization

---

**Ready to integrate?** Contact the technical team for API access and integration support.