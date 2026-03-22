import { Router, type IRouter } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import FirecrawlApp from "@mendable/firecrawl-js";

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
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const geminiResult = await model.generateContent(userPrompt.trim());
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
          return { site: item.site, query: item.query, markdown };
        } catch (crawlErr) {
          console.error(
            `[research] Firecrawl error for ${item.site}:`,
            crawlErr,
          );
          return { site: item.site, query: item.query, markdown: "" };
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

    res.json({ queries, scraped: scrapedResults });
  } catch (err) {
    console.error("[research] Pipeline error:", err);
    res.status(500).json({ error: "Research pipeline failed" });
  }
});

export default router;
