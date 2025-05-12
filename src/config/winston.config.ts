import winston from 'winston';

const logger = winston.createLogger({
  level: 'info', // Mức độ log (info, error, warn, ...)
  format: winston.format.combine(
    winston.format.colorize(), // Tô màu log khi hiển thị trên console
    winston.format.timestamp(), // Ghi thời gian
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`; 
    })
  ),
  transports: [
    new winston.transports.Console(), // Ghi log vào console
    new winston.transports.File({ filename: 'logs/app.log' })
  ],
});

export default logger;