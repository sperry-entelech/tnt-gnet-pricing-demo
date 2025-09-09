/**
 * TNT Platform Detection System
 * Automatically detects user source and displays appropriate pricing interface
 */

class PlatformDetectionSystem {
    constructor() {
        this.platform = null;
        this.config = {
            // Detection rules for different platforms
            detection: {
                'retail': {
                    domains: ['tntlimousine.com', 'localhost'],
                    paths: ['/pricing', '/quote', '/retail'],
                    referrers: ['google.com', 'bing.com', 'facebook.com'],
                    params: ['source=website', 'utm_source=organic', 'type=retail']
                },
                'gnet': {
                    domains: ['gnet.tntlimousine.com', 'partners.tntlimousine.com'],
                    paths: ['/gnet', '/partner', '/affiliate'],
                    referrers: ['gnet.com', 'partner-portal.com'],
                    params: ['source=gnet', 'partner=gnet', 'utm_source=gnet', 'platform=gnet']
                },
                'groundspan': {
                    domains: ['corporate.tntlimousine.com', 'capitalone.tntlimousine.com'],
                    paths: ['/corporate', '/groundspan', '/capitalone'],
                    referrers: ['capitalone.com', 'groundspan.com'],
                    params: ['source=corporate', 'client=capitalone', 'platform=groundspan', 'corporate=true']
                }
            },
            
            // Platform-specific configurations
            platforms: {
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
            }
        };
        
        this.detectPlatform();
        this.applyPlatformConfiguration();
    }

    /**
     * Detect platform based on various signals
     */
    detectPlatform() {
        // Check URL parameters first (highest priority)
        const urlParams = new URLSearchParams(window.location.search);
        const urlPlatform = this.checkUrlParameters(urlParams);
        if (urlPlatform) {
            this.platform = urlPlatform;
            this.storePlatform(urlPlatform);
            return;
        }

        // Check subdomain
        const subdomainPlatform = this.checkSubdomain();
        if (subdomainPlatform) {
            this.platform = subdomainPlatform;
            this.storePlatform(subdomainPlatform);
            return;
        }

        // Check path
        const pathPlatform = this.checkPath();
        if (pathPlatform) {
            this.platform = pathPlatform;
            this.storePlatform(pathPlatform);
            return;
        }

        // Check referrer
        const referrerPlatform = this.checkReferrer();
        if (referrerPlatform) {
            this.platform = referrerPlatform;
            this.storePlatform(referrerPlatform);
            return;
        }

        // Check stored platform from previous visit
        const storedPlatform = this.getStoredPlatform();
        if (storedPlatform && this.config.platforms[storedPlatform]) {
            this.platform = storedPlatform;
            return;
        }

        // Default to retail
        this.platform = 'retail';
        this.storePlatform('retail');
    }

