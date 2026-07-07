# Flyin Popup v1.0.0

Modernized Flyin Popup library, rewritten in TypeScript and SCSS.

## Features

- **TypeScript Core:** Completely rewritten for type safety and modern standards.
- **SCSS Styles:** Modular styles with variables and nesting.
- **Zero Dependencies:** Standalone version (only requires `js-cookie`).
- **Modern Build:** Powered by Vite for fast development and small bundles.
- **No IE Support:** Focused on modern browsers (Chrome, Firefox, Safari, Edge).

## Installation

```bash
npm install @dev4press/flyin
```

## Usage

### Vanilla JavaScript

```javascript
import { Flyin } from '@dev4press/flyin';

const popup = new Flyin('#my-popup', {
  effect: 'bounce',
  style: 'flyin-style-plain-white'
});

popup.open();
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
