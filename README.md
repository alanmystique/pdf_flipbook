# Responsive PDF Flipbook

A fully responsive HTML flipbook web application using Turn.js and jQuery. This flipbook loads page images from a `pages/` folder and supports keyboard navigation, fullscreen mode, and mobile swipe gestures.

## Features

- **Responsive Design**: Automatically scales to 90% of screen width and 70% of screen height while maintaining aspect ratio
- **Keyboard Navigation**: Use Left/Right arrow keys to flip pages
- **Fullscreen Mode**: Toggle fullscreen with the dedicated button
- **Mobile Support**: Swipe left/right to navigate pages on touch devices
- **Image Preloading**: All images are preloaded for smooth performance
- **Cross-Browser Support**: Compatible with Chrome, Safari, and Firefox
- **Static Hosting Ready**: Single HTML file with linked CSS/JS files

## File Structure

```
pdf_flipbook/
├── index.html          # Main HTML file
├── style.css           # Responsive CSS styles
├── script.js           # JavaScript functionality
├── pages/              # Folder containing page images
│   ├── page1.jpg
│   ├── page2.jpg
│   ├── page3.jpg
│   └── ...
└── README.md           # This documentation file
```

## How to Use

1. **Open the flipbook**: Simply open `index.html` in any modern web browser
2. **Navigate pages**:
   - **Keyboard**: Use Left/Right arrow keys
   - **Mouse**: Click on page edges or drag pages
   - **Touch**: Swipe left/right on mobile devices
3. **Fullscreen**: Click the fullscreen button (⛶) in the top-right corner
4. **Help**: Click the "?" button for navigation instructions

## Adding More Pages

To add more page images to your flipbook:

### Method 1: Simple Addition (Recommended)

1. **Add image files**: Place your new page images in the `pages/` folder
2. **Name them sequentially**: Use the format `pageX.jpg` where X is the page number
   - Example: `page12.jpg`, `page13.jpg`, etc.
3. **Update the configuration**: Open `script.js` and modify the `CONFIG` object:
   ```javascript
   const CONFIG = {
       totalPages: 15, // Change this to your new total page count
       pagesFolder: 'pages/',
       imageFormat: 'jpg',
       swipeThreshold: 50,
       preloadDelay: 100
   };
   ```

### Method 2: Different Image Format

If your images are in a different format (PNG, WebP, etc.):

1. **Add your images** to the `pages/` folder
2. **Update the configuration** in `script.js`:
   ```javascript
   const CONFIG = {
       totalPages: 11,
       pagesFolder: 'pages/',
       imageFormat: 'png', // Change to your image format
       swipeThreshold: 50,
       preloadDelay: 100
   };
   ```

### Method 3: Custom Image Names

For custom image naming patterns, modify the preload function in `script.js`:

```javascript
// Replace this section in script.js
function preloadImages() {
    const promises = [];
    
    // Custom image names array
    const imageNames = [
        'cover.jpg',
        'chapter1.jpg',
        'chapter2.jpg',
        // Add your custom names here
    ];
    
    imageNames.forEach((imageName, index) => {
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                imagesLoaded++;
                updateLoadingProgress();
                resolve(img);
            };
            img.onerror = reject;
            img.src = `${CONFIG.pagesFolder}${imageName}`;
        });
        promises.push(promise);
    });
    
    return Promise.all(promises);
}
```

## Customization

### Responsive Breakpoints

Modify the responsive design in `style.css`:

```css
/* Mobile phones */
@media (max-width: 480px) {
    #flipbook {
        width: 98vw;
        height: 80vh;
    }
}

/* Tablets */
@media (max-width: 768px) {
    #flipbook {
        width: 95vw;
        height: 75vh;
    }
}
```

### Flipbook Dimensions

Change the default flipbook size in `style.css`:

```css
#flipbook {
    width: 90vw;        /* Change width percentage */
    height: 70vh;       /* Change height percentage */
    max-width: 1200px;  /* Change maximum width */
    max-height: 800px;  /* Change maximum height */
}
```

### Turn.js Options

Customize the flipbook behavior in `script.js`:

```javascript
flipbook.turn({
    width: flipbook.parent().width(),
    height: flipbook.parent().height(),
    autoCenter: true,
    elevation: 50,        // Shadow depth
    gradients: true,      // Enable gradients
    acceleration: true,   // Hardware acceleration
    duration: 600,        // Animation duration
    pages: CONFIG.totalPages
});
```

## Browser Compatibility

- **Chrome**: Full support
- **Safari**: Full support
- **Firefox**: Full support
- **Edge**: Full support
- **Mobile browsers**: Full support with touch gestures

## Performance Tips

1. **Optimize images**: Compress your images to reduce loading time
2. **Use appropriate dimensions**: Match image dimensions to your target display size
3. **Consider lazy loading**: For very large flipbooks, implement lazy loading
4. **Test on mobile**: Always test swipe gestures on actual mobile devices

## Troubleshooting

### Images not loading
- Check that image files are in the `pages/` folder
- Verify image file names match the expected pattern
- Ensure image files are not corrupted
- Check browser console for error messages

### Flipbook not responsive
- Verify CSS media queries are not overridden
- Check that viewport meta tag is present in HTML
- Test in different browsers

### Touch gestures not working
- Ensure you're testing on an actual touch device
- Check that touch events are not being prevented by other scripts
- Verify the swipe threshold in the configuration

## License

This project is open source and available under the MIT License.

## Credits

- **Turn.js**: Page flip library by Emmanuel Garcia
- **jQuery**: JavaScript library for DOM manipulation
- **CSS3**: Modern styling and animations
