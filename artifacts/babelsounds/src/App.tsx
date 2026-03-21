import { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "archives" | "recording" | "soundscape";

interface LanguageSignal {
  id: string;
  title: string;
  strength: number;
  description: string;
  dna: { guttural: number; sibilant: number; vocalic: number };
  why_match: string;
  phonetic_sample: string;
  fingerprint: string[];
  voiceDescription: string;
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
    strength: 94,
    description:
      "Sourced from the Popol Vuh and Dresden Codex, cross-referenced against acoustic reconstructions of Classic Maya ceremonial sites at Palenque. The Camazotz death-bat deity presided over Xibalba's blood-sacrifice chambers — phoneme clusters were vocalized in complete darkness, demanding extreme resonance to carry through stone corridors.",
    dna: { guttural: 88, sibilant: 42, vocalic: 61 },
    why_match:
      "High consonant density aligns with this type of query. The subterranean acoustic environment of Xibalba favors deep, resonant tones over softer fricatives.",
    voiceDescription: "An ancient, raspy female priestess speaking with deep sorrow and slow pacing, echoing through dark stone corridors.",
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
    voiceDescription: "A commanding male priest with booming resonance and sharp sibilant whispers, as if channeling the voice of Anubis himself.",
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
    voiceDescription: "A weathered old shaman humming through nasal drones, voice cracking with age, deeply meditative and hypnotic.",
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
    voiceDescription: "A terrifying, high-pitched screeching ancient warrior chanting battle cries with rhythmic fury and controlled rage.",
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
  onUse: (sig: LanguageSignal) => void;
}) {
  function ScaleBar({ leftLabel, rightLabel, value }: { leftLabel: string; rightLabel: string; value: number }) {
    const filled = Math.round(value / 10);
    return (
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", marginBottom: "5px" }}>
          <span>{leftLabel}</span><span>{rightLabel}</span>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "1.2rem" }}>
          <span style={{ color: "#F0EAD6" }}>{"■".repeat(filled)}</span>
          <span style={{ color: "#F0EAD622" }}>{"■".repeat(10 - filled)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="screen-fade-in" style={{ background: "#121212", border: "4px solid #F0EAD6", maxWidth: "680px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ background: "#F0EAD6", color: "#121212", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Rubik Mono One', monospace", fontSize: "0.85rem", letterSpacing: "0.06em" }}>
          <span>Language Information</span>
          <button onClick={onClose} style={{ background: "#121212", color: "#F0EAD6", border: "none", fontFamily: "'VT323', monospace", fontSize: "1.2rem", cursor: "pointer", padding: "2px 12px" }}>Close</button>
        </div>
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ borderBottom: "1px solid #F0EAD625", paddingBottom: "14px", display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.2rem", letterSpacing: "0.05em" }}>{signal.title}</span>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880" }}>Match: {signal.strength}%</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ border: "2px solid #F0EAD6", padding: "14px" }}>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sound Character</div>
              <pre style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", lineHeight: "1.35", color: "#F0EAD6", margin: 0 }}>{signal.fingerprint.join("\n")}</pre>
            </div>
            <div style={{ border: "2px solid #F0EAD6", padding: "14px" }}>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Attributes</div>
              <ScaleBar leftLabel="Harsh" rightLabel="Smooth" value={100 - signal.dna.guttural} />
              <ScaleBar leftLabel="Fast" rightLabel="Slow" value={100 - signal.dna.sibilant} />
              <ScaleBar leftLabel="Deep" rightLabel="High" value={100 - signal.dna.vocalic} />
            </div>
          </div>
          <div style={{ border: "2px solid #F0EAD6" }}>
            <div style={{ background: "#F0EAD608", borderBottom: "2px solid #F0EAD6", padding: "8px 16px", fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.08em" }}>Summary</div>
            <div style={{ padding: "16px", fontFamily: "'VT323', monospace", fontSize: "1.15rem", lineHeight: "1.6", color: "#F0EAD6" }}>
              <p style={{ margin: "0 0 12px 0" }}>{signal.description}</p>
              <p style={{ margin: 0, color: "#a09880", fontSize: "1.05rem" }}>{signal.why_match}</p>
            </div>
          </div>
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
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", marginBottom: "10px", letterSpacing: "0.06em" }}>
                {searchDone ? `Showing best matches for "${query}"` : `${LANGUAGE_SIGNALS.length} languages in the archive`}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 240px 100px", border: "2px solid #F0EAD6", borderBottom: "none", padding: "8px 16px", background: "#F0EAD608", fontFamily: "'VT323', monospace", fontSize: "0.95rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                <span>Name</span><span>Match</span><span style={{ textAlign: "right" }}>Action</span>
              </div>
              {LANGUAGE_SIGNALS.map((sig, idx) => (
                <div key={sig.id} style={{ display: "grid", gridTemplateColumns: "1fr 240px 100px", border: "2px solid #F0EAD6", borderBottom: idx === LANGUAGE_SIGNALS.length - 1 ? "2px solid #F0EAD6" : "none", padding: "14px 16px", alignItems: "center", background: "#121212" }}>
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.2rem", letterSpacing: "0.04em" }}>{sig.title}</span>
                  <span><MatchBar value={sig.strength} /></span>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => setInspecting(sig)} style={{ ...outlineBtn, fontSize: "1.05rem", padding: "6px 14px" }}>Details</button>
                  </div>
                </div>
              ))}
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
  const [voicePrompt, setVoicePrompt] = useState(language.voiceDescription);
  const [scriptPrompt, setScriptPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  function handleGenerate() {
    if (!scriptPrompt.trim() || generating) return;
    setGenerating(true);
    setTimeout(() => {
      // TODO: ElevenLabs API Integration
      // client.textToVoice.design({
      //   text: scriptPrompt,
      //   voiceDescription: voicePrompt,
      //   outputFormat: "mp3_22050_32"
      // });
      const fragment = PHONEME_FRAGMENTS[Math.floor(Math.random() * PHONEME_FRAGMENTS.length)];
      const duration = Math.floor(Math.random() * 6) + 3;
      const words = scriptPrompt.trim().split(" ").slice(0, 4).join(" ");
      onAddClip({
        id: `clip_${Date.now()}`,
        name: words.length > 0 ? `${words} (${fragment})` : `${language.title} — Phrase ${clipLibrary.length + 1}`,
        duration,
      });
      setGenerating(false);
      setScriptPrompt("");
    }, 1200);
  }

  function handlePlay(id: string) {
    setPlayingId(id);
    setTimeout(() => setPlayingId(null), 2000);
  }

  return (
    <div className="screen-fade-in" style={{ minHeight: "100vh", background: "#121212", color: "#F0EAD6", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ borderBottom: "4px solid #F0EAD6", padding: "0 24px", display: "flex", alignItems: "stretch", minHeight: "60px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ ...outlineBtn, border: "none", borderRight: "2px solid #F0EAD6", fontSize: "1.1rem", padding: "0 24px" }}>← Back</button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 24px", gap: "16px" }}>
          <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.2rem", letterSpacing: "0.12em" }}>BABELSOUNDS</span>
          <span style={{ color: "#F0EAD625" }}>|</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880" }}>Step 2 of 3 — The Vocal Lab</span>
          <span style={{ color: "#F0EAD625" }}>|</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#F0EAD6" }}>{language.title}</span>
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 0 }}>
        {/* Left — Input */}
        <div style={{ borderRight: "4px solid #F0EAD6", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.1rem", letterSpacing: "0.06em", marginBottom: "6px" }}>The Vocal Lab</div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880" }}>Design a voice and script phrases in {language.title}</div>
          </div>

          <div style={{ borderTop: "2px solid #F0EAD630" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
            <label style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Voice Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the speaker (e.g., A raspy old man, a booming giant...)"
              value={voicePrompt}
              onChange={(e) => setVoicePrompt(e.target.value)}
              style={{ width: "100%", background: "transparent", border: "2px solid #F0EAD6", color: "#F0EAD6", fontFamily: "'VT323', monospace", fontSize: "1.2rem", padding: "16px", resize: "none" }}
            />

            <div style={{ borderTop: "2px solid #F0EAD620", margin: "4px 0" }} />

            <label style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              What should the AI say?
            </label>
            <textarea
              rows={4}
              placeholder="Type a phrase to vocalize..."
              value={scriptPrompt}
              onChange={(e) => setScriptPrompt(e.target.value)}
              style={{ width: "100%", background: "transparent", border: "2px solid #F0EAD6", color: "#F0EAD6", fontFamily: "'VT323', monospace", fontSize: "1.2rem", padding: "16px", resize: "none" }}
            />

            <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.95rem", color: "#a09880" }}>
              Tone: {language.dna.guttural > 60 ? "Harsh" : "Smooth"} &nbsp;·&nbsp;
              Pace: {language.dna.sibilant > 60 ? "Fast" : "Slow"} &nbsp;·&nbsp;
              Depth: {language.dna.vocalic > 60 ? "Deep" : "High"}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !scriptPrompt.trim()}
            style={{ ...solidBtn, fontSize: "1.3rem", padding: "16px", width: "100%", opacity: generating || !scriptPrompt.trim() ? 0.5 : 1 }}
          >
            {generating ? "Generating..." : "Generate Audio"}
          </button>
        </div>

        {/* Right — Clip Library */}
        <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.1rem", letterSpacing: "0.06em", marginBottom: "6px" }}>Clip Library</div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880" }}>{clipLibrary.length} clip{clipLibrary.length !== 1 ? "s" : ""} recorded</div>
          </div>

          <div style={{ borderTop: "2px solid #F0EAD630" }} />

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0" }}>
            {clipLibrary.length === 0 && (
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880", padding: "24px 0", textAlign: "center", border: "2px dashed #F0EAD630" }}>
                No clips yet. Generate audio to build your library.
              </div>
            )}
            {clipLibrary.map((clip, idx) => (
              <div
                key={clip.id}
                style={{ display: "flex", alignItems: "center", gap: "10px", border: "2px solid #F0EAD6", borderBottom: idx === clipLibrary.length - 1 ? "2px solid #F0EAD6" : "none", padding: "12px 14px", background: "#121212" }}
              >
                <button
                  onClick={() => handlePlay(clip.id)}
                  style={{ ...solidBtn, fontSize: "1.1rem", padding: "6px 14px", minWidth: "60px", flexShrink: 0 }}
                >
                  {playingId === clip.id ? "▶▶" : "▶"}
                </button>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clip.name}</div>
                  <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.9rem", color: "#a09880" }}>{clip.duration}s</div>
                </div>
                <button
                  onClick={() => onDeleteClip(clip.id)}
                  style={{ background: "#121212", color: "#a09880", border: "2px solid #a09880", fontFamily: "'VT323', monospace", fontSize: "1.05rem", cursor: "pointer", padding: "6px 12px", flexShrink: 0 }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom action */}
      <div style={{ borderTop: "4px solid #F0EAD6", flexShrink: 0 }}>
        <button
          onClick={onProceed}
          style={{ ...solidBtn, width: "100%", fontSize: "1.4rem", padding: "20px", letterSpacing: "0.1em", border: "none" }}
        >
          Proceed to Soundscape →
        </button>
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

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("archives");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageSignal | null>(null);
  const [clipLibrary, setClipLibrary] = useState<AudioClip[]>([]);

  function handleSelectLanguage(sig: LanguageSignal) {
    setSelectedLanguage(sig);
    setScreen("recording");
  }

  function handleAddClip(clip: AudioClip) {
    setClipLibrary((prev) => [...prev, clip]);
  }

  function handleDeleteClip(id: string) {
    setClipLibrary((prev) => prev.filter((c) => c.id !== id));
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
