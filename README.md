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

## Configuration

### Settings

Flyin supports a wide range of settings to customize behavior and appearance.

- **style** (string): Popup skin class. Default: `'plain-white'`.
- **effect** (string): Entry effect. Default: `'random'`.
- **modal** (boolean): Enable modal overlay. Default: `true`.
- **onLoad** (boolean): Open automatically on page load. Default: `true`.
- **width** / **height** (string): Dimensions of the popup.
- **positionX** / **positionY** (string): Alignment of the popup.

For a full list of settings, see the [Settings Documentation](https://dev4press.github.io/flyin/docs/settings.html).

### Callbacks

Hook into the popup lifecycle with callbacks:

- **prepared**: Triggered when the popup is initialized.
- **ready**: Triggered when the popup is ready in the DOM.
- **beforeOpen** / **afterOpen**: Opening lifecycle events.
- **beforeClose** / **afterClose**: Closing lifecycle events.

## License

MIT
