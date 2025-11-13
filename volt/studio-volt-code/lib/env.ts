/**
 * Environment Variables Configuration
 *
 * Centralizes access to environment variables with type safety and validation.
 * All public environment variables must be prefixed with NEXT_PUBLIC_
 */

/**
 * Gets an environment variable value
 * @throws Error if required variable is missing
 */
function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please check your .env.local file and make sure ${key} is defined.\n` +
      `See .env.example for reference.`
    );
  }

  return value || '';
}

/**
 * Environment variables used throughout the application
 */
export const env = {
  // WhatsApp Configuration
  whatsapp: {
    number: getEnvVar('NEXT_PUBLIC_WHATSAPP_NUMBER'),
    link: getEnvVar('NEXT_PUBLIC_WHATSAPP_LINK'),
  },

  // Contact Configuration
  contact: {
    email: getEnvVar('NEXT_PUBLIC_EMAIL'),
    phoneDisplay: getEnvVar('NEXT_PUBLIC_PHONE_DISPLAY'),
  },

  // Site Configuration
  site: {
    url: getEnvVar('NEXT_PUBLIC_SITE_URL'),
    name: getEnvVar('NEXT_PUBLIC_SITE_NAME'),
  },

  // Analytics (optional)
  analytics: {
    googleId: getEnvVar('NEXT_PUBLIC_GA_ID', false),
  },

  // SEO (optional)
  seo: {
    googleVerification: getEnvVar('NEXT_PUBLIC_GOOGLE_VERIFICATION', false),
    ogImage: getEnvVar('NEXT_PUBLIC_OG_IMAGE', false) || '/og-image.png',
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
    // Attempt to access all required variables
    env.whatsapp.number;
    env.whatsapp.link;
    env.contact.email;
    env.contact.phoneDisplay;
    env.site.url;
    env.site.name;

    console.log('✅ Environment variables validated successfully');
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    throw error;
  }
}
