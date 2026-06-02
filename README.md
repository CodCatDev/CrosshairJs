# CrosshairJS

Lightweight (5KB) animated crosshair cursor with smart hover effects and zero setup.

## Features
-  Zero Markup — style injection and DOM elements are handled automatically.
-  Magnetic Hover — automatically snaps and scales to links and buttons.
-  Customizable — easy control over colors, sizes, and blend modes.
-  Performance — smooth 60fps animation using RequestAnimationFrame.

## Installation

Just include the script before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/CodCatDev/CrosshairJs@main/src/crosshair.min.js"></script>
<script>
  new Crosshair();
</script>
```

## Configuration

You can pass an options object to customize the look and feel:

```javascript
new Crosshair({
    dotSize: 6, // cursor dot size
    outlineSize: 30, // space between the dot and the outline
    dotColor: '#ff0000', // cursor dot color
    outlineColor: '#fff', // outline color
    useBlend: true, // mix-blend-mode: difference
    hoverPadding: { x: 15, y: 10 } // padding between the cursor and the element when hovering
});
```


## How it works
The cursor automatically tracks all `<a>`, `<button>` and elements with the `.interactable` class. It uses a `MutationObserver`, so it works perfectly with dynamic content and SPAs.

# Add to any website
You can run this in the console:

```javascript
(function() {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/gh/CodCatDev/CrosshairJs@main/src/crosshair.js';
    s.onload = () => {
        if (typeof Crosshair !== 'undefined') {
            new Crosshair();
            console.log('CrosshairJs loaded');
        } else {
            console.error('Класс Crosshair не найден');
        }
    };
    document.head.appendChild(s);
})();
```

And then add CrosshairJs to any website (until the next page reload =D)