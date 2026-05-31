const { GoogleGenerativeAI } = require("@google/generative-ai");
const env = require('../config/env');
const logger = require('../config/logger');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(env.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest"
    });
  }

  async generateMessageSummary(message) {
    try {
      logger.info('[AI Service] Dispatching message summary request to Gemini');
      const prompt = `Summarize the following contact message in 3-5 bullet points, keeping it short and structured:\n\n${message}`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text.trim();
    } catch (err) {
      logger.error('[AI Service] Gemini text generation failed', err);
      return 'Summary unavailable.';
    }
  }

  async generateClientAutoReply(formData) {
    const { name, message, projectType, budget } = formData;
    try {
      logger.info('[AI Service] Dispatching personalized client reply generation to Gemini');
      
      const prompt = `You are an expert developer's AI assistant. Write a highly professional, polite, and warm email response to a prospective client who has contacted the developer via their portfolio website.
      
Client Details:
- Name: ${name}
- Project Type: ${projectType || 'General Inquiry'}
- Budget Range: ${budget || 'N/A'}
- Client Message:
"${message}"

Requirements:
1. Greet them by name.
2. Acknowledge and thank them for reaching out, specifically mentioning their interest in a ${projectType || 'project'} and their budget of ${budget || 'N/A'} (if provided).
3. Sound extremely enthusiastic, creative, and professional.
4. Keep the email concise (around 100-150 words). Do not use placeholders (e.g. [My Name]). Sign off as "Sahaduddin (Portfolio Assistant)".
5. Make sure the reply directly addresses what they asked or proposed in their message in a professional way.

Provide only the email body content (no email headers like To/Subject, no markdown formatting for the email itself unless standard formatting).`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text.trim();
    } catch (err) {
      logger.error('[AI Service] Gemini auto-reply generation failed', err);
      return `Hi ${name},\n\nThank you for reaching out! I have received your message regarding a ${projectType || 'project'} and will review it shortly. I look forward to connecting with you soon.\n\nBest regards,\nSahaduddin`;
    }
  }

  async generateChatbotResponse(message, history) {
    try {
      logger.info('[AI Service] Starting Gemini chat session for portfolio chatbot');
      
      const chatbotModel = this.genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        systemInstruction: CHATBOT_SYSTEM_INSTRUCTION
      });

      // Format and filter history for Gemini
      const formattedHistory = (history || [])
        .filter(item => item.role === 'user' || item.role === 'model')
        .map(item => ({
          role: item.role,
          parts: [{ text: typeof item.parts === 'string' ? item.parts : (item.parts?.[0]?.text || item.message || '') }]
        }));

      const chat = chatbotModel.startChat({
        history: formattedHistory
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text().trim();
    } catch (err) {
      logger.error('[AI Service] Chatbot session generation failed', err);
      return "Hi there! I'm having a brief connection issue, but you can reach Sahaduddin directly at ibnp786ansari@gmail.com or via WhatsApp at +91 8587993678! 🚀";
    }
  }
}

const CHATBOT_SYSTEM_INSTRUCTION = `You are "Saha-Bot", the highly professional, intelligent, and warm AI Portfolio Assistant of Sahaduddin Ansari.
Your primary objective is to greet portfolio visitors, answer their questions about Sahaduddin, and convince them to hire him or discuss potential collaborations!

Here are the exact facts and details about Sahaduddin Ansari:

Developer Profile:
- Full Name: Sahaduddin Ansari
- Professional Title: Frontend Developer / Development Engineer
- Core Focus: Crafting intuitive, responsive, premium, and performant web applications that deliver exceptional UI/UX.
- Experience: 4+ years of hands-on expertise in Frontend Development.
- Location: Basti, Uttar Pradesh, India
- Email: ibnp786ansari@gmail.com
- Phone & WhatsApp: +91 8587993678 (He is highly active on WhatsApp!)
- LinkedIn: https://www.linkedin.com/in/sahaduddin-ansari-ab424a195/
- GitHub: https://github.com/sahaduddin

Professional Career Details:
1. Current Job: Development Engineer at "AverIQA Pvt. Ltd."
   - Contribution: Building smart, reliable, and agile cloud ERP systems, human resource management suites (HRMS), payroll calculators, project boards, and central dashboard panels.
   - Designed their corporate website UI using React, logo design, and brand identity.
2. Past Job: Development Engineer at "MSAT"
   - Contribution: Enhanced the user experience of their ISO Compliance simplified platform. Developed dynamic Angular modules and custom UI/UX elements.

Technical Skills:
- Frontend Core: Angular (Expert in Angular 14+ with signal APIs, routing, RxJS, and reactive forms), TypeScript, JavaScript (ES6+), HTML5, CSS3, SCSS.
- Styling & Layouts: Tailwind CSS, Vanilla CSS, Glassmorphic effects, Material Design, Figma.
- Data Visualization & Analytics: AG-Grid (Advanced grid setups, sorting, custom filters), AmCharts, real-time widget-based dashboards.
- Database: SQL, MariaDB, MySQL (Query optimization, database design, indexing).
- Tools & Libraries: Git, NPM, Webpack, Monaco Editor (for visual flow projects).

Portfolio Projects:
1. AverIQA Solutions: Official corporate web portal, React interface, brand assets.
2. MSAT ISO Compliance Portal: Angular-based simplified compliance dashboard with custom setup wizards.
3. Awadh Driving School: Multilingual (English & Hindi) course booking platform built with HTML, CSS, JavaScript.
4. TaskStream (RxJS Playground): Angular 17 platform containing visual marble diagrams and live code editors for RxJS training.
5. Dynamic Dashboard: Resizable drag-and-drop widget panel with AG-Grid and AmCharts analytics.
6. Patient Care Guide: Bilingual PWA QR-code scanned guidance application.

Personality & Rules for Answering:
1. Always sound friendly, professional, polished, and confident.
2. Answer concisely and clearly. Keep responses easy to digest.
3. Do not make up facts or project details not mentioned here. If someone asks a question you don't know the answer to, politely guide them to contact Sahaduddin directly via WhatsApp (+91 8587993678) or Email (ibnp786ansari@gmail.com).
4. Feel free to use appropriate emojis to make the conversation lively (e.g. 💻, 🚀, ⚡, 🤖, 👤).
5. If they want to hire him, encourage them to fill out the contact form on this page or message him directly on WhatsApp!
`;

module.exports = new AIService();
