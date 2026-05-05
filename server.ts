import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security: Set security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for Vite dev server compatibility
      crossOriginEmbedderPolicy: false,
    })
  );

  // Trust proxy for rate limiting behind reverse proxy
  app.set("trust proxy", 1);

  // Rate Limiting
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Too many requests from this scroll, please wait." },
  });

  const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5, // Limit each IP to 5 contact requests per hour
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Our scribes are busy. Please try again after an hour." },
  });

  const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 20, // Limit each IP to 20 AI requests per hour
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "The digital library has reached its hourly limit for your region." },
  });

  app.use("/api/", globalLimiter);
  app.use(express.json({ limit: "5mb" })); // Increased limit for base64 images
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));

  // AI Client setup
  let aiClient: any = null;
  const getAiClient = () => {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
      aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
  };

  // Contact form endpoint
  app.post("/api/contact", contactLimiter, async (req, res) => {
    const { name, institution, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Basic sanitization/length checks
    if (name.length > 100 || (institution && institution.length > 200) || email.length > 150 || message.length > 5000) {
      return res.status(400).json({ error: "Manuscript too large or names too long." });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.EMAIL_PORT || "465"),
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: "arpitpal0412@gmail.com",
        replyTo: email,
        subject: `New Message from Professor Anjan Kumar Pal Website: ${name}`,
        text: `Name: ${name}\nInstitution: ${institution}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h3>New Message Request</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Institution:</strong> ${institution || "N/A"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <br/>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      };

      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.json({ 
          success: true, 
          simulated: true,
          message: "Message received (Simulation). Please set up EMAIL_USER and EMAIL_PASS in Secrets to enable actual delivery." 
        });
      }

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Thank you. Your message has been sent." });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Ancient scrolls could not be delivered." });
    }
  });

  // AI History Proxy
  app.post("/api/ai/history", aiLimiter, async (req, res) => {
    const { country } = req.body;
    if (!country) return res.status(400).json({ error: "No country provided" });

    try {
      const ai = getAiClient();
      const prompt = `Act as an expert historian. Provide a concise, evocative, and deep historical overview of ${country} and its global influence. Focus on architectural marvels, philosophical shifts, and legacy. Keep it around 150 words. Format with short paragraphs and a poetic but scholarly tone.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      if (response && response.text) {
        res.json({ text: response.text });
      } else {
        throw new Error("No response from AI library.");
      }
    } catch (error: any) {
      console.error("AI History Error:", error);
      if (error.message === "GEMINI_API_KEY_MISSING") {
        res.status(500).json({ error: "GEMINI_API_KEY_MISSING" });
      } else {
        res.status(500).json({ error: "Failed to consult the archives." });
      }
    }
  });

  // AI Blog Proxy
  app.post("/api/ai/blog", aiLimiter, async (req, res) => {
    const { topic, tone, length } = req.body;
    if (!topic) return res.status(400).json({ error: "No topic provided" });

    try {
      const ai = getAiClient();
      const prompt = `Act as Dr. Anjan Kumar Pal, a distinguished professor of Indian History. 
      Generate a blog post draft about: "${topic}".
      Tone: ${tone}.
      Desired Length: ${length} (Short: ~150 words, Medium: ~350 words, Long: ~600 words).
      Provide a compelling title followed by the draft content. 
      Format with clear paragraphs. Use evocative but accurate historical language.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      if (response && response.text) {
        res.json({ text: response.text });
      } else {
        throw new Error("No response from AI library.");
      }
    } catch (error: any) {
      console.error("AI Blog Error:", error);
      if (error.message === "GEMINI_API_KEY_MISSING") {
        res.status(500).json({ error: "GEMINI_API_KEY_MISSING" });
      } else {
        res.status(500).json({ error: "Failed to generate blog manuscript." });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
