import { Router } from "express";
import { ElevenLabsClient } from "elevenlabs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import FirecrawlApp from "@mendable/firecrawl-js";

const router = Router();

const conversationHistories = new Map<string, { role: string; parts: { text: string }[] }[]>();

interface GatekeeperResult {
  action: "TALK" | "SEARCH";
  category: string | null;
  query: string | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function cleanAndParseJSON(raw: string): { phonetic: string; english: string } | null {
  const attempts = [
    raw,
    raw.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim(),
    raw.replace(/```[\w]*\s*/g, "").replace(/```/g, "").trim(),
  ];
  for (const attempt of attempts) {
    try {
      const parsed = JSON.parse(attempt);
      if (typeof parsed.phonetic === "string" && typeof parsed.english === "string") {
        return parsed as { phonetic: string; english: string };
      }
    } catch {
      // try next
    }
  }
  return null;
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

async function fetchMemoryFragment(
  firecrawlKey: string,
  genAI: GoogleGenerativeAI,
  query: string,
  languageName: string,
): Promise<string | null> {
  try {
    const firecrawl = new FirecrawlApp({ apiKey: firecrawlKey });
    const searchResult = await firecrawl.search(query, {
      limit: 1,
      scrapeOptions: { formats: ["markdown"] },
    });

    const raw = searchResult as Record<string, unknown>;
    const dataArr = Array.isArray(raw.data) ? raw.data : Array.isArray(raw.web) ? raw.web : [];
    const firstResult = dataArr[0] as Record<string, unknown> | undefined;
    const markdown = (firstResult?.markdown as string) ?? "";

    if (!markdown.trim()) {
      console.warn("[RAG] Firecrawl returned no markdown content");
      return null;
    }

    // ── Firecrawl raw result log ───────────────────────────────────────────────
    console.log(
      `\n${"=".repeat(52)}\n` +
      `=== [!] ANCIENT MEMORY RECOVERY: FIRECRAWL DATA ===\n` +
      `${"=".repeat(52)}\n` +
      `QUERY: ${query}\n` +
      `${"─".repeat(52)}\n` +
      `${markdown.substring(0, 1500)}${markdown.length > 1500 ? "..." : ""}\n` +
      `${"=".repeat(52)}\n` +
      `=== [!] END OF RECOVERED DATA ===\n` +
      `${"=".repeat(52)}\n`,
    );

    const truncated = markdown.length > 8000 ? markdown.slice(0, 8000) + "\n[TRUNCATED]" : markdown;
    console.log(`[RAG] Firecrawl returned ${markdown.length} chars — summarizing with gemini-2.5-flash-lite`);

    const summaryModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: `You are a neural processor. Summarize the following web data into a 2-3 sentence "Memory Fragment" that directly answers the user's query about the ${languageName} culture. Focus on historical facts, specific recipes, or poetic structures found in the text.`,
    });

    const summaryResult = await summaryModel.generateContent(truncated);
    const fragment = summaryResult.response.text().trim();
    console.log(`[RAG] Memory Fragment: "${fragment.slice(0, 120)}..."`);
    return fragment;
  } catch (err) {
    console.error("[RAG] Firecrawl/summarization failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

async function runEntityChat(
  model: ReturnType<InstanceType<typeof GoogleGenerativeAI>["getGenerativeModel"]>,
  agentId: string,
  messageToSend: string,
  originalUserMessage: string,
  languageName: string,
  systemPrompt: string | undefined,
  phoneticRules: string | undefined,
): Promise<{ phonetic: string; english: string }> {
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

  const result = await chat.sendMessage(messageToSend);
  const rawResponse = result.response.text();
  console.log(`[interrogate] Gemini raw response: ${rawResponse.slice(0, 300)}`);

  // Store the original user message in history (not the injected version)
  history.push(
    { role: "user", parts: [{ text: originalUserMessage }] },
    { role: "model", parts: [{ text: rawResponse }] },
  );
  if (history.length > 20) history = history.slice(-20);
  conversationHistories.set(agentId, history);

  const parsed = cleanAndParseJSON(rawResponse);
  if (parsed) {
    return parsed;
  }

  // Final fallback — model didn't return JSON at all
  console.error("[interrogate] Could not parse JSON from response, using raw text");
  return { phonetic: rawResponse, english: rawResponse };
}

async function synthesizeTTS(
  elevenKey: string,
  voiceId: string,
  phonetic: string,
): Promise<string> {
  const elevenClient = new ElevenLabsClient({ apiKey: elevenKey });
  const ttsText = phonetic.slice(0, 300) || "...";
  const ttsResponse = await elevenClient.textToSpeech.convert(voiceId, {
    text: ttsText,
    model_id: "eleven_multilingual_v2",
  });

  const chunks: Buffer[] = [];
  for await (const chunk of ttsResponse as AsyncIterable<Buffer>) {
    chunks.push(Buffer.from(chunk));
  }
  const audioBase64 = Buffer.concat(chunks).toString("base64");
  console.log(`[interrogate] TTS generated: ${audioBase64.length} base64 chars`);
  return audioBase64;
}

// ── Route ──────────────────────────────────────────────────────────────────────

interface ChatEntry {
  role: "user" | "assistant";
  message: string;
}

function buildHistoryBlock(history: ChatEntry[]): string {
  if (!history.length) return "";
  const log = history
    .map((h) => `${h.role === "user" ? "HUMAN" : "ENTITY"}: ${h.message}`)
    .join("\n");
  return `[CONVERSATION HISTORY]:\n${log}\n${"─".repeat(40)}\n`;
}

router.post("/interrogate", async (req, res) => {
  const { agentId, voiceId, userMessage, languageName, systemPrompt, phoneticRules, history } = req.body as {
    agentId?: string;
    voiceId?: string;
    userMessage?: string;
    languageName?: string;
    systemPrompt?: string;
    phoneticRules?: string;
    history?: ChatEntry[];
  };

  if (!agentId?.trim() || !voiceId?.trim() || !userMessage?.trim()) {
    res.status(400).json({ error: "agentId, voiceId, and userMessage are all required" });
    return;
  }

  const elevenKey = process.env.ELEVEN_SECRET;
  const geminiKey = process.env.GEMINI_SECRET;
  const firecrawlKey = process.env["FIRECRAWL_SECRET"] ?? process.env["FIRECRWL_SECRECT"];

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
    console.log(`[GATEKEEPER] Action: ${gate.action}${gate.query ? ` | Query: ${gate.query}` : ""}`);

    let messageToSend: string;
    let memoryFragment: string | null = null;

    // Sanitise and cap the frontend conversation history to the last 6 exchanges (12 items)
    const safeHistory: ChatEntry[] = Array.isArray(history) ? history.slice(-12) : [];
    const historyBlock = buildHistoryBlock(safeHistory);

    // ── Step 2: RAG Pipeline (SEARCH branch) ──────────────────────────────────
    if (gate.action === "SEARCH" && gate.query && firecrawlKey) {
      memoryFragment = await fetchMemoryFragment(firecrawlKey, genAI, gate.query, languageName || "this culture");

      if (memoryFragment) {
        messageToSend =
          historyBlock +
          `[SYSTEM OVERRIDE]: You just recovered an ancient memory. Use these facts to answer the user: "${memoryFragment}".\n` +
          `[USER ASKS]: "${userMessage}"\n` +
          `[CRITICAL INSTRUCTION]: Answer using the facts, but stay completely in your ancient, cryptic persona. Do not mention "archives", "web", or "search". You must output ONLY valid JSON in this format: { "phonetic": "...", "english": "..." }`;
        console.log("[RAG] Injected memory fragment into entity message");
      } else {
        // Firecrawl failed or empty — fall back to plain TALK
        console.warn("[RAG] No memory fragment retrieved — falling back to TALK");
        messageToSend = historyBlock
          ? `${historyBlock}[NEW HUMAN INPUT]: "${userMessage}"\n[SYSTEM INSTRUCTION]: Use the history for context. Answer the new input in your ancient persona. Return JSON: { "phonetic": "...", "english": "..." }.`
          : userMessage;
      }
    } else {
      // TALK branch — inject history context when available
      messageToSend = historyBlock
        ? `${historyBlock}[NEW HUMAN INPUT]: "${userMessage}"\n[SYSTEM INSTRUCTION]: Use the history for context. Answer the new input in your ancient persona. Return JSON: { "phonetic": "...", "english": "..." }.`
        : userMessage;
    }

    // ── Step 3: Entity Response via Gemini Chat ────────────────────────────────
    const { phonetic, english } = await runEntityChat(
      model,
      agentId,
      messageToSend,
      userMessage,
      languageName || "an ancient language",
      systemPrompt,
      phoneticRules,
    );

    // ── Step 4: TTS Synthesis ──────────────────────────────────────────────────
    let audioBase64 = "";
    try {
      audioBase64 = await synthesizeTTS(elevenKey, voiceId, phonetic);
    } catch (ttsErr) {
      console.error("[interrogate] TTS failed (returning text-only):", ttsErr instanceof Error ? ttsErr.message : ttsErr);
    }

    // ── Step 5: Respond ────────────────────────────────────────────────────────
    res.json({
      phonetic,
      english,
      audioBase64,
      telemetry: memoryFragment ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[interrogate] Error:", message);
    res.status(500).json({ error: message });
  }
});

export default router;
