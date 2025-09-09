/**
 * TNT Airport Zone Pricing Data
 * Flat rates based on distance: pickup zone → airport → back to HQ
 */

const AirportZonePricing = {
    // Zone-based airport pricing structure
    zones: {
        'central-virginia': 'Central Virginia',
        'prince-george': 'Prince George', 
        'norfolk': 'Norfolk',
        'charlottesville': 'Charlottesville'
    },
    
    airports: {
        'ric': 'Richmond International Airport',
        'dca': 'Ronald Reagan National Airport', 
        'iad': 'Washington Dulles International Airport',
        'bwi': 'Baltimore/Washington International Airport',
        'cho': 'Charlottesville Albemarle Airport'
    },
    
    // Flat rates by vehicle type and route
    rates: {
        'sedan': { // Lincoln Aviator
            'central-virginia': {
                'ric': 105,
                'dca': 450,
                'iad': 460,
                'bwi': 657,
                'cho': 333
            },
            'prince-george': {
                'ric': 105,
                'dca': 450,
                'iad': 460,
                'bwi': 657
            },
            'norfolk': {
                'ric': 105, // Hourly rate converted to flat
                'cho': 333  // Hourly rate converted to flat
            },
            'charlottesville': {
                'central-virginia': 333,
                'norfolk': 333
            }
        },
        
        'transit': { // Ford Transit 15 Pax
            'central-virginia': {
                'ric': 175,
                'dca': 700,
                'iad': 710,
                'bwi': 854,
                'cho': 525
            },
            'prince-george': {
                'ric': 175,
                'dca': 700,
                'iad': 710,
                'bwi': 854
            },
            'norfolk': {
                'ric': 175 // Hourly rate converted to flat
            },
            'charlottesville': {
                'central-virginia': 525
            }
        },
        
        'sprinter-limo': { // Mercedes Limo Sprinter
            'central-virginia': {
                'ric': 194,
                'dca': 780,
                'iad': 790,
                'bwi': 910,
                'cho': 575
            },
            'prince-george': {
                'ric': 194,
                'dca': 780,
                'iad': 790,
                'bwi': 910
            },
            'norfolk': {
                'ric': 194 // Hourly rate converted to flat
            },
            'charlottesville': {
                'central-virginia': 575
            }
        },
        
        'limo-bus': { // Limo Bus
            'central-virginia': {
                'ric': 225,
                'dca': 1020,
                'iad': 1045,
                'bwi': 1265,
                'cho': 624
            },
            'prince-george': {
                'ric': 225,
                'dca': 1020,
                'iad': 1045,
                'bwi': 1265
            },
            'norfolk': {
                'ric': 225 // Hourly rate converted to flat
            },
            'charlottesville': {
                'central-virginia': 624
            }
        }
    },
    
    // Vehicle name mapping
    vehicleNames: {
        'sedan': 'Lincoln Aviator',
        'transit': 'Ford Transit (15 passengers)',
        'sprinter-limo': 'Mercedes Sprinter Limousine',
        'limo-bus': 'Executive Limo Bus'
    },
    
    /**
     * Get airport rate for specific zone and vehicle
     */
    getRate: function(vehicleType, zone, airport) {
        try {
            return this.rates[vehicleType]?.[zone]?.[airport] || null;
        } catch (error) {
            console.error('Error getting rate:', error);
            return null;
        }
    },
    
    /**
     * Get all available airports for a zone and vehicle
     */
    getAvailableAirports: function(vehicleType, zone) {
        try {
            const zoneRates = this.rates[vehicleType]?.[zone];
            return zoneRates ? Object.keys(zoneRates) : [];
        } catch (error) {
            console.error('Error getting airports:', error);
            return [];
        }
    },
    
    /**
     * Get all available zones for a vehicle type
     */
    getAvailableZones: function(vehicleType) {
        try {
            const vehicleRates = this.rates[vehicleType];
            return vehicleRates ? Object.keys(vehicleRates) : [];
        } catch (error) {
            console.error('Error getting zones:', error);
            return [];
        }
    },
    
    /**
     * Validate if a route exists
     */
    validateRoute: function(vehicleType, zone, airport) {
        const rate = this.getRate(vehicleType, zone, airport);
        return rate !== null && rate > 0;
    },
    
    /**
     * Get route details including rate and estimated hours
     */
    getRouteDetails: function(vehicleType, zone, airport) {
        const rate = this.getRate(vehicleType, zone, airport);
        if (!rate) return null;
        
        // Estimated hours based on the data pattern
        const estimatedHours = this.getEstimatedHours(zone, airport);
        
        return {
            vehicleType: this.vehicleNames[vehicleType],
            zone: this.zones[zone],
            airport: this.airports[airport],
            rate: rate,
            rateType: 'Flat',
            estimatedHours: estimatedHours,
            route: `${this.zones[zone]} → ${this.airports[airport]}`
        };
    },
    
    /**
     * Get estimated hours based on route distance
     */
    getEstimatedHours: function(zone, airport) {
        // Estimated hours based on distance patterns from your data
        const estimates = {
            'central-virginia': {
                'ric': 1,
                'dca': 4,
                'iad': 4.5,
                'bwi': 7,
                'cho': 2.5
            },
            'prince-george': {
                'ric': 2,
                'dca': 5,
                'iad': 6.5,
                'bwi': 8
            },
            'norfolk': {
                'ric': 4,
                'cho': 6.5
            },
            'charlottesville': {
                'central-virginia': 2.5,
                'norfolk': 6.5
            }
        };
        
        return estimates[zone]?.[airport] || 4; // Default 4 hours
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AirportZonePricing;
}

// Make available globally
window.AirportZonePricing = AirportZonePricing;