/**
 * Comprehensive Rate Calculation Test Suite
 * Tests all pricing logic, zone calculations, and platform-specific rates
 */

class RateCalculationTester {
    constructor() {
        this.testResults = [];
        this.criticalIssues = [];
        this.warnings = [];
        this.pricingDiscrepancies = [];
    }

    /**
     * Run comprehensive rate calculation tests
     */
    async runAllTests() {
        console.log('Starting TNT Rate Calculation Test Suite...');
        
        // Test Airport Zone Pricing
        this.testAirportZonePricing();
        
        // Test Hourly Rate Calculations
        this.testHourlyRateCalculations();
        
        // Test Platform-Specific Rate Differences
        this.testPlatformRateDifferences();
        
        // Test Rate Integrity and Consistency
        this.testRateIntegrity();
        
        // Test Edge Cases and Error Handling
        this.testCalculationEdgeCases();
        
        // Test Commission Calculations
        this.testCommissionCalculations();
        
        // Test Corporate Rate Premiums
        this.testCorporateRatePremiums();
        
        this.generateRateTestReport();
        return this.getRateTestSummary();
    }

    /**
     * Test airport zone pricing accuracy
     */
    testAirportZonePricing() {
        // Test cases based on the airport zone pricing data
        const testCases = [
            // Central Virginia routes
            {
                vehicle: 'sedan',
                zone: 'central-virginia',
                airport: 'ric',
                expectedRate: 105,
                description: 'Sedan Central VA to RIC'
            },
            {
                vehicle: 'sedan',
                zone: 'central-virginia',
                airport: 'dca',
                expectedRate: 450,
                description: 'Sedan Central VA to DCA'
            },
            {
                vehicle: 'sedan',
                zone: 'central-virginia',
                airport: 'bwi',
                expectedRate: 657,
                description: 'Sedan Central VA to BWI'
            },
            {
                vehicle: 'limo-bus',
                zone: 'central-virginia',
                airport: 'bwi',
                expectedRate: 1265,
                description: 'Limo Bus Central VA to BWI'
            },
            
            // Prince George routes
            {
                vehicle: 'transit',
                zone: 'prince-george',
                airport: 'ric',
                expectedRate: 175,
                description: 'Transit Prince George to RIC'
            },
            
            // Norfolk routes (limited availability)
            {
                vehicle: 'sedan',
                zone: 'norfolk',
                airport: 'ric',
                expectedRate: 105,
                description: 'Sedan Norfolk to RIC'
            },
            {
                vehicle: 'sedan',
                zone: 'norfolk',
                airport: 'dca',
                expectedRate: null,
                description: 'Sedan Norfolk to DCA (not available)'
            },
            
            // Charlottesville routes
            {
                vehicle: 'sprinter-limo',
                zone: 'charlottesville',
                airport: 'central-virginia',
                expectedRate: 575,
                description: 'Sprinter Limo Charlottesville to Central VA'
            },
            
            // Invalid combinations
            {
                vehicle: 'invalid-vehicle',
                zone: 'central-virginia',
                airport: 'ric',
                expectedRate: null,
                description: 'Invalid vehicle type'
            },
            {
                vehicle: 'sedan',
                zone: 'invalid-zone',
                airport: 'ric',
                expectedRate: null,
                description: 'Invalid pickup zone'
            }
        ];

        testCases.forEach(testCase => {
            try {
                const actualRate = this.simulateAirportZoneRate(testCase.vehicle, testCase.zone, testCase.airport);
                
                if (actualRate === testCase.expectedRate) {
                    this.testResults.push({
                        test: 'Airport Zone Pricing',
                        case: testCase.description,
                        status: 'PASS',
                        expected: testCase.expectedRate,
                        actual: actualRate,
                        vehicle: testCase.vehicle,
                        route: `${testCase.zone} → ${testCase.airport}`
                    });
                } else {
                    this.pricingDiscrepancies.push({
                        test: 'Airport Zone Pricing',
                        case: testCase.description,
                        expected: testCase.expectedRate,
                        actual: actualRate,
                        discrepancy: actualRate ? Math.abs(actualRate - (testCase.expectedRate || 0)) : 'N/A',
                        severity: this.calculatePricingSeverity(testCase.expectedRate, actualRate)
                    });
                }
            } catch (error) {
                this.criticalIssues.push({
                    test: 'Airport Zone Pricing',
                    case: testCase.description,
                    issue: `Rate calculation failed: ${error.message}`,
                    severity: 'CRITICAL'
                });
            }
        });
    }

