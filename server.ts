import express from "express";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { createServer as createViteServer } from "vite";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API routes FIRST
  app.post("/api/analyze", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Missing imageBase64" });
      }

      // Remove the data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const prompt = `You are a civic infrastructure analysis agent for "Community GO".
Analyze this civic infrastructure photo.
Return STRICT JSON matching this schema exactly, with NO markdown formatting, NO backticks, NO extra text:
{
  "category": "POTHOLE" | "GARBAGE" | "ROAD_DAMAGE" | "DRAINAGE" | "WATER_LEAK" | "STREETLIGHT" | "TRAFFIC_SIGNAL" | "OTHER",
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "authorityDept": "BBMP" | "BWSSB" | "BESCOM" | "BTP" | "OTHER",
  "title": "Short descriptive title (max 50 chars)",
  "description": "Detailed description of the issue based on the photo",
  "confidence": number (0-100),
  "safetyTips": "One short sentence safety tip for citizens",
  "estimatedImpact": "Short description of impact, e.g., 'Affects 100+ commuters daily'"
}

Routing rules:
- POTHOLE / GARBAGE / ROAD_DAMAGE / DRAINAGE -> BBMP
- WATER_LEAK -> BWSSB
- STREETLIGHT -> BESCOM
- TRAFFIC_SIGNAL -> BTP
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      let responseText = response.text || "{}";
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

      try {
        const analysis = JSON.parse(responseText);
        res.json({ analysis });
      } catch (parseError) {
        console.error("Failed to parse JSON:", responseText);
        res.json({
          analysis: {
            category: "OTHER",
            severity: "MEDIUM",
            authorityDept: "BBMP",
            title: "Uncategorized Civic Issue",
            description: "Issue reported by citizen. Awaiting manual review.",
            confidence: 50,
            safetyTips: "Please stay clear of the affected area.",
            estimatedImpact: "Unknown impact."
          }
        });
      }

    } catch (error) {
      console.error("AI Analysis Error:", error);
      // Fallback response when AI is unavailable
      res.json({
        analysis: {
          category: "OTHER",
          severity: "MEDIUM",
          authorityDept: "BBMP",
          title: "Uncategorized Civic Issue",
          description: "Issue reported by citizen. AI analysis unavailable due to high demand.",
          confidence: 50,
          safetyTips: "Please stay clear of the affected area.",
          estimatedImpact: "Unknown impact."
        }
      });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:\${PORT}`);
  });
}

startServer();
