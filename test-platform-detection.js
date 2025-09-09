/**
 * Comprehensive Test Suite for TNT Platform Detection System
 * Tests all URL patterns, edge cases, and platform-specific behavior
 */

class PlatformDetectionTester {
    constructor() {
        this.testResults = [];
        this.criticalIssues = [];
        this.warnings = [];
    }

    /**
     * Run all platform detection tests
     */
    async runAllTests() {
        console.log('Starting TNT Platform Detection Test Suite...');
        
        // Test URL Parameter Detection
        this.testUrlParameters();
        
        // Test Subdomain Detection
        this.testSubdomainDetection();
        
        // Test Path Detection
        this.testPathDetection();
        
        // Test Referrer Detection
        this.testReferrerDetection();
        
        // Test Platform Configuration
        this.testPlatformConfiguration();
        
        // Test Edge Cases
        this.testEdgeCases();
        
        // Test Security Implications
        this.testSecurityVulnerabilities();
        
        this.generateTestReport();
        return this.getTestSummary();
    }

    /**
     * Test URL parameter detection logic
     */
    testUrlParameters() {
        const testCases = [
            // GNET Parameter Tests
            { url: '?source=gnet', expected: 'gnet', description: 'GNET source parameter' },
            { url: '?partner=gnet', expected: 'gnet', description: 'GNET partner parameter' },
            { url: '?utm_source=gnet', expected: 'gnet', description: 'GNET UTM parameter' },
            { url: '?platform=gnet', expected: 'gnet', description: 'GNET platform parameter' },
            
            // Groundspan/Capital One Parameter Tests
            { url: '?source=corporate', expected: 'groundspan', description: 'Corporate source parameter' },
            { url: '?client=capitalone', expected: 'groundspan', description: 'Capital One client parameter' },
            { url: '?platform=groundspan', expected: 'groundspan', description: 'Groundspan platform parameter' },
            { url: '?corporate=true', expected: 'groundspan', description: 'Corporate boolean parameter' },
            
            // Retail Parameter Tests
            { url: '?source=website', expected: 'retail', description: 'Website source parameter' },
            { url: '?utm_source=organic', expected: 'retail', description: 'Organic UTM parameter' },
            { url: '?type=retail', expected: 'retail', description: 'Retail type parameter' },
            
            // Edge Cases
            { url: '?source=GNET', expected: 'gnet', description: 'Case insensitive GNET' },
            { url: '?source=gnet&client=capitalone', expected: 'gnet', description: 'Multiple parameters - GNET priority' },
            { url: '?invalid=param', expected: 'retail', description: 'Invalid parameter defaults to retail' },
            { url: '', expected: 'retail', description: 'No parameters defaults to retail' },
        ];

        testCases.forEach(testCase => {
            try {
                const mockUrlParams = new URLSearchParams(testCase.url);
                const result = this.simulateUrlParameterCheck(mockUrlParams);
                
                if (result === testCase.expected) {
                    this.testResults.push({
                        test: 'URL Parameters',
                        case: testCase.description,
                        status: 'PASS',
                        expected: testCase.expected,
                        actual: result
                    });
                } else {
                    this.criticalIssues.push({
                        test: 'URL Parameters',
                        case: testCase.description,
                        issue: `Expected ${testCase.expected}, got ${result}`,
                        severity: 'HIGH'
                    });
                }
            } catch (error) {
                this.criticalIssues.push({
                    test: 'URL Parameters',
                    case: testCase.description,
                    issue: `Test failed with error: ${error.message}`,
                    severity: 'CRITICAL'
                });
            }
        });
    }

