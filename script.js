// Initialize the flipbook with Turn.js

const CONFIG = {
  pagesFolder: 'pages/',
  imageFormat: 'jpg'
};

function loadPages() {
  const flipbook = $('#flipbook');
  flipbook.empty();
  let pageCount = 0;

  // Dynamically load all page images (page1.jpg, page2.jpg, ...)
  for (let i = 1; i <= 50; i++) {
    let imgPath = `${CONFIG.pagesFolder}page${i}.${CONFIG.imageFormat}`;
    let img = new Image();
    img.src = imgPath;
    img.onload = () => {
      const pageDiv = $('<div />', { 'class': 'page' }).append($(img));
      flipbook.append(pageDiv);
      pageCount++;
      $('#total-pages').text(pageCount);

      // Initialize Turn.js after first load
      if (pageCount === 1) initTurn();
    };
    img.onerror = () => {
      if (i === 1 && pageCount === 0) {
        console.error('No pages found in pages folder.');
      }
    };
  }
}

function initTurn() {
  $('#flipbook').turn({
    width: $('#flipbook').width(),
    height: $('#flipbook').height(),
    autoCenter: true
  });

  $('#loading').fadeOut();

  $('#flipbook').bind('turned', function (e, page) {
    $('#current-page').text(page);
  });

  // Keyboard navigation
  $(document).keydown(function (e) {
    if (e.key === 'ArrowRight') $('#flipbook').turn('next');
    if (e.key === 'ArrowLeft') $('#flipbook').turn('previous');
  });

  // Fullscreen button
  $('#fullscreen-btn').click(() => {
    const elem = document.getElementById('flipbook-container');
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  });

  // Swipe gestures
  let startX = 0;
  const flipbookElem = document.getElementById('flipbook');
  flipbookElem.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
  });
  flipbookElem.addEventListener('touchend', (e) => {
    let endX = e.changedTouches[0].screenX;
    if (startX - endX > 50) $('#flipbook').turn('next');
    if (endX - startX > 50) $('#flipbook').turn('previous');
  });
}

$(document).ready(function () {
  loadPages();
});

window.addEventListener('resize', () => {
  $('#flipbook').turn('size', $('#flipbook').width(), $('#flipbook').height());
});
