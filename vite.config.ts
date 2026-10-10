import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

function cleanUrlPlugin() {
  return {
    name: 'clean-url-plugin',
    configureServer(server: any) {
      server.middlewares.use((req: any, _res: any, next: any) => {
        if (req.url && !req.url.includes('.') && req.url !== '/') {
          const cleanPath = req.url.split('?')[0];
          const possibleHtml = path.join(__dirname, cleanPath + '.html');
          if (fs.existsSync(possibleHtml)) {
            req.url = req.url.replace(cleanPath, cleanPath + '.html');
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cleanUrlPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          services: path.resolve(__dirname, 'services.html'),
          portfolio: path.resolve(__dirname, 'portfolio.html'),
          pricing: path.resolve(__dirname, 'pricing.html'),
          blog: path.resolve(__dirname, 'blog.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          team: path.resolve(__dirname, 'team.html'),
          // Service sub-pages
          service_seo: path.resolve(__dirname, 'services/seo.html'),
          service_paid_ads: path.resolve(__dirname, 'services/paid-ads.html'),
          service_content: path.resolve(__dirname, 'services/content-marketing.html'),
          service_social: path.resolve(__dirname, 'services/social-media-marketing.html'),
          service_web: path.resolve(__dirname, 'services/web-design-development.html'),
          service_automation: path.resolve(__dirname, 'services/marketing-automation-crm.html'),
          service_geo: path.resolve(__dirname, 'services/geo-aeo-optimization.html'),
          // Blog sub-pages
          blog_geo_vs_seo: path.resolve(__dirname, 'blog/geo-vs-seo.html'),
          blog_meta: path.resolve(__dirname, 'blog/meta-account-structure.html'),
          blog_landing: path.resolve(__dirname, 'blog/landing-page-mistakes.html'),
          blog_aeo: path.resolve(__dirname, 'blog/aeo-content-format.html'),
          blog_cac: path.resolve(__dirname, 'blog/cac-truth.html'),
          blog_shopify: path.resolve(__dirname, 'blog/shopify-cwv.html'),
          // Portfolio sub-pages
          port_fernway: path.resolve(__dirname, 'portfolio/fernway.html'),
          port_hearthline: path.resolve(__dirname, 'portfolio/hearthline.html'),
          port_kaleido: path.resolve(__dirname, 'portfolio/kaleido.html'),
          port_loopcraft: path.resolve(__dirname, 'portfolio/loopcraft.html'),
          port_northwind: path.resolve(__dirname, 'portfolio/northwind.html'),
          port_orbital: path.resolve(__dirname, 'portfolio/orbital.html'),
          port_pivot: path.resolve(__dirname, 'portfolio/pivot.html'),
          port_quorum: path.resolve(__dirname, 'portfolio/quorum.html'),
          port_sable: path.resolve(__dirname, 'portfolio/sable.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
