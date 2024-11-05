import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

import path from 'path';
import jsconfig from './jsconfig.json';

const raw = jsconfig.compilerOptions.paths;
const alias = {};
for (const x in raw) {
  alias[x.replace('/*', '')] = raw[x].map(p =>
    path.resolve(__dirname, p.replace('/*', ''))
  );
}

export default defineConfig({
  base: '/',
  publicDir: 'public',
  root: './',
  plugins: [react()],
  clearScreen: false,
  resolve: {
    alias,
  },
  build: {
    lightningcss: {
      targets: { chrome: 115, firefox: 115, safari: 16 },
    },
  },
});
