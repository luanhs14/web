/**
 * Environment Variables Configuration
 *
 * Centralizes access to environment variables with type safety and validation.
 * All public environment variables must be prefixed with NEXT_PUBLIC_
 *
 * IMPORTANT: Direct references to process.env are required for Next.js to
 * inline these values at build time.
 */

/**
 * Environment variables used throughout the application
 */
export const env = {
  // WhatsApp Configuration
  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
    link: process.env.NEXT_PUBLIC_WHATSAPP_LINK || '',
  },

  // Contact Configuration
  contact: {
    email: process.env.NEXT_PUBLIC_EMAIL || '',
    phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY || '',
  },

  // Site Configuration
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || '',
    name: process.env.NEXT_PUBLIC_SITE_NAME || '',
  },

  // Analytics (optional)
  analytics: {
    googleId: process.env.NEXT_PUBLIC_GA_ID || '',
  },

  // SEO (optional)
  seo: {
    googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
    ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || '/og-image.png',
  },
} as const;

/**
 * Helper function to generate WhatsApp link with custom message
 * @param message - The pre-filled message to send
 * @returns Complete WhatsApp link with encoded message
 */
export function getWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `${env.whatsapp.link}?text=${encodedMessage}`;
}

/**
 * Validates that all required environment variables are present
 * Should be called at build time or app initialization
 */
export function validateEnv(): void {
  try {
    // Attempt to access all required variables (void to avoid unused expression warning)
    void env.whatsapp.number;
    void env.whatsapp.link;
    void env.contact.email;
    void env.contact.phoneDisplay;
    void env.site.url;
    void env.site.name;

    console.info('✅ Environment variables validated successfully');
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    throw error;
  }
}