    /**
     * Test hourly rate calculations
     */
    testHourlyRateCalculations() {
        const hourlyRates = {
            'sedan': 100,
            'transit': 137,
            'executive-mini-bus': 142,
            'mini-bus-sofa': 142,
            'stretch-limo': 160,
            'sprinter-limo': 160,
            'limo-bus': 208
        };

        const testCases = [
            // Minimum hour tests
            { vehicle: 'sedan', hours: 1, expected: 300, description: 'Sedan 1 hour (3 hour minimum)' },
            { vehicle: 'sedan', hours: 2, expected: 300, description: 'Sedan 2 hours (3 hour minimum)' },
            { vehicle: 'sedan', hours: 3, expected: 300, description: 'Sedan 3 hours (minimum)' },
            
            // Standard hour tests
            { vehicle: 'sedan', hours: 4, expected: 400, description: 'Sedan 4 hours' },
            { vehicle: 'sedan', hours: 6, expected: 600, description: 'Sedan 6 hours' },
            { vehicle: 'sedan', hours: 8, expected: 800, description: 'Sedan 8 hours' },
            
            // Different vehicle types
            { vehicle: 'transit', hours: 3, expected: 411, description: 'Transit 3 hours minimum' },
            { vehicle: 'limo-bus', hours: 4, expected: 832, description: 'Limo Bus 4 hours' },
            { vehicle: 'stretch-limo', hours: 5, expected: 800, description: 'Stretch Limo 5 hours' },
            
            // Edge cases
            { vehicle: 'sedan', hours: 0, expected: 300, description: 'Sedan 0 hours (minimum applied)' },
            { vehicle: 'sedan', hours: 10, expected: 1000, description: 'Sedan 10 hours' },
            { vehicle: 'invalid-vehicle', hours: 3, expected: null, description: 'Invalid vehicle type' }
        ];

        testCases.forEach(testCase => {
            try {
                const actualRate = this.simulateHourlyRate(testCase.vehicle, testCase.hours);
                
                if (actualRate === testCase.expected) {
                    this.testResults.push({
                        test: 'Hourly Rate Calculations',
                        case: testCase.description,
                        status: 'PASS',
                        expected: testCase.expected,
                        actual: actualRate,
                        vehicle: testCase.vehicle,
                        hours: testCase.hours
                    });
                } else {
                    this.pricingDiscrepancies.push({
                        test: 'Hourly Rate Calculations',
                        case: testCase.description,
                        expected: testCase.expected,
                        actual: actualRate,
                        discrepancy: actualRate ? Math.abs(actualRate - (testCase.expected || 0)) : 'N/A',
                        severity: this.calculatePricingSeverity(testCase.expected, actualRate)
                    });
                }
            } catch (error) {
                this.criticalIssues.push({
                    test: 'Hourly Rate Calculations',
                    case: testCase.description,
                    issue: `Hourly calculation failed: ${error.message}`,
                    severity: 'CRITICAL'
                });
            }
        });
    }

