import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    server: {
      deps: {
        inline: ['clsx'],
      },
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      include: ['src'],
      exclude: [
        'src/interface',
        'src/__tests__',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/core/ShellRoutingSync.tsx',
        'src/i18n.ts',
        'src/main.tsx',
        'src/routes.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@translation': path.resolve(__dirname, 'public/translations'),
    },
    mainFields: ['module'],
  },
});
