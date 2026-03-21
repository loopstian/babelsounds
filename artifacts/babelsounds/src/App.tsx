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

// ─── Signal Data ─────────────────────────────────────────────────────────────

const LANGUAGE_SIGNALS: LanguageSignal[] = [
  {
    id: "SIGNAL_ARC_01",
    title: "Camazotz Ritual Phonetics",
    strength: 94,
    description:
      "Firecrawl uplink surfaced deep-archive fragments from the Popol Vuh and Dresden Codex cross-referenced against acoustic reconstructions of Classic Maya ceremonial sites at Palenque. The Camazotz death-bat deity presided over Xibalba's blood-sacrifice chambers — phoneme clusters were vocalized in complete darkness, demanding extreme guttural resonance to carry through stone corridors.",
    dna: { guttural: 88, sibilant: 42, vocalic: 61 },
    why_match:
      "CLINICAL ANALYSIS: High consonant density (plosive-cluster index 0.91) aligns with subject query. Xibalba subterranean acoustic environment penalizes sibilant diffusion. Guttural index CRITICAL.",
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
    id: "SIGNAL_ARC_02",
    title: "Ennead Death Invocation",
    strength: 81,
    description:
      "Archive nodes recovered from transliterated papyrus scrolls (Spell 125, Book of the Dead) alongside acoustic modeling of the Hypostyle Hall at Karnak. The Ennead — nine primordial Egyptian deities — were invoked through sustained sibilant tones that induced resonance in the limestone chambers. Vowels were considered divine emanations, forbidden in written script but recorded in oral tradition.",
    dna: { guttural: 34, sibilant: 91, vocalic: 78 },
    why_match:
      "CLINICAL ANALYSIS: Sustained fricative chains (s, sh, z) dominate corpus. Vowel-harmonic structure indexes at 0.78 — unusually high for Afroasiatic branch. Sacred silence intervals suggest rhythm-based synthesis approach.",
    phonetic_sample: "ĒN-\nLIL-\nKI",
    fingerprint: [
      "===================",
      "||  ENNEAD  GATE  ||",
      "||_______________||",
      "|| |   | |   | | ||",
      "|| |___|_|___|_| ||",
      "||  ANUBIS_SCALE ||",
      "||_______________||",
      "=|||=====|||=====||",
      " [MA'AT]  [THOTH] ",
    ],
  },
  {
    id: "SIGNAL_ARC_03",
    title: "Proto-Uralic Shamanic Drone",
    strength: 73,
    description:
      "Acoustic archaeology reconstructions from Neolithic shaman burial sites in Western Siberia, cross-referenced with surviving Khanty and Selkup ceremonial recordings. The proto-language predates written record by 6,000 years. Phoneme reconstruction derived from comparative linguistics of all modern Uralic branches. Characterized by sustained nasal drones and deep vowel harmonics — throat-singing precursors.",
    dna: { guttural: 67, sibilant: 28, vocalic: 95 },
    why_match:
      "CLINICAL ANALYSIS: Extreme vocalic saturation (harmonic overtone index 0.95) — highest in archive corpus. Nasal resonance pattern unique to Siberian permafrost acoustics. Guttural-vocalic compound phonemes suggest two-voice synthesis layer.",
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
    id: "SIGNAL_ARC_04",
    title: "Elamite Lamentation Cycle",
    strength: 58,
    description:
      "Recovered from cuneiform tablets at Susa and Anshan, cross-referenced with Mesopotamian lament-priest oral tradition logs. Elamite remains one of the world's true language isolates — no confirmed genealogical relatives. Its lamentation genre featured antiphonal structure: a solo high priest vocalized the 'cry' motif, answered by a chorus of temple singers using sustained low-register drones. A sound that has not been heard for 2,500 years.",
    dna: { guttural: 55, sibilant: 63, vocalic: 47 },
    why_match:
      "CLINICAL ANALYSIS: Balanced phoneme profile — moderate scores across all dimensions. Antiphonal structure suggests layered track architecture. Isolated linguistic status means zero contamination from neighboring phoneme families. High synthesis purity index: 0.87.",
    phonetic_sample: "TĒZ-\nCAT-\nLIP",
    fingerprint: [
      "+-----------------+",
      "|  SUSA  ARCHIVE  |",
      "+-----------------+",
      "| >>> CUNEIFORM   |",
      "| ||| ||| ||| ||| |",
      "| --- --- --- --- |",
      "| ELAMITE ISOLATE |",
      "| [NO_RELATIVES]  |",
      "+-----------------+",
    ],
  },
];

