/**
 * PM2 Ecosystem Configuration
 *
 * Configuração para deploy e gerenciamento do Studio Volt Code em produção.
 *
 * Para iniciar:
 *   pm2 start ecosystem.config.js
 *
 * Para restart:
 *   pm2 restart studio-volt-code
 *
 * Para ver logs:
 *   pm2 logs studio-volt-code
 */

module.exports = {
  apps: [
    {
      name: 'studio-volt-code',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/volt/studio-volt-code',
      instances: 1,
      exec_mode: 'fork',

      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },

      // Logs
      error_file: '/var/log/pm2/studio-volt-code-error.log',
      out_file: '/var/log/pm2/studio-volt-code-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Advanced features
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs'],
      max_memory_restart: '500M',

      // Auto restart
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',

      // Kill timeout
      kill_timeout: 5000,
    },
  ],
};