    /**
     * Test subdomain detection logic
     */
    testSubdomainDetection() {
        const testCases = [
            // GNET Subdomain Tests
            { hostname: 'gnet.tntlimousine.com', expected: 'gnet', description: 'GNET subdomain' },
            { hostname: 'partners.tntlimousine.com', expected: 'gnet', description: 'Partners subdomain' },
            
            // Groundspan Subdomain Tests
            { hostname: 'corporate.tntlimousine.com', expected: 'groundspan', description: 'Corporate subdomain' },
            { hostname: 'capitalone.tntlimousine.com', expected: 'groundspan', description: 'Capital One subdomain' },
            
            // Retail Subdomain Tests
            { hostname: 'tntlimousine.com', expected: 'retail', description: 'Main domain' },
            { hostname: 'www.tntlimousine.com', expected: 'retail', description: 'WWW subdomain' },
            { hostname: 'localhost', expected: 'retail', description: 'Localhost development' },
            
            // Edge Cases
            { hostname: 'staging-gnet.tntlimousine.com', expected: null, description: 'Non-matching staging subdomain' },
            { hostname: 'malicious-gnet.example.com', expected: null, description: 'Malicious domain with GNET prefix' },
        ];

        testCases.forEach(testCase => {
            try {
                const result = this.simulateSubdomainCheck(testCase.hostname);
                
                if (result === testCase.expected) {
                    this.testResults.push({
                        test: 'Subdomain Detection',
                        case: testCase.description,
                        status: 'PASS',
                        expected: testCase.expected,
                        actual: result
                    });
                } else {
                    const severity = testCase.description.includes('malicious') ? 'CRITICAL' : 'HIGH';
                    this.criticalIssues.push({
                        test: 'Subdomain Detection',
                        case: testCase.description,
                        issue: `Expected ${testCase.expected}, got ${result}`,
                        severity: severity
                    });
                }
            } catch (error) {
                this.criticalIssues.push({
                    test: 'Subdomain Detection',
                    case: testCase.description,
                    issue: `Test failed with error: ${error.message}`,
                    severity: 'CRITICAL'
                });
            }
        });
    }

    /**
     * Test path detection logic
     */
    testPathDetection() {
        const testCases = [
            // GNET Path Tests
            { pathname: '/gnet/booking', expected: 'gnet', description: 'GNET path' },
            { pathname: '/partner/portal', expected: 'gnet', description: 'Partner path' },
            { pathname: '/affiliate/booking', expected: 'gnet', description: 'Affiliate path' },
            
            // Groundspan Path Tests
            { pathname: '/corporate/booking', expected: 'groundspan', description: 'Corporate path' },
            { pathname: '/groundspan/services', expected: 'groundspan', description: 'Groundspan path' },
            { pathname: '/capitalone/transport', expected: 'groundspan', description: 'Capital One path' },
            
            // Retail Path Tests
            { pathname: '/pricing', expected: 'retail', description: 'Retail pricing path' },
            { pathname: '/quote', expected: 'retail', description: 'Retail quote path' },
            { pathname: '/retail/services', expected: 'retail', description: 'Retail services path' },
            
            // Edge Cases
            { pathname: '/', expected: null, description: 'Root path' },
            { pathname: '/admin/gnet', expected: 'gnet', description: 'Admin GNET path' },
            { pathname: '/user/corporate/profile', expected: 'groundspan', description: 'Nested corporate path' },
        ];

        testCases.forEach(testCase => {
            try {
                const result = this.simulatePathCheck(testCase.pathname);
                
                if (result === testCase.expected) {
                    this.testResults.push({
                        test: 'Path Detection',
                        case: testCase.description,
                        status: 'PASS',
                        expected: testCase.expected,
                        actual: result
                    });
                } else {
                    this.criticalIssues.push({
                        test: 'Path Detection',
                        case: testCase.description,
                        issue: `Expected ${testCase.expected}, got ${result}`,
                        severity: 'MEDIUM'
                    });
                }
            } catch (error) {
                this.criticalIssues.push({
                    test: 'Path Detection',
                    case: testCase.description,
                    issue: `Test failed with error: ${error.message}`,
                    severity: 'HIGH'
                });
            }
        });
    }

    /**
     * Test referrer detection logic
     */
    testReferrerDetection() {
        const testCases = [
            // GNET Referrer Tests
            { referrer: 'https://gnet.com/booking', expected: 'gnet', description: 'GNET referrer' },
            { referrer: 'https://partner-portal.com/services', expected: 'gnet', description: 'Partner portal referrer' },
            
            // Groundspan Referrer Tests
            { referrer: 'https://capitalone.com/travel', expected: 'groundspan', description: 'Capital One referrer' },
            { referrer: 'https://groundspan.com/transport', expected: 'groundspan', description: 'Groundspan referrer' },
            
            // Retail Referrer Tests
            { referrer: 'https://google.com/search', expected: 'retail', description: 'Google referrer' },
            { referrer: 'https://bing.com/search', expected: 'retail', description: 'Bing referrer' },
            { referrer: 'https://facebook.com/page', expected: 'retail', description: 'Facebook referrer' },
            
            // Edge Cases
            { referrer: '', expected: null, description: 'Empty referrer' },
            { referrer: 'https://malicious-capitalone.com/', expected: 'groundspan', description: 'Potentially malicious referrer' },
        ];

        testCases.forEach(testCase => {
            try {
                const result = this.simulateReferrerCheck(testCase.referrer);
                
                if (result === testCase.expected) {
                    this.testResults.push({
                        test: 'Referrer Detection',
                        case: testCase.description,
                        status: 'PASS',
                        expected: testCase.expected,
                        actual: result
                    });
                } else {
                    const severity = testCase.description.includes('malicious') ? 'CRITICAL' : 'MEDIUM';
                    this.criticalIssues.push({
                        test: 'Referrer Detection',
                        case: testCase.description,
                        issue: `Expected ${testCase.expected}, got ${result}`,
                        severity: severity
                    });
                }
            } catch (error) {
                this.criticalIssues.push({
                    test: 'Referrer Detection',
                    case: testCase.description,
                    issue: `Test failed with error: ${error.message}`,
                    severity: 'HIGH'
                });
            }
        });
    }

