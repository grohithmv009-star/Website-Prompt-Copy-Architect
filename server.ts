import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper to check for API key
const checkApiKey = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in your Secrets panel.");
  }
};

// Endpoint 1: Generate Website Copy for Freelancers (4 pages)
app.post("/api/generate-copy", async (req, res) => {
  try {
    checkApiKey();
    const { targetAudience, goal, businessName, industry, tone, mainOfferings } = req.body;

    if (!targetAudience || !goal || !businessName) {
      return res.status(400).json({ error: "Missing required fields (Target Audience, Goal, Business Name)." });
    }

    const systemInstruction = `You are an expert copywriter, SEO strategist, and conversion rate optimization specialist. 
Your task is to generate complete, high-converting, SEO-optimized website copy and a clear layout structure for a 4-page business website based on the user's inputs.
The tone of voice should be: "${tone || "professional, clear, and concise"}".
The industry is "${industry || "General Business"}".
The business name is "${businessName}".
The primary goal is to "${goal}".
The target audience is "${targetAudience}".
Main offerings/features: "${mainOfferings || "Standard industry services"}".

Return a JSON object matching this schema exactly:
{
  "homepage": {
    "seoTitle": "string",
    "seoDescription": "string",
    "heroSection": {
      "headline": "string",
      "subheadline": "string",
      "ctaText": "string"
    },
    "introduction": {
      "heading": "string",
      "bodyText": "string"
    },
    "features": [
      { "title": "string", "description": "string" },
      { "title": "string", "description": "string" },
      { "title": "string", "description": "string" }
    ],
    "ctaSection": {
      "heading": "string",
      "body": "string",
      "buttonText": "string"
    }
  },
  "aboutUs": {
    "seoTitle": "string",
    "seoDescription": "string",
    "heading": "string",
    "backgroundStory": "string",
    "missionStatement": "string"
  },
  "services": {
    "seoTitle": "string",
    "seoDescription": "string",
    "heading": "string",
    "description": "string",
    "offerings": [
      { "title": "string", "description": "string" },
      { "title": "string", "description": "string" },
      { "title": "string", "description": "string" },
      { "title": "string", "description": "string" }
    ]
  },
  "contact": {
    "seoTitle": "string",
    "seoDescription": "string",
    "heading": "string",
    "introText": "string",
    "ctaText": "string"
  },
  "promptForFreelancer": "string"
}

Provide deep, professional, realistic, fully written copywriting copy. Do NOT use placeholders like '[Insert Name]'. Use the provided Business Name (${businessName}) and tailor every single word specifically to appeal to ${targetAudience} and achieve ${goal}. 
The "promptForFreelancer" property should contain the fully customized version of the prompt requested by the user, populated with their inputs, ready to copy-paste.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Generate the complete website copy and prompt now based on the system instructions.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["homepage", "aboutUs", "services", "contact", "promptForFreelancer"],
          properties: {
            homepage: {
              type: Type.OBJECT,
              required: ["seoTitle", "seoDescription", "heroSection", "introduction", "features", "ctaSection"],
              properties: {
                seoTitle: { type: Type.STRING },
                seoDescription: { type: Type.STRING },
                heroSection: {
                  type: Type.OBJECT,
                  required: ["headline", "subheadline", "ctaText"],
                  properties: {
                    headline: { type: Type.STRING },
                    subheadline: { type: Type.STRING },
                    ctaText: { type: Type.STRING }
                  }
                },
                introduction: {
                  type: Type.OBJECT,
                  required: ["heading", "bodyText"],
                  properties: {
                    heading: { type: Type.STRING },
                    bodyText: { type: Type.STRING }
                  }
                },
                features: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["title", "description"],
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING }
                    }
                  }
                },
                ctaSection: {
                  type: Type.OBJECT,
                  required: ["heading", "body", "buttonText"],
                  properties: {
                    heading: { type: Type.STRING },
                    body: { type: Type.STRING },
                    buttonText: { type: Type.STRING }
                  }
                }
              }
            },
            aboutUs: {
              type: Type.OBJECT,
              required: ["seoTitle", "seoDescription", "heading", "backgroundStory", "missionStatement"],
              properties: {
                seoTitle: { type: Type.STRING },
                seoDescription: { type: Type.STRING },
                heading: { type: Type.STRING },
                backgroundStory: { type: Type.STRING },
                missionStatement: { type: Type.STRING }
              }
            },
            services: {
              type: Type.OBJECT,
              required: ["seoTitle", "seoDescription", "heading", "description", "offerings"],
              properties: {
                seoTitle: { type: Type.STRING },
                seoDescription: { type: Type.STRING },
                heading: { type: Type.STRING },
                description: { type: Type.STRING },
                offerings: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["title", "description"],
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            contact: {
              type: Type.OBJECT,
              required: ["seoTitle", "seoDescription", "heading", "introText", "ctaText"],
              properties: {
                seoTitle: { type: Type.STRING },
                seoDescription: { type: Type.STRING },
                heading: { type: Type.STRING },
                introText: { type: Type.STRING },
                ctaText: { type: Type.STRING }
              }
            },
            promptForFreelancer: { type: Type.STRING }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Error generating copy:", error);
    res.status(500).json({ error: error.message || "An error occurred during copy generation." });
  }
});

// Endpoint 2: Generate Responsive HTML/CSS/JS Landing Page Code
app.post("/api/generate-code", async (req, res) => {
  try {
    checkApiKey();
    const { targetAudience, goal, businessName, industry, tone, mainOfferings, accentColor, visualStyle } = req.body;

    if (!targetAudience || !goal || !businessName) {
      return res.status(400).json({ error: "Missing required fields (Target Audience, Goal, Business Name)." });
    }

    const systemInstruction = `You are a world-class Frontend Developer and UI/UX Designer.
Your task is to generate clean, semantic HTML5, modern CSS3 (using Tailwind CSS CDN for styling and layout, and responsive Flexbox/Grid), and vanilla JavaScript for a modern, responsive, minimalist single-page landing page inspired by the clean style of business-explained.com.

The page MUST include these exact sections:
1. Header: Navigation bar with Logo (text or mini SVG) and links to 'About', 'Services', and 'Contact' that smooth-scroll to sections.
2. Hero Section: Bold H1 headline, short persuasive subheadline, and a primary CTA button that scrolls to Contact or opens a contact modal.
3. Features/Services Section: A beautiful 3-column grid layout with placeholder SVG icons (using heroicons or clean CSS styling), H3 titles, and brief descriptions.
4. Footer: Clean footer with copyright, navigation links, and simple vector social media icon links.
5. Simple Contact Modal/Form: An interactive component so the CTA buttons actually trigger something in the preview.

Tailor the design to:
- Brand Name: "${businessName}"
- Industry: "${industry || "General Business"}"
- Target Audience: "${targetAudience}"
- Goal: "${goal}"
- Accent Color: "${accentColor || "#2563eb"}" (Provide a hex color or tailwind class style like 'blue-600')
- Visual Style / Theme: "${visualStyle || "Minimalist, clean, airy with soft light mode"}"

Important: Keep the styling clean, using a professional color palette with lots of negative space (whites, grays, and the primary accent color). Make sure it looks outstanding on mobile and desktop.

Return a JSON object matching this schema exactly:
{
  "html": "string",
  "css": "string",
  "javascript": "string",
  "combinedHtml": "string",
  "promptForDeveloper": "string"
}

- "html": The semantic body structure inside a <div> or <body>.
- "css": Any custom CSS overrides or animations.
- "javascript": The vanilla JS logic for interactive elements (like modal triggers, mobile menu toggles, form submissions).
- "combinedHtml": A complete, standalone HTML document (including <!DOCTYPE html>, a <head> loading Tailwind CSS CDN and Google Fonts, the styles, the markup, and script tags) so it can be previewed perfectly in an iframe.
- "promptForDeveloper": The fully customized prompt ready to copy-paste.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Generate the complete code and prompt now based on the system instructions.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["html", "css", "javascript", "combinedHtml", "promptForDeveloper"],
          properties: {
            html: { type: Type.STRING, description: "The core semantic HTML elements." },
            css: { type: Type.STRING, description: "Custom CSS styles used." },
            javascript: { type: Type.STRING, description: "Custom vanilla JS." },
            combinedHtml: { type: Type.STRING, description: "Full standalone preview HTML." },
            promptForDeveloper: { type: Type.STRING, description: "The copy-paste developer prompt." }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Error generating code:", error);
    res.status(500).json({ error: error.message || "An error occurred during code generation." });
  }
});

// Vite middleware and asset serving
async function startServer() {
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
