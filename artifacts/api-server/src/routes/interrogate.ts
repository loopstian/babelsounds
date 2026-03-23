import { Router } from "express";
import { ElevenLabsClient } from "elevenlabs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

const conversationHistories = new Map<string, { role: string; parts: { text: string }[] }[]>();

interface GatekeeperResult {
  action: "TALK" | "SEARCH";
  category: string | null;
  query: string | null;
}

async function runGatekeeper(
  model: ReturnType<InstanceType<typeof GoogleGenerativeAI>["getGenerativeModel"]>,
  userMessage: string,
  languageName: string,
): Promise<GatekeeperResult> {
  const gatekeeperInstruction = `You are a Research Coordinator for an Archaeological AI. Analyze the user's message to an ancient entity.
Determine if the message requires specific historical, cultural, or artistic knowledge (e.g., questions about food, poetry, combat, geography, or rituals).
If the message is simple small talk (e.g., "Hi", "Who are you?", "You are scary"), return this JSON: {"action": "TALK", "category": null, "query": null}.
If the message requires specific knowledge, return this JSON: {"action": "SEARCH", "category": "FOOD|POETRY|COMBAT|HISTORY|OTHER", "query": "a highly specific search query to find the answer on the web regarding the ${languageName} culture"}.
Return ONLY the raw JSON.`;

  const gateChat = model.startChat({
    history: [
      { role: "user", parts: [{ text: gatekeeperInstruction }] },
      { role: "model", parts: [{ text: '{"action":"TALK","category":null,"query":null}' }] },
    ],
  });

  const gateResult = await gateChat.sendMessage(userMessage);
  const raw = gateResult.response.text().replace(/```json\s*/g, "").replace(/```/g, "").trim();

  try {
    const parsed = JSON.parse(raw) as GatekeeperResult;
    return parsed;
  } catch {
    return { action: "TALK", category: null, query: null };
  }
}

router.post("/interrogate", async (req, res) => {
  const { agentId, voiceId, userMessage, languageName, systemPrompt, phoneticRules } = req.body as {
    agentId?: string;
    voiceId?: string;
    userMessage?: string;
    languageName?: string;
    systemPrompt?: string;
    phoneticRules?: string;
  };

  if (!agentId?.trim() || !voiceId?.trim() || !userMessage?.trim()) {
    res.status(400).json({ error: "agentId, voiceId, and userMessage are all required" });
    return;
  }

  const elevenKey = process.env.ELEVEN_SECRET;
  const geminiKey = process.env.GEMINI_SECRET;
  if (!elevenKey || !geminiKey) {
    res.status(500).json({ error: "API keys not configured on server" });
    return;
  }

  console.log(`[interrogate] User message to agent ${agentId}: "${userMessage.slice(0, 100)}"`);

  try {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ── Step 1: Intent Gatekeeper ──────────────────────────────────────────────
    const gate = await runGatekeeper(model, userMessage, languageName || "an ancient culture");

    if (gate.action === "SEARCH") {
      console.log(`[GATEKEEPER] Action: SEARCH | Category: ${gate.category} | Query: ${gate.query}`);
      res.json({
        phonetic: "...",
        english: `SYSTEM: [SEARCH_REQUIRED] - Querying ancient archives for: ${gate.query}`,
        audioBase64: null,
      });
      return;
    }

    console.log(`[GATEKEEPER] Action: TALK`);

    // ── Step 2: Entity Response via Gemini Chat ────────────────────────────────
    const entityPrompt = `You are an ancient entity speaking ${languageName || "an ancient language"}. ${systemPrompt || "You are trapped in a digital terminal. Your personality is intimidating, cryptic, and ancient."}

CRITICAL RULES:
- You must respond ONLY in valid JSON format: { "phonetic": "[Your response in the native phonetic tongue]", "english": "[The English translation of what you said]" }
- The "phonetic" field must use these phonetic rules: ${phoneticRules || "Use IPA-inspired phonetic transcription"}
- The "english" field is the translation of your phonetic response
- Stay in character as an ancient, cryptic entity
- Keep responses between 1-3 sentences
- Do not include any text outside the JSON object`;

    let history = conversationHistories.get(agentId) || [];

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: entityPrompt }] },
        { role: "model", parts: [{ text: '{"phonetic": "understood", "english": "I await your words, seeker."}' }] },
        ...history,
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const rawResponse = result.response.text();
    console.log(`[interrogate] Gemini raw response: ${rawResponse.slice(0, 300)}`);

    history.push(
      { role: "user", parts: [{ text: userMessage }] },
      { role: "model", parts: [{ text: rawResponse }] },
    );
    if (history.length > 20) history = history.slice(-20);
    conversationHistories.set(agentId, history);

    let phonetic = "";
    let english = "";
    try {
      const cleaned = rawResponse.replace(/```json\s*/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      phonetic = parsed.phonetic ?? "";
      english = parsed.english ?? "";
    } catch {
      phonetic = rawResponse;
      english = rawResponse;
    }

    // ── Step 3: TTS Synthesis ──────────────────────────────────────────────────
    let audioBase64 = "";
    const elevenClient = new ElevenLabsClient({ apiKey: elevenKey });
    try {
      const ttsText = phonetic.slice(0, 300) || "...";
      const ttsResponse = await elevenClient.textToSpeech.convert(voiceId, {
        text: ttsText,
        model_id: "eleven_multilingual_v2",
      });

      const chunks: Buffer[] = [];
      for await (const chunk of ttsResponse as AsyncIterable<Buffer>) {
        chunks.push(Buffer.from(chunk));
      }
      audioBase64 = Buffer.concat(chunks).toString("base64");
      console.log(`[interrogate] TTS generated: ${audioBase64.length} base64 chars for ${ttsText.length} chars of phonetic text`);
    } catch (ttsErr) {
      console.error("[interrogate] TTS failed (returning text-only):", ttsErr instanceof Error ? ttsErr.message : ttsErr);
    }

    res.json({ phonetic, english, audioBase64 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[interrogate] Error:", message);
    res.status(500).json({ error: message });
  }
});

export default router;
