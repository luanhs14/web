/**
 * Logger Utility
 *
 * Sistema de logging que só funciona em desenvolvimento.
 * Em produção, os logs são suprimidos automaticamente.
 *
 * Uso:
 * ```ts
 * import logger from '@/lib/logger';
 *
 * logger.log('Debug info');
 * logger.warn('Warning message');
 * logger.error('Error message');
 * ```
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  /**
   * Log de debug - apenas em desenvolvimento
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      // Note: console.log não é permitido normalmente, mas aqui é intencional
      // eslint-disable-next-line no-console
      (console.log as typeof console.info)('[DEBUG]', ...args);
    }
  },

  /**
   * Warning - funciona em desenvolvimento e produção
   */
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
  },

  /**
   * Error - funciona em desenvolvimento e produção
   */
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },

  /**
   * Info - apenas em desenvolvimento
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Agrupa logs relacionados
   */
  group: (label: string, callback: () => void) => {
    if (isDevelopment) {
      console.info(`=== ${label} ===`);
      callback();
      console.info(`=== End ${label} ===`);
    }
  },

  /**
   * Log de tabela - apenas em desenvolvimento
   */
  table: (data: unknown) => {
    if (isDevelopment) {
      console.info('Table:', data);
    }
  },

  /**
   * Performance timing
   */
  time: (label: string) => {
    if (isDevelopment && typeof performance !== 'undefined') {
      performance.mark(`${label}-start`);
    }
  },

  timeEnd: (label: string) => {
    if (isDevelopment && typeof performance !== 'undefined') {
      performance.mark(`${label}-end`);
      try {
        performance.measure(label, `${label}-start`, `${label}-end`);
        const measure = performance.getEntriesByName(label)[0];
        console.info(`⏱️ ${label}: ${measure.duration.toFixed(2)}ms`);
      } catch {
        // Ignore measurement errors
      }
    }
  },
};

export default logger;
