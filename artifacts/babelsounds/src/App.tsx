import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "archives" | "studio";

interface LanguageSignal {
  id: string;
  title: string;
  strength: number;
  description: string;
  dna: { guttural: number; sibilant: number; vocalic: number };
  why_match: string;
  phonetic_sample: string;
  fingerprint: string[];
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
    strength: 94,
    description:
      "Sourced from the Popol Vuh and Dresden Codex, cross-referenced against acoustic reconstructions of Classic Maya ceremonial sites at Palenque. The Camazotz death-bat deity presided over Xibalba's blood-sacrifice chambers — phoneme clusters were vocalized in complete darkness, demanding extreme resonance to carry through stone corridors.",
    dna: { guttural: 88, sibilant: 42, vocalic: 61 },
    why_match:
      "High consonant density aligns with this type of query. The subterranean acoustic environment of Xibalba favors deep, resonant tones over softer fricatives.",
    phonetic_sample: "XŌCH-\nYĀŌ-\nYŌTL",
    fingerprint: [
      "  /\\  /\\  /\\  /\\  ",
      " /XX\\/XX\\/XX\\/XX\\ ",
      "/____\\/____\\/____\\",
      "|  CAMAZOTZ  |BAT|",
      "|______|_____|___|",
      " \\  XIBALBA  /    ",
      "  \\__/\\__/\\__/    ",
      "   |  |  |  |    ",
      "_______________   ",
    ],
  },
  {
    id: "arc_02",
    title: "Ennead Death Invocation",
    strength: 81,
    description:
      "Recovered from papyrus scrolls (Spell 125, Book of the Dead) alongside acoustic modeling of the Hypostyle Hall at Karnak. The nine primordial Egyptian deities were invoked through sustained sibilant tones that induced resonance in the limestone chambers. Vowels were considered divine emanations, forbidden in written script but preserved in oral tradition.",
    dna: { guttural: 34, sibilant: 91, vocalic: 78 },
    why_match:
      "Sustained fricative chains dominate this language's phoneme structure. The sacred silence intervals suggest a rhythm-based synthesis approach, well-suited for ceremonial pacing.",
    phonetic_sample: "ĒN-\nLIL-\nKI",
    fingerprint: [
      "===================",
      "||  ENNEAD  GATE  ||",
      "||_______________||",
      "|| |   | |   | | ||",
      "|| |___|_|___|_| ||",
      "||  ANUBIS SCALE ||",
      "||_______________||",
      "=|||=====|||=====||",
      "  MA'AT    THOTH  ",
    ],
  },
  {
    id: "arc_03",
    title: "Proto-Uralic Shamanic Drone",
    strength: 73,
    description:
      "Reconstructed from Neolithic shaman burial sites in Western Siberia, cross-referenced with surviving Khanty and Selkup ceremonial recordings. This proto-language predates written record by 6,000 years. Characterized by sustained nasal drones and deep vowel harmonics — the earliest known precursors to throat-singing.",
    dna: { guttural: 67, sibilant: 28, vocalic: 95 },
    why_match:
      "Extreme vowel richness — the highest harmonic overtone index in the archive. The nasal resonance pattern is unique to Siberian permafrost acoustics, suggesting a two-voice synthesis layer.",
    phonetic_sample: "HA-\nAB-\nCUL",
    fingerprint: [
      "~~~~~~~~~~~~~~~~~~ ",
      "~ URAL TUNDRA SIG ~",
      "~~~~~~~~~~~~~~~~~~ ",
      "  )  (  )  (  )   ",
      " (\\  /)(\\  /)(\\   ",
      "  \\_//  \\_//  \\_/ ",
      "   |  DRONE  |    ",
      "   |_________|    ",
      "  /___________\\   ",
    ],
  },
  {
    id: "arc_04",
    title: "Elamite Lamentation Cycle",
    strength: 58,
    description:
      "Recovered from cuneiform tablets at Susa and Anshan. Elamite is one of the world's true language isolates — no confirmed relatives. Its lamentation genre featured antiphonal structure: a solo high priest vocalized the 'cry' motif, answered by temple singers using sustained low-register drones. A sound unheard for 2,500 years.",
    dna: { guttural: 55, sibilant: 63, vocalic: 47 },
    why_match:
      "A balanced phoneme profile across all dimensions. The antiphonal structure suits layered track architecture, and its linguistic isolation means a uniquely pure sound with no outside influence.",
    phonetic_sample: "TĒZ-\nCAT-\nLIP",
    fingerprint: [
      "+-----------------+",
      "|  SUSA  ARCHIVE  |",
      "+-----------------+",
      "| >>> CUNEIFORM   |",
      "| ||| ||| ||| ||| |",
      "| --- --- --- --- |",
      "| ELAMITE ISOLATE |",
      "|  NO  RELATIVES  |",
      "+-----------------+",
    ],
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
  onUse: (signal: LanguageSignal) => void;
}) {
  function ScaleBar({ leftLabel, rightLabel, value }: { leftLabel: string; rightLabel: string; value: number }) {
    const filled = Math.round(value / 10);
    const empty = 10 - filled;
    return (
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", marginBottom: "5px" }}>
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "1.2rem" }}>
          <span style={{ color: "#F0EAD6" }}>{"■".repeat(filled)}</span>
          <span style={{ color: "#F0EAD622" }}>{"■".repeat(empty)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="screen-fade-in"
        style={{ background: "#121212", border: "4px solid #F0EAD6", maxWidth: "680px", width: "100%", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div style={{ background: "#F0EAD6", color: "#121212", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Rubik Mono One', monospace", fontSize: "0.85rem", letterSpacing: "0.06em", flexShrink: 0 }}>
          <span>Language Information</span>
          <button onClick={onClose} style={{ background: "#121212", color: "#F0EAD6", border: "none", fontFamily: "'VT323', monospace", fontSize: "1.2rem", cursor: "pointer", padding: "2px 12px" }}>
            Close
          </button>
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Title */}
          <div style={{ borderBottom: "1px solid #F0EAD625", paddingBottom: "16px", display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.25rem", letterSpacing: "0.05em" }}>{signal.title}</span>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880" }}>Match: {signal.strength}%</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Fingerprint */}
            <div style={{ border: "2px solid #F0EAD6", padding: "14px" }}>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sound Character</div>
              <pre style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", lineHeight: "1.35", color: "#F0EAD6", margin: 0 }}>{signal.fingerprint.join("\n")}</pre>
            </div>
            {/* Attributes */}
            <div style={{ border: "2px solid #F0EAD6", padding: "14px" }}>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Attributes</div>
              <ScaleBar leftLabel="Harsh" rightLabel="Smooth" value={100 - signal.dna.guttural} />
              <ScaleBar leftLabel="Fast" rightLabel="Slow" value={100 - signal.dna.sibilant} />
              <ScaleBar leftLabel="Deep" rightLabel="High" value={100 - signal.dna.vocalic} />
            </div>
          </div>

          {/* Summary */}
          <div style={{ border: "2px solid #F0EAD6" }}>
            <div style={{ background: "#F0EAD608", borderBottom: "2px solid #F0EAD6", padding: "8px 16px", fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.08em" }}>Summary</div>
            <div style={{ padding: "16px", fontFamily: "'VT323', monospace", fontSize: "1.15rem", lineHeight: "1.6", color: "#F0EAD6" }}>
              <p style={{ margin: "0 0 12px 0" }}>{signal.description}</p>
              <p style={{ margin: 0, color: "#a09880", fontSize: "1.05rem" }}>{signal.why_match}</p>
            </div>
          </div>

          {/* Use button */}
          <button
            onClick={() => onUse(signal)}
            style={{ ...solidBtn, fontSize: "1.2rem", padding: "15px", width: "100%", letterSpacing: "0.08em", border: "4px solid #F0EAD6" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#121212"; (e.currentTarget as HTMLButtonElement).style.color = "#F0EAD6"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#F0EAD6"; (e.currentTarget as HTMLButtonElement).style.color = "#121212"; }}
          >
            Use this language
          </button>
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
        p = 100;
        clearInterval(iv);
        setSearching(false);
        setSearchDone(true);
      }
      setProgress(p);
    }, 75);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  function MatchBar({ value }: { value: number }) {
    const filled = Math.round(value / 5);
    const empty = 20 - filled;
    return (
      <span style={{ fontFamily: "monospace", fontSize: "1rem" }}>
        <span style={{ color: "#F0EAD6" }}>{"█".repeat(filled)}</span>
        <span style={{ color: "#F0EAD618" }}>{"░".repeat(empty)}</span>
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

      <div
        className="screen-fade-in"
        style={{ minHeight: "100vh", background: "#121212", color: "#F0EAD6", display: "flex", flexDirection: "column" }}
      >
        {/* Top bar */}
        <div style={{ borderBottom: "2px solid #F0EAD615", padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.4rem", letterSpacing: "0.14em" }}>BABELSOUNDS</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880" }}>The Archives</span>
        </div>

        {/* Main content — centered */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 40px 40px" }}>
          <div style={{ width: "100%", maxWidth: "760px", display: "flex", flexDirection: "column", gap: "0" }}>

            {/* Wordmark */}
            <div style={{ marginBottom: "60px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "clamp(2rem, 6vw, 3.5rem)", letterSpacing: "0.08em", lineHeight: 1 }}>
                THE ARCHIVES
              </div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.2rem", color: "#a09880", marginTop: "12px", letterSpacing: "0.1em" }}>
                A catalogue of lost voices. Select a language to begin.
              </div>
            </div>

            {/* Search block */}
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
                  onKeyDown={handleKeyDown}
                  style={{
                    flex: 1,
                    border: "none !important" as "none",
                    borderRight: "2px solid #F0EAD6 !important" as "none",
                    background: "transparent !important" as "transparent",
                    fontFamily: "'VT323', monospace",
                    fontSize: "1.4rem",
                    padding: "16px 20px",
                    color: "#F0EAD6",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleSearch}
                  style={{ ...solidBtn, fontSize: "1.3rem", padding: "16px 32px", border: "none", borderLeft: "2px solid #F0EAD6" }}
                >
                  {searching ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Progress */}
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

            {/* Results */}
            <div style={{ marginTop: "40px" }}>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", marginBottom: "10px", letterSpacing: "0.06em" }}>
                {searchDone ? `Showing best matches for "${query}"` : `${LANGUAGE_SIGNALS.length} languages in the archive`}
              </div>

              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 240px 100px", border: "2px solid #F0EAD6", borderBottom: "none", padding: "8px 16px", background: "#F0EAD608", fontFamily: "'VT323', monospace", fontSize: "0.95rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                <span>Name</span>
                <span>Match</span>
                <span style={{ textAlign: "right" }}>Action</span>
              </div>

              {LANGUAGE_SIGNALS.map((sig, idx) => (
                <div
                  key={sig.id}
                  style={{ display: "grid", gridTemplateColumns: "1fr 240px 100px", border: "2px solid #F0EAD6", borderBottom: idx === LANGUAGE_SIGNALS.length - 1 ? "2px solid #F0EAD6" : "none", padding: "14px 16px", alignItems: "center", background: "#121212" }}
                >
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.2rem", letterSpacing: "0.04em" }}>{sig.title}</span>
                  <span><MatchBar value={sig.strength} /></span>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => setInspecting(sig)} style={{ ...outlineBtn, fontSize: "1.05rem", padding: "6px 14px" }}>
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer marquee */}
        <div style={{ borderTop: "2px solid #F0EAD615", overflow: "hidden", padding: "7px 0", background: "#0d0d0d" }}>
          <span
            className="marquee-text"
            style={{ fontFamily: "'VT323', monospace", fontSize: "1.05rem", letterSpacing: "0.18em", color: "#a09880", animationDuration: "45s" }}
          >
            Exploring the sounds of lost civilizations and ancient myths. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Exploring the sounds of lost civilizations and ancient myths. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Exploring the sounds of lost civilizations and ancient myths. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Exploring the sounds of lost civilizations and ancient myths.
          </span>
        </div>
      </div>
    </>
  );
}

// ─── SCREEN 2: The Studio — shared sub-components ────────────────────────────

interface DrawerProps {
  number: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function StudioDrawer({ number, title, isOpen, onToggle, children }: DrawerProps) {
  return (
    <div style={{ border: "2px solid #F0EAD6", borderTop: "none" }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: "16px", padding: "14px 24px", background: isOpen ? "#F0EAD6" : "#121212", color: isOpen ? "#121212" : "#F0EAD6", border: "none", borderBottom: isOpen ? "2px solid #F0EAD6" : "none", cursor: "pointer", fontFamily: "'Rubik Mono One', monospace", fontSize: "1rem", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "left" }}
      >
        <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem", opacity: 0.5 }}>{number}.</span>
        <span>{title}</span>
        <span style={{ marginLeft: "auto", fontFamily: "'VT323', monospace", fontSize: "1.1rem", opacity: 0.5 }}>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div style={{ padding: "24px" }}>{children}</div>}
    </div>
  );
}

// Voice Options
const VOICE_OPTIONS = [
  { id: "sumerisk", label: "スメル語", sublabel: "Sumerian" },
  { id: "nahuatl", label: "ナワトル語", sublabel: "Nahuatl" },
  { id: "elamite", label: "エラム語", sublabel: "Elamite" },
  { id: "lydian", label: "リュディア語", sublabel: "Lydian" },
  { id: "linear_a", label: "線形文字Ａ", sublabel: "Linear-A" },
  { id: "mayan", label: "マヤ語", sublabel: "Proto-Mayan" },
];

const FAKE_WORDS = ["XŌCH-\nYĀŌ-\nYŌTL", "KUL-\nAB-\nBA", "TĒZ-\nCAT-\nLIP", "ĒN-\nLIL-\nKI", "HA-\nAB-\nCUL"];

function CreateVoice({ language }: { language: LanguageSignal }) {
  const [inputText, setInputText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("sumerisk");
  const [guideText, setGuideText] = useState(language.phonetic_sample);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { setGuideText(language.phonetic_sample); }, [language]);

  function handleGenerate() {
    setGenerating(true);
    let count = 0;
    const iv = setInterval(() => {
      setGuideText(FAKE_WORDS[Math.floor(Math.random() * FAKE_WORDS.length)]);
      count++;
      if (count > 8) {
        clearInterval(iv);
        setGenerating(false);
        setGuideText(language.phonetic_sample);
      }
    }, 120);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", minHeight: "320px" }}>
        {/* Col 1 */}
        <div style={{ border: "2px solid #F0EAD6", borderRight: "none", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.06em" }}>What should the AI say?</div>
          <div style={{ borderTop: "1px solid #F0EAD625", paddingTop: "10px" }}>
            <textarea
              rows={7}
              placeholder={`Type what you want vocalized in ${language.title}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ width: "100%", fontFamily: "'VT323', monospace", fontSize: "1.15rem" }}
            />
          </div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", marginTop: "auto", lineHeight: 1.6 }}>
            <div>Characters: {inputText.length}</div>
            <div style={{ borderTop: "1px solid #F0EAD622", marginTop: "8px", paddingTop: "8px" }}>
              Tone: {language.dna.guttural > 60 ? "Harsh" : "Smooth"}
            </div>
            <div>Pace: {language.dna.sibilant > 60 ? "Fast" : "Slow"}</div>
            <div>Depth: {language.dna.vocalic > 60 ? "Deep" : "High"}</div>
          </div>
        </div>

        {/* Col 2 */}
        <div style={{ border: "2px solid #F0EAD6", borderRight: "none", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.06em", alignSelf: "flex-start" }}>Pronunciation Guide</div>
          <div
            style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "3rem", letterSpacing: "0.04em", textAlign: "center", lineHeight: "1.05", border: "3px solid #F0EAD6", padding: "16px 24px", width: "100%", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "pre-line", color: generating ? "#a09880" : "#F0EAD6", transition: "color 0.1s" }}
          >
            {guideText}
          </div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", alignSelf: "flex-start", lineHeight: 1.5 }}>
            {generating ? "Generating..." : "Ready to play"}
            {!generating && <div style={{ color: "#F0EAD6" }}>Source: {language.title}</div>}
          </div>
        </div>

        {/* Col 3 */}
        <div style={{ border: "2px solid #F0EAD6", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.06em" }}>Voice Style</div>
          <div style={{ borderTop: "1px solid #F0EAD625", paddingTop: "10px", flex: 1 }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.05rem", marginBottom: "10px", color: "#a09880" }}>Select a voice style:</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
              {VOICE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedVoice(opt.id)}
                  style={{ background: selectedVoice === opt.id ? "#F0EAD6" : "#121212", color: selectedVoice === opt.id ? "#121212" : "#F0EAD6", border: "2px solid #F0EAD6", padding: "8px 6px", fontFamily: "'VT323', monospace", cursor: "pointer", textAlign: "left", lineHeight: "1.2" }}
                >
                  <div style={{ fontSize: "1.3rem" }}>{opt.label}</div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>{opt.sublabel}</div>
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleGenerate} style={{ ...solidBtn, fontSize: "1.2rem", padding: "14px", width: "100%", marginTop: "auto" }}>
            {generating ? "Generating..." : "Generate Audio"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Waveform
const BASE_HEIGHTS = [8, 20, 35, 18, 42, 28, 12, 38, 22, 45, 16, 30, 40, 14, 25, 36, 10, 44, 20, 32, 8, 38, 26, 15, 40, 22, 33, 12, 48, 18, 28, 42, 9, 35, 24, 16, 44, 30, 11, 38, 20, 46, 14, 32, 28, 41, 7, 36, 23, 17];

function WaveformDisplay({ playing }: { playing: boolean }) {
  const [animH, setAnimH] = useState<number[]>(BASE_HEIGHTS);
  useEffect(() => {
    if (!playing) { setAnimH(BASE_HEIGHTS); return; }
    const iv = setInterval(() => setAnimH(BASE_HEIGHTS.map((h) => Math.max(4, h + Math.floor(Math.random() * 10 - 5)))), 150);
    return () => clearInterval(iv);
  }, [playing]);
  return (
    <div style={{ display: "flex", alignItems: "center", height: "52px", gap: "2px", flex: 1, padding: "0 8px" }}>
      {animH.map((h, i) => (
        <div key={i} className="waveform-bar" style={{ height: `${h}px`, opacity: playing ? 0.9 : 0.55, transition: playing ? "height 0.12s" : "none" }} />
      ))}
    </div>
  );
}

function RefineSound({ language }: { language: LanguageSignal }) {
  const [pitch, setPitch] = useState(50);
  const [echo, setEcho] = useState(30);
  const [layers, setLayers] = useState(20);
  const [tracks, setTracks] = useState([
    { id: 1, name: language.title, playing: false, muted: false },
    { id: 2, name: "Ambient Layer", playing: false, muted: false },
  ]);

  useEffect(() => {
    setTracks((prev) => prev.map((t) => (t.id === 1 ? { ...t, name: language.title } : t)));
  }, [language]);

  function updateTrack(id: number, patch: Partial<(typeof tracks)[0]>) {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }
  function deleteTrack(id: number) {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }

  function Slider({ label, left, right, value, onChange }: { label: string; left: string; right: string; value: number; onChange: (v: number) => void }) {
    const filled = Math.floor(value / 10);
    const bar = `${"=".repeat(filled)}|${" ".repeat(10 - filled)}`;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.05rem", letterSpacing: "0.1em", display: "flex", justifyContent: "space-between", textTransform: "uppercase" }}>
          <span>{label}</span>
          <span style={{ color: "#a09880", fontSize: "0.9rem" }}>{value}%</span>
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.15rem", color: "#F0EAD6", letterSpacing: "-0.02em" }}>{bar}</div>
        <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880" }}>
          <span>{left}</span>
          <span>{right}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ border: "2px solid #F0EAD6", padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px" }}>
        <Slider label="Pitch" left="Low" right="High" value={pitch} onChange={setPitch} />
        <Slider label="Echo" left="Dry" right="Wet" value={echo} onChange={setEcho} />
        <Slider label="Layers" left="Single" right="Full" value={layers} onChange={setLayers} />
      </div>

      <div style={{ border: "2px solid #F0EAD6", padding: "20px" }}>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>Audio Tracks</div>

        {tracks.length === 0 && (
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880", padding: "16px 0" }}>No tracks.</div>
        )}

        {tracks.map((trk) => (
          <div key={trk.id} style={{ display: "flex", alignItems: "center", gap: "10px", border: "2px solid #F0EAD6", marginBottom: "8px", padding: "10px", background: "#121212", opacity: trk.muted ? 0.4 : 1 }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", minWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trk.name}</div>
            <button onClick={() => updateTrack(trk.id, { playing: !trk.playing })} style={{ ...solidBtn, fontSize: "1.05rem", padding: "6px 14px", minWidth: "68px" }}>
              {trk.playing ? "Stop" : "Play"}
            </button>
            <button
              onClick={() => updateTrack(trk.id, { muted: !trk.muted })}
              style={{ ...outlineBtn, fontSize: "1.05rem", padding: "6px 14px", minWidth: "80px", ...(trk.muted ? { background: "#F0EAD6", color: "#121212" } : {}) }}
            >
              {trk.muted ? "Unmute" : "Mute"}
            </button>
            <button
              onClick={() => deleteTrack(trk.id)}
              style={{ background: "#121212", color: "#a09880", border: "2px solid #a09880", fontFamily: "'VT323', monospace", fontSize: "1.05rem", cursor: "pointer", padding: "6px 14px" }}
            >
              Delete
            </button>
            <div style={{ flex: 1, border: "1px solid #F0EAD622", background: "#0a0a0a", height: "52px", display: "flex" }}>
              <WaveformDisplay playing={trk.playing} />
            </div>
          </div>
        ))}

        <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
          <button onClick={() => setTracks((p) => p.map((t) => ({ ...t, playing: true })))} style={solidBtn}>Play All</button>
          <button onClick={() => setTracks((p) => p.map((t) => ({ ...t, playing: false })))} style={outlineBtn}>Stop All</button>
          <button style={outlineBtn}>Record</button>
          <button style={outlineBtn}>Export</button>
          <div style={{ marginLeft: "auto", border: "2px solid #F0EAD6", padding: "6px 16px", fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880", display: "flex", alignItems: "center", gap: "10px" }}>
            Tempo: <span style={{ color: "#F0EAD6" }}>120</span>
            <span style={{ color: "#F0EAD625" }}>|</span>
            Key: <span style={{ color: "#F0EAD6" }}>Dm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 2: The Studio ─────────────────────────────────────────────────────

function StudioScreen({ language, onChangeLanguage }: { language: LanguageSignal; onChangeLanguage: () => void }) {
  const [openDrawer, setOpenDrawer] = useState<number>(1);
  const toggle = (n: number) => setOpenDrawer((p) => (p === n ? 0 : n));

  return (
    <div className="screen-fade-in" style={{ minHeight: "100vh", background: "#121212", color: "#F0EAD6", display: "flex", flexDirection: "column" }}>
      {/* Studio header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#121212",
          borderBottom: "4px solid #F0EAD6",
          padding: "0 24px",
          display: "flex",
          alignItems: "stretch",
          minHeight: "60px",
        }}
      >
        {/* Left: wordmark + language */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px", flex: 1, padding: "12px 0" }}>
          <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.2rem", letterSpacing: "0.12em", borderRight: "2px solid #F0EAD630", paddingRight: "24px" }}>
            BABELSOUNDS
          </span>
          <div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.95rem", color: "#a09880", letterSpacing: "0.06em" }}>Active Language</div>
            <div style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1rem", letterSpacing: "0.04em" }}>{language.title}</div>
          </div>
        </div>

        {/* Right: change language */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={onChangeLanguage}
            style={{ ...outlineBtn, fontSize: "1.1rem", padding: "8px 20px", border: "none", borderLeft: "2px solid #F0EAD6", height: "100%" }}
          >
            Change Language
          </button>
        </div>
      </div>

      {/* The Studio label */}
      <div style={{ borderBottom: "2px solid #F0EAD615", padding: "10px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", letterSpacing: "0.08em" }}>The Studio</span>
        <span style={{ color: "#F0EAD625" }}>|</span>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880" }}>
          Tone: {language.dna.guttural > 60 ? "Harsh" : "Smooth"} &nbsp;·&nbsp;
          Pace: {language.dna.sibilant > 60 ? "Fast" : "Slow"} &nbsp;·&nbsp;
          Depth: {language.dna.vocalic > 60 ? "Deep" : "High"} &nbsp;·&nbsp;
          Match: {language.strength}%
        </span>
      </div>

      {/* Drawers */}
      <div style={{ maxWidth: "1400px", width: "100%", margin: "0 auto", flex: 1 }}>
        <div style={{ borderTop: "2px solid #F0EAD6" }} />
        <StudioDrawer number="1" title="Create the Voice" isOpen={openDrawer === 1} onToggle={() => toggle(1)}>
          <CreateVoice language={language} />
        </StudioDrawer>
        <StudioDrawer number="2" title="Refine the Sound" isOpen={openDrawer === 2} onToggle={() => toggle(2)}>
          <RefineSound language={language} />
        </StudioDrawer>

        {/* Footer */}
        <div style={{ borderTop: "2px solid #F0EAD6", padding: "12px 24px", fontFamily: "'VT323', monospace", fontSize: "0.95rem", color: "#a09880", display: "flex", justifyContent: "space-between" }}>
          <span>Babelsounds — Dead Language Audio Synthesis</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("archives");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageSignal | null>(null);

  function handleSelectLanguage(sig: LanguageSignal) {
    setSelectedLanguage(sig);
    setScreen("studio");
  }

  function handleChangeLanguage() {
    setScreen("archives");
  }

  if (screen === "studio" && selectedLanguage) {
    return <StudioScreen language={selectedLanguage} onChangeLanguage={handleChangeLanguage} />;
  }

  return <ArchivesScreen onSelectLanguage={handleSelectLanguage} />;
}
