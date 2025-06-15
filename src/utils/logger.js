const winston = require('winston');

// Configurar los niveles de log
const logger = winston.createLogger({
  levels: winston.config.syslog.levels, // Usa niveles estándar como info, warn, error, debug, etc.
  format: winston.format.combine(
    winston.format.timestamp(), // Agregar marca de tiempo a los logs
    winston.format.json() // Formato JSON para los logs
  ),
  transports: [
    // Registrar logs en la consola
    new winston.transports.Console({
      level: 'info', // Nivel mínimo de logs que se mostrarán en la consola
      format: winston.format.simple(), // Formato simplificado para la consola
    }),
    // Registrar logs de nivel "error" en un archivo separado
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // Registrar todos los logs en un archivo combinado
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

module.exports = logger;