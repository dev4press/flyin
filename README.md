# Smart Animated Popup v3.0

Modernized version of the Smart Animated Popup library, rewritten in TypeScript and SCSS.

## Features

- **TypeScript Core:** Completely rewritten for type safety and modern standards.
- **SCSS Styles:** Modular styles with variables and nesting.
- **Zero Dependencies:** Standalone version (only requires `js-cookie`).
- **jQuery Compatible:** Includes a wrapper for backward compatibility.
- **Modern Build:** Powered by Vite for fast development and small bundles.
- **No IE Support:** Focused on modern browsers (Chrome, Firefox, Safari, Edge).

## Installation

```bash
npm install smart-animated-popup
```

## Usage

### Vanilla JavaScript

```javascript
import { SmartAniPopup } from 'smart-animated-popup';

const popup = new SmartAniPopup('#my-popup', {
  effect: 'bounce',
  style: 'sanp-style-plain-white'
});

popup.open();
```

### jQuery

```javascript
$('#my-popup').smartAniPopup({
  effect: 'fade'
});

$('#my-popup').smartAniPopup('open');
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint and format
npm run lint
npm run format
```

## License

MIT
