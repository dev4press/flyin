# Flyin Popup v1.0.0

Modernized Flyin Popup library.

## Features

- **TypeScript Core:** Type safety and modern standards.
- **SCSS Styles:** Modular styles with variables and nesting.
- **Zero Dependencies:** No external libraries required.
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
  settings: {
    effect: 'bounce',
    style: 'plain-white'
  }
});

popup.open();
```

## Settings

Settings can be passed during initialization or overridden using `data-*` attributes on the popup element.

### Core Settings
- `style` (string): CSS class for the popup skin. Default: `plain-white`.
- `effect` (string): Entry effect. Default: `random`.
- `effectSpeed` (number): Duration in seconds. Default: `0.7`.
- `modal` (boolean): Whether to show a modal overlay. Default: `true`.
- `closeAuto` (boolean): Automatically close after a delay. Default: `false`.
- `closeAutoDelay` (number): Delay in milliseconds for auto-closing. Default: `0`.

### Data Attribute Overrides
Settings can be overridden using `data-` attributes:
- `data-title`: Sets the header title.
- `data-title-tag`: Sets the HTML tag for the title (e.g., `h3`).
- `data-modal`: Sets whether the popup is modal (`true`/`false`).
- `data-on-load`: Sets whether to open on load (`true`/`false`).
- `data-on-load-delay`: Sets the delay in milliseconds.

### Storage and Persistence
Popups can save their state (like position and size) in local storage.
- `storeCode` (string): Unique identifier for the popup. Default: `''`. Must be set to enable persistence.
- `savePositionSize` (boolean): Whether to save position and size. Default: `true`.
- `storePositionSizeCode` (string): Base key for storage. Default: `flyin-positionsize`.

The full storage key for position is: `${storePositionSizeCode}-${storeCode}`.

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
