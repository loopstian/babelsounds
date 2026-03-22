import { Router, type IRouter } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import FirecrawlApp from "@mendable/firecrawl-js";

const router: IRouter = Router();

const QUERY_INSTRUCTION = `You are a linguistic archaeologist. The user will give you a thematic concept for a sound or language (e.g., "spooky cave talk"). Your job is to identify a real historical, extinct, or mythological language that fits this theme (e.g., "Nahuatl", "Akkadian", "Old Norse").

You must return a raw JSON array containing exactly three objects. Each object represents a highly targeted search query for a specific database.

The JSON format MUST be exactly this:
[
  { "site": "wikipedia.org", "query": "[Language Name] phonology history acoustics" },
  { "site": "phoible.org", "query": "[Language Name] phonetic inventory consonants vowels" },
  { "site": "en.wiktionary.org", "query": "[Language Name] IPA pronunciation etymology" }
]
Do not include markdown formatting like \`\`\`json. Return ONLY the raw array.`;

const SYNTHESIS_INSTRUCTION = `You are a Master Linguistic Archaeologist. Your task is to analyze the provided scraped text from Wikipedia, PHOIBLE, and Wiktionary to reconstruct a "Language Signal".

You must output a single, valid JSON object following this exact schema:
{
  "id": "unique_string",
  "name": "Full Language Name",
  "matchScore": number (1-100, how well it fits user intent),
  "lexiconSample": { "word": "example_word", "type": "noun/verb", "ipa": "/phonetic/", "meaning": "translation" },
  "phoneticInventory": ["symbol1", "symbol2", ...],
  "acousticConsensus": "A 2-3 sentence summary of the sound and history",
  "culturalContext": "Era and Region",
  "vocalBlueprint": "A highly descriptive ElevenLabs prompt (e.g., A deep, raspy ancient voice...)",
  "typingGuide": "Short rules for the user: Use k, q, avoid f...",
  "sources": ["url1", "url2", ...],
  "systemPrompt": "A rich character prompt for the AI voice entity — an ancient being trapped in a digital terminal. Include how it addresses the user, its personality, its relationship to the language and mythology. Never break character.",
  "firstMessage": "The entity's opening line when the user first enters the interrogation room — cryptic, atmospheric, in-character."
}

Only use facts found in the provided text. If PHOIBLE data is missing, use your internal knowledge to provide a highly probable phonetic inventory for that specific language. Return ONLY the raw JSON.`;

router.post("/research", async (req, res) => {
  const { userPrompt } = req.body as { userPrompt?: string };

  if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
    res.status(400).json({ error: "userPrompt is required" });
    return;
  }

  const geminiKey = process.env["GEMINI_SECRET"];
  if (!geminiKey) {
    res.status(500).json({ error: "GEMINI_SECRET is not configured" });
    return;
  }

  const firecrawlKey = process.env["FIRECRAWL_SECRET"] ?? process.env["FIRECRWL_SECRECT"];
  if (!firecrawlKey) {
    res.status(500).json({ error: "FIRECRAWL_SECRET is not configured" });
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiKey);

    const queryModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: QUERY_INSTRUCTION,
    });

    const geminiResult = await queryModel.generateContent(userPrompt.trim());
    const text = geminiResult.response.text().trim();
    const queries: { site: string; query: string }[] = JSON.parse(text);
    console.log("[research] Gemini queries:", queries);

    const firecrawl = new FirecrawlApp({ apiKey: firecrawlKey });

    const scrapedResults = await Promise.all(
      queries.map(async (item) => {
        try {
          const searchResult = await firecrawl.search(
            `site:${item.site} ${item.query}`,
            {
              limit: 1,
              scrapeOptions: { formats: ["markdown"] },
            },
          );
          const raw = searchResult as Record<string, unknown>;
          const webArr = Array.isArray(raw.data) ? raw.data : Array.isArray(raw.web) ? raw.web : [];
          const firstResult = webArr[0] as Record<string, unknown> | undefined;
          const markdown: string = (firstResult?.markdown as string) ?? "";
          const url: string = (firstResult?.url as string) ?? "";
          return { site: item.site, query: item.query, markdown, url };
        } catch (crawlErr) {
          console.error(
            `[research] Firecrawl error for ${item.site}:`,
            crawlErr,
          );
          return { site: item.site, query: item.query, markdown: "", url: "" };
        }
      }),
    );

    console.log(
      "[research] Scrape complete:",
      scrapedResults.map((r) => ({
        site: r.site,
        chars: r.markdown.length,
      })),
    );

    const wikiData = scrapedResults.find((r) => r.site === "wikipedia.org")?.markdown ?? "";
    const phoibleData = scrapedResults.find((r) => r.site === "phoible.org")?.markdown ?? "";
    const wiktData = scrapedResults.find((r) => r.site === "en.wiktionary.org")?.markdown ?? "";

    const truncate = (s: string, max: number) => s.length > max ? s.slice(0, max) + "\n[TRUNCATED]" : s;

    const synthesisPrompt = `User's original request: "${userPrompt.trim()}"

--- Wikipedia data ---
${truncate(wikiData, 30000)}

--- PHOIBLE data ---
${truncate(phoibleData, 10000)}

--- Wiktionary data ---
${truncate(wiktData, 15000)}

Analyze the above scraped data and produce the Language Signal JSON.`;

    console.log("[research] Starting synthesis with gemini-2.5-flash...");

    const synthesisModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYNTHESIS_INSTRUCTION,
    });

    const synthesisResult = await synthesisModel.generateContent(synthesisPrompt);
    let synthesisText = synthesisResult.response.text().trim();

    if (synthesisText.startsWith("```")) {
      synthesisText = synthesisText.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    const languageSignal = JSON.parse(synthesisText);

    const requiredFields = ["id", "name", "matchScore", "lexiconSample", "phoneticInventory", "acousticConsensus", "culturalContext", "vocalBlueprint", "typingGuide", "systemPrompt", "firstMessage"];
    for (const field of requiredFields) {
      if (!(field in languageSignal)) {
        throw new Error(`Synthesis output missing required field: ${field}`);
      }
    }

    languageSignal.sources = scrapedResults
      .map((r) => r.url)
      .filter((u) => u.length > 0);

    console.log("[research] Synthesis complete:", languageSignal.name, "— match:", languageSignal.matchScore);

    res.json({ signal: languageSignal });
  } catch (err) {
    console.error("[research] Pipeline error:", err);
    res.status(500).json({ error: "Research pipeline failed" });
  }
});

export default router;