    /**
     * Check URL parameters for platform indicators
     */
    checkUrlParameters(urlParams) {
        for (const [platform, config] of Object.entries(this.config.detection)) {
            for (const param of config.params) {
                if (param.includes('=')) {
                    const [key, value] = param.split('=');
                    if (urlParams.get(key) === value) {
                        console.log(`Platform detected via URL parameter: ${param} -> ${platform}`);
                        return platform;
                    }
                } else {
                    if (urlParams.has(param)) {
                        console.log(`Platform detected via URL parameter: ${param} -> ${platform}`);
                        return platform;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Check subdomain for platform identification
     */
    checkSubdomain() {
        const hostname = window.location.hostname.toLowerCase();
        
        for (const [platform, config] of Object.entries(this.config.detection)) {
            for (const domain of config.domains) {
                if (hostname === domain || hostname.endsWith('.' + domain)) {
                    console.log(`Platform detected via domain: ${hostname} -> ${platform}`);
                    return platform;
                }
            }
        }
        return null;
    }

    /**
     * Check URL path for platform identification
     */
    checkPath() {
        const pathname = window.location.pathname.toLowerCase();
        
        for (const [platform, config] of Object.entries(this.config.detection)) {
            for (const path of config.paths) {
                if (pathname.includes(path)) {
                    console.log(`Platform detected via path: ${pathname} -> ${platform}`);
                    return platform;
                }
            }
        }
        return null;
    }

    /**
     * Check referrer for platform identification
     */
    checkReferrer() {
        const referrer = document.referrer.toLowerCase();
        if (!referrer) return null;
        
        for (const [platform, config] of Object.entries(this.config.detection)) {
            for (const ref of config.referrers) {
                if (referrer.includes(ref)) {
                    console.log(`Platform detected via referrer: ${referrer} -> ${platform}`);
                    return platform;
                }
            }
        }
        return null;
    }

    /**
     * Apply platform-specific configuration to the page
     */
    applyPlatformConfiguration() {
        if (!this.platform || !this.config.platforms[this.platform]) {
            console.warn('Invalid platform detected, defaulting to retail');
            this.platform = 'retail';
        }

        const config = this.config.platforms[this.platform];
        
        // Update page title and branding
        this.updateBranding(config);
        
        // Hide/show platform-specific elements
        this.togglePlatformElements(config);
        
        // Apply platform-specific styling
        this.applyPlatformStyling(config);
        
        // Initialize platform-specific features
        this.initializePlatformFeatures(config);
        
        // Update global variables for pricing calculations
        this.updateGlobalPlatform();
        
        console.log(`Platform configuration applied: ${this.platform}`, config);
    }

    /**
     * Update page branding based on platform
     */
    updateBranding(config) {
        // Update page title
        if (document.title.includes('TNT')) {
            document.title = config.name;
        }

        // Update main heading if exists
        const mainHeading = document.querySelector('h1, .main-title, .page-title');
        if (mainHeading) {
            mainHeading.textContent = config.title;
        }

        // Update corporate info section
        const corporateInfo = document.querySelector('.corporate-info, .platform-info');
        if (corporateInfo) {
            corporateInfo.textContent = config.title;
        }
    }

    /**
     * Show/hide elements based on platform
     */
    togglePlatformElements(config) {
        // Commission elements (GNET only)
        const commissionElements = document.querySelectorAll('.commission-display, .partner-commission, [class*="commission"]');
        commissionElements.forEach(el => {
            el.style.display = config.showCommission ? 'block' : 'none';
        });

        // Corporate rate elements (Groundspan only)  
        const corporateElements = document.querySelectorAll('.corporate-badge, .corporate-premium, [class*="corporate"]');
        corporateElements.forEach(el => {
            el.style.display = config.showCorporateRates ? 'block' : 'none';
        });

        // Full breakdown elements (hide for corporate)
        const breakdownElements = document.querySelectorAll('.rate-breakdown, .pricing-details, [class*="breakdown"]');
        breakdownElements.forEach(el => {
            el.style.display = config.showFullBreakdown ? 'block' : 'none';
        });

        // Platform-specific sections
        this.togglePlatformSections();
    }

    /**
     * Toggle platform-specific sections
     */
    togglePlatformSections() {
        // Hide all platform-specific sections first
        const allPlatformSections = document.querySelectorAll('[data-platform]');
        allPlatformSections.forEach(section => {
            section.style.display = 'none';
        });

        // Show sections for current platform
        const currentPlatformSections = document.querySelectorAll(`[data-platform="${this.platform}"]`);
        currentPlatformSections.forEach(section => {
            section.style.display = 'block';
        });

        // Show sections for all platforms if no platform specified
        const universalSections = document.querySelectorAll('[data-platform="all"], [data-platform=""]');
        universalSections.forEach(section => {
            section.style.display = 'block';
        });
    }

    /**
     * Apply platform-specific CSS themes
     */
    applyPlatformStyling(config) {
        // Add platform class to body
        document.body.className = document.body.className.replace(/platform-\w+/g, '');
        document.body.classList.add(`platform-${this.platform}`);

        // Apply theme-specific colors and styling
        const root = document.documentElement;
        switch (config.theme) {
            case 'partner':
                root.style.setProperty('--primary-color', '#667eea');
                root.style.setProperty('--secondary-color', '#764ba2');
                break;
            case 'corporate':
                root.style.setProperty('--primary-color', '#DC2626');
                root.style.setProperty('--secondary-color', '#B91C1C');
                break;
            default: // retail
                root.style.setProperty('--primary-color', '#DC2626');
                root.style.setProperty('--secondary-color', '#10b981');
        }
    }

    /**
     * Initialize platform-specific features
     */
    initializePlatformFeatures(config) {
        // Remove all feature classes
        document.body.classList.remove('feature-discounts', 'feature-commission', 'feature-corporate');
        
        // Add current platform features
        config.features.forEach(feature => {
            document.body.classList.add(`feature-${feature}`);
        });

        // Initialize specific platform functionality
        switch (this.platform) {
            case 'gnet':
                this.initializeGNETFeatures();
                break;
            case 'groundspan':
                this.initializeGroundspanFeatures();
                break;
            case 'retail':
                this.initializeRetailFeatures();
                break;
        }
    }

    /**
     * Initialize GNET partner features
     */
    initializeGNETFeatures() {
        // Show partner booking buttons
        const partnerButtons = document.querySelectorAll('.partner-btn, .gnet-export');
        partnerButtons.forEach(btn => btn.style.display = 'inline-block');

        // Initialize commission tracking
        if (window.initializeGNETCommission) {
            window.initializeGNETCommission();
        }
    }

    /**
     * Initialize Groundspan corporate features
     */
    initializeGroundspanFeatures() {
        // Hide service area restrictions for corporate
        const serviceRestrictions = document.querySelectorAll('.service-restriction, .zone-restriction');
        serviceRestrictions.forEach(el => el.style.display = 'none');

        // Show corporate billing info
        const corporateBilling = document.querySelectorAll('.corporate-billing, .monthly-billing');
        corporateBilling.forEach(el => el.style.display = 'block');
    }

    /**
     * Initialize retail customer features
     */
    initializeRetailFeatures() {
        // Show promotional elements
        const promoElements = document.querySelectorAll('.discount-info, .promotion-banner');
        promoElements.forEach(el => el.style.display = 'block');

        // Show full pricing transparency
        const transparencyElements = document.querySelectorAll('.rate-transparency, .price-breakdown');
        transparencyElements.forEach(el => el.style.display = 'block');
    }

    /**
     * Update global platform variable for pricing calculations
     */
    updateGlobalPlatform() {
        window.currentPlatform = this.platform;
        
        // Update any existing pricing objects
        if (window.pricingEngine) {
            window.pricingEngine.platform = this.platform;
        }
    }

    /**
     * Store platform preference
     */
    storePlatform(platform) {
        try {
            localStorage.setItem('tnt_platform', platform);
            sessionStorage.setItem('tnt_platform_session', platform);
        } catch (e) {
            console.warn('Could not store platform preference:', e);
        }
    }

    /**
     * Get stored platform preference
     */
    getStoredPlatform() {
        try {
            return sessionStorage.getItem('tnt_platform_session') || 
                   localStorage.getItem('tnt_platform');
        } catch (e) {
            return null;
        }
    }

    /**
     * Get current platform info
     */
    getPlatformInfo() {
        return {
            platform: this.platform,
            config: this.config.platforms[this.platform],
            isRetail: this.platform === 'retail',
            isGNET: this.platform === 'gnet',
            isGroundspan: this.platform === 'groundspan'
        };
    }

    /**
     * Force platform change (for testing or admin override)
     */
    setPlatform(platform) {
        if (this.config.platforms[platform]) {
            this.platform = platform;
            this.storePlatform(platform);
            this.applyPlatformConfiguration();
            
            // Reload pricing if function exists
            if (window.calculateComprehensivePrice) {
                setTimeout(() => window.calculateComprehensivePrice(), 100);
            }
        }
    }
}

// Initialize platform detection when page loads
let platformDetection;

document.addEventListener('DOMContentLoaded', function() {
    platformDetection = new PlatformDetectionSystem();
    console.log('Platform Detection initialized:', platformDetection.getPlatformInfo());
});

// Make available globally
if (typeof window !== 'undefined') {
    window.PlatformDetectionSystem = PlatformDetectionSystem;
    window.getPlatform = () => platformDetection ? platformDetection.getPlatformInfo() : { platform: 'retail' };
    window.setPlatform = (platform) => platformDetection ? platformDetection.setPlatform(platform) : null;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlatformDetectionSystem;
}