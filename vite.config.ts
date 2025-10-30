import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/vc': {
            target: 'https://issuer-sandbox.wallet.gov.tw/',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/vc/, ''),
            configure: (proxy, options) => {
              proxy.on('proxyReq', (proxyReq) => {
                proxyReq.setHeader('Access-Token', env.VC_API_KEY);
              });
            }
          },
          '/api/vp': {
            target: 'https://verifier-sandbox.wallet.gov.tw/',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/vp/, ''),
            configure: (proxy, options) => {
              proxy.on('proxyReq', (proxyReq) => {
                proxyReq.setHeader('Access-Token', env.VP_API_KEY);
              });
            }
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