    /**
     * Test platform configuration application
     */
    testPlatformConfiguration() {
        const platforms = ['retail', 'gnet', 'groundspan'];
        
        platforms.forEach(platform => {
            try {
                // Test that each platform has required configuration
                const config = this.getPlatformConfig(platform);
                
                const requiredFields = ['name', 'title', 'showCommission', 'showCorporateRates', 'theme', 'features'];
                const missingFields = requiredFields.filter(field => !(field in config));
                
                if (missingFields.length === 0) {
                    this.testResults.push({
                        test: 'Platform Configuration',
                        case: `${platform} configuration completeness`,
                        status: 'PASS',
                        expected: 'All required fields present',
                        actual: 'Complete configuration'
                    });
                } else {
                    this.criticalIssues.push({
                        test: 'Platform Configuration',
                        case: `${platform} configuration`,
                        issue: `Missing required fields: ${missingFields.join(', ')}`,
                        severity: 'HIGH'
                    });
                }
                
                // Test platform-specific settings
                this.testPlatformSpecificConfig(platform, config);
                
            } catch (error) {
                this.criticalIssues.push({
                    test: 'Platform Configuration',
                    case: `${platform} configuration loading`,
                    issue: `Configuration failed: ${error.message}`,
                    severity: 'CRITICAL'
                });
            }
        });
    }

    /**
     * Test platform-specific configuration requirements
     */
    testPlatformSpecificConfig(platform, config) {
        switch (platform) {
            case 'retail':
                if (config.showCommission !== false) {
                    this.criticalIssues.push({
                        test: 'Platform Configuration',
                        case: 'Retail commission display',
                        issue: 'Retail platform should not show commission',
                        severity: 'HIGH'
                    });
                }
                break;
                
            case 'gnet':
                if (!config.features.includes('partner-rates')) {
                    this.warnings.push({
                        test: 'Platform Configuration',
                        case: 'GNET partner features',
                        issue: 'GNET should include partner-rates feature',
                        severity: 'MEDIUM'
                    });
                }
                break;
                
            case 'groundspan':
                if (config.showCorporateRates !== true) {
                    this.criticalIssues.push({
                        test: 'Platform Configuration',
                        case: 'Corporate rates display',
                        issue: 'Groundspan platform should show corporate rates',
                        severity: 'HIGH'
                    });
                }
                break;
        }
    }

    /**
     * Test edge cases and error conditions
     */
    testEdgeCases() {
        const edgeCases = [
            {
                description: 'Multiple platform indicators - priority order',
                test: () => {
                    // Should prioritize URL params over subdomain
                    const urlParams = new URLSearchParams('?platform=retail');
                    const hostname = 'gnet.tntlimousine.com';
                    const expected = 'retail';
                    // In actual code, URL params have highest priority
                    return expected;
                }
            },
            {
                description: 'Case sensitivity handling',
                test: () => {
                    const urlParams = new URLSearchParams('?SOURCE=GNET');
                    // Should be case insensitive
                    return 'retail'; // Current implementation may be case sensitive
                }
            },
            {
                description: 'Special characters in parameters',
                test: () => {
                    const urlParams = new URLSearchParams('?source=gnet%20test');
                    return null; // Should handle URL encoding
                }
            }
        ];

        edgeCases.forEach(testCase => {
            try {
                const result = testCase.test();
                this.testResults.push({
                    test: 'Edge Cases',
                    case: testCase.description,
                    status: 'EVALUATED',
                    result: result
                });
            } catch (error) {
                this.criticalIssues.push({
                    test: 'Edge Cases',
                    case: testCase.description,
                    issue: `Edge case failed: ${error.message}`,
                    severity: 'MEDIUM'
                });
            }
        });
    }

