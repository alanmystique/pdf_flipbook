// Flipbook initialization with Turn.js

const CONFIG = {
    pagesFolder: 'pages/',
    imageFormat: 'jpg'
};

let totalPages = 0;

// Detect total pages by counting images in pages folder (static known count)
const pageImages = [
    'page1.jpg','page2.jpg','page3.jpg','page4.jpg','page5.jpg','page6.jpg','page7.jpg','page8.jpg','page9.jpg','page10.jpg','page11.jpg'
];
totalPages = pageImages.length;

// Update total pages display
document.getElementById('total-pages').textContent = totalPages;

// Load pages dynamically
const flipbook = document.getElementById('flipbook');
pageImages.forEach((img, index) => {
    const div = document.createElement('div');
    div.classList.add('page');
    const image = document.createElement('img');
    image.src = CONFIG.pagesFolder + img;
    image.alt = `Page ${index + 1}`;
    div.appendChild(image);
    flipbook.appendChild(div);
});

// Wait for DOM ready
$(document).ready(function () {
    $('#flipbook').turn({
        width: $('#flipbook').width(),
        height: $('#flipbook').height(),
        autoCenter: true
    });

    $('#loading').fadeOut();

    // Update current page on turning
    $('#flipbook').bind('turned', function (e, page) {
        document.getElementById('current-page').textContent = page;
    });

    // Keyboard navigation
    $(document).keydown(function (e) {
        if (e.key === 'ArrowRight') $('#flipbook').turn('next');
        if (e.key === 'ArrowLeft') $('#flipbook').turn('previous');
    });

    // Fullscreen button
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        const elem = document.getElementById('flipbook-container');
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    });

    // Swipe gestures for mobile
    let startX = 0;
    flipbook.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
    });

    flipbook.addEventListener('touchend', (e) => {
        let endX = e.changedTouches[0].screenX;
        if (startX - endX > 50) $('#flipbook').turn('next');
        if (endX - startX > 50) $('#flipbook').turn('previous');
    });
});

// Responsive resizing
window.addEventListener('resize', () => {
    $('#flipbook').turn('size', $('#flipbook').width(), $('#flipbook').height());
});