// ─── RackDrawer ──────────────────────────────────────────────────────────────

function RackDrawer({ number, title, isOpen, onToggle, children }: DrawerProps) {
  return (
    <div style={{ border: "2px solid #F0EAD6", marginBottom: "0", borderTop: "none" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 16px",
          background: isOpen ? "#F0EAD6" : "#121212",
          color: isOpen ? "#121212" : "#F0EAD6",
          border: "none",
          borderBottom: isOpen ? "2px solid #F0EAD6" : "none",
          cursor: "pointer",
          fontFamily: "'VT323', monospace",
          fontSize: "1.4rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          textAlign: "left",
        }}
      >
        <span style={{ minWidth: "32px", fontWeight: "bold" }}>{isOpen ? "[-]" : "[+]"}</span>
        <span style={{ opacity: 0.6 }}>{number} //</span>
        <span>{title}</span>
        <span style={{ marginLeft: "auto", opacity: 0.5, fontSize: "1rem" }}>
          {isOpen ? "▲ CLOSE" : "▼ EXPAND"}
        </span>
      </button>
      {isOpen && <div style={{ padding: "16px" }}>{children}</div>}
    </div>
  );
}

// ─── Signal Inspect Modal ─────────────────────────────────────────────────────

function SignalModal({
  signal,
  onClose,
  onLock,
}: {
  signal: LanguageSignal;
  onClose: () => void;
  onLock: (signal: LanguageSignal) => void;
}) {
  function DnaBar({ label, value }: { label: string; value: number }) {
    const filled = Math.round(value / 10);
    const empty = 10 - filled;
    return (
      <div style={{ marginBottom: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'VT323', monospace",
            fontSize: "1.1rem",
            marginBottom: "3px",
          }}
        >
          <span style={{ color: "#a09880", letterSpacing: "0.08em" }}>{label}</span>
          <span>{value}%</span>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "1.2rem", letterSpacing: "0.05em" }}>
          [
          <span style={{ color: "#F0EAD6" }}>{"■".repeat(filled)}</span>
          <span style={{ color: "#F0EAD630" }}>{"□".repeat(empty)}</span>
          ]
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
        background: "rgba(0,0,0,0.85)",
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
          maxWidth: "720px",
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
            padding: "10px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "'VT323', monospace",
            fontSize: "1.3rem",
            letterSpacing: "0.12em",
            borderBottom: "4px solid #F0EAD6",
            flexShrink: 0,
          }}
        >
          <span>DECRYPTION_DOSSIER // {signal.id}</span>
          <button
            onClick={onClose}
            style={{
              background: "#121212",
              color: "#F0EAD6",
              border: "2px solid #121212",
              fontFamily: "'VT323', monospace",
              fontSize: "1.2rem",
              cursor: "pointer",
              padding: "2px 10px",
              letterSpacing: "0.05em",
            }}
          >
            [X] CLOSE_BUFFER
          </button>
        </div>

        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Title row */}
          <div
            style={{
              fontFamily: "'Rubik Mono One', monospace",
              fontSize: "1.4rem",
              letterSpacing: "0.08em",
              borderBottom: "2px solid #F0EAD630",
              paddingBottom: "10px",
            }}
          >
            {signal.title}
            <span
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: "1.1rem",
                color: "#a09880",
                marginLeft: "16px",
                letterSpacing: "0.1em",
              }}
            >
              SIGNAL STRENGTH: {signal.strength}%
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* ASCII Fingerprint */}
            <div style={{ border: "2px solid #F0EAD6", padding: "12px" }}>
              <div
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "0.9rem",
                  color: "#a09880",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                // VISUAL FINGERPRINT
              </div>
              <pre
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "1.05rem",
                  lineHeight: "1.3",
                  color: "#F0EAD6",
                  margin: 0,
                  letterSpacing: "0.05em",
                }}
              >
                {signal.fingerprint.join("\n")}
              </pre>
            </div>

            {/* Linguistic DNA */}
            <div style={{ border: "2px solid #F0EAD6", padding: "12px" }}>
              <div
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "0.9rem",
                  color: "#a09880",
                  letterSpacing: "0.1em",
                  marginBottom: "12px",
                }}
              >
                // LINGUISTIC PROFILE — DNA
              </div>
              <DnaBar label="GUTTURAL" value={signal.dna.guttural} />
              <DnaBar label="SIBILANT" value={signal.dna.sibilant} />
              <DnaBar label="VOCALIC" value={signal.dna.vocalic} />
              <div
                style={{
                  marginTop: "12px",
                  borderTop: "1px solid #F0EAD630",
                  paddingTop: "10px",
                  fontFamily: "'VT323', monospace",
                  fontSize: "1rem",
                  color: "#a09880",
                }}
              >
                <div>PHONEME_PURITY: <span style={{ color: "#F0EAD6" }}>0.{signal.strength}</span></div>
                <div>CORPUS_DEPTH: <span style={{ color: "#F0EAD6" }}>CLASSIFIED</span></div>
                <div>STATUS: <span style={{ color: "#4CAF50" }}>DECRYPTED</span></div>
              </div>
            </div>
          </div>

          {/* Commander Log */}
          <div style={{ border: "2px solid #F0EAD6" }}>
            <div
              style={{
                background: "#F0EAD610",
                borderBottom: "2px solid #F0EAD6",
                padding: "6px 12px",
                fontFamily: "'VT323', monospace",
                fontSize: "1rem",
                color: "#a09880",
                letterSpacing: "0.12em",
              }}
            >
              [COMMANDER_LOG] // FIRECRAWL EXTRACTION REPORT
            </div>
            <div
              style={{
                padding: "12px",
                fontFamily: "'VT323', monospace",
                fontSize: "1.15rem",
                lineHeight: "1.5",
                color: "#F0EAD6",
              }}
            >
              <div style={{ marginBottom: "10px" }}>{signal.description}</div>
              <div
                style={{
                  borderTop: "1px solid #F0EAD640",
                  paddingTop: "10px",
                  color: "#a09880",
                  fontSize: "1.05rem",
                }}
              >
                &gt;&gt; {signal.why_match}
              </div>
            </div>
          </div>

          {/* Lock Button */}
          <button
            onClick={() => onLock(signal)}
            style={{
              background: "#F0EAD6",
              color: "#121212",
              border: "4px solid #F0EAD6",
              fontFamily: "'Rubik Mono One', monospace",
              fontSize: "1.3rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
              padding: "14px",
              textTransform: "uppercase",
              width: "100%",
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
            [ LOCK_SIGNAL_TO_CORE ]
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Drawer 001: Archive Scanner ─────────────────────────────────────────────

function ArchiveScanner({
  onLockSignal,
}: {
  onLockSignal: (signal: LanguageSignal) => void;
}) {
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [inspecting, setInspecting] = useState<LanguageSignal | null>(null);

  function handleScan() {
    if (!query.trim() || scanning) return;
    setScanning(true);
    setScanDone(false);
    setScanProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 8) + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setScanning(false);
        setScanDone(true);
      }
      setScanProgress(p);
    }, 80);
  }

  function StrengthBar({ value }: { value: number }) {
    const filled = Math.round(value / 5);
    const empty = 20 - filled;
    return (
      <span style={{ fontFamily: "monospace", fontSize: "1rem", letterSpacing: "0" }}>
        [
        <span style={{ color: "#F0EAD6" }}>{"█".repeat(filled)}</span>
        <span style={{ color: "#F0EAD620" }}>{"░".repeat(empty)}</span>
        ] {value}%
      </span>
    );
  }

  return (
    <>
      {inspecting && (
        <SignalModal
          signal={inspecting}
          onClose={() => setInspecting(null)}
          onLock={(sig) => {
            setInspecting(null);
            onLockSignal(sig);
          }}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Query input */}
        <div style={{ border: "2px solid #F0EAD6", padding: "12px" }}>
          <div
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: "1rem",
              color: "#a09880",
              letterSpacing: "0.1em",
              marginBottom: "8px",
            }}
          >
            ACOUSTIC ARCHAEOLOGY // FIRECRAWL UPLINK v4.2
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.2rem", marginBottom: "4px" }}>
                INPUT QUERY &gt;_
              </div>
              <textarea
                rows={2}
                placeholder="e.g. Mesoamerican blood rituals, Proto-Indo-European chants, Sumerian lamentations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: "100%", fontFamily: "'VT323', monospace", fontSize: "1.15rem" }}
              />
            </div>
            <button
              className="ascii-btn"
              onClick={handleScan}
              style={{ fontSize: "1.2rem", padding: "8px 16px", marginTop: "24px", whiteSpace: "nowrap" }}
            >
              {scanning ? "[ SCANNING... ]" : "[ INITIATE SCAN ]"}
            </button>
          </div>

          {/* Scan progress bar */}
          {(scanning || scanDone) && (
            <div style={{ marginTop: "10px" }}>
              <div
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "1rem",
                  color: "#a09880",
                  marginBottom: "4px",
                  letterSpacing: "0.08em",
                }}
              >
                {scanning ? "SCANNING CORPUS..." : "SCAN COMPLETE — SIGNALS ISOLATED"}
                <span style={{ float: "right" }}>{scanProgress}%</span>
              </div>
              <div
                style={{
                  height: "10px",
                  background: "#0a0a0a",
                  border: "1px solid #F0EAD640",
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
                    width: `${scanProgress}%`,
                    background: scanDone ? "#F0EAD6" : "#a09880",
                    transition: "width 0.1s",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Signal list */}
        <div>
          <div
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: "1rem",
              color: "#a09880",
              letterSpacing: "0.12em",
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>// ISOLATED LANGUAGE SIGNALS — {LANGUAGE_SIGNALS.length} DETECTED</span>
            {scanDone && <span style={{ color: "#4CAF50" }}>● ARCHIVE UPLINK ACTIVE</span>}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 260px 120px",
                gap: "0",
                border: "2px solid #F0EAD6",
                borderBottom: "none",
                padding: "6px 12px",
                background: "#F0EAD610",
                fontFamily: "'VT323', monospace",
                fontSize: "0.95rem",
                color: "#a09880",
                letterSpacing: "0.1em",
              }}
            >
              <span>SIGNAL_ID</span>
              <span>TITLE</span>
              <span>STRENGTH</span>
              <span style={{ textAlign: "right" }}>ACTION</span>
            </div>

            {LANGUAGE_SIGNALS.map((sig, idx) => (
              <div
                key={sig.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr 260px 120px",
                  gap: "0",
                  border: "2px solid #F0EAD6",
                  borderBottom: idx === LANGUAGE_SIGNALS.length - 1 ? "2px solid #F0EAD6" : "none",
                  padding: "10px 12px",
                  alignItems: "center",
                  fontFamily: "'VT323', monospace",
                  background: "#121212",
                }}
              >
                <span style={{ fontSize: "1rem", color: "#a09880", letterSpacing: "0.05em" }}>
                  {sig.id}
                </span>
                <span
                  style={{
                    fontSize: "1.2rem",
                    letterSpacing: "0.05em",
                    paddingRight: "12px",
                  }}
                >
                  {sig.title}
                </span>
                <span style={{ fontSize: "1.1rem" }}>
                  <StrengthBar value={sig.strength} />
                </span>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    className="ascii-btn"
                    onClick={() => setInspecting(sig)}
                    style={{ fontSize: "1.1rem" }}
                  >
                    [ INSPECT ]
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status footer */}
        <div
          style={{
            border: "2px solid #F0EAD630",
            padding: "8px 12px",
            fontFamily: "'VT323', monospace",
            fontSize: "1rem",
            color: "#a09880",
            display: "flex",
            gap: "24px",
            letterSpacing: "0.08em",
          }}
        >
          <span>UPLINK: <span style={{ color: "#4CAF50" }}>ACTIVE</span></span>
          <span>AUTH: <span style={{ color: "#4CAF50" }}>GRANTED</span></span>
          <span>PROTOCOL: <span style={{ color: "#F0EAD6" }}>FIRECRAWL_v3</span></span>
          <span>CORPUS: <span style={{ color: "#F0EAD6" }}>4 SIGNALS LOADED</span></span>
        </div>
      </div>
    </>
  );
}

