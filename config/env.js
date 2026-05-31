require('dotenv').config();

const requiredEnv = ['GEMINI_API_KEY', 'SMTP_USER', 'SMTP_PASS'];

// Verify crucial required credentials on startup
requiredEnv.forEach(key => {
  if (!process.env[key]) {
    console.error(`[FATAL] Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const nodeEnv = process.env.NODE_ENV || 'development';

const env = {
  nodeEnv,
  port: parseInt(process.env.PORT, 10) || 8080,
  geminiApiKey: process.env.GEMINI_API_KEY,
  corsOrigin: process.env.CORS_ORIGIN || (nodeEnv === 'production' ? 'https://sahaduddin.github.io' : 'http://localhost:4200,http://localhost:3000'),
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio',
    connectionLimit: parseInt(process.env.DB_CONN_LIMIT, 10) || 5,
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_TO 
      ? process.env.CONTACT_TO.split(',').map(e => e.trim()) 
      : [process.env.SMTP_USER]
  },
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL || 'https://erp.averiqa.com/api/v01/wh-saas/cloud-messages/send',
    from: process.env.WHATSAPP_FROM || '918345984810',
    apiToken: process.env.WHATSAPP_API_TOKEN,
    developerNumber: process.env.DEVELOPER_WHATSAPP_NUMBER || '918345984810'
  }
};

module.exports = env;
