// ===== CONFIGURATION VARIABLES (EDIT THESE) =====
const CTA_URL = "https://www.opera.com/gx";
const CTA_TEXT = "Download Opera GX — FREE";
const BRAND_NAME = "Opera GX";
const PAGE_VARIANT = "A";
const HERO_BG_URL = "https://via.placeholder.com/1920x1080/1a1a2e/ff2d5a?text=Gaming+Browser+Background";

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupCTALinks();
    setupScrollBehavior();
    setupFAQ();
    setupModal();
    setupAnalytics();
});

// ===== PAGE INITIALIZATION =====
function initializePage() {
    // Set brand name in content
    const brandElements = document.querySelectorAll('[data-brand]');
    brandElements.forEach(el => {
        el.textContent = BRAND_NAME;
    });
    
    // Set hero background
    const hero = document.getElementById('hero');
    if (hero && HERO_BG_URL) {
        hero.style.backgroundImage = `url('${HERO_BG_URL}')`;
    }
}

// ===== CTA SETUP =====
function setupCTALinks() {
    const finalCTAUrl = buildCTAUrl();
    
    // Header CTA
    const headerCTA = document.getElementById('header-cta');
    const headerCTAText = document.getElementById('header-cta-text');
    if (headerCTA) {
        headerCTA.href = finalCTAUrl;
        headerCTA.addEventListener('click', () => trackCTAClick('header'));
    }
    if (headerCTAText) {
        headerCTAText.textContent = CTA_TEXT;
    }
    
    // Section CTAs (1-4) - Only set href, keep custom text
    for (let i = 1; i <= 4; i++) {
        const sectionCTA = document.querySelector(`.section-cta-${i}`);
        if (sectionCTA) {
            sectionCTA.href = finalCTAUrl;
            sectionCTA.addEventListener('click', () => trackCTAClick(`section-${i}`));
        }
    }
    
    // Final CTA
    const finalCTA = document.getElementById('final-cta');
    const finalCTAText = document.getElementById('final-cta-text');
    if (finalCTA) {
        finalCTA.href = finalCTAUrl;
        finalCTA.addEventListener('click', () => trackCTAClick('final'));
    }
    if (finalCTAText) {
        finalCTAText.textContent = CTA_TEXT;
    }
    
    // Sticky CTA
    const stickyCTA = document.getElementById('sticky-cta-button');
    const stickyCTAText = document.getElementById('sticky-cta-text');
    if (stickyCTA) {
        stickyCTA.href = finalCTAUrl;
        stickyCTA.addEventListener('click', () => trackCTAClick('sticky'));
    }
    if (stickyCTAText) {
        stickyCTAText.textContent = CTA_TEXT;
    }
}

function buildCTAUrl() {
    try {
        const currentUrl = new URL(window.location.href);
        const ctaUrl = new URL(CTA_URL);
        
        // Get tracking params from current URL
        const paramsToPass = ['clickid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        
        paramsToPass.forEach(param => {
            const value = currentUrl.searchParams.get(param);
            if (value) {
                ctaUrl.searchParams.set(param, value);
            }
        });
        
        return ctaUrl.toString();
    } catch (e) {
        console.error('Error building CTA URL:', e);
        return CTA_URL;
    }
}

// ===== SCROLL BEHAVIOR =====
function setupScrollBehavior() {
    const stickyBar = document.getElementById('sticky-cta');
    let scrollThreshold = 0.35;
    
    window.addEventListener('scroll', function() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        if (scrollPercent > scrollThreshold && stickyBar) {
            stickyBar.classList.add('visible');
            stickyBar.setAttribute('aria-hidden', 'false');
        } else if (stickyBar) {
            stickyBar.classList.remove('visible');
            stickyBar.setAttribute('aria-hidden', 'true');
        }
    });
}

// ===== FAQ ACCORDION =====
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
                const q = i.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// ===== MODAL SYSTEM =====
function setupModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.querySelector('.modal-close');
    const footerLinks = document.querySelectorAll('.footer-link[data-modal]');
    
    const modalContents = {
        disclaimer: `
            <h3>Disclaimer</h3>
            <p>This is a promotional landing page designed to inform you about ${BRAND_NAME}.</p>
            <p>Performance improvements may vary based on your system configuration, active applications, and usage patterns.</p>
            <p>${BRAND_NAME} is a product of its respective owner. This website is not affiliated with or endorsed by Opera Software.</p>
            <p>No specific results are guaranteed. Individual experiences may differ.</p>
        `,
        privacy: `
            <h3>Privacy Policy</h3>
            <p>This is a promotional landing page. We respect your privacy and do not collect personal information through this page.</p>
            <p>When you click the download link, you will be directed to the official website where their privacy policy applies.</p>
            <p>This page may use cookies for analytics purposes to improve user experience.</p>
        `,
        terms: `
            <h3>Terms of Service</h3>
            <p>This is a promotional page designed to inform you about ${BRAND_NAME}.</p>
            <p>By using this page, you agree that:</p>
            <p>• The information provided is for informational purposes only</p>
            <p>• Performance improvements may vary based on your system</p>
            <p>• ${BRAND_NAME} is a product of its respective owner</p>
            <p>• No guarantees are made regarding specific outcomes</p>
            <p>• This is not an official Opera website</p>
        `
    };
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function() {
            const modalType = this.getAttribute('data-modal');
            if (modalContents[modalType]) {
                modalContent.innerHTML = modalContents[modalType];
                modalOverlay.classList.add('active');
            }
        });
    });
    
    // Close modal
    function closeModal() {
        modalOverlay.classList.remove('active');
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

// ===== ANALYTICS =====
function setupAnalytics() {
    window.dataLayer = window.dataLayer || [];
}

function trackCTAClick(location) {
    try {
        const currentUrl = new URL(window.location.href);
        const clickid = currentUrl.searchParams.get('clickid') || '';
        const utm_source = currentUrl.searchParams.get('utm_source') || '';
        
        window.dataLayer.push({
            event: 'prelander_click',
            click_location: location,
            clickid: clickid,
            utm_source: utm_source,
            page_variant: PAGE_VARIANT
        });
    } catch (e) {
        console.error('Analytics error:', e);
    }
}