import { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "archives" | "transition" | "recording" | "soundscape";

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
  typingGuide: string;
  sources: string[];
}

interface AudioClip {
  id: string;
  name: string;
  duration: number;
}

interface TrackClip {
  id: string;
  name: string;
  startTime: number;
  duration: number;
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
    vocalBlueprint: "A Mesoamerican high priest chanting in a subterranean stone chamber — deep chest resonance, aggressive ejective consonants, sustained nasal output, rhythmic and percussive, ancient and authoritative",
    typingGuide: "Use hard consonants: 'tl', 'x' (as 'sh'), 'qu'. Favour long vowels 'oo', 'aa'. Avoid soft sounds like 'f', 'v', 'th'. End words with 'tl' or 'c'.",
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
    vocalBlueprint: "An Egyptian high priest performing a funerary invocation at Karnak — sustained sibilant fricatives, deep pharyngeal resonance, rhythmic and ceremonial, mid-range frequencies, solemnly authoritative",
    typingGuide: "Use 'sh', 'kh', 'aa' extensively. Double consonants for emphasis ('ss', 'rr'). Use 'h' after vowels for pharyngeal depth. Avoid 'p', 'b', 'g'.",
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
    vocalBlueprint: "A Siberian shaman in deep ceremonial trance — nasal drone, sustained vowel harmonics, throat-singing, smooth and flowing, hypnotic oscillation between resonating chambers, ancient and meditative",
    typingGuide: "Use soft nasals: 'ng', 'n', 'm'. Favour rounded vowels 'ö', 'ü', 'ä'. Words should feel smooth and flowing. Avoid hard stops like 'k', 't', 'p' at word endings.",
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
    vocalBlueprint: "An Elamite temple priest performing royal lamentation — a high keening cry answered by deep low-register sustained drones, formal and mournful, guttural and sibilant, ancient and isolated",
    typingGuide: "Use hard consonants like 'q', 'k', 'sh', and short vowels 'a', 'i', 'u'. Double 'r' for trills. Avoid 'o' and 'e'. End words with 'sh' or a consonant cluster.",
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

  function handleSearch() {
    if (!query.trim() || searching) return;
    setSearching(true);
    setSearchDone(false);
    setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.floor(Math.random() * 9) + 4;
      if (p >= 100) {
        p = 100; clearInterval(iv);
        setSearching(false); setSearchDone(true);
      }
      setProgress(p);
    }, 75);
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
                <button onClick={handleSearch} style={{ ...solidBtn, fontSize: "1.3rem", padding: "16px 32px", border: "none", borderLeft: "2px solid #F0EAD6" }}>
                  {searching ? "Searching..." : "Search"}
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

// ─── SCREEN 2: Recording — The Vocal Lab ─────────────────────────────────────

const PHONEME_FRAGMENTS = ["XŌCH", "YĀŌYŌTL", "ĒNLIL", "KULABBA", "HAABCUL", "TĒZCATLIP", "XIBALBA", "ANUBIS", "PTAH", "ENLIL", "SHAMASH", "NERGAL"];

const LANGUAGE_PHONEME_POOLS: Record<string, string[][]> = {
  arc_01: [["Xooc'haa", "Tla-quoo-tziin", "Maa'ya'tl", "Xōch-uitl"], ["Yāōyōtl!", "Tēzcatlip-ooc!", "Xibalba-tl!"], ["Quoo-maal", "Āōtl-xōch", "Tla-maa-tl"]],
  arc_02: [["Shaakha-raa", "Kh'aabu-sset", "Haarr-shenu"], ["SHAAK-RHAAH!", "KHUUN-SSETH!", "HARRR-AABU!"], ["sh'aa... kha-raa...", "haarr... sseenu..."]],
  arc_03: [["Käläw-öng", "Nüm-ängäl", "Wäng-äläm-ö"], ["NGÄL-ÖM! KÄLÄW!", "WÄNG-NÜM!"], ["ngäl... öm... käläw..."]],
  arc_04: [["Halmar-rish", "Qutti-kash", "Shu-rriqan"], ["HALMAR-RISH!", "QUUT-TISH! KAASH!"], ["hal... mar-rish...", "shu... rriqan..."]],
};