// ─── Drawer 002: Linguistic Synthesis ────────────────────────────────────────

const VOICE_OPTIONS = [
  { id: "sumerisk", label: "スメル語", sublabel: "SUMERIAN" },
  { id: "nahuatl", label: "ナワトル語", sublabel: "NAHUATL" },
  { id: "elamite", label: "エラム語", sublabel: "ELAMITE" },
  { id: "lydian", label: "リュディア語", sublabel: "LYDIAN" },
  { id: "linear_a", label: "線形文字Ａ", sublabel: "LINEAR-A" },
  { id: "mayan", label: "マヤ語", sublabel: "PROTO-MAYAN" },
];

const FAKE_WORDS = [
  "XŌCH-\nYĀŌ-\nYŌTL",
  "KUL-\nAB-\nBA",
  "TĒZ-\nCAT-\nLIP",
  "ĒN-\nLIL-\nKI",
  "HA-\nAB-\nCUL",
];

function LinguisticSynthesis({ lockedSignal }: { lockedSignal: LanguageSignal | null }) {
  const [inputText, setInputText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("sumerisk");
  const [generatedWord, setGeneratedWord] = useState(FAKE_WORDS[0]);
  const [synthesizing, setSynthesizing] = useState(false);

  useEffect(() => {
    if (lockedSignal) {
      setGeneratedWord(lockedSignal.phonetic_sample);
    }
  }, [lockedSignal]);

  function handleSynthesize() {
    setSynthesizing(true);
    let count = 0;
    const interval = setInterval(() => {
      setGeneratedWord(FAKE_WORDS[Math.floor(Math.random() * FAKE_WORDS.length)]);
      count++;
      if (count > 8) {
        clearInterval(interval);
        setSynthesizing(false);
        if (lockedSignal) setGeneratedWord(lockedSignal.phonetic_sample);
      }
    }, 120);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {/* Locked signal banner */}
      {lockedSignal && (
        <div
          style={{
            border: "2px solid #F0EAD6",
            borderBottom: "none",
            padding: "8px 14px",
            background: "#F0EAD610",
            fontFamily: "'VT323', monospace",
            fontSize: "1.1rem",
            color: "#a09880",
            letterSpacing: "0.1em",
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#4CAF50" }}>● SIGNAL LOCKED</span>
          <span style={{ color: "#F0EAD6" }}>{lockedSignal.id} // {lockedSignal.title}</span>
          <span>STRENGTH: {lockedSignal.strength}%</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0", minHeight: "320px" }}>
        {/* Column 1: English Input */}
        <div
          style={{
            border: "2px solid #F0EAD6",
            borderRight: "none",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", letterSpacing: "0.1em" }}>
            COL.01 // ENGLISH INPUT
          </div>
          <div style={{ borderTop: "1px solid #F0EAD640", paddingTop: "8px" }}>
            <textarea
              rows={6}
              placeholder={
                lockedSignal
                  ? `Signal loaded: ${lockedSignal.title}. Enter English text to synthesize...`
                  : "Enter English text to translate into the dead language phoneme matrix..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ width: "100%", fontFamily: "'VT323', monospace", fontSize: "1.15rem" }}
            />
          </div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", marginTop: "auto" }}>
            <div>CHAR COUNT: {inputText.length}</div>
            <div>PHONEME SLOTS: {Math.floor(inputText.length * 0.7)}</div>
            <div>ENTROPY: {inputText.length > 0 ? "HIGH" : "NULL"}</div>
            {lockedSignal && (
              <>
                <div style={{ borderTop: "1px solid #F0EAD630", marginTop: "6px", paddingTop: "6px" }}>
                  GUTTURAL: {lockedSignal.dna.guttural}%
                </div>
                <div>SIBILANT: {lockedSignal.dna.sibilant}%</div>
                <div>VOCALIC: {lockedSignal.dna.vocalic}%</div>
              </>
            )}
          </div>
        </div>

        {/* Column 2: Decrypted Script */}
        <div
          style={{
            border: "2px solid #F0EAD6",
            borderRight: "none",
            padding: "12px",
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
              letterSpacing: "0.1em",
              alignSelf: "flex-start",
            }}
          >
            COL.02 // DECRYPTED SCRIPT
          </div>
          <div
            style={{
              fontFamily: "'Rubik Mono One', monospace",
              fontSize: "3rem",
              letterSpacing: "0.05em",
              textAlign: "center",
              lineHeight: "1",
              border: "3px solid #F0EAD6",
              padding: "16px 24px",
              width: "100%",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "pre-line",
              color: synthesizing ? "#a09880" : "#F0EAD6",
              transition: "color 0.1s",
            }}
          >
            {generatedWord}
          </div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", alignSelf: "flex-start" }}>
            PHONEME MATRIX: {synthesizing ? "COMPUTING..." : "RESOLVED"}
            {lockedSignal && !synthesizing && (
              <div style={{ color: "#4CAF50" }}>SOURCE: {lockedSignal.id}</div>
            )}
          </div>
        </div>

        {/* Column 3: Voice Selectors + Synth Button */}
        <div
          style={{
            border: "2px solid #F0EAD6",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", letterSpacing: "0.1em" }}>
            COL.03 // VOICE MATRIX
          </div>
          <div style={{ borderTop: "1px solid #F0EAD640", paddingTop: "8px", flex: 1 }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", marginBottom: "8px" }}>
              SELECT PHONEME ENGINE:
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
                    fontSize: "1rem",
                    cursor: "pointer",
                    textAlign: "left",
                    lineHeight: "1.2",
                  }}
                >
                  <div style={{ fontSize: "1.3rem" }}>{opt.label}</div>
                  <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>{opt.sublabel}</div>
                </button>
              ))}
            </div>
          </div>
          <button
            className="inverted-btn"
            onClick={handleSynthesize}
            style={{ marginTop: "auto", fontSize: "1.3rem", padding: "12px" }}
          >
            {synthesizing ? "[ COMPUTING... ]" : "[ INITIATE SYNTHESIS ]"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Drawer 003: Audio Sequencer ─────────────────────────────────────────────

const BASE_HEIGHTS = [8, 20, 35, 18, 42, 28, 12, 38, 22, 45, 16, 30, 40, 14, 25, 36, 10, 44, 20, 32, 8, 38, 26, 15, 40, 22, 33, 12, 48, 18, 28, 42, 9, 35, 24, 16, 44, 30, 11, 38, 20, 46, 14, 32, 28, 41, 7, 36, 23, 17];

function WaveformDisplay({ playing }: { playing: boolean }) {
  const [animHeights, setAnimHeights] = useState<number[]>(BASE_HEIGHTS);

  useEffect(() => {
    if (!playing) {
      setAnimHeights(BASE_HEIGHTS);
      return;
    }
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

function AudioSequencer() {
  const [pitch, setPitch] = useState(50);
  const [reverb, setReverb] = useState(30);
  const [distortion, setDistortion] = useState(20);
  const [track1Playing, setTrack1Playing] = useState(false);
  const [track2Playing, setTrack2Playing] = useState(false);
  const [track1Muted, setTrack1Muted] = useState(false);
  const [track2Muted, setTrack2Muted] = useState(false);

  function renderSlider(label: string, value: number, onChange: (v: number) => void, color?: string) {
    const filled = Math.floor(value / 10);
    const empty = 10 - filled;
    const ascii = `[${"=".repeat(filled)}|${" ".repeat(empty)}]`;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", letterSpacing: "0.15em", display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#a09880" }}>{label}</span>
          <span>{value}%</span>
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.3rem", letterSpacing: "-0.02em", color: color || "#F0EAD6" }}>
          {ascii}
        </div>
        <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", minHeight: "360px" }}>
      <div style={{ border: "2px solid #F0EAD6", padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", gridColumn: "1/-1", marginBottom: "-8px", letterSpacing: "0.1em" }}>
          // SIGNAL PROCESSING UNIT
        </div>
        {renderSlider("PITCH", pitch, setPitch)}
        {renderSlider("REVERB", reverb, setReverb, "#b8d4b8")}
        {renderSlider("DISTORTION", distortion, setDistortion, "#d4b8b8")}
      </div>

      <div style={{ border: "2px solid #F0EAD6", padding: "16px" }}>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", letterSpacing: "0.1em", marginBottom: "12px" }}>
          // AUDIO TIMELINE — 2 TRACKS
        </div>

        <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880", display: "flex", marginBottom: "4px", paddingLeft: "240px" }}>
          {["0:00", "0:15", "0:30", "0:45", "1:00", "1:15", "1:30", "1:45", "2:00"].map((t) => (
            <span key={t} style={{ flex: 1 }}>{t}</span>
          ))}
        </div>

        {[
          { id: 1, name: "TRK_001", sub: "PHONEME_BASE", playing: track1Playing, muted: track1Muted, setPlaying: setTrack1Playing, setMuted: setTrack1Muted },
          { id: 2, name: "TRK_002", sub: "RITUAL_REVERB", playing: track2Playing, muted: track2Muted, setPlaying: setTrack2Playing, setMuted: setTrack2Muted },
        ].map((trk) => (
          <div
            key={trk.id}
            style={{ display: "flex", alignItems: "center", gap: "8px", border: "2px solid #F0EAD6", marginBottom: "8px", padding: "8px", background: "#121212", opacity: trk.muted ? 0.5 : 1 }}
          >
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", minWidth: "100px", letterSpacing: "0.08em" }}>
              {trk.name}
              <div style={{ fontSize: "0.85rem", color: "#a09880" }}>{trk.sub}</div>
            </div>
            <button className="ascii-btn" onClick={() => trk.setPlaying(!trk.playing)} style={{ minWidth: "90px" }}>
              {trk.playing ? "[ STOP ]" : "[ PLAY ]"}
            </button>
            <button
              className="ascii-btn"
              onClick={() => trk.setMuted(!trk.muted)}
              style={{ minWidth: "90px", background: trk.muted ? "#F0EAD6" : "#121212", color: trk.muted ? "#121212" : "#F0EAD6" }}
            >
              {trk.muted ? "[ UNMUTE ]" : "[ MUTE ]"}
            </button>
            <div style={{ flex: 1, border: "1px solid #F0EAD630", background: "#0a0a0a", height: "52px", display: "flex" }}>
              <WaveformDisplay playing={trk.playing} />
            </div>
          </div>
        ))}

        <div style={{ display: "flex", gap: "8px", marginTop: "12px", fontFamily: "'VT323', monospace" }}>
          <button className="ascii-btn" onClick={() => { setTrack1Playing(true); setTrack2Playing(true); }}>[▶ PLAY ALL]</button>
          <button className="ascii-btn" onClick={() => { setTrack1Playing(false); setTrack2Playing(false); }}>[■ STOP ALL]</button>
          <button className="ascii-btn">[ REC ]</button>
          <button className="ascii-btn">[ EXPORT ]</button>
          <div style={{ marginLeft: "auto", border: "2px solid #F0EAD6", padding: "4px 12px", fontSize: "1.1rem", color: "#a09880", display: "flex", alignItems: "center", gap: "8px" }}>
            BPM: <span style={{ color: "#F0EAD6" }}>120</span>
            <span style={{ color: "#F0EAD640" }}>|</span>
            KEY: <span style={{ color: "#F0EAD6" }}>Dm</span>
            <span style={{ color: "#F0EAD640" }}>|</span>
            MODE: <span style={{ color: "#F0EAD6" }}>RITUAL</span>
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

  function handleLockSignal(signal: LanguageSignal) {
    setLockedSignal(signal);
    setOpenDrawer(2);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#F0EAD6", fontFamily: "'VT323', monospace" }}>
      {/* Top Marquee */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#121212", borderBottom: "4px solid #F0EAD6", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px", borderBottom: "2px solid #F0EAD620" }}>
          <div style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.8rem", letterSpacing: "0.15em", color: "#F0EAD6" }}>
            BABELSOUNDS
          </div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", letterSpacing: "0.1em" }}>
            <span style={{ color: "#4CAF50" }}>●</span> SYSTEM ACTIVE // v1.0.0 // {new Date().toISOString().split("T")[0]}
            {lockedSignal && (
              <span style={{ marginLeft: "16px", color: "#F0EAD6" }}>
                // LOCKED: {lockedSignal.id}
              </span>
            )}
          </div>
        </div>
        <div style={{ padding: "6px 0", overflow: "hidden", background: "#0a0a0a" }}>
          <span
            className="marquee-text"
            style={{ fontFamily: "'VT323', monospace", fontSize: "1.3rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#F0EAD6" }}
          >
            &gt;&gt;&gt; SYSTEM SECURE // BABELSOUNDS_V1.0 // ARCHIVE UPLINK ACTIVE // PHONEME DATABASE: ONLINE // DEAD LANGUAGE CORPUS: LOADED // FIRECRAWL ENGINE: READY // SIGNAL PROCESSING: NOMINAL // RITUAL SYNTHESIS: ARMED &lt;&lt;&lt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &gt;&gt;&gt; SYSTEM SECURE // BABELSOUNDS_V1.0 // ARCHIVE UPLINK ACTIVE // PHONEME DATABASE: ONLINE // DEAD LANGUAGE CORPUS: LOADED // FIRECRAWL ENGINE: READY // SIGNAL PROCESSING: NOMINAL // RITUAL SYNTHESIS: ARMED &lt;&lt;&lt;
          </span>
        </div>
      </div>

      {/* Drawers */}
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ borderTop: "2px solid #F0EAD6", marginTop: "0" }} />

        <RackDrawer
          number="001"
          title="ARCHIVE SCANNER // RESEARCH PHASE"
          isOpen={openDrawer === 1}
          onToggle={() => toggleDrawer(1)}
        >
          <ArchiveScanner onLockSignal={handleLockSignal} />
        </RackDrawer>

        <RackDrawer
          number="002"
          title="LINGUISTIC SYNTHESIS // GENERATION PHASE"
          isOpen={openDrawer === 2}
          onToggle={() => toggleDrawer(2)}
        >
          <LinguisticSynthesis lockedSignal={lockedSignal} />
        </RackDrawer>

        <RackDrawer
          number="003"
          title="AUDIO SEQUENCER // SOUND DESIGN PHASE"
          isOpen={openDrawer === 3}
          onToggle={() => toggleDrawer(3)}
        >
          <AudioSequencer />
        </RackDrawer>

        <div
          style={{
            borderTop: "2px solid #F0EAD6",
            padding: "12px 16px",
            fontFamily: "'VT323', monospace",
            fontSize: "1rem",
            color: "#a09880",
            display: "flex",
            justifyContent: "space-between",
            letterSpacing: "0.08em",
          }}
        >
          <span>BABELSOUNDS // DEAD LANGUAGE AUDIO SYNTHESIS TOOL</span>
          <span>BUILD: 001.0.0 // STATUS: OPERATIONAL</span>
        </div>
      </div>
    </div>
  );
}
