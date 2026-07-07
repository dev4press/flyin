import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SmartAniPopup',
      fileName: (format) => `smart-animated-popup.${format}.js`,
    },
    rollupOptions: {
      external: ['js-cookie'],
      output: {
        globals: {
          'js-cookie': 'Cookies',
        },
      },
    },
  },
});
