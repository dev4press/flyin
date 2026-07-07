import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Flyin',
      fileName: (format) => `flyin.${format}.js`,
    },
    rollupOptions: {
      external: ['js-cookie'],
      output: {
        exports: 'default',
        globals: {
          'js-cookie': 'Cookies',
        },
      },
    },
  },
});