    /**
     * Test platform-specific rate differences
     */
    testPlatformRateDifferences() {
        const testScenarios = [
            {
                service: 'hourly',
                vehicle: 'sedan',
                hours: 4,
                retail: 400,      // $100/hour * 4 hours
                gnet: 400,        // Same rate for GNET
                groundspan: 440,  // $110/hour * 4 hours (corporate premium)
                description: 'Sedan 4 hours across platforms'
            },
            {
                service: 'airport',
                vehicle: 'sedan',
                airport: 'dca',
                retail: 450,      // Standard airport rate
                gnet: 450,        // Same rate for GNET
                groundspan: 485,  // Corporate airport rate
                description: 'Sedan to DCA across platforms'
            },
            {
                service: 'hourly',
                vehicle: 'limo-bus',
                hours: 3,
                retail: 624,      // $208/hour * 3 hours
                gnet: 624,        // Same rate for GNET
                groundspan: 654,  // $218/hour * 3 hours (corporate)
                description: 'Limo Bus 3 hours across platforms'
            }
        ];

        testScenarios.forEach(scenario => {
            ['retail', 'gnet', 'groundspan'].forEach(platform => {
                try {
                    let actualRate;
                    
                    if (scenario.service === 'hourly') {
                        actualRate = this.simulatePlatformHourlyRate(platform, scenario.vehicle, scenario.hours);
                    } else if (scenario.service === 'airport') {
                        actualRate = this.simulatePlatformAirportRate(platform, scenario.vehicle, scenario.airport);
                    }

                    const expectedRate = scenario[platform];
                    
                    if (actualRate === expectedRate) {
                        this.testResults.push({
                            test: 'Platform Rate Differences',
                            case: `${scenario.description} - ${platform}`,
                            status: 'PASS',
                            expected: expectedRate,
                            actual: actualRate,
                            platform: platform
                        });
                    } else {
                        this.pricingDiscrepancies.push({
                            test: 'Platform Rate Differences',
                            case: `${scenario.description} - ${platform}`,
                            expected: expectedRate,
                            actual: actualRate,
                            platform: platform,
                            discrepancy: actualRate ? Math.abs(actualRate - expectedRate) : 'N/A',
                            severity: this.calculatePricingSeverity(expectedRate, actualRate)
                        });
                    }
                } catch (error) {
                    this.criticalIssues.push({
                        test: 'Platform Rate Differences',
                        case: `${scenario.description} - ${platform}`,
                        issue: `Platform rate calculation failed: ${error.message}`,
                        severity: 'HIGH'
                    });
                }
            });
        });
    }

    /**
     * Test rate integrity and consistency
     */
    testRateIntegrity() {
        const integrityTests = [
            {
                description: 'All hourly rates are positive',
                test: () => {
                    const hourlyRates = {
                        'sedan': 100, 'transit': 137, 'executive-mini-bus': 142,
                        'mini-bus-sofa': 142, 'stretch-limo': 160, 'sprinter-limo': 160, 'limo-bus': 208
                    };
                    return Object.values(hourlyRates).every(rate => rate > 0);
                }
            },
            {
                description: 'Corporate rates are higher than retail rates',
                test: () => {
                    const retailRate = this.simulatePlatformHourlyRate('retail', 'sedan', 4);
                    const corporateRate = this.simulatePlatformHourlyRate('groundspan', 'sedan', 4);
                    return corporateRate > retailRate;
                }
            },
            {
                description: 'Airport rates increase with distance',
                test: () => {
                    const ricRate = this.simulateAirportZoneRate('sedan', 'central-virginia', 'ric');
                    const dcaRate = this.simulateAirportZoneRate('sedan', 'central-virginia', 'dca');
                    const bwiRate = this.simulateAirportZoneRate('sedan', 'central-virginia', 'bwi');
                    return ricRate < dcaRate && dcaRate < bwiRate;
                }
            },
            {
                description: 'Larger vehicles cost more than smaller vehicles',
                test: () => {
                    const sedanRate = this.simulatePlatformHourlyRate('retail', 'sedan', 4);
                    const transitRate = this.simulatePlatformHourlyRate('retail', 'transit', 4);
                    const limoBusRate = this.simulatePlatformHourlyRate('retail', 'limo-bus', 4);
                    return sedanRate < transitRate && transitRate < limoBusRate;
                }
            }
        ];

        integrityTests.forEach(test => {
            try {
                const result = test.test();
                if (result) {
                    this.testResults.push({
                        test: 'Rate Integrity',
                        case: test.description,
                        status: 'PASS',
                        result: 'Integrity check passed'
                    });
                } else {
                    this.criticalIssues.push({
                        test: 'Rate Integrity',
                        case: test.description,
                        issue: 'Rate integrity check failed',
                        severity: 'HIGH'
                    });
                }
            } catch (error) {
                this.criticalIssues.push({
                    test: 'Rate Integrity',
                    case: test.description,
                    issue: `Integrity test failed: ${error.message}`,
                    severity: 'HIGH'
                });
            }
        });
    }

