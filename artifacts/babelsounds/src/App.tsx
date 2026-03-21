import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DrawerProps {
  number: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

// ─── RackDrawer ──────────────────────────────────────────────────────────────

function RackDrawer({ number, title, isOpen, onToggle, children }: DrawerProps) {
  return (
    <div
      style={{
        border: "2px solid #F0EAD6",
        marginBottom: "0",
        borderTop: "none",
      }}
    >
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
        <span style={{ minWidth: "32px", fontWeight: "bold" }}>
          {isOpen ? "[-]" : "[+]"}
        </span>
        <span style={{ opacity: 0.6 }}>{number} //</span>
        <span>{title}</span>
        <span style={{ marginLeft: "auto", opacity: 0.5, fontSize: "1rem" }}>
          {isOpen ? "▲ CLOSE" : "▼ EXPAND"}
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: "16px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Drawer 001: Archive Scanner ─────────────────────────────────────────────

function ArchiveScanner() {
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [stats, setStats] = useState({
    nodes: 0,
    phonetic: 0,
    vectors: 0,
    corpus: 0,
  });

  const exampleOutput = [
    "INITIALIZING FIRECRAWL UPLINK...",
    "CONNECTING TO DEAD LANGUAGE ARCHIVE v4.2...",
    "SCANNING PHONETIC MORPHEME DATABASE...",
    "",
    ">> QUERY: \"mesoamerican blood rituals\"",
    ">> CORPUS MATCH: Nahuatl, Mayan, Zapotec",
    "",
    "FRAGMENT [0001]: xōchiyāōyōtl — \"flower war\"",
    "  → phoneme pattern: X-OCH-YAO-YOTL",
    "  → ritual context: SACRIFICE_CYCLE confirmed",
    "",
    "FRAGMENT [0002]: tlāltēuctli — \"earth lord\"",
    "  → semantic cluster: CHTHONIC_DEITY",
    "  → frequency score: 0.882",
    "",
    "FRAGMENT [0003]: quetzalcōātl — \"feathered serpent\"",
    "  → cross-reference: VENUS_CYCLE, RESURRECTION",
    "  → phoneme density: HIGH",
    "",
    "FIRECRAWL COMPLETE. 402 nodes indexed.",
    "PHONETIC MATCH: 88% | CONFIDENCE: NOMINAL",
  ];

  function handleScan() {
    if (!query.trim()) return;
    setScanning(true);
    setOutput([]);
    setStats({ nodes: 0, phonetic: 0, vectors: 0, corpus: 0 });

    let i = 0;
    const interval = setInterval(() => {
      if (i < exampleOutput.length) {
        setOutput((prev) => [...prev, exampleOutput[i]]);
        i++;
        setStats({
          nodes: Math.min(402, Math.floor((i / exampleOutput.length) * 402)),
          phonetic: Math.min(88, Math.floor((i / exampleOutput.length) * 88)),
          vectors: Math.min(1247, Math.floor((i / exampleOutput.length) * 1247)),
          corpus: Math.min(3, Math.floor((i / exampleOutput.length) * 3)),
        });
      } else {
        clearInterval(interval);
        setScanning(false);
      }
    }, 80);
  }

  function renderLine(line: string | undefined, idx: number) {
    if (!line) return <div key={idx} style={{ minHeight: "1.3em" }} />;
    const words = line.split(" ");
    return (
      <div key={idx} style={{ marginBottom: "2px", minHeight: "1.3em" }}>
        {words.map((word, wi) => {
          const shouldHighlight =
            word.length > 4 &&
            (word.includes("ā") ||
              word.includes("ō") ||
              word.includes("ē") ||
              word.includes("ū") ||
              word === "SACRIFICE_CYCLE" ||
              word === "CHTHONIC_DEITY" ||
              word === "VENUS_CYCLE," ||
              word === "RESURRECTION" ||
              word === "FIRECRAWL" ||
              word === "COMPLETE.");
          return (
            <span key={wi}>
              {shouldHighlight ? (
                <span className="highlighted-word">{word}</span>
              ) : (
                word
              )}{" "}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "16px", minHeight: "320px" }}>
      {/* Left: Terminal */}
      <div style={{ flex: "0 0 60%", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div
          style={{
            border: "2px solid #F0EAD6",
            padding: "12px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880", letterSpacing: "0.1em" }}>
            ARCHIVE SCANNER TERMINAL v1.0
          </div>
          <div style={{ borderTop: "1px solid #F0EAD640", paddingTop: "8px" }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.3rem", marginBottom: "6px" }}>
              INPUT QUERY &gt;_
            </div>
            <textarea
              rows={3}
              placeholder="e.g. Mesoamerican blood rituals, Proto-Indo-European chants, Sumerian lamentations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: "100%", fontFamily: "'VT323', monospace", fontSize: "1.2rem" }}
            />
          </div>
          <button className="ascii-btn" onClick={handleScan} style={{ marginTop: "4px", fontSize: "1.3rem" }}>
            {scanning ? "[ SCANNING... ]" : "[ INITIATE SCAN ]"}
          </button>
          <div
            style={{
              marginTop: "8px",
              background: "#0a0a0a",
              border: "1px solid #F0EAD630",
              padding: "10px",
              fontFamily: "'VT323', monospace",
              fontSize: "1.05rem",
              lineHeight: "1.4",
              flex: 1,
              minHeight: "140px",
              overflowY: "auto",
              color: "#F0EAD6",
            }}
          >
            {output.length === 0 && !scanning && (
              <span style={{ color: "#a09880" }}>// AWAITING QUERY INPUT...</span>
            )}
            {output.map((line, idx) => renderLine(line, idx))}
            {scanning && (
              <span className="blink" style={{ color: "#F0EAD6" }}>█</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Data Panel */}
      <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          style={{
            border: "2px solid #F0EAD6",
            padding: "12px",
            fontFamily: "'VT323', monospace",
          }}
        >
          <div style={{ fontSize: "1.1rem", color: "#a09880", marginBottom: "10px", letterSpacing: "0.1em" }}>
            // DATA PANEL
          </div>
          {[
            { label: "DATA NODES FOUND", value: stats.nodes, unit: "" },
            { label: "PHONETIC MATCH", value: stats.phonetic, unit: "%" },
            { label: "MORPHEME VECTORS", value: stats.vectors, unit: "" },
            { label: "CORPUS LANGUAGES", value: stats.corpus, unit: "" },
          ].map(({ label, value, unit }) => (
            <div
              key={label}
              style={{
                marginBottom: "10px",
                paddingBottom: "10px",
                borderBottom: "1px solid #F0EAD620",
              }}
            >
              <div style={{ fontSize: "0.95rem", color: "#a09880", letterSpacing: "0.08em" }}>
                {label}:
              </div>
              <div style={{ fontSize: "2.2rem", letterSpacing: "0.05em" }}>
                {value}
                {unit}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            border: "2px solid #F0EAD6",
            padding: "12px",
            fontFamily: "'VT323', monospace",
            fontSize: "1rem",
            color: "#a09880",
            lineHeight: "1.6",
          }}
        >
          <div style={{ color: "#F0EAD6", marginBottom: "6px" }}>// STATUS LOG</div>
          <div>UPLINK: <span style={{ color: "#4CAF50" }}>ACTIVE</span></div>
          <div>AUTH: <span style={{ color: "#4CAF50" }}>GRANTED</span></div>
          <div>CACHE: <span style={{ color: "#F0EAD6" }}>NOMINAL</span></div>
          <div>MODE: <span style={{ color: "#F0EAD6" }}>DEEP_SCAN</span></div>
          <div>PROTOCOL: <span style={{ color: "#F0EAD6" }}>FIRECRAWL_v3</span></div>
        </div>
      </div>
    </div>
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

function LinguisticSynthesis() {
  const [inputText, setInputText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("sumerisk");
  const [generatedWord, setGeneratedWord] = useState(FAKE_WORDS[0]);
  const [synthesizing, setSynthesizing] = useState(false);

  function handleSynthesize() {
    setSynthesizing(true);
    let count = 0;
    const interval = setInterval(() => {
      setGeneratedWord(FAKE_WORDS[Math.floor(Math.random() * FAKE_WORDS.length)]);
      count++;
      if (count > 8) {
        clearInterval(interval);
        setSynthesizing(false);
      }
    }, 120);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", minHeight: "320px" }}>
      {/* Column 1: English Input */}
      <div style={{ border: "2px solid #F0EAD6", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", letterSpacing: "0.1em" }}>
          COL.01 // ENGLISH INPUT
        </div>
        <div style={{ borderTop: "1px solid #F0EAD640", paddingTop: "8px" }}>
          <textarea
            rows={6}
            placeholder="Enter English text to translate into the dead language phoneme matrix..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ width: "100%", fontFamily: "'VT323', monospace", fontSize: "1.15rem" }}
          />
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", marginTop: "auto" }}>
          <div>CHAR COUNT: {inputText.length}</div>
          <div>PHONEME SLOTS: {Math.floor(inputText.length * 0.7)}</div>
          <div>ENTROPY: {inputText.length > 0 ? "HIGH" : "NULL"}</div>
        </div>
      </div>

      {/* Column 2: Decrypted Script */}
      <div
        style={{
          border: "2px solid #F0EAD6",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", letterSpacing: "0.1em", alignSelf: "flex-start" }}>
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
        </div>
      </div>

      {/* Column 3: Voice Selectors + Synth Button */}
      <div style={{ border: "2px solid #F0EAD6", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
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
          style={{
            height: `${h}px`,
            opacity: playing ? 0.9 : 0.6,
            transition: playing ? "height 0.12s" : "none",
          }}
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

  function renderSlider(
    label: string,
    value: number,
    onChange: (v: number) => void,
    color?: string
  ) {
    const filled = Math.floor(value / 10);
    const empty = 10 - filled;
    const ascii = `[${"=".repeat(filled)}|${" ".repeat(empty)}]`;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: "1rem",
            letterSpacing: "0.15em",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#a09880" }}>{label}</span>
          <span>{value}%</span>
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.3rem", letterSpacing: "-0.02em", color: color || "#F0EAD6" }}>
          {ascii}
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", minHeight: "360px" }}>
      {/* Sliders */}
      <div
        style={{
          border: "2px solid #F0EAD6",
          padding: "16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "24px",
        }}
      >
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", gridColumn: "1/-1", marginBottom: "-8px", letterSpacing: "0.1em" }}>
          // SIGNAL PROCESSING UNIT
        </div>
        {renderSlider("PITCH", pitch, setPitch)}
        {renderSlider("REVERB", reverb, setReverb, "#b8d4b8")}
        {renderSlider("DISTORTION", distortion, setDistortion, "#d4b8b8")}
      </div>

      {/* Timeline */}
      <div style={{ border: "2px solid #F0EAD6", padding: "16px" }}>
        <div
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: "1rem",
            color: "#a09880",
            letterSpacing: "0.1em",
            marginBottom: "12px",
          }}
        >
          // AUDIO TIMELINE — 2 TRACKS
        </div>

        {/* Track ruler */}
        <div
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: "0.9rem",
            color: "#a09880",
            display: "flex",
            gap: "0",
            marginBottom: "4px",
            paddingLeft: "240px",
          }}
        >
          {["0:00", "0:15", "0:30", "0:45", "1:00", "1:15", "1:30", "1:45", "2:00"].map((t) => (
            <span key={t} style={{ flex: 1 }}>{t}</span>
          ))}
        </div>

        {/* Track 1 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "2px solid #F0EAD6",
            marginBottom: "8px",
            padding: "8px",
            background: track1Muted ? "#0d0d0d" : "#121212",
            opacity: track1Muted ? 0.5 : 1,
          }}
        >
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", minWidth: "100px", letterSpacing: "0.08em" }}>
            TRK_001
            <div style={{ fontSize: "0.85rem", color: "#a09880" }}>PHONEME_BASE</div>
          </div>
          <button
            className="ascii-btn"
            onClick={() => setTrack1Playing(!track1Playing)}
            style={{ minWidth: "90px" }}
          >
            {track1Playing ? "[ STOP ]" : "[ PLAY ]"}
          </button>
          <button
            className="ascii-btn"
            onClick={() => setTrack1Muted(!track1Muted)}
            style={{ minWidth: "90px", background: track1Muted ? "#F0EAD6" : "#121212", color: track1Muted ? "#121212" : "#F0EAD6" }}
          >
            {track1Muted ? "[ UNMUTE ]" : "[ MUTE ]"}
          </button>
          <div style={{ flex: 1, border: "1px solid #F0EAD630", background: "#0a0a0a", height: "52px", display: "flex" }}>
            <WaveformDisplay playing={track1Playing} />
          </div>
        </div>

        {/* Track 2 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "2px solid #F0EAD6",
            padding: "8px",
            background: track2Muted ? "#0d0d0d" : "#121212",
            opacity: track2Muted ? 0.5 : 1,
          }}
        >
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", minWidth: "100px", letterSpacing: "0.08em" }}>
            TRK_002
            <div style={{ fontSize: "0.85rem", color: "#a09880" }}>RITUAL_REVERB</div>
          </div>
          <button
            className="ascii-btn"
            onClick={() => setTrack2Playing(!track2Playing)}
            style={{ minWidth: "90px" }}
          >
            {track2Playing ? "[ STOP ]" : "[ PLAY ]"}
          </button>
          <button
            className="ascii-btn"
            onClick={() => setTrack2Muted(!track2Muted)}
            style={{ minWidth: "90px", background: track2Muted ? "#F0EAD6" : "#121212", color: track2Muted ? "#121212" : "#F0EAD6" }}
          >
            {track2Muted ? "[ UNMUTE ]" : "[ MUTE ]"}
          </button>
          <div style={{ flex: 1, border: "1px solid #F0EAD630", background: "#0a0a0a", height: "52px", display: "flex" }}>
            <WaveformDisplay playing={track2Playing} />
          </div>
        </div>

        {/* Transport controls */}
        <div style={{ display: "flex", gap: "8px", marginTop: "12px", fontFamily: "'VT323', monospace" }}>
          <button
            className="ascii-btn"
            onClick={() => {
              setTrack1Playing(true);
              setTrack2Playing(true);
            }}
          >
            [▶ PLAY ALL]
          </button>
          <button
            className="ascii-btn"
            onClick={() => {
              setTrack1Playing(false);
              setTrack2Playing(false);
            }}
          >
            [■ STOP ALL]
          </button>
          <button className="ascii-btn">[ REC ]</button>
          <button className="ascii-btn">[ EXPORT ]</button>
          <div
            style={{
              marginLeft: "auto",
              border: "2px solid #F0EAD6",
              padding: "4px 12px",
              fontSize: "1.1rem",
              color: "#a09880",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
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

  function toggleDrawer(n: number) {
    setOpenDrawer((prev) => (prev === n ? null : n));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#121212",
        color: "#F0EAD6",
        fontFamily: "'VT323', monospace",
      }}
    >
      {/* Top Marquee */}
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
            padding: "8px 20px",
            borderBottom: "2px solid #F0EAD620",
          }}
        >
          <div
            style={{
              fontFamily: "'Rubik Mono One', monospace",
              fontSize: "1.8rem",
              letterSpacing: "0.15em",
              color: "#F0EAD6",
            }}
          >
            BABELSOUNDS
          </div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", letterSpacing: "0.1em" }}>
            <span style={{ color: "#4CAF50" }}>●</span> SYSTEM ACTIVE // v1.0.0 // {new Date().toISOString().split("T")[0]}
          </div>
        </div>
        {/* Scrolling ticker */}
        <div
          style={{
            padding: "6px 0",
            overflow: "hidden",
            background: "#0a0a0a",
          }}
        >
          <span
            className="marquee-text"
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: "1.3rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#F0EAD6",
            }}
          >
            &gt;&gt;&gt; SYSTEM SECURE // BABELSOUNDS_V1.0 // ARCHIVE UPLINK ACTIVE // PHONEME DATABASE: ONLINE // DEAD LANGUAGE CORPUS: LOADED // FIRECRAWL ENGINE: READY // SIGNAL PROCESSING: NOMINAL // RITUAL SYNTHESIS: ARMED &lt;&lt;&lt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &gt;&gt;&gt; SYSTEM SECURE // BABELSOUNDS_V1.0 // ARCHIVE UPLINK ACTIVE // PHONEME DATABASE: ONLINE // DEAD LANGUAGE CORPUS: LOADED // FIRECRAWL ENGINE: READY // SIGNAL PROCESSING: NOMINAL // RITUAL SYNTHESIS: ARMED &lt;&lt;&lt;
          </span>
        </div>
      </div>

      {/* Drawers */}
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Top border of first drawer */}
        <div style={{ borderTop: "2px solid #F0EAD6", marginTop: "0" }} />

        <RackDrawer
          number="001"
          title="ARCHIVE SCANNER // RESEARCH PHASE"
          isOpen={openDrawer === 1}
          onToggle={() => toggleDrawer(1)}
        >
          <ArchiveScanner />
        </RackDrawer>

        <RackDrawer
          number="002"
          title="LINGUISTIC SYNTHESIS // GENERATION PHASE"
          isOpen={openDrawer === 2}
          onToggle={() => toggleDrawer(2)}
        >
          <LinguisticSynthesis />
        </RackDrawer>

        <RackDrawer
          number="003"
          title="AUDIO SEQUENCER // SOUND DESIGN PHASE"
          isOpen={openDrawer === 3}
          onToggle={() => toggleDrawer(3)}
        >
          <AudioSequencer />
        </RackDrawer>

        {/* Footer */}
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
