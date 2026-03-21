import { useState, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DrawerProps {
  number: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

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

// ─── Button helpers ───────────────────────────────────────────────────────────

const solidBtn: React.CSSProperties = {
  background: "#F0EAD6",
  color: "#121212",
  border: "2px solid #F0EAD6",
  fontFamily: "'VT323', monospace",
  fontSize: "1.2rem",
  letterSpacing: "0.06em",
  cursor: "pointer",
  padding: "8px 18px",
  textTransform: "uppercase" as const,
  whiteSpace: "nowrap" as const,
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
  textTransform: "uppercase" as const,
  whiteSpace: "nowrap" as const,
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

// ─── RackDrawer ──────────────────────────────────────────────────────────────

function RackDrawer({ number, title, isOpen, onToggle, children }: DrawerProps) {
  return (
    <div style={{ border: "2px solid #F0EAD6", borderTop: "none" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "12px 20px",
          background: isOpen ? "#F0EAD6" : "#121212",
          color: isOpen ? "#121212" : "#F0EAD6",
          border: "none",
          borderBottom: isOpen ? "2px solid #F0EAD6" : "none",
          cursor: "pointer",
          fontFamily: "'Rubik Mono One', monospace",
          fontSize: "1rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: "1.4rem",
            minWidth: "24px",
            opacity: 0.5,
          }}
        >
          {number}.
        </span>
        <span>{title}</span>
        <span style={{ marginLeft: "auto", fontFamily: "'VT323', monospace", fontSize: "1.1rem", opacity: 0.5 }}>
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      {isOpen && <div style={{ padding: "20px" }}>{children}</div>}
    </div>
  );
}

// ─── Language Detail Modal ────────────────────────────────────────────────────

function SignalModal({
  signal,
  onClose,
  onUse,
}: {
  signal: LanguageSignal;
  onClose: () => void;
  onUse: (signal: LanguageSignal) => void;
}) {
  // Tone: guttural high = Harsh, low = Smooth
  // Pace: sibilant high = Fast, low = Slow
  // Depth: vocalic high = Deep, low = High-pitched

  function ScaleBar({
    leftLabel,
    rightLabel,
    value,
  }: {
    leftLabel: string;
    rightLabel: string;
    value: number;
  }) {
    const filled = Math.round(value / 10);
    const empty = 10 - filled;
    return (
      <div style={{ marginBottom: "14px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'VT323', monospace",
            fontSize: "1rem",
            color: "#a09880",
            marginBottom: "4px",
          }}
        >
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "1.15rem",
            color: "#F0EAD6",
            letterSpacing: "0.02em",
          }}
        >
          {"■".repeat(filled)}
          <span style={{ color: "#F0EAD625" }}>{"■".repeat(empty)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#121212",
          border: "4px solid #F0EAD6",
          maxWidth: "700px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            background: "#F0EAD6",
            color: "#121212",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "'Rubik Mono One', monospace",
            fontSize: "0.9rem",
            letterSpacing: "0.06em",
            borderBottom: "4px solid #F0EAD6",
            flexShrink: 0,
          }}
        >
          <span>Language Information</span>
          <button
            onClick={onClose}
            style={{
              background: "#121212",
              color: "#F0EAD6",
              border: "2px solid #121212",
              fontFamily: "'VT323', monospace",
              fontSize: "1.2rem",
              cursor: "pointer",
              padding: "2px 12px",
            }}
          >
            Close
          </button>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Title + match */}
          <div
            style={{
              borderBottom: "2px solid #F0EAD620",
              paddingBottom: "14px",
              display: "flex",
              alignItems: "baseline",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "'Rubik Mono One', monospace",
                fontSize: "1.3rem",
                letterSpacing: "0.06em",
              }}
            >
              {signal.title}
            </span>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880" }}>
              Match: {signal.strength}%
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* ASCII Fingerprint */}
            <div style={{ border: "2px solid #F0EAD6", padding: "14px" }}>
              <div
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "0.95rem",
                  color: "#a09880",
                  letterSpacing: "0.08em",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                }}
              >
                Sound Character
              </div>
              <pre
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "1rem",
                  lineHeight: "1.35",
                  color: "#F0EAD6",
                  margin: 0,
                  letterSpacing: "0.04em",
                }}
              >
                {signal.fingerprint.join("\n")}
              </pre>
            </div>

            {/* Scale Attributes */}
            <div style={{ border: "2px solid #F0EAD6", padding: "14px" }}>
              <div
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "0.95rem",
                  color: "#a09880",
                  letterSpacing: "0.08em",
                  marginBottom: "14px",
                  textTransform: "uppercase",
                }}
              >
                Attributes
              </div>
              <ScaleBar leftLabel="Harsh" rightLabel="Smooth" value={100 - signal.dna.guttural} />
              <ScaleBar leftLabel="Fast" rightLabel="Slow" value={100 - signal.dna.sibilant} />
              <ScaleBar leftLabel="Deep" rightLabel="High" value={100 - signal.dna.vocalic} />
            </div>
          </div>

          {/* Summary */}
          <div style={{ border: "2px solid #F0EAD6" }}>
            <div
              style={{
                background: "#F0EAD608",
                borderBottom: "2px solid #F0EAD6",
                padding: "8px 14px",
                fontFamily: "'VT323', monospace",
                fontSize: "0.95rem",
                color: "#a09880",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Summary
            </div>
            <div
              style={{
                padding: "14px",
                fontFamily: "'VT323', monospace",
                fontSize: "1.15rem",
                lineHeight: "1.55",
                color: "#F0EAD6",
              }}
            >
              <p style={{ margin: "0 0 12px 0" }}>{signal.description}</p>
              <p style={{ margin: 0, color: "#a09880", fontSize: "1.05rem" }}>{signal.why_match}</p>
            </div>
          </div>

          {/* Use Button */}
          <button
            onClick={() => onUse(signal)}
            style={{
              ...solidBtn,
              fontSize: "1.25rem",
              padding: "14px",
              width: "100%",
              letterSpacing: "0.1em",
              border: "4px solid #F0EAD6",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#121212";
              (e.currentTarget as HTMLButtonElement).style.color = "#F0EAD6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#F0EAD6";
              (e.currentTarget as HTMLButtonElement).style.color = "#121212";
            }}
          >
            Use this language
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Drawer 1: Find a Language ────────────────────────────────────────────────

function FindLanguage({ onSelectSignal }: { onSelectSignal: (signal: LanguageSignal) => void }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [inspecting, setInspecting] = useState<LanguageSignal | null>(null);

  function handleSearch() {
    if (!query.trim() || searching) return;
    setSearching(true);
    setSearchDone(false);
    setSearchProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 8) + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setSearching(false);
        setSearchDone(true);
      }
      setSearchProgress(p);
    }, 80);
  }

  function MatchBar({ value }: { value: number }) {
    const filled = Math.round(value / 5);
    const empty = 20 - filled;
    return (
      <span style={{ fontFamily: "monospace", fontSize: "1rem" }}>
        <span style={{ color: "#F0EAD6" }}>{"█".repeat(filled)}</span>
        <span style={{ color: "#F0EAD620" }}>{"░".repeat(empty)}</span>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", marginLeft: "6px", color: "#a09880" }}>
          {value}%
        </span>
      </span>
    );
  }

  return (
    <>
      {inspecting && (
        <SignalModal
          signal={inspecting}
          onClose={() => setInspecting(null)}
          onUse={(sig) => {
            setInspecting(null);
            onSelectSignal(sig);
          }}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Search input */}
        <div style={{ border: "2px solid #F0EAD6", padding: "14px" }}>
          <div
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: "1.15rem",
              color: "#a09880",
              marginBottom: "8px",
              letterSpacing: "0.05em",
            }}
          >
            What are you looking for?
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <textarea
              rows={2}
              placeholder="e.g. Ancient Greek, deep desert chants, whispering spirits..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, fontFamily: "'VT323', monospace", fontSize: "1.2rem" }}
            />
            <button
              onClick={handleSearch}
              style={{ ...solidBtn, marginTop: "2px", fontSize: "1.25rem", padding: "10px 24px" }}
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Progress bar */}
          {(searching || searchDone) && (
            <div style={{ marginTop: "12px" }}>
              <div
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "1rem",
                  color: "#a09880",
                  marginBottom: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{searching ? "Searching the archive..." : "Search complete"}</span>
                <span>{searchProgress}%</span>
              </div>
              <div
                style={{
                  height: "8px",
                  background: "#0a0a0a",
                  border: "1px solid #F0EAD630",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${searchProgress}%`,
                    background: searchDone ? "#F0EAD6" : "#a09880",
                    transition: "width 0.1s",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Results table */}
        <div>
          <div
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: "1rem",
              color: "#a09880",
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{LANGUAGE_SIGNALS.length} languages available</span>
            {searchDone && (
              <span style={{ color: "#F0EAD6" }}>Showing best matches for your query</span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Header row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 220px 100px",
                border: "2px solid #F0EAD6",
                borderBottom: "none",
                padding: "8px 14px",
                background: "#F0EAD60A",
                fontFamily: "'VT323', monospace",
                fontSize: "1rem",
                color: "#a09880",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <span>Name</span>
              <span>Match</span>
              <span style={{ textAlign: "right" }}>Action</span>
            </div>

            {LANGUAGE_SIGNALS.map((sig, idx) => (
              <div
                key={sig.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 220px 100px",
                  border: "2px solid #F0EAD6",
                  borderBottom: idx === LANGUAGE_SIGNALS.length - 1 ? "2px solid #F0EAD6" : "none",
                  padding: "12px 14px",
                  alignItems: "center",
                  background: "#121212",
                }}
              >
                <span
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: "1.2rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  {sig.title}
                </span>
                <span>
                  <MatchBar value={sig.strength} />
                </span>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setInspecting(sig)}
                    style={{ ...outlineBtn, fontSize: "1.1rem", padding: "6px 14px" }}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Drawer 2: Create the Voice ───────────────────────────────────────────────

const VOICE_OPTIONS = [
  { id: "sumerisk", label: "スメル語", sublabel: "Sumerian" },
  { id: "nahuatl", label: "ナワトル語", sublabel: "Nahuatl" },
  { id: "elamite", label: "エラム語", sublabel: "Elamite" },
  { id: "lydian", label: "リュディア語", sublabel: "Lydian" },
  { id: "linear_a", label: "線形文字Ａ", sublabel: "Linear-A" },
  { id: "mayan", label: "マヤ語", sublabel: "Proto-Mayan" },
];

const FAKE_WORDS = [
  "XŌCH-\nYĀŌ-\nYŌTL",
  "KUL-\nAB-\nBA",
  "TĒZ-\nCAT-\nLIP",
  "ĒN-\nLIL-\nKI",
  "HA-\nAB-\nCUL",
];

function CreateVoice({ lockedSignal }: { lockedSignal: LanguageSignal | null }) {
  const [inputText, setInputText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("sumerisk");
  const [generatedWord, setGeneratedWord] = useState(FAKE_WORDS[0]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (lockedSignal) setGeneratedWord(lockedSignal.phonetic_sample);
  }, [lockedSignal]);

  function handleGenerate() {
    setGenerating(true);
    let count = 0;
    const interval = setInterval(() => {
      setGeneratedWord(FAKE_WORDS[Math.floor(Math.random() * FAKE_WORDS.length)]);
      count++;
      if (count > 8) {
        clearInterval(interval);
        setGenerating(false);
        if (lockedSignal) setGeneratedWord(lockedSignal.phonetic_sample);
      }
    }, 120);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Active language banner */}
      {lockedSignal && (
        <div
          style={{
            border: "2px solid #F0EAD6",
            borderBottom: "none",
            padding: "10px 16px",
            background: "#F0EAD60A",
            fontFamily: "'VT323', monospace",
            fontSize: "1.15rem",
            color: "#a09880",
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#F0EAD6" }}>Active language:</span>
          <span>{lockedSignal.title}</span>
          <span>Match {lockedSignal.strength}%</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", minHeight: "320px" }}>
        {/* Column 1: Text input */}
        <div
          style={{
            border: "2px solid #F0EAD6",
            borderRight: "none",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            What should the AI say?
          </div>
          <div style={{ borderTop: "1px solid #F0EAD630", paddingTop: "10px" }}>
            <textarea
              rows={7}
              placeholder={
                lockedSignal
                  ? `Language set: ${lockedSignal.title}. Type what you want the AI to vocalize...`
                  : "Type what you want the AI to vocalize in the chosen language..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ width: "100%", fontFamily: "'VT323', monospace", fontSize: "1.15rem" }}
            />
          </div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", marginTop: "auto", lineHeight: 1.6 }}>
            <div>Characters: {inputText.length}</div>
            {lockedSignal && (
              <>
                <div style={{ borderTop: "1px solid #F0EAD625", marginTop: "8px", paddingTop: "8px" }}>
                  Tone: {lockedSignal.dna.guttural > 60 ? "Harsh" : "Smooth"}
                </div>
                <div>Pace: {lockedSignal.dna.sibilant > 60 ? "Fast" : "Slow"}</div>
                <div>Depth: {lockedSignal.dna.vocalic > 60 ? "Deep" : "High"}</div>
              </>
            )}
          </div>
        </div>

        {/* Column 2: Pronunciation Guide */}
        <div
          style={{
            border: "2px solid #F0EAD6",
            borderRight: "none",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: "1rem",
              color: "#a09880",
              letterSpacing: "0.06em",
              alignSelf: "flex-start",
              textTransform: "uppercase",
            }}
          >
            Pronunciation Guide
          </div>
          <div
            style={{
              fontFamily: "'Rubik Mono One', monospace",
              fontSize: "3rem",
              letterSpacing: "0.04em",
              textAlign: "center",
              lineHeight: "1.05",
              border: "3px solid #F0EAD6",
              padding: "16px 24px",
              width: "100%",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "pre-line",
              color: generating ? "#a09880" : "#F0EAD6",
              transition: "color 0.1s",
            }}
          >
            {generatedWord}
          </div>
          <div
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: "1rem",
              color: "#a09880",
              alignSelf: "flex-start",
              lineHeight: 1.5,
            }}
          >
            {generating ? "Generating..." : "Ready to play"}
            {lockedSignal && !generating && (
              <div style={{ color: "#F0EAD6" }}>Source: {lockedSignal.title}</div>
            )}
          </div>
        </div>

        {/* Column 3: Voice style + Generate */}
        <div
          style={{
            border: "2px solid #F0EAD6",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Voice Style
          </div>
          <div style={{ borderTop: "1px solid #F0EAD630", paddingTop: "10px", flex: 1 }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.05rem", marginBottom: "10px", color: "#a09880" }}>
              Select a voice style:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
              {VOICE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedVoice(opt.id)}
                  style={{
                    background: selectedVoice === opt.id ? "#F0EAD6" : "#121212",
                    color: selectedVoice === opt.id ? "#121212" : "#F0EAD6",
                    border: "2px solid #F0EAD6",
                    padding: "8px 6px",
                    fontFamily: "'VT323', monospace",
                    cursor: "pointer",
                    textAlign: "left",
                    lineHeight: "1.2",
                  }}
                >
                  <div style={{ fontSize: "1.3rem" }}>{opt.label}</div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>{opt.sublabel}</div>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            style={{
              ...solidBtn,
              marginTop: "auto",
              fontSize: "1.25rem",
              padding: "14px",
              width: "100%",
              letterSpacing: "0.06em",
            }}
          >
            {generating ? "Generating..." : "Generate Audio"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Drawer 3: Refine the Sound ───────────────────────────────────────────────

const BASE_HEIGHTS = [8, 20, 35, 18, 42, 28, 12, 38, 22, 45, 16, 30, 40, 14, 25, 36, 10, 44, 20, 32, 8, 38, 26, 15, 40, 22, 33, 12, 48, 18, 28, 42, 9, 35, 24, 16, 44, 30, 11, 38, 20, 46, 14, 32, 28, 41, 7, 36, 23, 17];

function WaveformDisplay({ playing }: { playing: boolean }) {
  const [animHeights, setAnimHeights] = useState<number[]>(BASE_HEIGHTS);

  useEffect(() => {
    if (!playing) { setAnimHeights(BASE_HEIGHTS); return; }
    const interval = setInterval(() => {
      setAnimHeights(BASE_HEIGHTS.map((h) => Math.max(4, h + Math.floor(Math.random() * 10 - 5))));
    }, 150);
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div style={{ display: "flex", alignItems: "center", height: "52px", gap: "2px", flex: 1, padding: "0 8px" }}>
      {animHeights.map((h, i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{ height: `${h}px`, opacity: playing ? 0.9 : 0.6, transition: playing ? "height 0.12s" : "none" }}
        />
      ))}
    </div>
  );
}

function RefineSound({ lockedSignal }: { lockedSignal: LanguageSignal | null }) {
  const [pitch, setPitch] = useState(50);
  const [echo, setEcho] = useState(30);
  const [layers, setLayers] = useState(20);
  const [tracks, setTracks] = useState([
    { id: 1, name: lockedSignal?.title ?? "Base Layer", playing: false, muted: false },
    { id: 2, name: "Ambient Layer", playing: false, muted: false },
  ]);

  useEffect(() => {
    if (lockedSignal) {
      setTracks((prev) =>
        prev.map((t) => (t.id === 1 ? { ...t, name: lockedSignal.title } : t))
      );
    }
  }, [lockedSignal]);

  function updateTrack(id: number, patch: Partial<(typeof tracks)[0]>) {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function deleteTrack(id: number) {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }

  function renderSlider(
    label: string,
    leftLabel: string,
    rightLabel: string,
    value: number,
    onChange: (v: number) => void,
  ) {
    const filled = Math.floor(value / 10);
    const empty = 10 - filled;
    const bar = `${"=".repeat(filled)}|${" ".repeat(empty)}`;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: "1.05rem",
            letterSpacing: "0.1em",
            display: "flex",
            justifyContent: "space-between",
            textTransform: "uppercase",
          }}
        >
          <span>{label}</span>
          <span style={{ color: "#a09880", fontSize: "0.95rem" }}>{value}%</span>
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.2rem", color: "#F0EAD6", letterSpacing: "-0.02em" }}>
          {bar}
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880" }}>
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", minHeight: "360px" }}>
      {/* Sliders */}
      <div
        style={{
          border: "2px solid #F0EAD6",
          padding: "18px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "28px",
        }}
      >
        {renderSlider("Pitch", "Low", "High", pitch, setPitch)}
        {renderSlider("Echo", "Dry", "Wet", echo, setEcho)}
        {renderSlider("Layers", "Single", "Full", layers, setLayers)}
      </div>

      {/* Timeline */}
      <div style={{ border: "2px solid #F0EAD6", padding: "18px" }}>
        <div
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: "1rem",
            color: "#a09880",
            letterSpacing: "0.06em",
            marginBottom: "14px",
            textTransform: "uppercase",
          }}
        >
          Audio Tracks
        </div>

        {tracks.length === 0 && (
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880", padding: "20px 0" }}>
            No tracks. Add a language from the Find a Language step.
          </div>
        )}

        {tracks.map((trk) => (
          <div
            key={trk.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              border: "2px solid #F0EAD6",
              marginBottom: "8px",
              padding: "10px",
              background: "#121212",
              opacity: trk.muted ? 0.45 : 1,
            }}
          >
            <div
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: "1.1rem",
                minWidth: "140px",
                letterSpacing: "0.04em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {trk.name}
            </div>
            <button
              onClick={() => updateTrack(trk.id, { playing: !trk.playing })}
              style={{ ...solidBtn, fontSize: "1.05rem", padding: "6px 14px", minWidth: "72px" }}
            >
              {trk.playing ? "Stop" : "Play"}
            </button>
            <button
              onClick={() => updateTrack(trk.id, { muted: !trk.muted })}
              style={{
                ...outlineBtn,
                fontSize: "1.05rem",
                padding: "6px 14px",
                minWidth: "72px",
                ...(trk.muted ? { background: "#F0EAD6", color: "#121212" } : {}),
              }}
            >
              {trk.muted ? "Unmute" : "Mute"}
            </button>
            <button
              onClick={() => deleteTrack(trk.id)}
              style={{
                background: "#121212",
                color: "#a09880",
                border: "2px solid #a09880",
                fontFamily: "'VT323', monospace",
                fontSize: "1.05rem",
                cursor: "pointer",
                padding: "6px 14px",
              }}
            >
              Delete
            </button>
            <div
              style={{
                flex: 1,
                border: "1px solid #F0EAD625",
                background: "#0a0a0a",
                height: "52px",
                display: "flex",
              }}
            >
              <WaveformDisplay playing={trk.playing} />
            </div>
          </div>
        ))}

        {/* Transport row */}
        <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
          <button onClick={() => setTracks((p) => p.map((t) => ({ ...t, playing: true })))} style={solidBtn}>
            Play All
          </button>
          <button onClick={() => setTracks((p) => p.map((t) => ({ ...t, playing: false })))} style={outlineBtn}>
            Stop All
          </button>
          <button style={outlineBtn}>Record</button>
          <button style={outlineBtn}>Export</button>
          <div
            style={{
              marginLeft: "auto",
              border: "2px solid #F0EAD6",
              padding: "6px 14px",
              fontFamily: "'VT323', monospace",
              fontSize: "1.1rem",
              color: "#a09880",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            Tempo: <span style={{ color: "#F0EAD6" }}>120</span>
            <span style={{ color: "#F0EAD625" }}>|</span>
            Key: <span style={{ color: "#F0EAD6" }}>Dm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [openDrawer, setOpenDrawer] = useState<number | null>(1);
  const [lockedSignal, setLockedSignal] = useState<LanguageSignal | null>(null);

  function toggleDrawer(n: number) {
    setOpenDrawer((prev) => (prev === n ? null : n));
  }

  function handleSelectSignal(signal: LanguageSignal) {
    setLockedSignal(signal);
    setOpenDrawer(2);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#F0EAD6", fontFamily: "'VT323', monospace" }}>
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#121212",
          borderBottom: "4px solid #F0EAD6",
          overflow: "hidden",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 24px",
            borderBottom: "2px solid #F0EAD615",
          }}
        >
          <div
            style={{
              fontFamily: "'Rubik Mono One', monospace",
              fontSize: "1.7rem",
              letterSpacing: "0.12em",
            }}
          >
            BABELSOUNDS
          </div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880" }}>
            {lockedSignal ? (
              <span style={{ color: "#F0EAD6" }}>Language: {lockedSignal.title}</span>
            ) : (
              <span>No language selected</span>
            )}
          </div>
        </div>

        {/* Slow marquee */}
        <div style={{ padding: "5px 0", overflow: "hidden", background: "#0d0d0d" }}>
          <span
            className="marquee-text"
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: "1.15rem",
              letterSpacing: "0.18em",
              color: "#a09880",
              animationDuration: "40s",
            }}
          >
            Exploring the sounds of lost civilizations and ancient myths. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Exploring the sounds of lost civilizations and ancient myths. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Exploring the sounds of lost civilizations and ancient myths.
          </span>
        </div>
      </div>

      {/* Drawers */}
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ borderTop: "2px solid #F0EAD6" }} />

        <RackDrawer
          number="1"
          title="Find a Language"
          isOpen={openDrawer === 1}
          onToggle={() => toggleDrawer(1)}
        >
          <FindLanguage onSelectSignal={handleSelectSignal} />
        </RackDrawer>

        <RackDrawer
          number="2"
          title="Create the Voice"
          isOpen={openDrawer === 2}
          onToggle={() => toggleDrawer(2)}
        >
          <CreateVoice lockedSignal={lockedSignal} />
        </RackDrawer>

        <RackDrawer
          number="3"
          title="Refine the Sound"
          isOpen={openDrawer === 3}
          onToggle={() => toggleDrawer(3)}
        >
          <RefineSound lockedSignal={lockedSignal} />
        </RackDrawer>

        {/* Footer */}
        <div
          style={{
            borderTop: "2px solid #F0EAD6",
            padding: "12px 24px",
            fontFamily: "'VT323', monospace",
            fontSize: "1rem",
            color: "#a09880",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Babelsounds — Dead Language Audio Synthesis</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
