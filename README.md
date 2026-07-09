# Flyin

Lightweight and highly customizable popups library

<p align="left">
  <a href="https://dev4press.github.io/flyin/">Home Page</a> &middot;
  <a href="https://dev4press.github.io/flyin/docs/index.html">Documentation</a> &middot;
  <a href="https://dev4press.github.io/flyin/examples/index.html">Examples</a> &middot;
  <a href="https://www.dev4press.com/">Dev4Press</a>
</p>

## About

Flyin is a lightweight popup library designed for developers who need flexibility and performance. It provides a robust core for creating everything from simple notifications to complex interactive dialogs.

## Features

- **TypeScript Core:** Written in TypeScript for excellent developer experience and type safety.
- **SCSS Styles:** Fully themeable using CSS variables and modular SCSS partials.
- **Zero Dependencies:** Minimal footprint with no external dependencies.
- **Modern Build:** Vite-powered build system ensures optimized bundles and fast loading.
- **Accessibility:** Built-in focus management and WAI-ARIA support for inclusive design.
- **No IE Support:** Optimized for modern browsers with no legacy IE baggage.

## Installation

```bash
npm install @dev4press/flyin
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

## Usage

### Vanilla JavaScript

```javascript
import { Flyin } from '@dev4press/flyin';

const popup = new Flyin('#my-popup', {
  settings: {
    effect: 'bounce',
    style: 'plain-white'
  }
});

popup.open();
```

## License

MIT
