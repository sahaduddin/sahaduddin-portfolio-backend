const https = require('https');
const env = require('../config/env');
const logger = require('../config/logger');

class WhatsAppService {
  constructor() {
    this.apiUrl = env.whatsapp.apiUrl;
    this.from = env.whatsapp.from;
    this.apiToken = env.whatsapp.apiToken;
    this.developerNumber = env.whatsapp.developerNumber;
  }

  /**
   * Sends a WhatsApp message using the Averiqa ERP Cloud Messages API
   * @param {string} to - The recipient's phone number with country code (e.g. 91XXXXXXXXXX)
   * @param {string} messageText - The body of the WhatsApp message
   * @returns {Promise<boolean>}
   */
  async sendMessage(to, messageText) {
    if (!this.apiToken) {
      logger.warn('[WhatsApp Service] API Token is missing. Skipping WhatsApp notification.');
      return false;
    }

    if (!to) {
      logger.warn('[WhatsApp Service] Recipient number (to) is missing. Skipping WhatsApp notification.');
      return false;
    }

    // Prepare standard JSON payload for WhatsApp SaaS
    const payload = JSON.stringify({
      from: this.from,
      to: to,
      body: messageText,
      message: messageText, // Providing both 'body' and 'message' to support different API versions
      token: this.apiToken, // Body parameter variations
      api_token: this.apiToken,
      app_token: this.apiToken
    });

    // Parse the Averiqa API URL
    const urlObj = new URL(this.apiUrl);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiToken}`,
        'x-api-key': this.apiToken, // Alternate standard API token header
        'x-api-token': this.apiToken,
        'x-app-token': this.apiToken,
        'app-token': this.apiToken,
        'app_token': this.apiToken,
        'api_token': this.apiToken,
        'token': this.apiToken,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    logger.info(`[WhatsApp Service] Sending alert to ${to} via Averiqa Gateway...`);

    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
          responseBody += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            logger.info(`[WhatsApp Service] Message delivered successfully. Code: ${res.statusCode}`);
            resolve(true);
          } else {
            logger.error(`[WhatsApp Service] API response failed. Code: ${res.statusCode}, Body: ${responseBody}`);
            resolve(false);
          }
        });
      });

      req.on('error', (err) => {
        logger.error('[WhatsApp Service] Request error occurred while sending WhatsApp message', err);
        resolve(false);
      });

      // Write payload and close request
      req.write(payload);
      req.end();
    });
  }

  /**
   * Helper to format and send a real-time lead alert to the developer
   * @param {Object} formData - Form details (name, email, projectType, budget, message)
   * @param {string} aiSummary - AI-generated message summary
   * @returns {Promise<boolean>}
   */
  async sendAdminAlert(formData, aiSummary) {
    const { name, email, projectType, budget } = formData;
    
    const alertMessage = `⚡ *New Contact Lead Alert!* ⚡\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `💼 *Project:* ${projectType || 'N/A'}\n` +
      `💰 *Budget:* ${budget || 'N/A'}\n\n` +
      `🤖 *AI Summary:* \n${aiSummary}\n\n` +
      `📬 _Check your email or dashboard for full details._`;

    return this.sendMessage(this.developerNumber, alertMessage);
  }
}

module.exports = new WhatsAppService();