const DIRECTIVE_LABELS = ["WHISPERED", "SHOUTED", "CHANTED", "BREATHLESS"] as const;
type Directive = typeof DIRECTIVE_LABELS[number];

function generateMockScript(
  intent: string,
  directives: Directive[],
  languageId: string,
  typingGuide: string
): string {
  // TODO: LLM Prompt to generate phonetics based on:
  // Intent: {intent}
  // Modifiers: {directives}
  // Rules: {typingGuide}
  const pool = LANGUAGE_PHONEME_POOLS[languageId] ?? LANGUAGE_PHONEME_POOLS["arc_01"];
  const isShouted = directives.includes("SHOUTED");
  const isWhispered = directives.includes("WHISPERED");
  const isChanted = directives.includes("CHANTED");
  const isBreathless = directives.includes("BREATHLESS");

  const base = isShouted ? pool[1] ?? pool[0] : isWhispered ? pool[2] ?? pool[0] : pool[0];
  const picks = [base[Math.floor(Math.random() * base.length)], base[Math.floor(Math.random() * base.length)]];
  const unique = [...new Set(picks)];

  let result = unique.join(isBreathless ? " — " : isChanted ? " / " : " ");
  if (isChanted) result = `${result} / ${unique[0]}`;
  if (isBreathless) result = result.split("").join("").replace(/([aeiouāōūæäö])/gi, "$1-");
  if (isWhispered && !result.includes("...")) result = result + "...";
  return result;
}