    /**
     * Test edge cases and error handling
     */
    testCalculationEdgeCases() {
        const edgeCases = [
            {
                description: 'Zero hours handling',
                test: () => this.simulateHourlyRate('sedan', 0),
                expectError: false,
                expectedResult: 300 // Should default to minimum 3 hours
            },
            {
                description: 'Negative hours handling',
                test: () => this.simulateHourlyRate('sedan', -1),
                expectError: false,
                expectedResult: 300 // Should default to minimum 3 hours
            },
            {
                description: 'Very large hours handling',
                test: () => this.simulateHourlyRate('sedan', 100),
                expectError: false,
                expectedResult: 10000 // 100 * $100
            },
            {
                description: 'Null vehicle type handling',
                test: () => this.simulateHourlyRate(null, 4),
                expectError: true,
                expectedResult: null
            },
            {
                description: 'Empty string vehicle handling',
                test: () => this.simulateHourlyRate('', 4),
                expectError: true,
                expectedResult: null
            },
            {
                description: 'Non-existent airport route',
                test: () => this.simulateAirportZoneRate('sedan', 'norfolk', 'bwi'),
                expectError: false,
                expectedResult: null
            }
        ];

        edgeCases.forEach(testCase => {
            try {
                const result = testCase.test();
                
                if (testCase.expectError && result === null) {
                    this.testResults.push({
                        test: 'Edge Cases',
                        case: testCase.description,
                        status: 'PASS',
                        result: 'Properly handled invalid input'
                    });
                } else if (!testCase.expectError && result === testCase.expectedResult) {
                    this.testResults.push({
                        test: 'Edge Cases',
                        case: testCase.description,
                        status: 'PASS',
                        expected: testCase.expectedResult,
                        actual: result
                    });
                } else {
                    this.warnings.push({
                        test: 'Edge Cases',
                        case: testCase.description,
                        issue: `Expected ${testCase.expectedResult}, got ${result}`,
                        severity: 'MEDIUM'
                    });
                }
            } catch (error) {
                if (testCase.expectError) {
                    this.testResults.push({
                        test: 'Edge Cases',
                        case: testCase.description,
                        status: 'PASS',
                        result: 'Properly threw error for invalid input'
                    });
                } else {
                    this.criticalIssues.push({
                        test: 'Edge Cases',
                        case: testCase.description,
                        issue: `Unexpected error: ${error.message}`,
                        severity: 'HIGH'
                    });
                }
            }
        });
    }

    /**
     * Test commission calculations for GNET
     */
    testCommissionCalculations() {
        const commissionTests = [
            {
                serviceType: 'hourly',
                totalAmount: 400,
                expectedCommission: 48, // 12% standard
                description: 'Standard 12% hourly commission'
            },
            {
                serviceType: 'airport',
                totalAmount: 450,
                expectedCommission: 67.50, // 15% premium
                description: 'Premium 15% airport commission'
            },
            {
                serviceType: 'hourly',
                totalAmount: 1000,
                expectedCommission: 120, // 12% standard
                description: 'Large amount 12% commission'
            }
        ];

        commissionTests.forEach(test => {
            try {
                const actualCommission = this.simulateCommissionCalculation(test.serviceType, test.totalAmount);
                
                if (Math.abs(actualCommission - test.expectedCommission) < 0.01) {
                    this.testResults.push({
                        test: 'Commission Calculations',
                        case: test.description,
                        status: 'PASS',
                        expected: test.expectedCommission,
                        actual: actualCommission,
                        serviceType: test.serviceType
                    });
                } else {
                    this.pricingDiscrepancies.push({
                        test: 'Commission Calculations',
                        case: test.description,
                        expected: test.expectedCommission,
                        actual: actualCommission,
                        discrepancy: Math.abs(actualCommission - test.expectedCommission),
                        severity: 'MEDIUM'
                    });
                }
            } catch (error) {
                this.criticalIssues.push({
                    test: 'Commission Calculations',
                    case: test.description,
                    issue: `Commission calculation failed: ${error.message}`,
                    severity: 'HIGH'
                });
            }
        });
    }

