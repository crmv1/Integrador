import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.vitest.js'],
    css: false,
  },
  esbuild: {
    loader: 'jsx',                    // procesa .js/.jsx con JSX
    include: /src\/.*\.(js|jsx)$/,    // sólo archivos dentro de src
    jsx: 'automatic',                 // runtime automático de React 17+
    jsxDev: true,
    // Si prefieres el runtime clásico, comenta 'jsx' arriba y usa esta inyección:
    // jsxInject: `import React from 'react'`,
  },
});
