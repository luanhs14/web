import type { NextConfig } from "next";

/**
 * Next.js Configuration
 *
 * Configuração otimizada para produção com:
 * - Image optimization
 * - Security headers
 * - Performance optimizations
 * - SEO improvements
 */
const nextConfig: NextConfig = {
  // ============================================
  // IMAGE OPTIMIZATION
  // ============================================
  images: {
    // Domínios permitidos para otimização de imagens externas
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/api/**",
      },
    ],
    // Formatos de imagem modernos
    formats: ["image/avif", "image/webp"],
    // Tamanhos de dispositivo para responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache de imagens otimizadas (60 dias)
    minimumCacheTTL: 60 * 60 * 24 * 60,
  },

  // ============================================
  // SECURITY HEADERS
  // ============================================
  async headers() {
    return [
      {
        // Aplicar headers em todas as rotas
        source: "/:path*",
        headers: [
          // Previne clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Previne MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Ativa XSS protection (browsers antigos)
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Content Security Policy (CSP) - Previne XSS e code injection
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-inline necessário para Next.js
              "style-src 'self' 'unsafe-inline'", // unsafe-inline necessário para CSS-in-JS
              "img-src 'self' data: blob: https://images.unsplash.com https://ui-avatars.com",
              "font-src 'self' data:",
              "connect-src 'self'",
              "media-src 'self'",
              "object-src 'none'",
              "frame-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          // Referrer policy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions policy (desabilita features não usadas)
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Strict Transport Security (HSTS) - força HTTPS
          // ATENÇÃO: Só habilite em produção com SSL configurado
          // {
          //   key: 'Strict-Transport-Security',
          //   value: 'max-age=31536000; includeSubDomains; preload',
          // },
        ],
      },
    ];
  },

  // ============================================
  // REDIRECTS
  // ============================================
  async redirects() {
    return [
      // Redirect trailing slashes (SEO)
      // {
      //   source: '/:path+/',
      //   destination: '/:path+',
      //   permanent: true,
      // },
    ];
  },

  // ============================================
  // REWRITES (se necessário para proxy de API)
  // ============================================
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://api.example.com/:path*',
  //     },
  //   ];
  // },

  // ============================================
  // PERFORMANCE & BUILD OPTIMIZATIONS
  // ============================================

  // Compressão (Gzip/Brotli) - geralmente feito pelo servidor (Nginx/Vercel)
  compress: true,

  // Gerar ETags para cache
  generateEtags: true,

  // NOTA: swcMinify é o padrão no Next.js 16+ (não precisa configurar)

  // ============================================
  // EXPERIMENTAL FEATURES
  // ============================================
  experimental: {
    // Otimizações de bundle
    optimizeCss: true,

    // Melhor otimização de pacotes
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "react-icons",
    ],
  },

  // ============================================
  // TYPESCRIPT
  // ============================================
  typescript: {
    // Falhar build em erros de tipo (recomendado para produção)
    ignoreBuildErrors: false,
  },

  // NOTA: ESLint config foi removido do next.config no Next.js 16+
  // Use o arquivo .eslintrc.json ou execute 'next lint' separadamente

  // ============================================
  // WEBPACK CUSTOMIZATION (se necessário)
  // ============================================
  webpack: (config, { dev, isServer }) => {
    // Otimizações de produção
    if (!dev && !isServer) {
      // Tree shaking mais agressivo
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }

    return config;
  },

  // ============================================
  // OUTPUT (para diferentes plataformas)
  // ============================================
  // output: 'standalone', // Para Docker
  // output: 'export', // Para static export

  // ============================================
  // OUTRAS CONFIGURAÇÕES
  // ============================================

  // Desabilitar X-Powered-By header (não revela tecnologia)
  poweredByHeader: false,

  // Strict mode do React (ajuda a encontrar bugs)
  reactStrictMode: true,

  // Trailing slash (consistência de URLs)
  // trailingSlash: false,

  // Base path (se app não estiver na raiz do domínio)
  // basePath: '/app',

  // Asset prefix (para CDN)
  // assetPrefix: 'https://cdn.example.com',
};

export default nextConfig;