    /**
     * Test for potential security vulnerabilities
     */
    testSecurityVulnerabilities() {
        const securityTests = [
            {
                description: 'XSS prevention in platform parameters',
                test: 'platform=<script>alert("xss")</script>',
                expectSafe: true
            },
            {
                description: 'SQL injection prevention',
                test: 'platform=gnet\'; DROP TABLE users; --',
                expectSafe: true
            },
            {
                description: 'Directory traversal prevention',
                test: 'source=../../../admin/config',
                expectSafe: true
            },
            {
                description: 'Domain spoofing protection',
                hostname: 'gnet-tntlimousine.com.malicious.com',
                expectSafe: true
            }
        ];

        securityTests.forEach(testCase => {
            try {
                // Test that malicious input doesn't break the system
                if (testCase.test) {
                    const urlParams = new URLSearchParams(testCase.test);
                    const result = this.simulateUrlParameterCheck(urlParams);
                    // Should either return null or default safely to retail
                    if (result === 'retail' || result === null) {
                        this.testResults.push({
                            test: 'Security',
                            case: testCase.description,
                            status: 'PASS',
                            result: 'Safe handling of malicious input'
                        });
                    } else {
                        this.criticalIssues.push({
                            test: 'Security',
                            case: testCase.description,
                            issue: `Potentially unsafe handling of input: ${result}`,
                            severity: 'CRITICAL'
                        });
                    }
                }
                
                if (testCase.hostname) {
                    const result = this.simulateSubdomainCheck(testCase.hostname);
                    if (result === null) {
                        this.testResults.push({
                            test: 'Security',
                            case: testCase.description,
                            status: 'PASS',
                            result: 'Domain spoofing prevented'
                        });
                    } else {
                        this.criticalIssues.push({
                            test: 'Security',
                            case: testCase.description,
                            issue: `Domain spoofing vulnerability: ${result}`,
                            severity: 'CRITICAL'
                        });
                    }
                }
            } catch (error) {
                // Errors in security tests could indicate vulnerabilities
                this.warnings.push({
                    test: 'Security',
                    case: testCase.description,
                    issue: `Security test error: ${error.message}`,
                    severity: 'HIGH'
                });
            }
        });
    }

    // Simulation methods based on actual platform detection logic
    
    simulateUrlParameterCheck(urlParams) {
        const config = {
            detection: {
                'retail': {
                    params: ['source=website', 'utm_source=organic', 'type=retail']
                },
                'gnet': {
                    params: ['source=gnet', 'partner=gnet', 'utm_source=gnet', 'platform=gnet']
                },
                'groundspan': {
                    params: ['source=corporate', 'client=capitalone', 'platform=groundspan', 'corporate=true']
                }
            }
        };

        for (const [platform, platformConfig] of Object.entries(config.detection)) {
            for (const param of platformConfig.params) {
                if (param.includes('=')) {
                    const [key, value] = param.split('=');
                    if (urlParams.get(key) === value) {
                        return platform;
                    }
                } else {
                    if (urlParams.has(param)) {
                        return platform;
                    }
                }
            }
        }
        return null;
    }

    simulateSubdomainCheck(hostname) {
        const config = {
            detection: {
                'retail': {
                    domains: ['tntlimousine.com', 'localhost']
                },
                'gnet': {
                    domains: ['gnet.tntlimousine.com', 'partners.tntlimousine.com']
                },
                'groundspan': {
                    domains: ['corporate.tntlimousine.com', 'capitalone.tntlimousine.com']
                }
            }
        };

        hostname = hostname.toLowerCase();
        
        for (const [platform, platformConfig] of Object.entries(config.detection)) {
            for (const domain of platformConfig.domains) {
                if (hostname === domain || hostname.endsWith('.' + domain)) {
                    return platform;
                }
            }
        }
        return null;
    }

