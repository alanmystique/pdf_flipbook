/**
 * Responsive PDF Flipbook Application
 * Features: Responsive design, keyboard navigation, fullscreen, mobile swipe, image preloading
 * Compatible with: Chrome, Safari, Firefox
 */

// Configuration
const CONFIG = {
    totalPages: 11,
    pagesFolder: 'pages/',
    imageFormat: 'jpg',
    swipeThreshold: 50,
    preloadDelay: 100
};

// Global variables
let flipbook;
let isFullscreen = false;
let touchStartX = 0;
let touchStartY = 0;
let imagesLoaded = 0;

/**
 * Preload all images for better performance
 */
function preloadImages() {
    const promises = [];
    
    for (let i = 1; i <= CONFIG.totalPages; i++) {
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                imagesLoaded++;
                updateLoadingProgress();
                resolve(img);
            };
            img.onerror = reject;
            img.src = `${CONFIG.pagesFolder}page${i}.${CONFIG.imageFormat}`;
        });
        promises.push(promise);
    }
    
    return Promise.all(promises);
}

/**
 * Update loading progress
 */
function updateLoadingProgress() {
    const progress = (imagesLoaded / CONFIG.totalPages) * 100;
    const loadingText = document.querySelector('#loading p');
    if (loadingText) {
        loadingText.textContent = `Loading flipbook... ${Math.round(progress)}%`;
    }
}

/**
 * Initialize the flipbook
 */
function initializeFlipbook() {
    flipbook = $('#flipbook');
    
    // Create pages dynamically
    for (let i = 1; i <= CONFIG.totalPages; i++) {
        const pageDiv = $(`
            <div class="page">
                <img src="${CONFIG.pagesFolder}page${i}.${CONFIG.imageFormat}" 
                     alt="Page ${i}" 
                     loading="lazy">
            </div>
        `);
        flipbook.append(pageDiv);
    }
    
    // Initialize Turn.js
    flipbook.turn({
        width: flipbook.parent().width(),
        height: flipbook.parent().height(),
        autoCenter: true,
        pages: CONFIG.totalPages,
        elevation: 50,
        gradients: true,
        when: {
            turning: function(event, page, view) {
                updatePageInfo(page);
            },
            turned: function(event, page, view) {
                updatePageInfo(page);
            }
        }
    });
    
    // Set initial page info
    updatePageInfo(1);
    
    // Handle image loading
    flipbook.find('img').each(function() {
        $(this).on('load', function() {
            $(this).addClass('loaded');
        });
    });
}

/**
 * Update page information display
 */
function updatePageInfo(currentPage) {
    $('#current-page').text(currentPage);
    $('#total-pages').text(CONFIG.totalPages);
}

/**
 * Handle window resize for responsive design
 */
function handleResize() {
    if (flipbook && flipbook.turn) {
        const container = flipbook.parent();
        const newWidth = container.width();
        const newHeight = container.height();
        
        flipbook.turn('size', newWidth, newHeight);
    }
}

/**
 * Debounce function for resize events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle keyboard navigation
 */
function handleKeyboard(event) {
    if (!flipbook) return;
    
    switch(event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            flipbook.turn('previous');
            break;
        case 'ArrowRight':
            event.preventDefault();
            flipbook.turn('next');
            break;
        case 'Home':
            event.preventDefault();
            flipbook.turn('page', 1);
            break;
        case 'End':
            event.preventDefault();
            flipbook.turn('page', CONFIG.totalPages);
            break;
        case 'f':
        case 'F':
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                toggleFullscreen();
            }
            break;
        case 'Escape':
            if (isFullscreen) {
                exitFullscreen();
            }
            break;
    }
}

/**
 * Handle touch events for mobile swipe gestures
 */
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;
    
    // Check if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > CONFIG.swipeThreshold) {
            if (deltaX > 0) {
                // Swipe left - next page
                flipbook.turn('next');
            } else {
                // Swipe right - previous page
                flipbook.turn('previous');
            }
        }
    }
    
    // Reset touch coordinates
    touchStartX = 0;
    touchStartY = 0;
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

/**
 * Enter fullscreen mode
 */
function enterFullscreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

/**
 * Exit fullscreen mode
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * Handle fullscreen change events
 */
function handleFullscreenChange() {
    isFullscreen = !!document.fullscreenElement;
    
    // Update fullscreen button icon
    const icon = document.querySelector('.fullscreen-icon');
    if (icon) {
        icon.textContent = isFullscreen ? '⛶' : '⛶';
    }
    
    // Resize flipbook after fullscreen change
    setTimeout(handleResize, 100);
}

/**
 * Show instructions modal
 */
function showInstructions() {
    $('#instructions').fadeIn(300);
}

/**
 * Hide instructions modal
 */
function hideInstructions() {
    $('#instructions').fadeOut(300);
}

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
    // Keyboard navigation
    $(document).on('keydown', handleKeyboard);
    
    // Touch events for mobile
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Window resize
    $(window).on('resize', debounce(handleResize, 250));
    
    // Fullscreen events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    // Fullscreen button
    $('#fullscreen-btn').on('click', toggleFullscreen);
    
    // Help button and modal
    $('#help-btn').on('click', showInstructions);
    $('.close').on('click', hideInstructions);
    
    // Close modal when clicking outside
    $('#instructions').on('click', function(event) {
        if (event.target === this) {
            hideInstructions();
        }
    });
    
    // Prevent context menu on flipbook
    $('#flipbook').on('contextmenu', function(event) {
        event.preventDefault();
    });
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
    $('#loading').fadeOut(500, function() {
        $(this).remove();
    });
}

/**
 * Main initialization function
 */
function init() {
    // Show loading screen
    $('#loading').show();
    
    // Preload images and initialize flipbook
    preloadImages()
        .then(() => {
            // Small delay to ensure smooth transition
            setTimeout(() => {
                initializeFlipbook();
                initializeEventListeners();
                hideLoadingScreen();
                
                // Initial resize to ensure proper sizing
                setTimeout(handleResize, 100);
            }, CONFIG.preloadDelay);
        })
        .catch((error) => {
            console.error('Error loading images:', error);
            // Initialize anyway with available images
            initializeFlipbook();
            initializeEventListeners();
            hideLoadingScreen();
        });
}

/**
 * Document ready
 */
$(document).ready(function() {
    init();
});

/**
 * Export functions for debugging (optional)
 */
window.FlipbookApp = {
    goToPage: (page) => flipbook && flipbook.turn('page', page),
    nextPage: () => flipbook && flipbook.turn('next'),
    previousPage: () => flipbook && flipbook.turn('previous'),
    getCurrentPage: () => flipbook && flipbook.turn('page'),
    toggleFullscreen: toggleFullscreen,
    showInstructions: showInstructions
};