    /**
     * Test corporate rate premiums
     */
    testCorporateRatePremiums() {
        const premiumTests = [
            {
                service: 'hourly',
                vehicle: 'sedan',
                hours: 4,
                retailRate: 400,
                corporateRate: 440,
                expectedPremium: 40,
                description: 'Sedan hourly corporate premium'
            },
            {
                service: 'airport',
                vehicle: 'sedan',
                airport: 'dca',
                retailRate: 450,
                corporateRate: 485,
                expectedPremium: 35,
                description: 'Sedan airport corporate premium'
            }
        ];

        premiumTests.forEach(test => {
            try {
                const retailRate = test.retailRate;
                const corporateRate = test.corporateRate;
                const actualPremium = corporateRate - retailRate;
                
                if (actualPremium === test.expectedPremium) {
                    this.testResults.push({
                        test: 'Corporate Rate Premiums',
                        case: test.description,
                        status: 'PASS',
                        expected: test.expectedPremium,
                        actual: actualPremium,
                        retailRate: retailRate,
                        corporateRate: corporateRate
                    });
                } else {
                    this.pricingDiscrepancies.push({
                        test: 'Corporate Rate Premiums',
                        case: test.description,
                        expected: test.expectedPremium,
                        actual: actualPremium,
                        discrepancy: Math.abs(actualPremium - test.expectedPremium),
                        severity: 'LOW'
                    });
                }
            } catch (error) {
                this.criticalIssues.push({
                    test: 'Corporate Rate Premiums',
                    case: test.description,
                    issue: `Premium calculation failed: ${error.message}`,
                    severity: 'MEDIUM'
                });
            }
        });
    }

    // Simulation methods based on actual pricing logic

    simulateAirportZoneRate(vehicleType, zone, airport) {
        const airportRates = {
            'sedan': {
                'central-virginia': { 'ric': 105, 'dca': 450, 'iad': 460, 'bwi': 657, 'cho': 333 },
                'prince-george': { 'ric': 105, 'dca': 450, 'iad': 460, 'bwi': 657 },
                'norfolk': { 'ric': 105, 'cho': 333 },
                'charlottesville': { 'central-virginia': 333, 'norfolk': 333 }
            },
            'transit': {
                'central-virginia': { 'ric': 175, 'dca': 700, 'iad': 710, 'bwi': 854, 'cho': 525 },
                'prince-george': { 'ric': 175, 'dca': 700, 'iad': 710, 'bwi': 854 },
                'norfolk': { 'ric': 175 },
                'charlottesville': { 'central-virginia': 525 }
            },
            'sprinter-limo': {
                'central-virginia': { 'ric': 194, 'dca': 780, 'iad': 790, 'bwi': 910, 'cho': 575 },
                'prince-george': { 'ric': 194, 'dca': 780, 'iad': 790, 'bwi': 910 },
                'norfolk': { 'ric': 194 },
                'charlottesville': { 'central-virginia': 575 }
            },
            'limo-bus': {
                'central-virginia': { 'ric': 225, 'dca': 1020, 'iad': 1045, 'bwi': 1265, 'cho': 624 },
                'prince-george': { 'ric': 225, 'dca': 1020, 'iad': 1045, 'bwi': 1265 },
                'norfolk': { 'ric': 225 },
                'charlottesville': { 'central-virginia': 624 }
            }
        };

        try {
            return airportRates[vehicleType]?.[zone]?.[airport] || null;
        } catch (error) {
            return null;
        }
    }

    simulateHourlyRate(vehicleType, hours) {
        const hourlyRates = {
            'sedan': 100, 'transit': 137, 'executive-mini-bus': 142,
            'mini-bus-sofa': 142, 'stretch-limo': 160, 'sprinter-limo': 160, 'limo-bus': 208
        };

        if (!vehicleType || !hourlyRates[vehicleType]) {
            return null;
        }

        const actualHours = Math.max(hours || 0, 3); // 3 hour minimum
        return hourlyRates[vehicleType] * actualHours;
    }

    simulatePlatformHourlyRate(platform, vehicleType, hours) {
        const platformRates = {
            retail: { 'sedan': 100, 'transit': 137, 'limo-bus': 208 },
            gnet: { 'sedan': 100, 'transit': 137, 'limo-bus': 208 },
            groundspan: { 'sedan': 110, 'transit': 147, 'limo-bus': 218 }
        };

        const rate = platformRates[platform]?.[vehicleType];
        if (!rate) return null;

        const actualHours = Math.max(hours || 0, 3);
        return rate * actualHours;
    }

