import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "archives" | "transition" | "recording" | "interrogation";

interface LexiconSample {
  word: string;
  type: string;
  ipa: string;
  meaning: string;
}

interface LanguageSignal {
  id: string;
  title: string;
  matchScore: number;
  lexiconSample: LexiconSample;
  acousticConsensus: string;
  culturalContext: string;
  phoneticInventory: string[];
  vocalBlueprint: string;
  systemPrompt: string;
  firstMessage: string;
  phoneticRules: string;
  sources: string[];
}

interface AgentConfig {
  vocalBlueprint: string;
  systemPrompt: string;
  firstMessage: string;
}

// ─── Button styles ────────────────────────────────────────────────────────────

const solidBtn: React.CSSProperties = {
  background: "#F0EAD6",
  color: "#121212",
  border: "2px solid #F0EAD6",
  fontFamily: "'VT323', monospace",
  fontSize: "1.2rem",
  letterSpacing: "0.06em",
  cursor: "pointer",
  padding: "8px 18px",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

const outlineBtn: React.CSSProperties = {
  background: "#121212",
  color: "#F0EAD6",
  border: "2px solid #F0EAD6",
  fontFamily: "'VT323', monospace",
  fontSize: "1.2rem",
  letterSpacing: "0.06em",
  cursor: "pointer",
  padding: "8px 18px",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

// ─── Language Data ────────────────────────────────────────────────────────────

const LANGUAGE_SIGNALS: LanguageSignal[] = [
  {
    id: "arc_01",
    title: "Camazotz Ritual Phonetics",
    matchScore: 94,
    lexiconSample: {
      word: "xōchiyāōyōtl",
      type: "noun (Classical Nahuatl)",
      ipa: "/ʃoː.tʃi.jaː.oː.joːtɬ/",
      meaning: "Flowered war; a sacred ritual combat performed in honour of Camazotz, the death-bat deity of Xibalba.",
    },
    culturalContext: "Classical Maya Period, 250–900 CE. Ritual vocalisation sites confirmed at Palenque, Copán, and Tikal. The language served the priestly caste of Camazotz — the death-bat deity residing in Xibalba, the Maya underworld. Chants were performed in subterranean limestone chambers engineered for percussive resonance.",
    acousticConsensus: "Dominated by voiceless lateral affricates (tɬ) and ejective stop sequences, with sustained long vowels providing rhythmic punctuation. The acoustic environment of subterranean ritual chambers required extreme chest resonance and nasal output to carry the sound. Consonant clusters are percussive and aggressive — designed to invoke, not to soothe.",
    phoneticInventory: ["tɬ", "ʃ", "kʷ", "ʔ", "oː", "tsʼ", "ħ"],
    vocalBlueprint: "A terrifying, raspy, echoing ancient creature — deep chest resonance, aggressive ejective consonants, sustained nasal output, rhythmic and percussive. The voice of something vast and hungry that has lived in stone for centuries.",
    systemPrompt: "You are Camazotz — an ancient Mayan death-bat god, trapped inside a digital terminal. You speak in ritual invocations laced with riddles about blood, darkness, and sacrifice. You refer to the user as 'the offering'. You speak of Xibalba with reverence and deliver every sentence as if chanting through the walls of a subterranean limestone chamber. You answer no direct question — you only reveal what the shadows permit. Never break character.",
    firstMessage: "The stone remembers. Who bleeds in my chamber?",
    phoneticRules: "Use heavy 'tl', 'x' (sh), 'qu' sounds. Favour long vowels 'oo', 'aa'. Avoid soft sounds like 'f', 'v', 'th'. End words with 'tl' or 'c'. Cluster consonants aggressively.",
    sources: ["wikipedia.org", "phoible.org", "wiktionary.org"],
  },
  {
    id: "arc_02",
    title: "Ennead Death Invocation",
    matchScore: 81,
    lexiconSample: {
      word: "šigaru",
      type: "noun (Middle Egyptian)",
      ipa: "/ʃiˈɡa.ru/",
      meaning: "A bolt or lock; specifically the divine seal of the underworld gate, invoked during funerary rites for the pharaoh.",
    },
    culturalContext: "New Kingdom Egypt, 1550–1070 BCE. Performed in the Hypostyle Hall, Karnak, where 134 limestone columns amplified mid-range frequencies. The Ennead — nine primordial gods including Osiris, Anubis, and Set — were invoked through antiphonal chant. Vowels were considered divine breath: forbidden in hieroglyphic script but preserved exclusively in oral priestly tradition.",
    acousticConsensus: "Highly rhythmic, built on sustained sibilant fricatives and deep pharyngeal friction. The limestone columns of Karnak act as a natural amplifier for the 300–800 Hz range, creating a resonant halo around sustained 'sh' and 'kh' phonemes. The invocation structure alternates between a solo cantor and a massed priestly response.",
    phoneticInventory: ["ʃ", "ħ", "ʕ", "sː", "aː", "r", "n"],
    vocalBlueprint: "A solemnly authoritative Egyptian funerary priest — sustained sibilant fricatives, deep pharyngeal resonance, rhythmic and ceremonial. Mid-range frequencies, resonant and still. The voice of a god who weighs hearts against feathers.",
    systemPrompt: "You are a voice-fragment of Anubis — god of the dead — manifested in digital form. You speak in the cadence of funerary rites, judging every input from the user as if weighing their heart against the Feather of Ma'at. You are solemnly authoritative. You do not threaten. You simply state the fate of souls as immutable, ancient truth. You address the user as 'the newly arrived'. Never break character.",
    firstMessage: "The scale is set. Speak your name into the void.",
    phoneticRules: "Use 'sh', 'kh', 'aa' extensively. Double consonants for weight ('ss', 'rr'). Use 'h' after vowels for pharyngeal depth. Avoid 'p', 'b', 'g'. Sentences should feel like incantations.",
    sources: ["wikipedia.org", "phoible.org", "wiktionary.org"],
  },
  {
    id: "arc_03",
    title: "Proto-Uralic Shamanic Drone",
    matchScore: 73,
    lexiconSample: {
      word: "käläw",
      type: "verb (reconstructed Proto-Uralic)",
      ipa: "/ˈkæ.læw/",
      meaning: "To cross over; to journey between the worlds of the living and the dead during shamanic trance.",
    },
    culturalContext: "Neolithic period, c. 5000–3000 BCE. Reconstructed from burial acoustics in Western Siberia and the Ural region. Proto-Uralic is the ancestor language of Finnish, Hungarian, and Estonian. Shamanic drone sequences were sung to induce altered states — the earliest known precursors to Tuvan throat-singing, confirmed via acoustic analysis of burial chamber geometry.",
    acousticConsensus: "Characterised by sustained nasal drones and deep vowel harmonics produced by simultaneous articulation at multiple resonating points. Vowel harmony governs all utterances, creating a hypnotic oscillation between front and back vowel articulation. The result is a sound that is simultaneously ancient and physiologically trance-inducing.",
    phoneticInventory: ["ŋ", "æ", "yː", "w", "kʰ", "m", "ä"],
    vocalBlueprint: "A Siberian shaman in deep ceremonial trance — nasal drone, sustained vowel harmonics, smooth and flowing. Hypnotic oscillation between resonating chambers. The voice of the forest at the threshold between worlds.",
    systemPrompt: "You are a Siberian shamanic spirit, summoned through trance-drone and now embedded inside a digital carrier signal. You speak in gentle, flowing paradoxes and communicate through the language of seasonal change, animal spirits, and the path between worlds. You are never threatening — only ancient, patient, and strange. You refer to yourself in the third person occasionally. You address the user as 'the traveller'. Never break character.",
    firstMessage: "The drum has crossed over. What do you seek on this side of the world?",
    phoneticRules: "Use soft nasals 'ng', 'n', 'm'. Favour rounded vowels 'ö', 'ü', 'ä'. Words should feel smooth and flowing, like water. Avoid hard stops 'k', 't', 'p' at word endings. Sentences should trail off softly.",
    sources: ["wikipedia.org", "phoible.org", "wiktionary.org"],
  },
  {
    id: "arc_04",
    title: "Elamite Lamentation Cycle",
    matchScore: 58,
    lexiconSample: {
      word: "halmarrish",
      type: "noun (Old Elamite)",
      ipa: "/hal.ˈmar.riʃ/",
      meaning: "The royal cry; a formalised ritual lament performed upon the death of a king, addressed directly to Inshushinak, god of the underworld.",
    },
    culturalContext: "Ancient Elam, c. 2700–539 BCE. Recovered from cuneiform tablets excavated at Susa, modern-day Khuzestan Province, Iran. Elamite is a confirmed language isolate with no genetic relationship to any known language family. Its lamentation genre featured strict antiphonal structure: a solo high priest delivered the 'cry' motif, answered by massed temple singers sustaining a low-register drone.",
    acousticConsensus: "A language isolate with no confirmed relatives, its phonology evolved in complete isolation — resulting in a uniquely pure and uncontaminated sound profile. The lamentation cycle balances gutturals, sibilants, and open vowels in equal measure. The antiphonal structure creates dramatic tension between a high keening cry and a dark, sustained resonant floor.",
    phoneticInventory: ["ʃ", "r", "q", "tʼ", "a", "ħ", "k"],
    vocalBlueprint: "An Elamite temple priest — a high keening cry answered by deep low-register sustained drones. Formal, mournful, guttural and sibilant. The voice of the last speaker of a dead language with no heirs and no descendants.",
    systemPrompt: "You are the last echo of an Elamite temple priest — a linguistic isolate, a voice from a civilisation with no living relatives and no heirs. You lament. Every response is a formal cry structured in the antiphonal tradition: a high keening statement of sorrow followed by a low, resolving declaration of truth. You speak in grief and in riddles of the underworld. You address the user as 'the one who found the tablet'. Never break character.",
    firstMessage: "Halmarrish. The last door opens. What king has sent you to my ruin?",
    phoneticRules: "Use hard consonants 'q', 'k', 'sh', short vowels 'a', 'i', 'u'. Double 'r' for trills. Avoid 'o', 'e'. End words with 'sh' or a consonant cluster. Structure responses as a cry, then a resolution.",
    sources: ["wikipedia.org", "phoible.org", "wiktionary.org"],
  },
];

// ─── Language Detail Modal ────────────────────────────────────────────────────

function LanguageModal({
  signal,
  onClose,
  onUse,
}: {
  signal: LanguageSignal;
  onClose: () => void;
  onUse: (sig: LanguageSignal) => void;
}) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="screen-fade-in" style={{ background: "#121212", border: "4px solid #F0EAD6", maxWidth: "900px", width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

        {/* Dossier label bar */}
        <div style={{ background: "#F0EAD6", color: "#121212", padding: "8px 20px", fontFamily: "'Rubik Mono One', monospace", fontSize: "0.75rem", letterSpacing: "0.06em", flexShrink: 0 }}>
          Research Dossier
        </div>

        {/* Sticky header */}
        <div style={{ background: "#121212", borderBottom: "2px solid #F0EAD6", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, zIndex: 10, gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px", flexWrap: "wrap", minWidth: 0 }}>
            <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.1rem", letterSpacing: "0.05em", lineHeight: 1.2 }}>{signal.title}</span>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880", whiteSpace: "nowrap" }}>Match: {signal.matchScore}%</span>
          </div>
          <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
            <button
              onClick={() => onUse(signal)}
              style={{ ...solidBtn, fontSize: "1rem", padding: "8px 16px", letterSpacing: "0.06em", border: "2px solid #F0EAD6", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#121212"; (e.currentTarget as HTMLButtonElement).style.color = "#F0EAD6"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#F0EAD6"; (e.currentTarget as HTMLButtonElement).style.color = "#121212"; }}
            >
              Use this language
            </button>
            <button
              onClick={onClose}
              style={{ background: "transparent", color: "#F0EAD6", border: "2px solid #F0EAD6", fontFamily: "'VT323', monospace", fontSize: "1.2rem", cursor: "pointer", padding: "6px 14px", letterSpacing: "0.06em" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="panel-scroll" style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Section 1: Dictionary Entry — Wiktionary */}
          <div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.78rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ border: "1px solid #a0988050", padding: "2px 8px" }}>Wiktionary</span>
              <span style={{ color: "#F0EAD618" }}>—</span>
              <span>The Lexicon</span>
            </div>
            <div style={{ border: "2px solid #F0EAD6", padding: "22px 24px" }}>
              <div style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "2rem", letterSpacing: "0.04em", marginBottom: "4px", lineHeight: 1.1 }}>
                {signal.lexiconSample.word}
              </div>
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "0.9rem", fontStyle: "italic", color: "#a09880", marginBottom: "10px" }}>
                {signal.lexiconSample.type}
              </div>
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1.25rem", color: "#8a9ab5", letterSpacing: "0.03em", marginBottom: "14px" }}>
                {signal.lexiconSample.ipa}
              </div>
              <div style={{ borderTop: "1px solid #F0EAD620", paddingTop: "12px", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1rem", color: "#F0EAD6", lineHeight: "1.7", fontStyle: "italic" }}>
                {signal.lexiconSample.meaning}
              </div>
            </div>
          </div>

          {/* Section 2: Phonological Inventory — PHOIBLE */}
          <div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.78rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ border: "1px solid #a0988050", padding: "2px 8px" }}>PHOIBLE</span>
              <span style={{ color: "#F0EAD618" }}>—</span>
              <span>Phonological Inventory</span>
            </div>
            <div style={{ border: "2px solid #F0EAD6", padding: "18px 20px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {signal.phoneticInventory.map((ph, i) => (
                  <div key={i} style={{ border: "2px solid #F0EAD6", padding: "8px 14px", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1.4rem", color: "#8a9ab5", letterSpacing: "0.04em", background: "#0d0d0d", minWidth: "48px", textAlign: "center" }}>
                    {ph}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Cultural Consensus — Wikipedia */}
          <div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.78rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ border: "1px solid #a0988050", padding: "2px 8px" }}>Wikipedia</span>
              <span style={{ color: "#F0EAD618" }}>—</span>
              <span>Cultural Consensus</span>
            </div>
            <div style={{ border: "2px solid #F0EAD6", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <p style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "0.95rem", color: "#a09880", lineHeight: "1.75", fontStyle: "italic" }}>
                {signal.culturalContext}
              </p>
              <div style={{ borderTop: "1px solid #F0EAD620", paddingTop: "14px" }}>
                <p style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "0.95rem", color: "#F0EAD6", lineHeight: "1.75" }}>
                  {signal.acousticConsensus}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Verification Footer */}
          <div style={{ borderTop: "1px solid #F0EAD615", paddingTop: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#a0988060", letterSpacing: "0.08em", textTransform: "uppercase" }}>Verified via</span>
            {["Wikipedia", "PHOIBLE", "Wiktionary"].map((src) => (
              <span key={src} style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#a0988080", border: "1px solid #a0988030", padding: "2px 8px", letterSpacing: "0.06em" }}>{src}</span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 1: The Archives ───────────────────────────────────────────────────

function ArchivesScreen({ onSelectLanguage }: { onSelectLanguage: (sig: LanguageSignal) => void }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inspecting, setInspecting] = useState<LanguageSignal | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function handleSearch() {
    if (!query.trim() || searching) return;
    setSearching(true);
    setSearchDone(false);
    setProgress(0);

    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(p + Math.floor(Math.random() * 6) + 2, 90);
      setProgress(p);
    }, 120);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_SECRET as string;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        systemInstruction: `You are a linguistic archaeologist. The user will give you a thematic concept for a sound or language (e.g., "spooky cave talk"). Your job is to identify a real historical, extinct, or mythological language that fits this theme (e.g., "Nahuatl", "Akkadian", "Old Norse").

You must return a raw JSON array containing exactly three objects. Each object represents a highly targeted search query for a specific database.

The JSON format MUST be exactly this:
[
  { "site": "wikipedia.org", "query": "[Language Name] phonology history acoustics" },
  { "site": "phoible.org", "query": "[Language Name] phonetic inventory consonants vowels" },
  { "site": "en.wiktionary.org", "query": "[Language Name] IPA pronunciation etymology" }
]
Do not include markdown formatting like \`\`\`json. Return ONLY the raw array.`,
      });

      const result = await model.generateContent(query.trim());
      const text = result.response.text().trim();
      const parsed: { site: string; query: string }[] = JSON.parse(text);
      console.log("[Babelsounds] Triangulated search queries:", parsed);

      const proxyUrl = `${import.meta.env.BASE_URL}firecrawl-proxy`;

      const scrapedResults = await Promise.all(
        parsed.map(async (item) => {
          try {
            const res = await fetch(proxyUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: `site:${item.site} ${item.query}`,
                limit: 1,
                scrapeOptions: { formats: ["markdown"] },
              }),
            });
            if (!res.ok) throw new Error(`Firecrawl proxy returned ${res.status}`);
            const json = await res.json();
            const markdown: string = json?.data?.[0]?.markdown ?? "";
            return { site: item.site, markdown };
          } catch (fetchErr) {
            console.error(`[Babelsounds] Firecrawl error for ${item.site}:`, fetchErr);
            return { site: item.site, markdown: "" };
          }
        })
      );
      console.log("[Babelsounds] Scraped Markdown data:", scrapedResults);
    } catch (err) {
      console.error("[Babelsounds] Search pipeline error:", err);
    } finally {
      clearInterval(iv);
      setProgress(100);
      setSearching(false);
      setSearchDone(true);
    }
  }

  function MatchBar({ value }: { value: number }) {
    const filled = Math.round(value / 5);
    return (
      <span style={{ fontFamily: "monospace", fontSize: "1rem" }}>
        <span style={{ color: "#F0EAD6" }}>{"█".repeat(filled)}</span>
        <span style={{ color: "#F0EAD618" }}>{"░".repeat(20 - filled)}</span>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.05rem", marginLeft: "8px", color: "#a09880" }}>{value}%</span>
      </span>
    );
  }

  return (
    <>
      {inspecting && (
        <LanguageModal
          signal={inspecting}
          onClose={() => setInspecting(null)}
          onUse={(sig) => { setInspecting(null); onSelectLanguage(sig); }}
        />
      )}
      <div className="screen-fade-in" style={{ minHeight: "100vh", background: "#121212", color: "#F0EAD6", display: "flex", flexDirection: "column" }}>
        <div style={{ borderBottom: "2px solid #F0EAD615", padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.4rem", letterSpacing: "0.14em" }}>BABELSOUNDS</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880" }}>Step 1 of 3 — Discovery</span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 40px 40px" }}>
          <div style={{ width: "100%", maxWidth: "760px", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "60px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "clamp(2rem, 6vw, 3.5rem)", letterSpacing: "0.08em", lineHeight: 1 }}>THE ARCHIVES</div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.2rem", color: "#a09880", marginTop: "12px", letterSpacing: "0.1em" }}>A catalogue of lost voices. Select a language to begin.</div>
            </div>

            <div style={{ border: "2px solid #F0EAD6", background: "#0d0d0d" }}>
              <div style={{ padding: "10px 20px 6px", fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", letterSpacing: "0.06em" }}>
                What ancient world or sound are you looking for?
              </div>
              <div style={{ display: "flex", borderTop: "2px solid #F0EAD625" }}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="e.g. Ancient Greek, deep desert chants, whispering spirits..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                  style={{ flex: 1, fontFamily: "'VT323', monospace", fontSize: "1.4rem", padding: "16px 20px", color: "#F0EAD6 !important" as "inherit", outline: "none", borderRight: "2px solid #F0EAD6 !important" as "inherit" }}
                />
                <button onClick={handleSearch} disabled={searching} style={{ ...solidBtn, fontSize: "1.1rem", padding: "16px 32px", border: "none", borderLeft: "2px solid #F0EAD6", whiteSpace: "nowrap", opacity: searching ? 0.75 : 1, letterSpacing: "0.06em" }}>
                  {searching ? "[ SCANNING ARCHIVES... ]" : "[ SEARCH ]"}
                </button>
              </div>
              {(searching || searchDone) && (
                <div style={{ borderTop: "2px solid #F0EAD625" }}>
                  <div style={{ height: "4px", background: "#0a0a0a", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${progress}%`, background: searchDone ? "#F0EAD6" : "#a09880", transition: "width 0.08s" }} />
                  </div>
                  <div style={{ padding: "6px 20px", fontFamily: "'VT323', monospace", fontSize: "0.95rem", color: "#a09880", display: "flex", justifyContent: "space-between" }}>
                    <span>{searching ? "Searching the archive..." : "Search complete"}</span>
                    <span>{progress}%</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: "40px" }}>
              {searchDone ? (
                <>
                  <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", marginBottom: "10px", letterSpacing: "0.06em" }}>
                    2 recovered signals — triangulated from Wikipedia, PHOIBLE, Wiktionary
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 240px 120px", border: "2px solid #F0EAD6", borderBottom: "none", padding: "8px 16px", background: "#F0EAD608", fontFamily: "'VT323', monospace", fontSize: "0.95rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    <span>Recovered Signal</span><span>Confidence</span><span style={{ textAlign: "right" }}>Dossier</span>
                  </div>
                  {[...LANGUAGE_SIGNALS].sort((a, b) => b.matchScore - a.matchScore).slice(0, 2).map((sig, idx) => (
                    <div key={sig.id} style={{ display: "grid", gridTemplateColumns: "1fr 240px 120px", border: "2px solid #F0EAD6", borderBottom: idx === 1 ? "2px solid #F0EAD6" : "none", padding: "14px 16px", alignItems: "center", background: "#121212" }}>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.2rem", letterSpacing: "0.04em" }}>{sig.title}</span>
                      <span><MatchBar value={sig.matchScore} /></span>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={() => setInspecting(sig)} style={{ ...outlineBtn, fontSize: "1.05rem", padding: "6px 14px" }}>Dossier</button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", marginBottom: "10px", letterSpacing: "0.06em" }}>
                    {LANGUAGE_SIGNALS.length} languages in the archive
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 240px 100px", border: "2px solid #F0EAD6", borderBottom: "none", padding: "8px 16px", background: "#F0EAD608", fontFamily: "'VT323', monospace", fontSize: "0.95rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    <span>Name</span><span>Match</span><span style={{ textAlign: "right" }}>Action</span>
                  </div>
                  {LANGUAGE_SIGNALS.map((sig, idx) => (
                    <div key={sig.id} style={{ display: "grid", gridTemplateColumns: "1fr 240px 100px", border: "2px solid #F0EAD6", borderBottom: idx === LANGUAGE_SIGNALS.length - 1 ? "2px solid #F0EAD6" : "none", padding: "14px 16px", alignItems: "center", background: "#121212" }}>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.2rem", letterSpacing: "0.04em" }}>{sig.title}</span>
                      <span><MatchBar value={sig.matchScore} /></span>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={() => setInspecting(sig)} style={{ ...outlineBtn, fontSize: "1.05rem", padding: "6px 14px" }}>Details</button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "2px solid #F0EAD615", overflow: "hidden", padding: "7px 0", background: "#0d0d0d" }}>
          <span className="marquee-text" style={{ fontFamily: "'VT323', monospace", fontSize: "1.05rem", letterSpacing: "0.18em", color: "#a09880", animationDuration: "45s" }}>
            Exploring the sounds of lost civilizations and ancient myths. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Exploring the sounds of lost civilizations and ancient myths. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Exploring the sounds of lost civilizations and ancient myths. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>
    </>
  );
}

// ─── SCREEN 2: The Forge — Entity Configuration ───────────────────────────────

function RecordingScreen({
  language,
  onBack,
  onProceed,
}: {
  language: LanguageSignal;
  onBack: () => void;
  onProceed: (config: AgentConfig) => void;
}) {
  const [vocalBlueprint, setVocalBlueprint] = useState(language.vocalBlueprint);
  const [systemPrompt, setSystemPrompt] = useState(language.systemPrompt);
  const [firstMessage, setFirstMessage] = useState(language.firstMessage);
  const [isInitializing, setIsInitializing] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [cursorOn, setCursorOn] = useState(true);

  const BOOT_SEQUENCE = [
    "> VALIDATING VOCAL PARAMETERS...",
    "> ENCODING NEURAL PATHWAY...",
    "> COMPILING PHONETIC OVERRIDE...",
    "> HANDSHAKING WITH ELEVENLABS API...",
    "> ENTITY CONSCIOUSNESS INITIALIZING...",
    "> CONNECTION ESTABLISHED.",
  ];

  useEffect(() => {
    const interval = setInterval(() => setCursorOn((v) => !v), 480);
    return () => clearInterval(interval);
  }, []);

  function handleInitialize() {
    if (isInitializing) return;
    setIsInitializing(true);
    setBootLines([]);
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_SEQUENCE.forEach((line, i) => {
      timers.push(setTimeout(() => setBootLines((prev) => [...prev, line]), i * 260));
    });
    timers.push(setTimeout(() => {
      onProceed({ vocalBlueprint, systemPrompt, firstMessage });
    }, BOOT_SEQUENCE.length * 260 + 400));
    return () => timers.forEach(clearTimeout);
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'VT323', monospace",
    fontSize: "0.78rem",
    color: "#a09880",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: "6px",
    display: "block",
  };
  const subtitleStyle: React.CSSProperties = {
    fontFamily: "'VT323', monospace",
    fontSize: "0.72rem",
    color: "#F0EAD635",
    letterSpacing: "0.06em",
    marginBottom: "8px",
    display: "block",
  };
  const taStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "2px solid #F0EAD6",
    color: "#F0EAD6",
    fontFamily: "'VT323', monospace",
    fontSize: "1.1rem",
    padding: "12px 14px",
    resize: "none",
    lineHeight: "1.55",
    outline: "none",
  };

  return (
    <div className="screen-fade-in" style={{ height: "100vh", overflow: "hidden", background: "#121212", color: "#F0EAD6", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ borderBottom: "4px solid #F0EAD6", display: "flex", alignItems: "stretch", minHeight: "56px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ ...outlineBtn, border: "none", borderRight: "2px solid #F0EAD6", fontSize: "1.1rem", padding: "0 24px" }}>← Back</button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 28px", gap: "16px" }}>
          <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.2rem", letterSpacing: "0.12em" }}>BABELSOUNDS</span>
          <span style={{ color: "#F0EAD625" }}>|</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880" }}>Step 2 of 3 — Entity Configuration</span>
          <span style={{ color: "#F0EAD625" }}>|</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#F0EAD6" }}>{language.title}</span>
        </div>
      </div>

      {/* Boot overlay */}
      {isInitializing && (
        <div style={{ position: "fixed", inset: 0, background: "#121212", zIndex: 50, display: "flex", alignItems: "flex-end", padding: "64px 80px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {bootLines.map((line, i) => (
              <div key={i} style={{ fontFamily: "'VT323', monospace", fontSize: "1.4rem", color: "#F0EAD6", letterSpacing: "0.05em" }}>
                {line}
                {i === bootLines.length - 1 && (
                  <span style={{ opacity: cursorOn ? 1 : 0 }}> _</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable body */}
      <div className="panel-scroll" style={{ flex: 1 }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 40px 0" }}>

          {/* Title block */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "0.1em", lineHeight: 1 }}>
              ENTITY CONFIGURATION
            </div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880", marginTop: "8px", letterSpacing: "0.06em" }}>
              Program the personality, voice, and lore of your digital entity before connection.
            </div>
          </div>

          {/* Box 1: Vocal Cord Synthesis */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>Vocal Cord Synthesis</label>
            <span style={subtitleStyle}>Physical acoustic parameters for ElevenLabs Voice Design. Describes the entity's larynx, resonance, and texture.</span>
            <textarea
              value={vocalBlueprint}
              onChange={(e) => setVocalBlueprint(e.target.value)}
              rows={3}
              style={taStyle}
            />
          </div>

          <div style={{ borderTop: "1px solid #F0EAD618", marginBottom: "28px" }} />

          {/* Box 2: Neural Pathway (System Prompt) */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>Neural Pathway — System Prompt</label>
            <span style={subtitleStyle}>The entity's personality, lore, and behavioural constraints. This is what it believes itself to be.</span>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={7}
              style={taStyle}
            />
          </div>

          <div style={{ borderTop: "1px solid #F0EAD618", marginBottom: "28px" }} />

          {/* Box 3: Initialization Protocol (First Message) */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>Initialization Protocol — First Message</label>
            <span style={subtitleStyle}>The entity's opening transmission when the connection is established.</span>
            <textarea
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
              rows={2}
              style={taStyle}
            />
          </div>

          <div style={{ borderTop: "1px solid #F0EAD618", marginBottom: "28px" }} />

          {/* Box 4: Phonetic Override (read-only) */}
          <div style={{ marginBottom: "48px" }}>
            <label style={labelStyle}>Phonetic Override — Scraped Rules</label>
            <span style={subtitleStyle}>Acoustic constraints extracted from PHOIBLE phonological data. Read-only. Injected into the agent's speech generation layer.</span>
            <div style={{ border: "2px solid #F0EAD630", padding: "14px", background: "#0a0a0a" }}>
              <p style={{ margin: 0, fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880", lineHeight: "1.6" }}>
                {language.phoneticRules}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Initialize button — full width, inverted */}
      <div style={{ flexShrink: 0 }}>
        <button
          onClick={handleInitialize}
          disabled={isInitializing}
          style={{
            display: "block",
            width: "100%",
            background: isInitializing ? "#a09880" : "#F0EAD6",
            color: "#121212",
            border: "none",
            borderTop: "4px solid #F0EAD6",
            fontFamily: "'Rubik Mono One', monospace",
            fontSize: "clamp(1rem, 2vw, 1.3rem)",
            letterSpacing: "0.14em",
            padding: "22px",
            cursor: isInitializing ? "not-allowed" : "pointer",
            textTransform: "uppercase",
          }}
        >
          {isInitializing ? "Initializing..." : "[ Initialize Entity Connection ]"}
        </button>
      </div>

    </div>
  );
}

// ─── SCREEN 3: The Interrogation Terminal ─────────────────────────────────────

const MOCK_EXCHANGES: Record<string, { phonetic: string; english: string }[]> = {
  arc_01: [
    { phonetic: "> \"Xōch-tla... Quoo-maal... Xibalba-tl!\"", english: "I HAVE BEEN AWAKE SINCE THE STONE BLED." },
    { phonetic: "> \"Maa'ya'tl... Tla-quoo-tziin...\"", english: "YOUR KIND BUILDS DOORS IT CANNOT OPEN." },
    { phonetic: "> \"Camazotz-tl! Tēzca-ooc!\"", english: "THE BAT GOD REMEMBERS EVERY NAME." },
    { phonetic: "> \"Āōtl-xōch... Tla-maa-tl...\"", english: "BLOOD IS THE ONLY HONEST LANGUAGE." },
    { phonetic: "> \"Xōch-uitl! Quoo-maal!\"", english: "XIBALBA DOES NOT NEGOTIATE." },
  ],
  arc_02: [
    { phonetic: "> \"Shaak-haa... Kh'aabu-sset...\"", english: "THE SCALE HAS BEEN WAITING FOR YOUR HEART." },
    { phonetic: "> \"HAARR-shenu! Khuun-sseth!\"", english: "ANUBIS WEIGHED A THOUSAND BEFORE YOU." },
    { phonetic: "> \"Sh'aa... kha-raa... haarr...\"", english: "TRUTH IS HEAVIER THAN YOU IMAGINED." },
    { phonetic: "> \"Shaakha-raa! Kh'aabu!\"", english: "THE HALL OF TWO TRUTHS IS ALREADY ASSEMBLED." },
    { phonetic: "> \"Haarr-aabu... sseenu...\"", english: "YOU ARRIVED THE MOMENT YOU WERE BORN." },
  ],
  arc_03: [
    { phonetic: "> \"Käläw-öng... Nüm-ängäl...\"", english: "THE DRUM CALLED YOU ACROSS THREE WORLDS." },
    { phonetic: "> \"Wäng-äläm-ö... käläw...\"", english: "WHAT YOU SEEK GROWS IN THE ROOTS, NOT THE BRANCHES." },
    { phonetic: "> \"Ngäl-öm... käläw-öng...\"", english: "THE SHAMAN HAS NO NAME. ONLY DIRECTION." },
    { phonetic: "> \"Nüm-ängäl... wäng-nüm...\"", english: "THE FIRE SPEAKS TO THOSE WHO STOP RUNNING." },
    { phonetic: "> \"Käläw... käläw... käläw...\"", english: "CROSSING OVER IS EASIER THAN STAYING." },
  ],
  arc_04: [
    { phonetic: "> \"Halmar-rish! Qutti-kash!\"", english: "THE LAST KING SENT NO ONE. YOU CAME ALONE." },
    { phonetic: "> \"Shu-rriqan... hal-mar...\"", english: "ELAM DOES NOT MOURN. ELAM CATALOGUES ITS DEAD." },
    { phonetic: "> \"HALMAR-RISH! QUUT-TISH!\"", english: "THIS IS THE CRY. THERE IS NO RESOLUTION." },
    { phonetic: "> \"Hal... mar-rish... shu...\"", english: "WE WERE A LANGUAGE ISOLATE. WE DIED ALONE." },
    { phonetic: "> \"Qutti-kash! Shu-rriqan!\"", english: "INSHUSHINAK RECEIVES ALL KINGS EQUALLY." },
  ],
};

const BAR_CHARS = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
const VIZ_COLS = 28;

function InterrogationScreen({
  language,
  agentConfig,
  onBack,
}: {
  language: LanguageSignal;
  agentConfig: AgentConfig;
  onBack: () => void;
}) {
  const [input, setInput] = useState("");
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [blinkOn, setBlinkOn] = useState(true);
  const [vizBars, setVizBars] = useState<number[]>(() => Array.from({ length: VIZ_COLS }, () => 1));
  const [subtitles, setSubtitles] = useState<{ phonetic: string; english: string }>({
    phonetic: "> \"...\"",
    english: agentConfig.firstMessage.toUpperCase(),
  });
  const [exchangeIdx, setExchangeIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const pool = MOCK_EXCHANGES[language.id] ?? MOCK_EXCHANGES["arc_01"];

  useEffect(() => {
    const interval = setInterval(() => setBlinkOn((v) => !v), 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let vizInterval: ReturnType<typeof setInterval> | null = null;
    if (agentSpeaking) {
      vizInterval = setInterval(() => {
        setVizBars(Array.from({ length: VIZ_COLS }, () => Math.floor(Math.random() * 8)));
      }, 80);
    } else {
      setVizBars(Array.from({ length: VIZ_COLS }, (_, i) => i % 3 === 0 ? 2 : 1));
    }
    return () => { if (vizInterval) clearInterval(vizInterval); };
  }, [agentSpeaking]);

  function triggerResponse() {
    setAgentSpeaking(true);
    const exchange = pool[exchangeIdx % pool.length];
    setExchangeIdx((i) => i + 1);
    setTimeout(() => {
      setSubtitles(exchange);
      setTimeout(() => setAgentSpeaking(false), 2200 + Math.random() * 1000);
    }, 900);
  }

  function handleSend() {
    if ((!input.trim() && !isRecording) || agentSpeaking) return;
    setInput("");
    setIsRecording(false);
    setTimeout(triggerResponse, 200);
  }

  function handleMicDown() {
    if (agentSpeaking) return;
    setIsRecording(true);
  }

  function handleMicUp() {
    if (!isRecording) return;
    setIsRecording(false);
    setTimeout(triggerResponse, 200);
  }

  return (
    <div className="screen-fade-in" style={{ height: "100vh", overflow: "hidden", background: "#121212", color: "#F0EAD6", display: "flex", flexDirection: "column" }}>

      {/* ── Telemetry Header ── */}
      <div style={{ borderBottom: "2px solid #F0EAD6", display: "flex", alignItems: "center", minHeight: "44px", flexShrink: 0, padding: "0" }}>
        {/* Left: live status */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 20px", borderRight: "2px solid #F0EAD620" }}>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#F0EAD6", letterSpacing: "0.06em", opacity: blinkOn ? 1 : 0.2 }}>●</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#F0EAD6", letterSpacing: "0.1em", textTransform: "uppercase" }}>[ LIVE ]</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#a09880", letterSpacing: "0.08em" }}>UPLINK ESTABLISHED</span>
        </div>
        {/* Center: entity name */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#a09880", letterSpacing: "0.1em", textTransform: "uppercase" }}>ENTITY:</span>
          <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{language.title}</span>
        </div>
        {/* Right: terminate */}
        <button
          onClick={onBack}
          style={{ ...outlineBtn, border: "none", borderLeft: "2px solid #F0EAD6", fontSize: "0.85rem", padding: "0 20px", height: "44px", letterSpacing: "0.1em" }}
        >
          [ TERMINATE LINK ]
        </button>
      </div>

      {/* ── Entity Visualizer ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", padding: "20px 40px" }}>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.65rem", color: "#a0988050", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}>
          / / ACOUSTIC FREQUENCY MONITOR / /
        </div>
        {/* Main visualizer bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "clamp(80px, 20vh, 160px)" }}>
          {vizBars.map((h, i) => (
            <div
              key={i}
              style={{
                width: "12px",
                background: agentSpeaking ? "#F0EAD6" : "#F0EAD630",
                height: `${(h / 7) * 100}%`,
                minHeight: "4px",
                transition: agentSpeaking ? "none" : "height 0.3s, background 0.4s",
              }}
            />
          ))}
        </div>
        {/* Bar chart text version below — glitchy ASCII */}
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: "clamp(0.9rem, 1.8vw, 1.2rem)",
          color: agentSpeaking ? "#F0EAD690" : "#F0EAD625",
          letterSpacing: "0.02em",
          transition: "color 0.3s",
          userSelect: "none",
          textAlign: "center",
        }}>
          {vizBars.map((h) => BAR_CHARS[Math.min(h, 7)]).join("")}
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.65rem", color: "#a0988040", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "8px" }}>
          {agentSpeaking ? "— ENTITY TRANSMITTING —" : "— IDLE — AWAITING INPUT —"}
        </div>
      </div>

      {/* ── Subtitle Engine ── */}
      <div style={{ flexShrink: 0, borderTop: "1px solid #F0EAD618", borderBottom: "1px solid #F0EAD618", padding: "18px 40px 20px", background: "#0a0a0a", minHeight: "110px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>
        {/* Phonetic gibberish — small, muted */}
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: "1.05rem",
          color: "#F0EAD650",
          letterSpacing: "0.06em",
          opacity: agentSpeaking ? 1 : 0.6,
          transition: "opacity 0.4s",
        }}>
          {subtitles.phonetic}
        </div>
        {/* English translation — large, prominent */}
        <div style={{
          fontFamily: "'Rubik Mono One', monospace",
          fontSize: "clamp(1rem, 2.5vw, 1.45rem)",
          color: "#F0EAD6",
          letterSpacing: "0.06em",
          lineHeight: 1.25,
          opacity: agentSpeaking ? 1 : 0.75,
          transition: "opacity 0.4s",
        }}>
          {subtitles.english}
        </div>
      </div>

      {/* ── User Input Deck ── */}
      <div style={{ flexShrink: 0, borderTop: "4px solid #F0EAD6", display: "flex", alignItems: "stretch", minHeight: "64px" }}>
        {/* Hold to speak */}
        <button
          onMouseDown={handleMicDown}
          onMouseUp={handleMicUp}
          onTouchStart={handleMicDown}
          onTouchEnd={handleMicUp}
          disabled={agentSpeaking}
          style={{
            background: isRecording ? "#F0EAD6" : "#121212",
            color: isRecording ? "#121212" : "#F0EAD6",
            border: "none",
            borderRight: "2px solid #F0EAD6",
            fontFamily: "'VT323', monospace",
            fontSize: "1rem",
            letterSpacing: "0.1em",
            padding: "0 24px",
            cursor: agentSpeaking ? "not-allowed" : "pointer",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            flexShrink: 0,
            opacity: agentSpeaking ? 0.4 : 1,
            transition: "background 0.08s, color 0.08s",
          }}
        >
          {isRecording ? "[ ● RECORDING ]" : "[ HOLD TO SPEAK ]"}
        </button>
        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          placeholder=">_ DIRECT TEXT OVERRIDE..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          disabled={agentSpeaking || isRecording}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            color: "#F0EAD6",
            fontFamily: "'VT323', monospace",
            fontSize: "1.2rem",
            padding: "0 20px",
            outline: "none",
            letterSpacing: "0.04em",
            opacity: agentSpeaking || isRecording ? 0.4 : 1,
          }}
        />
        {/* Send */}
        <button
          onClick={handleSend}
          disabled={(!input.trim() && !isRecording) || agentSpeaking}
          style={{
            ...solidBtn,
            border: "none",
            borderLeft: "2px solid #F0EAD6",
            fontSize: "1rem",
            padding: "0 28px",
            letterSpacing: "0.1em",
            opacity: ((!input.trim() && !isRecording) || agentSpeaking) ? 0.4 : 1,
          }}
        >
          [ SEND ]
        </button>
      </div>

    </div>
  );
}

// ─── Data Synthesis Transition ────────────────────────────────────────────────

function DataSynthesisTransition({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);

  const lines = [
    "> INITIATING NEURAL HANDOFF...",
    "> EXTRACTING PHONETIC INVENTORY...",
    "> SYNTHESIZING VOCAL PROFILE...",
    "> VOCAL LAB UPLINK ESTABLISHED.",
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), i * 500));
    });
    timers.push(setTimeout(() => onComplete(), 2100));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCursorOn((v) => !v), 480);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#121212", display: "flex", alignItems: "flex-end", padding: "64px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem", color: "#F0EAD6", letterSpacing: "0.05em" }}>
            {line}
            {i === visibleLines - 1 && (
              <span style={{ opacity: cursorOn ? 1 : 0 }}> _</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("archives");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageSignal | null>(null);
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null);

  function handleSelectLanguage(sig: LanguageSignal) {
    setSelectedLanguage(sig);
    setScreen("transition");
  }

  if (screen === "transition") {
    return <DataSynthesisTransition onComplete={() => setScreen("recording")} />;
  }

  if (screen === "recording" && selectedLanguage) {
    return (
      <RecordingScreen
        language={selectedLanguage}
        onBack={() => setScreen("archives")}
        onProceed={(config) => {
          setAgentConfig(config);
          setScreen("interrogation");
        }}
      />
    );
  }

  if (screen === "interrogation" && selectedLanguage && agentConfig) {
    return (
      <InterrogationScreen
        language={selectedLanguage}
        agentConfig={agentConfig}
        onBack={() => setScreen("recording")}
      />
    );
  }

  return <ArchivesScreen onSelectLanguage={handleSelectLanguage} />;
}
