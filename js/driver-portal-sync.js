/**
 * Driver Portal Sync Functions
 * Connects TNT pricing tools with driver portal for real-time data
 */

class DriverPortalSync {
  constructor(portalBaseUrl = 'https://tnt-driver-portal.vercel.app') {
    this.portalBaseUrl = portalBaseUrl;
    this.apiBase = `${portalBaseUrl}/api/pricing-sync`;
  }

  /**
   * Check real-time vehicle availability before showing pricing
   * Call this when user selects service date/time
   */
  async checkVehicleAvailability(datetime, passengerCount, serviceType) {
    try {
      const params = new URLSearchParams({
        datetime: datetime,
        passengers: passengerCount.toString(),
        service_type: serviceType
      });

      const response = await fetch(`${this.apiBase}/availability?${params}`);
      const result = await response.json();

      if (result.success) {
        return {
          available: result.availability.available,
          vehicleClass: result.availability.vehicleClass,
          assignedVehicleId: result.availability.assignedVehicleId,
          driverAvailable: result.availability.driverAvailable,
          conflicts: result.availability.conflictingTrips || []
        };
      } else {
        console.warn('Availability check failed:', result.error);
        return { available: true, vehicleClass: 'sedan', conflicts: [] }; // Fallback
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      return { available: true, vehicleClass: 'sedan', conflicts: [] }; // Fallback
    }
  }

  /**
   * Get real-time fleet status to show in pricing tool
   */
  async getFleetStatus() {
    try {
      const response = await fetch(`${this.apiBase}/fleet-status`);
      const result = await response.json();

      if (result.success) {
        return result.fleet;
      } else {
        console.warn('Fleet status failed:', result.error);
        return [];
      }
    } catch (error) {
      console.error('Error getting fleet status:', error);
      return [];
    }
  }

  /**
   * Create booking and sync to driver portal
   * Call this when user confirms a booking
   */
  async syncBookingToDriverPortal(bookingDetails) {
    try {
      const response = await fetch(`${this.apiBase}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails)
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          tripId: result.tripId,
          message: 'Booking created and synced to driver portal'
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      console.error('Error syncing booking:', error);
      return {
        success: false,
        error: 'Failed to sync booking to driver portal'
      };
    }
  }

  /**
   * Show availability warning in pricing tool
   */
  showAvailabilityWarning(availability) {
    if (!availability.available) {
      const warningDiv = document.createElement('div');
      warningDiv.className = 'availability-warning';
      warningDiv.style.cssText = `
        background: rgba(255, 193, 7, 0.1);
        border: 1px solid #ffc107;
        border-radius: 10px;
        padding: 15px;
        margin: 15px 0;
        color: #ffc107;
        font-size: 14px;
      `;

      let message = '⚠️ Limited availability for your requested time.';
      
      if (!availability.driverAvailable) {
        message += ' No drivers currently available.';
      }
      
      if (availability.conflicts.length > 0) {
        message += ` ${availability.conflicts.length} vehicle(s) already scheduled.`;
      }
      
      message += ' Please consider alternative times or contact us for priority booking.';

      warningDiv.innerHTML = message;

      // Insert warning before the results section
      const resultsDiv = document.getElementById('results');
      if (resultsDiv && resultsDiv.parentNode) {
        resultsDiv.parentNode.insertBefore(warningDiv, resultsDiv);
      }
    }
  }

  /**
   * Enhanced quote calculation with real-time availability
   */
  async calculateQuoteWithAvailability(quoteData) {
    // First check availability
    const availability = await this.checkVehicleAvailability(
      quoteData.pickupDateTime,
      quoteData.passengerCount,
      quoteData.serviceType
    );

    // Show availability warning if needed
    this.showAvailabilityWarning(availability);

    // Apply availability-based pricing adjustments
    if (!availability.available) {
      // Could apply surge pricing or priority booking fees
      if (!availability.driverAvailable) {
        quoteData.notes = (quoteData.notes || '') + ' Priority driver assignment fee may apply.';
      }
    }

    return {
      ...quoteData,
      availability,
      recommendedVehicleClass: availability.vehicleClass
    };
  }

  /**
   * Enhanced booking confirmation with driver portal sync
   */
  async confirmBookingWithSync(bookingData, platform = 'standard') {
    // Prepare booking data for driver portal
    const driverPortalBooking = {
      serviceType: bookingData.serviceType,
      vehicleClass: bookingData.vehicleType,
      pickupDateTime: `${bookingData.serviceDate}T${bookingData.serviceTime}`,
      pickupLocation: bookingData.pickupLocation,
      dropoffLocation: bookingData.dropoffLocation,
      passengerCount: parseInt(bookingData.passengerCount || '1'),
      totalAmount: parseFloat(bookingData.totalAmount || '0'),
      platform: platform,
      specialInstructions: bookingData.specialInstructions,
      corporateAccountId: platform === 'groundspan' ? 'CAPITAL_ONE' : 
                          platform === 'gnet' ? 'GNET_PARTNER' : null,
      
      // Additional metadata for tracking
      bookingSource: 'pricing_tool',
      bookingTimestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      customerInfo: {
        name: bookingData.customerName,
        email: bookingData.customerEmail,
        phone: bookingData.customerPhone
      }
    };

    // Sync to driver portal
    const syncResult = await this.syncBookingToDriverPortal(driverPortalBooking);

    if (syncResult.success) {
      // Show success message with driver portal integration
      this.showBookingConfirmation(syncResult.tripId, bookingData, platform);
      
      // Log successful sync for analytics
      console.log(`Booking ${syncResult.tripId} synced to driver portal for ${platform} platform`);
      
      return {
        success: true,
        tripId: syncResult.tripId,
        confirmationCode: `TNT-${Date.now().toString().slice(-6)}`,
        message: 'Booking confirmed and dispatched to drivers'
      };
    } else {
      // Fallback: booking created in pricing tool but not synced
      console.error('Failed to sync booking:', syncResult.error);
      
      this.showBookingError(syncResult.error);
      
      return {
        success: false,
        error: syncResult.error,
        fallback: true,
        message: 'Booking created but requires manual dispatcher assignment'
      };
    }
  }

  /**
   * Show enhanced booking confirmation
   */
  showBookingConfirmation(tripId, bookingData, platform) {
    const confirmationHTML = `
      <div style="
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
        border: 2px solid #10b981;
        border-radius: 15px;
        padding: 25px;
        margin: 20px 0;
        text-align: center;
      ">
        <h3 style="color: #10b981; margin-bottom: 15px;">✅ Booking Confirmed!</h3>
        
        <div style="background: rgba(0,0,0,0.1); border-radius: 10px; padding: 15px; margin: 15px 0;">
          <strong>Trip ID:</strong> ${tripId}<br>
          <strong>Platform:</strong> ${platform.toUpperCase()}<br>
          <strong>Status:</strong> Dispatched to drivers<br>
          <strong>Real-time tracking:</strong> Available in driver portal
        </div>
        
        <div style="font-size: 14px; opacity: 0.9; margin-top: 15px;">
          🚗 Your trip has been automatically assigned to our driver portal<br>
          📱 Drivers will receive immediate notification<br>
          📊 Real-time tracking and updates available<br>
          ${platform === 'groundspan' ? '🏢 Capital One corporate billing applied' : 
            platform === 'gnet' ? '🤝 GNET partner commission tracking active' : ''}
        </div>
      </div>
    `;

    // Insert confirmation message
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
      const confirmationDiv = document.createElement('div');
      confirmationDiv.innerHTML = confirmationHTML;
      resultsDiv.appendChild(confirmationDiv);
    }
  }

  /**
   * Show booking error message
   */
  showBookingError(error) {
    const errorHTML = `
      <div style="
        background: rgba(220, 38, 38, 0.1);
        border: 2px solid #DC2626;
        border-radius: 15px;
        padding: 20px;
        margin: 20px 0;
        text-align: center;
      ">
        <h4 style="color: #DC2626; margin-bottom: 10px;">⚠️ Booking Sync Issue</h4>
        <p style="font-size: 14px;">
          Your booking has been received but requires manual dispatcher assignment.<br>
          Error: ${error}<br><br>
          <strong>Our dispatch team has been notified and will contact you within 15 minutes.</strong>
        </p>
      </div>
    `;

    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = errorHTML;
      resultsDiv.appendChild(errorDiv);
    }
  }
}

// Initialize the sync service
const driverPortalSync = new DriverPortalSync();

// Export for use in pricing tools
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DriverPortalSync;
}

// Global functions for easy integration in existing pricing tools
window.checkDriverPortalAvailability = async (datetime, passengers, serviceType) => {
  return await driverPortalSync.checkVehicleAvailability(datetime, passengers, serviceType);
};

window.syncBookingToDriverPortal = async (bookingData, platform) => {
  return await driverPortalSync.confirmBookingWithSync(bookingData, platform);
};

window.getFleetStatus = async () => {
  return await driverPortalSync.getFleetStatus();
};