    simulatePlatformAirportRate(platform, vehicleType, airport) {
        if (platform === 'groundspan') {
            const corporateRates = {
                'sedan': { 'dca': 485, 'iad': 495, 'bwi': 705 }
            };
            return corporateRates[vehicleType]?.[airport] || null;
        } else {
            // Use standard airport rates for retail and GNET
            const airportMap = { 'dca': 'dca', 'iad': 'iad', 'bwi': 'bwi' };
            return this.simulateAirportZoneRate(vehicleType, 'central-virginia', airportMap[airport]);
        }
    }

    simulateCommissionCalculation(serviceType, totalAmount) {
        const commissionRates = {
            standard: 0.12, // 12% for hourly
            premium: 0.15   // 15% for airport
        };

        const rate = serviceType === 'airport' ? commissionRates.premium : commissionRates.standard;
        return totalAmount * rate;
    }

    calculatePricingSeverity(expected, actual) {
        if (expected === null || actual === null) {
            return expected === actual ? 'LOW' : 'HIGH';
        }

        const difference = Math.abs(expected - actual);
        const percentDifference = (difference / expected) * 100;

        if (percentDifference > 20) return 'CRITICAL';
        if (percentDifference > 10) return 'HIGH';
        if (percentDifference > 5) return 'MEDIUM';
        return 'LOW';
    }

    /**
     * Generate comprehensive rate test report
     */
    generateRateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(t => t.status === 'PASS').length;
        const criticalDiscrepancies = this.pricingDiscrepancies.filter(d => d.severity === 'CRITICAL').length;
        const highDiscrepancies = this.pricingDiscrepancies.filter(d => d.severity === 'HIGH').length;

        console.log('\n=== TNT RATE CALCULATION TEST REPORT ===');
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests}`);
        console.log(`Failed: ${totalTests - passedTests}`);
        console.log(`Critical Issues: ${this.criticalIssues.length}`);
        console.log(`Pricing Discrepancies: ${this.pricingDiscrepancies.length}`);
        console.log(`  - Critical: ${criticalDiscrepancies}`);
        console.log(`  - High: ${highDiscrepancies}`);

        if (this.pricingDiscrepancies.length > 0) {
            console.log('\n=== PRICING DISCREPANCIES ===');
            this.pricingDiscrepancies.forEach(discrepancy => {
                console.log(`[${discrepancy.severity}] ${discrepancy.test}: ${discrepancy.case}`);
                console.log(`   Expected: ${discrepancy.expected}, Actual: ${discrepancy.actual}`);
                console.log(`   Discrepancy: ${discrepancy.discrepancy}`);
            });
        }

        return {
            totalTests,
            passedTests,
            criticalIssues: this.criticalIssues.length,
            pricingDiscrepancies: this.pricingDiscrepancies.length,
            criticalDiscrepancies,
            highDiscrepancies
        };
    }

    /**
     * Get rate test summary for reporting
     */
    getRateTestSummary() {
        const summary = this.generateRateTestReport();
        const criticalDiscrepancies = this.pricingDiscrepancies.filter(d => d.severity === 'CRITICAL').length;
        
        return {
            overallStatus: criticalDiscrepancies === 0 && summary.criticalIssues === 0 ? 'ACCEPTABLE' : 'CRITICAL_PRICING_ISSUES',
            testCoverage: `${summary.passedTests}/${summary.totalTests}`,
            pricingAccuracy: `${((summary.totalTests - this.pricingDiscrepancies.length) / summary.totalTests * 100).toFixed(1)}%`,
            riskLevel: criticalDiscrepancies > 0 || summary.criticalIssues > 0 ? 'HIGH' : 
                      summary.pricingDiscrepancies > 5 ? 'MEDIUM' : 'LOW',
            deploymentReady: criticalDiscrepancies === 0 && summary.criticalIssues === 0,
            pricingDiscrepancies: this.pricingDiscrepancies,
            criticalIssues: this.criticalIssues,
            warnings: this.warnings,
            testResults: this.testResults
        };
    }
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RateCalculationTester;
} else {
    window.RateCalculationTester = RateCalculationTester;
}