import { Router, type IRouter } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router: IRouter = Router();

const SYSTEM_INSTRUCTION = `You are a linguistic archaeologist. The user will give you a thematic concept for a sound or language (e.g., "spooky cave talk"). Your job is to identify a real historical, extinct, or mythological language that fits this theme (e.g., "Nahuatl", "Akkadian", "Old Norse").

You must return a raw JSON array containing exactly three objects. Each object represents a highly targeted search query for a specific database.

The JSON format MUST be exactly this:
[
  { "site": "wikipedia.org", "query": "[Language Name] phonology history acoustics" },
  { "site": "phoible.org", "query": "[Language Name] phonetic inventory consonants vowels" },
  { "site": "en.wiktionary.org", "query": "[Language Name] IPA pronunciation etymology" }
]
Do not include markdown formatting like \`\`\`json. Return ONLY the raw array.`;

router.post("/research", async (req, res) => {
  const { userPrompt } = req.body as { userPrompt?: string };

  if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
    res.status(400).json({ error: "userPrompt is required" });
    return;
  }

  const apiKey = process.env["GEMINI_SECRET"];
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_SECRET is not configured" });
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const result = await model.generateContent(userPrompt.trim());
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);

    res.json({ queries: parsed });
  } catch (err) {
    console.error("[research] Gemini error:", err);
    res.status(500).json({ error: "Failed to generate research queries" });
  }
});

export default router;