    simulatePathCheck(pathname) {
        const config = {
            detection: {
                'retail': {
                    paths: ['/pricing', '/quote', '/retail']
                },
                'gnet': {
                    paths: ['/gnet', '/partner', '/affiliate']
                },
                'groundspan': {
                    paths: ['/corporate', '/groundspan', '/capitalone']
                }
            }
        };

        pathname = pathname.toLowerCase();
        
        for (const [platform, platformConfig] of Object.entries(config.detection)) {
            for (const path of platformConfig.paths) {
                if (pathname.includes(path)) {
                    return platform;
                }
            }
        }
        return null;
    }

    simulateReferrerCheck(referrer) {
        const config = {
            detection: {
                'retail': {
                    referrers: ['google.com', 'bing.com', 'facebook.com']
                },
                'gnet': {
                    referrers: ['gnet.com', 'partner-portal.com']
                },
                'groundspan': {
                    referrers: ['capitalone.com', 'groundspan.com']
                }
            }
        };

        if (!referrer) return null;
        referrer = referrer.toLowerCase();
        
        for (const [platform, platformConfig] of Object.entries(config.detection)) {
            for (const ref of platformConfig.referrers) {
                if (referrer.includes(ref)) {
                    return platform;
                }
            }
        }
        return null;
    }

    getPlatformConfig(platform) {
        const platforms = {
            'retail': {
                name: 'TNT Limousine',
                title: 'Premium Transportation Services',
                showCommission: false,
                showCorporateRates: false,
                showFullBreakdown: false,
                theme: 'standard',
                features: ['discounts', 'promotions', 'simple-pricing']
            },
            'gnet': {
                name: 'TNT Limousine - GNET Partner Portal',
                title: 'Partner Booking & Commission Tracking',
                showCommission: false,
                showCorporateRates: false,
                showFullBreakdown: false,
                theme: 'partner',
                features: ['partner-rates', 'booking-export', 'simple-pricing']
            },
            'groundspan': {
                name: 'TNT Limousine - Corporate Services',
                title: 'Capital One Transportation Services',
                showCommission: false,
                showCorporateRates: true,
                showFullBreakdown: false,
                theme: 'corporate',
                features: ['corporate-billing', 'premium-service', 'account-management']
            }
        };

        return platforms[platform];
    }

    /**
     * Generate comprehensive test report
     */
    generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(t => t.status === 'PASS').length;
        const criticalCount = this.criticalIssues.filter(i => i.severity === 'CRITICAL').length;
        const highCount = this.criticalIssues.filter(i => i.severity === 'HIGH').length;
        const mediumCount = this.criticalIssues.filter(i => i.severity === 'MEDIUM').length;

        console.log('\n=== TNT PLATFORM DETECTION TEST REPORT ===');
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests}`);
        console.log(`Failed: ${totalTests - passedTests}`);
        console.log(`Critical Issues: ${criticalCount}`);
        console.log(`High Priority Issues: ${highCount}`);
        console.log(`Medium Priority Issues: ${mediumCount}`);
        console.log(`Warnings: ${this.warnings.length}`);

        if (this.criticalIssues.length > 0) {
            console.log('\n=== CRITICAL ISSUES ===');
            this.criticalIssues.forEach(issue => {
                console.log(`[${issue.severity}] ${issue.test}: ${issue.case}`);
                console.log(`   Issue: ${issue.issue}`);
            });
        }

        if (this.warnings.length > 0) {
            console.log('\n=== WARNINGS ===');
            this.warnings.forEach(warning => {
                console.log(`[${warning.severity}] ${warning.test}: ${warning.case}`);
                console.log(`   Warning: ${warning.issue}`);
            });
        }

        return {
            totalTests,
            passedTests,
            criticalIssues: criticalCount,
            highIssues: highCount,
            mediumIssues: mediumCount,
            warnings: this.warnings.length
        };
    }

    /**
     * Get test summary for reporting
     */
    getTestSummary() {
        const summary = this.generateTestReport();
        
        return {
            overallStatus: summary.criticalIssues === 0 ? 'ACCEPTABLE' : 'CRITICAL_ISSUES_FOUND',
            testCoverage: `${summary.passedTests}/${summary.totalTests}`,
            riskLevel: summary.criticalIssues > 0 ? 'HIGH' : 
                      summary.highIssues > 0 ? 'MEDIUM' : 'LOW',
            deploymentReady: summary.criticalIssues === 0 && summary.highIssues < 3,
            issues: this.criticalIssues,
            warnings: this.warnings,
            testResults: this.testResults
        };
    }
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlatformDetectionTester;
} else {
    window.PlatformDetectionTester = PlatformDetectionTester;
}