function RecordingScreen({
  language,
  clipLibrary,
  onAddClip,
  onDeleteClip,
  onBack,
  onProceed,
}: {
  language: LanguageSignal;
  clipLibrary: AudioClip[];
  onAddClip: (clip: AudioClip) => void;
  onDeleteClip: (id: string) => void;
  onBack: () => void;
  onProceed: () => void;
}) {
  const [voicePrompt, setVoicePrompt] = useState(language.vocalBlueprint);
  const [englishIntent, setEnglishIntent] = useState("");
  const [phoneticScript, setPhoneticScript] = useState("");
  const [selectedDirectives, setSelectedDirectives] = useState<Directive[]>([]);
  const [generating, setGenerating] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const GLITCH_CHARS = "†∑Ω§≈∆ΓΞΨλφσπβθΛ∂∇∏∫≠±∞μ∈∉⊂⊃⊕⊗";

  function randomGlitch(len: number) {
    let out = "";
    for (let i = 0; i < len; i++) {
      out += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      if (i > 0 && i % 6 === 0) out += " ";
    }
    return out;
  }

  function toggleDirective(d: Directive) {
    setSelectedDirectives((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  function handleGenerateScript() {
    if (!englishIntent.trim() || isGeneratingScript) return;
    const result = generateMockScript(englishIntent, selectedDirectives, language.id, language.typingGuide);
    setIsGeneratingScript(true);
    setPhoneticScript(randomGlitch(28));

    const tickInterval = setInterval(() => {
      setPhoneticScript(randomGlitch(28));
    }, 80);

    setTimeout(() => {
      clearInterval(tickInterval);
      setPhoneticScript(result);
      setIsGeneratingScript(false);
    }, 1500);
  }

  function handleGenerate() {
    if (!phoneticScript.trim() || generating) return;
    setGenerating(true);
    setTimeout(() => {
      // TODO: ElevenLabs API Integration
      // client.textToVoice.design({
      //   text: phoneticScript,
      //   voiceDescription: voicePrompt,
      //   outputFormat: "mp3_22050_32"
      // });
      const fragment = PHONEME_FRAGMENTS[Math.floor(Math.random() * PHONEME_FRAGMENTS.length)];
      const duration = Math.floor(Math.random() * 6) + 3;
      const words = phoneticScript.trim().split(" ").slice(0, 4).join(" ");
      onAddClip({
        id: `clip_${Date.now()}`,
        name: words.length > 0 ? `${words} (${fragment})` : `${language.title} — Phrase ${clipLibrary.length + 1}`,
        duration,
      });
      setGenerating(false);
    }, 1200);
  }

  function handlePlay(id: string) {
    setPlayingId(id);
    setTimeout(() => setPlayingId(null), 2000);
  }

  return (
    <div className="screen-fade-in" style={{ height: "100vh", overflow: "hidden", background: "#121212", color: "#F0EAD6", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ borderBottom: "4px solid #F0EAD6", padding: "0 0 0 0", display: "flex", alignItems: "stretch", minHeight: "60px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ ...outlineBtn, border: "none", borderRight: "2px solid #F0EAD6", fontSize: "1.1rem", padding: "0 24px" }}>← Back</button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 24px", gap: "16px" }}>
          <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.2rem", letterSpacing: "0.12em" }}>BABELSOUNDS</span>
          <span style={{ color: "#F0EAD625" }}>|</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880" }}>Step 2 of 3 — The Vocal Lab</span>
          <span style={{ color: "#F0EAD625" }}>|</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#F0EAD6" }}>{language.title}</span>
        </div>
      </div>

      {/* Three-column body */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* ── Panel 1: REFERENCE (20%) ── */}
        <div style={{ width: "20%", borderRight: "2px solid #F0EAD6", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
          {/* Panel header */}
          <div style={{ padding: "14px 18px", borderBottom: "2px solid #F0EAD620", flexShrink: 0 }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.75rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.12em" }}>Data Reconstruction</div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.7rem", color: "#F0EAD630", letterSpacing: "0.06em", marginTop: "2px" }}>{language.title}</div>
          </div>
          {/* Scrollable reference content */}
          <div className="panel-scroll" style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Wiktionary Lexicon */}
            <div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.68rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", borderBottom: "1px solid #F0EAD615", paddingBottom: "4px" }}>Wiktionary</div>
              <div style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.1rem", letterSpacing: "0.03em", lineHeight: 1.2, marginBottom: "4px" }}>{language.lexiconSample.word}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "0.78rem", fontStyle: "italic", color: "#a09880", marginBottom: "6px" }}>{language.lexiconSample.type}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: "#8a9ab5", marginBottom: "8px" }}>{language.lexiconSample.ipa}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "0.82rem", color: "#F0EAD6", lineHeight: "1.6", fontStyle: "italic" }}>{language.lexiconSample.meaning}</div>
            </div>

            <div style={{ borderTop: "1px solid #F0EAD615" }} />

            {/* PHOIBLE Grid */}
            <div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.68rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", borderBottom: "1px solid #F0EAD615", paddingBottom: "4px" }}>PHOIBLE — DNA</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {language.phoneticInventory.map((ph, i) => (
                  <div key={i} style={{ border: "1px solid #F0EAD6", padding: "4px 8px", fontFamily: "Georgia, serif", fontSize: "1rem", color: "#8a9ab5", background: "#0d0d0d", textAlign: "center" }}>
                    {ph}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid #F0EAD615" }} />

            {/* Wikipedia acoustic summary */}
            <div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.68rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", borderBottom: "1px solid #F0EAD615", paddingBottom: "4px" }}>Wikipedia</div>
              <p style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: "0.78rem", color: "#F0EAD6", lineHeight: "1.7" }}>{language.acousticConsensus}</p>
            </div>

          </div>
        </div>

        {/* ── Panel 2: THE LAB (55%) ── */}
        <div style={{ flex: 1, borderRight: "2px solid #F0EAD6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Panel header */}
          <div style={{ padding: "14px 24px", borderBottom: "2px solid #F0EAD620", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <div style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "0.9rem", letterSpacing: "0.1em" }}>Vocal Synthesizer</div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#a09880", marginTop: "2px" }}>Script phrases in {language.title}</div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating || !phoneticScript.trim()}
              style={{ ...solidBtn, fontSize: "1rem", padding: "8px 18px", flexShrink: 0, opacity: generating || !phoneticScript.trim() ? 0.45 : 1 }}
            >
              {generating ? "Generating..." : "Generate Audio"}
            </button>
          </div>

          {/* Scrollable lab content */}
          <div className="panel-scroll" style={{ flex: 1, padding: "20px 24px 28px", display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Box 1: Voice Designer */}
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                Voice Designer
              </label>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.72rem", color: "#F0EAD640", letterSpacing: "0.06em", marginBottom: "6px" }}>Describes the speaker's physical vocal character.</div>
              <textarea
                value={voicePrompt}
                onChange={(e) => setVoicePrompt(e.target.value)}
                style={{ width: "100%", height: "72px", background: "transparent", border: "2px solid #F0EAD6", color: "#F0EAD6", fontFamily: "'VT323', monospace", fontSize: "1.1rem", padding: "10px", resize: "none" }}
              />
            </div>

            <div style={{ borderTop: "1px solid #F0EAD618" }} />

            {/* Box 2: The Intent */}
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                The Intent (English)
              </label>
              <textarea
                placeholder="Describe the emotion, action, or meaning. e.g., A desperate plea to the gods, a violent war cry..."
                value={englishIntent}
                onChange={(e) => setEnglishIntent(e.target.value)}
                style={{ width: "100%", height: "68px", background: "transparent", border: "2px solid #F0EAD6", color: "#F0EAD6", fontFamily: "'VT323', monospace", fontSize: "1.1rem", padding: "10px", resize: "none" }}
              />
            </div>

            {/* Control Row: Directives + Generate Script */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {DIRECTIVE_LABELS.map((d) => {
                const active = selectedDirectives.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => toggleDirective(d)}
                    style={{
                      background: active ? "#F0EAD6" : "transparent",
                      color: active ? "#121212" : "#F0EAD6",
                      border: "2px solid #F0EAD6",
                      fontFamily: "'VT323', monospace",
                      fontSize: "0.9rem",
                      letterSpacing: "0.05em",
                      padding: "5px 12px",
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    {d}
                  </button>
                );
              })}
              <button
                onClick={handleGenerateScript}
                disabled={!englishIntent.trim() || isGeneratingScript}
                style={{ ...solidBtn, fontSize: "0.9rem", padding: "5px 14px", letterSpacing: "0.06em", opacity: !englishIntent.trim() || isGeneratingScript ? 0.4 : 1, marginLeft: "auto" }}
              >
                {isGeneratingScript ? "Decrypting..." : "Generate Script"}
              </button>
            </div>

            {/* Box 3: Native Script */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>
                The Native Script (Editable)
                {isGeneratingScript && <span style={{ marginLeft: "10px", color: "#F0EAD650", fontSize: "0.78rem" }}>— BUFFERING RAW DATA...</span>}
              </label>
              <textarea
                readOnly={isGeneratingScript}
                placeholder="AI-generated phonetic script will appear here. Edit before generating audio."
                value={phoneticScript}
                onChange={(e) => !isGeneratingScript && setPhoneticScript(e.target.value)}
                style={{
                  width: "100%",
                  flex: 1,
                  minHeight: "90px",
                  background: isGeneratingScript ? "#0a0a0a" : "transparent",
                  border: `2px solid ${isGeneratingScript ? "#F0EAD650" : "#F0EAD6"}`,
                  color: isGeneratingScript ? "#F0EAD660" : "#F0EAD6",
                  fontFamily: "'VT323', monospace",
                  fontSize: "1.3rem",
                  padding: "10px",
                  resize: "none",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              />
            </div>

            {/* Footer: Typing Guide */}
            <div style={{ border: "1px solid #F0EAD625", padding: "10px 14px", flexShrink: 0 }}>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.72rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Typing Guide</div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.95rem", color: "#F0EAD6", lineHeight: "1.55" }}>{language.typingGuide}</div>
            </div>

          </div>
        </div>

        {/* ── Panel 3: LIBRARY (25%) ── */}
        <div style={{ width: "25%", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
          {/* Panel header */}
          <div style={{ padding: "14px 18px", borderBottom: "2px solid #F0EAD620", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
            <div>
              <div style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "0.9rem", letterSpacing: "0.08em" }}>Clip Library</div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#a09880", marginTop: "2px" }}>{clipLibrary.length} take{clipLibrary.length !== 1 ? "s" : ""} recorded</div>
            </div>
            <button
              onClick={onProceed}
              style={{ ...solidBtn, fontSize: "0.8rem", padding: "6px 12px", letterSpacing: "0.04em", flexShrink: 0 }}
            >
              Soundscape →
            </button>
          </div>

          {/* Clip list */}
          <div className="panel-scroll" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {clipLibrary.length === 0 && (
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", padding: "20px 16px", textAlign: "center", borderBottom: "2px dashed #F0EAD620", margin: "16px" }}>
                No clips yet. Generate audio to build your library.
              </div>
            )}
            {clipLibrary.map((clip, idx) => (
              <div
                key={clip.id}
                style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #F0EAD620", padding: "10px 16px", background: "#121212" }}
              >
                <button
                  onClick={() => handlePlay(clip.id)}
                  style={{ ...solidBtn, fontSize: "1rem", padding: "4px 12px", minWidth: "48px", flexShrink: 0 }}
                >
                  {playingId === clip.id ? "▶▶" : "▶"}
                </button>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clip.name}</div>
                  <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#a09880" }}>{clip.duration}s</div>
                </div>
                <button
                  onClick={() => onDeleteClip(clip.id)}
                  style={{ background: "transparent", color: "#a09880", border: "1px solid #a09880", fontFamily: "'VT323', monospace", fontSize: "0.9rem", cursor: "pointer", padding: "4px 8px", flexShrink: 0 }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

// ─── SCREEN 3: Soundscape — The Cinematic Mixer ───────────────────────────────

const PX_PER_SEC = 60;
const TIMELINE_DURATION = 30;
const TIME_MARKERS = [0, 5, 10, 15, 20, 25, 30];

function SoundscapeScreen({
  language,
  clipLibrary,
  onBack,
}: {
  language: LanguageSignal;
  clipLibrary: AudioClip[];
  onBack: () => void;
}) {
  const [voiceTrack, setVoiceTrack] = useState<TrackClip[]>([]);
  const [atmosphereTrack, setAtmosphereTrack] = useState<TrackClip[]>([]);
  const [atmosphereText, setAtmosphereText] = useState("");
  const [generatingAtmosphere, setGeneratingAtmosphere] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [atmosphereClips, setAtmosphereClips] = useState<AudioClip[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);

  const LABEL_W = 120;
  const trackWidth = TIMELINE_DURATION * PX_PER_SEC;
  const allSidebarClips = [...clipLibrary, ...atmosphereClips];

  function calcStartTime(e: React.DragEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + e.currentTarget.scrollLeft;
    return Math.max(0, Math.min(Math.floor(x / PX_PER_SEC), TIMELINE_DURATION - 1));
  }

  function handleTrackDrop(trackType: "voice" | "atmosphere", trackSetter: React.Dispatch<React.SetStateAction<TrackClip[]>>, e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const moveData = e.dataTransfer.getData("application/track-move");
    if (moveData) {
      try {
        const { id, originalDuration } = JSON.parse(moveData) as { id: string; originalDuration: number };
        const maxStart = Math.max(0, TIMELINE_DURATION - originalDuration);
        const newStart = Math.min(calcStartTime(e), maxStart);
        trackSetter((prev) => prev.map((c) => c.id === id ? { ...c, startTime: newStart, duration: originalDuration } : c));
      } catch { return; }
      return;
    }
    const clipData = e.dataTransfer.getData("application/clip");
    if (!clipData) return;
    try {
      const parsed = JSON.parse(clipData);
      const clipType = parsed.clipType as string;
      if (clipType !== trackType) return;
      const name = typeof parsed.name === "string" ? parsed.name : "";
      const duration = typeof parsed.duration === "number" && parsed.duration > 0 ? parsed.duration : 0;
      if (!name || !duration) return;
      const startTime = calcStartTime(e);
      const clampedDuration = Math.min(duration, TIMELINE_DURATION - startTime);
      if (clampedDuration <= 0) return;
      trackSetter((prev) => [
        ...prev,
        { id: `tc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name, startTime, duration: clampedDuration },
      ]);
    } catch { return; }
  }

  function handleGenerateAtmosphere() {
    if (!atmosphereText.trim() || generatingAtmosphere) return;
    setGeneratingAtmosphere(true);
    setTimeout(() => {
      const dur = Math.floor(Math.random() * 8) + 8;
      const clip: AudioClip = { id: `atm_${Date.now()}`, name: atmosphereText.trim(), duration: dur };
      setAtmosphereClips((prev) => [...prev, clip]);
      setAtmosphereTrack((prev) => [
        ...prev,
        { id: `tc_atm_${Date.now()}`, name: clip.name, startTime: 0, duration: TIMELINE_DURATION },
      ]);
      setGeneratingAtmosphere(false);
      setAtmosphereText("");
    }, 1400);
  }

  function handlePlayAll() {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 4000);
  }

  return (
    <div className="screen-fade-in" style={{ minHeight: "100vh", background: "#121212", color: "#F0EAD6", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ borderBottom: "4px solid #F0EAD6", padding: "0 24px", display: "flex", alignItems: "stretch", minHeight: "60px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ ...outlineBtn, border: "none", borderRight: "2px solid #F0EAD6", fontSize: "1.1rem", padding: "0 24px" }}>← Back to Recording</button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 24px", gap: "16px" }}>
          <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.2rem", letterSpacing: "0.12em" }}>BABELSOUNDS</span>
          <span style={{ color: "#F0EAD625" }}>|</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880" }}>Step 3 of 3 — The Cinematic Mixer</span>
          <span style={{ color: "#F0EAD625" }}>|</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#F0EAD6" }}>{language.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "0 0 0 16px" }}>
          <button onClick={handlePlayAll} style={{ ...solidBtn, fontSize: "1.1rem", padding: "0 20px", height: "100%", border: "none", borderLeft: "2px solid #F0EAD6" }}>
            {isPlaying ? "▶ Playing..." : "▶ Play All"}
          </button>
          <button style={{ ...outlineBtn, fontSize: "1.1rem", padding: "0 20px", height: "100%", border: "none", borderLeft: "2px solid #F0EAD6" }}>
            Export
          </button>
        </div>
      </div>

      {/* Main content: sidebar + timeline */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Clip Library Sidebar ── */}
        {isLibraryOpen && (
          <div style={{ width: "256px", flexShrink: 0, borderRight: "2px solid #F0EAD6", display: "flex", flexDirection: "column", background: "#0d0d0d" }}>
            <div style={{ padding: "14px 16px", borderBottom: "2px solid #F0EAD6", fontFamily: "'Rubik Mono One', monospace", fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Clip Library
            </div>
            <div style={{ padding: "10px 16px 6px", fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880", letterSpacing: "0.06em" }}>
              Drag clips onto a track
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
              {allSidebarClips.length === 0 && (
                <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", padding: "16px 8px", textAlign: "center", border: "2px dashed #F0EAD625" }}>
                  No clips yet.
                </div>
              )}
              {allSidebarClips.map((clip) => {
                const isAtmosphere = atmosphereClips.some((a) => a.id === clip.id);
                return (
                <div
                  key={clip.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("application/clip", JSON.stringify({ id: clip.id, name: clip.name, duration: clip.duration, clipType: isAtmosphere ? "atmosphere" : "voice" }));
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  style={{
                    border: "2px solid #F0EAD6",
                    background: "#121212",
                    padding: "10px 12px",
                    marginBottom: "6px",
                    cursor: "grab",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    userSelect: "none",
                  }}
                >
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.2rem", flexShrink: 0, color: "#a09880" }}>▶</span>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.05rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clip.name}</div>
                    <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#a09880" }}>{clip.duration}s · {isAtmosphere ? "Atmosphere" : "Voice"}</div>
                  </div>
                </div>
              );})}
            </div>
          </div>
        )}

        {/* ── Timeline + Atmosphere area ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
          {/* Timeline */}
          <div style={{ padding: "24px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <button
                onClick={() => setIsLibraryOpen((p) => !p)}
                style={{ ...outlineBtn, fontSize: "1rem", padding: "6px 14px" }}
              >
                {isLibraryOpen ? "[<] Close Library" : "[>] Open Library"}
              </button>
              <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1rem", letterSpacing: "0.08em" }}>
                THE TIMELINE
              </span>
            </div>

            <div style={{ border: "2px solid #F0EAD6", overflow: "hidden" }}>
              {/* Time ruler */}
              <div style={{ display: "grid", gridTemplateColumns: `${LABEL_W}px 1fr`, borderBottom: "2px solid #F0EAD6", background: "#0d0d0d" }}>
                <div style={{ borderRight: "2px solid #F0EAD6", padding: "6px 12px", fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880", textTransform: "uppercase" }}>
                  Track
                </div>
                <div style={{ overflowX: "auto" }}>
                  <div style={{ width: `${trackWidth}px`, position: "relative", height: "28px" }}>
                    {TIME_MARKERS.map((t) => (
                      <div key={t} style={{ position: "absolute", left: `${t * PX_PER_SEC}px`, top: 0, bottom: 0, display: "flex", alignItems: "center" }}>
                        <div style={{ width: "1px", background: "#F0EAD630", height: "100%", position: "absolute" }} />
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#a09880", paddingLeft: "4px", whiteSpace: "nowrap" }}>{t}s</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Track 1: Voices */}
              <TrackRow
                label="Voices"
                labelWidth={LABEL_W}
                trackWidth={trackWidth}
                clips={voiceTrack}
                onRemoveClip={(id) => setVoiceTrack((p) => p.filter((c) => c.id !== id))}
                onDrop={(e) => handleTrackDrop("voice", setVoiceTrack, e)}
              />

              {/* Track 2: Atmosphere */}
              <TrackRow
                label="Atmosphere"
                labelWidth={LABEL_W}
                trackWidth={trackWidth}
                clips={atmosphereTrack}
                onRemoveClip={(id) => setAtmosphereTrack((p) => p.filter((c) => c.id !== id))}
                onDrop={(e) => handleTrackDrop("atmosphere", setAtmosphereTrack, e)}
              />
            </div>
          </div>

          {/* Atmosphere generator */}
          <div style={{ padding: "0 24px 24px" }}>
            <div style={{ border: "2px solid #F0EAD6" }}>
              <div style={{ borderBottom: "2px solid #F0EAD6", padding: "10px 16px", background: "#F0EAD608", fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Atmosphere Generator
              </div>
              <div style={{ padding: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: "0.95rem", color: "#a09880", display: "block", marginBottom: "6px", letterSpacing: "0.06em" }}>
                    Describe the background atmosphere
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. haunting desert wind, deep metallic drones, cave drip resonance..."
                    value={atmosphereText}
                    onChange={(e) => setAtmosphereText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleGenerateAtmosphere(); }}
                    style={{ width: "100%", fontFamily: "'VT323', monospace", fontSize: "1.2rem", padding: "10px 14px" }}
                  />
                </div>
                <button
                  onClick={handleGenerateAtmosphere}
                  disabled={generatingAtmosphere || !atmosphereText.trim()}
                  style={{ ...solidBtn, fontSize: "1.2rem", padding: "12px 24px", marginTop: "24px", opacity: generatingAtmosphere || !atmosphereText.trim() ? 0.5 : 1 }}
                >
                  {generatingAtmosphere ? "Generating..." : "Generate Atmosphere"}
                </button>
              </div>
              {generatingAtmosphere && (
                <div style={{ borderTop: "1px solid #F0EAD625", padding: "8px 16px", fontFamily: "'VT323', monospace", fontSize: "0.95rem", color: "#a09880" }}>
                  Synthesizing atmosphere via ElevenLabs Music API...
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: "2px solid #F0EAD615", padding: "12px 24px", fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880", display: "flex", justifyContent: "space-between", marginTop: "auto" }}>
            <span>Babelsounds — Dead Language Audio Synthesis</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackRow({
  label,
  labelWidth,
  trackWidth,
  clips,
  onRemoveClip,
  onDrop,
}: {
  label: string;
  labelWidth: number;
  trackWidth: number;
  clips: TrackClip[];
  onRemoveClip: (id: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div style={{ display: "grid", gridTemplateColumns: `${labelWidth}px 1fr`, borderTop: "2px solid #F0EAD6", minHeight: "72px" }}>
      {/* Label column */}
      <div style={{ borderRight: "2px solid #F0EAD6", padding: "10px 12px", display: "flex", alignItems: "center", background: "#0d0d0d" }}>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
      </div>
      {/* Track area (drop target) */}
      <div
        style={{
          overflowX: "auto",
          background: dragOver ? "rgba(240, 234, 214, 0.08)" : "#0a0a0a",
          position: "relative",
          minHeight: "72px",
          transition: "background 0.15s",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = e.dataTransfer.types.includes("application/track-move") ? "move" : "copy";
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { setDragOver(false); onDrop(e); }}
      >
        <div style={{ width: `${trackWidth}px`, height: "100%", position: "relative" }}>
          {TIME_MARKERS.map((t) => (
            <div key={t} style={{ position: "absolute", left: `${t * PX_PER_SEC}px`, top: 0, bottom: 0, width: "1px", background: "#F0EAD610" }} />
          ))}
          {clips.map((clip) => (
            <div
              key={clip.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/track-move", JSON.stringify({ id: clip.id, originalDuration: clip.duration }));
                e.dataTransfer.effectAllowed = "move";
              }}
              style={{
                position: "absolute",
                left: `${clip.startTime * PX_PER_SEC}px`,
                top: "8px",
                bottom: "8px",
                width: `${clip.duration * PX_PER_SEC - 2}px`,
                background: "#F0EAD6",
                border: "2px solid #121212",
                display: "flex",
                alignItems: "center",
                padding: "0 22px 0 8px",
                overflow: "hidden",
                cursor: "grab",
              }}
              title={clip.name}
            >
              <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#121212", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "0.04em", flex: 1 }}>
                {clip.name}
              </span>
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); onRemoveClip(clip.id); }}
                draggable={false}
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "18px",
                  height: "18px",
                  background: "#121212",
                  color: "#F0EAD6",
                  border: "1px solid #F0EAD680",
                  fontFamily: "'VT323', monospace",
                  fontSize: "0.85rem",
                  lineHeight: "1",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
                title="Remove clip"
              >
                x
              </button>
            </div>
          ))}
        </div>
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
  const [clipLibrary, setClipLibrary] = useState<AudioClip[]>([]);

  function handleSelectLanguage(sig: LanguageSignal) {
    setSelectedLanguage(sig);
    setScreen("transition");
  }

  function handleAddClip(clip: AudioClip) {
    setClipLibrary((prev) => [...prev, clip]);
  }

  function handleDeleteClip(id: string) {
    setClipLibrary((prev) => prev.filter((c) => c.id !== id));
  }

  if (screen === "transition") {
    return <DataSynthesisTransition onComplete={() => setScreen("recording")} />;
  }

  if (screen === "recording" && selectedLanguage) {
    return (
      <RecordingScreen
        language={selectedLanguage}
        clipLibrary={clipLibrary}
        onAddClip={handleAddClip}
        onDeleteClip={handleDeleteClip}
        onBack={() => setScreen("archives")}
        onProceed={() => setScreen("soundscape")}
      />
    );
  }

  if (screen === "soundscape" && selectedLanguage) {
    return (
      <SoundscapeScreen
        language={selectedLanguage}
        clipLibrary={clipLibrary}
        onBack={() => setScreen("recording")}
      />
    );
  }

  return <ArchivesScreen onSelectLanguage={handleSelectLanguage} />;
}
