import { useState, useRef, useEffect } from "react";
import { Play, Square } from "lucide-react";

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
  name: string;
  matchScore: number;
  lexiconSample: LexiconSample;
  acousticConsensus: string;
  culturalContext: string;
  phoneticInventory: string[];
  vocalBlueprint: string;
  systemPrompt: string;
  englishFirstMessage: string;
  phoneticFirstMessage: string;
  typingGuide: string;
  sources: string[];
}

interface AgentConfig {
  vocalBlueprint: string;
  systemPrompt: string;
  phoneticFirstMessage: string;
  englishFirstMessage: string;
  agentId: string;
  voiceId: string;
  languageName: string;
  phoneticRules: string;
}

interface VoiceSynthResult {
  voiceId: string;
  audioBase64: string;
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


// ─── Active Scan Placeholder ──────────────────────────────────────────────────

function ScanPlaceholder() {
  const [blinkOn, setBlinkOn] = useState(true);

  useEffect(() => {
    const blinkIv = setInterval(() => setBlinkOn((v) => !v), 500);
    return () => clearInterval(blinkIv);
  }, []);

  return (
    <div style={{ border: "3px dashed #F0EAD630", padding: "36px 28px", background: "#0a0a0a", display: "flex", alignItems: "center", gap: "10px", fontFamily: "'VT323', monospace", fontSize: "1.3rem", letterSpacing: "0.06em" }}>
      <span style={{ color: "#F0EAD6" }}>&gt; INITIATING CROSS-SOURCE TRIANGULATION...</span>
      <span style={{ color: "#F0EAD6", opacity: blinkOn ? 1 : 0, transition: "none" }}>█</span>
    </div>
  );
}

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
            <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "1.1rem", letterSpacing: "0.05em", lineHeight: 1.2 }}>{signal.name}</span>
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
        <div className="panel-scroll" style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "0" }}>

          {/* Block 1: THE LORE — Wikipedia */}
          <div style={{ paddingBottom: "24px" }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.78rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ border: "1px solid #a0988050", padding: "2px 8px" }}>Wikipedia</span>
              <span style={{ color: "#F0EAD618" }}>—</span>
              <span>The Lore</span>
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

          {/* Divider */}
          <div style={{ borderTop: "1px solid #F0EAD630", marginBottom: "24px" }} />

          {/* Block 2: THE DNA — PHOIBLE */}
          <div style={{ paddingBottom: "24px" }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.78rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ border: "1px solid #a0988050", padding: "2px 8px" }}>PHOIBLE</span>
              <span style={{ color: "#F0EAD618" }}>—</span>
              <span>The DNA</span>
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

          {/* Divider */}
          <div style={{ borderTop: "1px solid #F0EAD630", marginBottom: "24px" }} />

          {/* Block 3: THE LEXICON — Wiktionary */}
          <div style={{ paddingBottom: "24px" }}>
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

          {/* Divider + Source Footer */}
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
  const [languageSignals, setLanguageSignals] = useState<LanguageSignal[]>([]);
  const [inspecting, setInspecting] = useState<LanguageSignal | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function handleSearch() {
    if (!query.trim() || searching) return;
    setSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: query.trim() }),
      });
      if (!res.ok) throw new Error(`Research API returned ${res.status}`);
      const data = (await res.json()) as { signal: LanguageSignal };
      console.log("[Babelsounds] Recovered signal:", data.signal);
      setLanguageSignals((prev) => [data.signal, ...prev]);
    } catch (err) {
      console.error("[Babelsounds] Search pipeline error:", err);
      setSearchError("Signal recovery failed. Try again.");
    } finally {
      setSearching(false);
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
                  {searching ? "[ SCANNING... ]" : "[ SEARCH ]"}
                </button>
              </div>
            </div>

            {searchError && (
              <div style={{ marginTop: "20px", fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#c44", letterSpacing: "0.06em" }}>
                {`> ERROR: ${searchError}`}
              </div>
            )}

            <div style={{ marginTop: "40px" }}>
              {searching ? (
                <ScanPlaceholder />
              ) : languageSignals.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.3rem", color: "#a09880", letterSpacing: "0.08em", lineHeight: 1.8 }}>
                    {"> NO SIGNALS DETECTED."}<br />
                    {"INITIATE SCAN TO RECOVER ANCIENT PHONETICS."}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", marginBottom: "10px", letterSpacing: "0.06em" }}>
                    {languageSignals.length} recovered signal{languageSignals.length !== 1 ? "s" : ""} — triangulated from Wikipedia, PHOIBLE, Wiktionary
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 240px 120px", border: "2px solid #F0EAD6", borderBottom: "none", padding: "8px 16px", background: "#F0EAD608", fontFamily: "'VT323', monospace", fontSize: "0.95rem", color: "#a09880", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    <span>Recovered Signal</span><span>Confidence</span><span style={{ textAlign: "right" }}>Dossier</span>
                  </div>
                  {languageSignals.map((sig, idx) => (
                    <div key={sig.id + "-" + idx} style={{ display: "grid", gridTemplateColumns: "1fr 240px 120px", border: "2px solid #F0EAD6", borderBottom: idx === languageSignals.length - 1 ? "2px solid #F0EAD6" : "none", padding: "14px 16px", alignItems: "center", background: "#121212" }}>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.2rem", letterSpacing: "0.04em" }}>{sig.name}</span>
                      <span><MatchBar value={sig.matchScore} /></span>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={() => setInspecting(sig)} style={{ ...outlineBtn, fontSize: "1.05rem", padding: "6px 14px" }}>Dossier</button>
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
  voiceSynthResult,
  onBack,
  onProceed,
}: {
  language: LanguageSignal;
  voiceSynthResult: VoiceSynthResult | null;
  onBack: () => void;
  onProceed: (config: AgentConfig) => void;
}) {
  const [vocalBlueprint, setVocalBlueprint] = useState(language.vocalBlueprint);
  const [systemPrompt, setSystemPrompt] = useState(language.systemPrompt);
  const [phoneticFirstMessage, setPhoneticFirstMessage] = useState(language.phoneticFirstMessage);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function buildAudio(): HTMLAudioElement | null {
    if (!voiceSynthResult?.audioBase64) return null;
    const audio = new Audio(`data:audio/mpeg;base64,${voiceSynthResult.audioBase64}`);
    audio.volume = 0.9;
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);
    audioRef.current = audio;
    return audio;
  }

  useEffect(() => {
    if (!voiceSynthResult?.audioBase64) return;
    try {
      const audio = buildAudio();
      audio?.play().catch((err) => console.warn("[Babelsounds] Audio autoplay blocked:", err));
    } catch (err) {
      console.error("[Babelsounds] Audio init error:", err);
    }
  }, []);

  function handleTogglePlay() {
    try {
      if (!audioRef.current) buildAudio();
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlaying) {
        audio.pause();
        audio.currentTime = 0;
      } else {
        audio.play().catch((err) => console.warn("[Babelsounds] Manual play blocked:", err));
      }
    } catch (err) {
      console.error("[Babelsounds] Toggle play error:", err);
    }
  }

  async function handleInitializeEntity() {
    if (isInitializing) return;
    setIsInitializing(true);
    setInitError(null);

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/create-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceId: voiceSynthResult?.voiceId,
          languageName: language.name,
          systemPrompt,
          phoneticRules: language.typingGuide,
          phoneticFirstMessage,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `API returned ${res.status}`);
      }
      const data = (await res.json()) as { agentId: string };
      console.log("AGENT CREATED WITH ID:", data.agentId);
      onProceed({ vocalBlueprint, systemPrompt, phoneticFirstMessage, englishFirstMessage: language.englishFirstMessage, agentId: data.agentId, voiceId: voiceSynthResult!.voiceId, languageName: language.name, phoneticRules: language.typingGuide });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Babelsounds] Agent creation error:", msg);
      setInitError(msg);
      setIsInitializing(false);
    }
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
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#F0EAD6" }}>{language.name}</span>
        </div>
      </div>

      

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
            {voiceSynthResult?.voiceId && (
              <div style={{ marginBottom: "10px", padding: "8px 12px", border: "1px solid #F0EAD630", background: "#0a0a0a", fontFamily: "'VT323', monospace", fontSize: "1rem", color: "#a09880", letterSpacing: "0.08em" }}>
                VOICE_ID: <span style={{ color: "#F0EAD6" }}>{voiceSynthResult.voiceId}</span>
              </div>
            )}
            <textarea
              value={vocalBlueprint}
              onChange={(e) => setVocalBlueprint(e.target.value)}
              rows={3}
              style={taStyle}
            />

            {/* Vocal Profile Player */}
            {voiceSynthResult?.audioBase64 && (
              <button
                onClick={handleTogglePlay}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  background: isPlaying ? "#F0EAD608" : "#0a0a0a",
                  border: "1px solid #F0EAD630",
                  color: "#F0EAD6",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontFamily: "'VT323', monospace",
                  letterSpacing: "0.1em",
                  transition: "background 0.15s",
                }}
              >
                {isPlaying
                  ? <Square size={13} strokeWidth={2.5} style={{ flexShrink: 0, opacity: 0.7 }} />
                  : <Play size={13} strokeWidth={2.5} style={{ flexShrink: 0, opacity: 0.7 }} />
                }
                <span style={{ fontSize: "1rem", flex: 1, textAlign: "left", color: isPlaying ? "#F0EAD6" : "#a09880" }}>
                  [ VOCAL PROFILE PREVIEW ]
                </span>
                {isPlaying && (
                  <span className="telemetry-flicker" style={{ fontSize: "0.9rem", color: "#a09880", letterSpacing: "0.06em" }}>
                    PLAYING...
                  </span>
                )}
              </button>
            )}
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

          {/* Box 3: The Script — Phonetic First Message */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>The Script — What The Entity Will Speak</label>
            <span style={subtitleStyle}>Phonetic vocalization in the native tongue. This is what the AI will actually say aloud.</span>
            <textarea
              value={phoneticFirstMessage}
              onChange={(e) => setPhoneticFirstMessage(e.target.value)}
              rows={3}
              style={taStyle}
            />
            <div style={{
              marginTop: "10px",
              padding: "10px 14px",
              border: "1px solid #F0EAD618",
              background: "#0a0a0a",
            }}>
              <span style={{
                fontFamily: "'VT323', monospace",
                fontSize: "0.75rem",
                color: "#a09880",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "4px",
              }}>
                Subtitles [English Translation]:
              </span>
              <span style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.95rem",
                color: "#F0EAD680",
                lineHeight: 1.5,
                fontStyle: "italic",
              }}>
                {language.englishFirstMessage}
              </span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #F0EAD618", marginBottom: "28px" }} />

          {/* Box 4: Phonetic Override (read-only) */}
          <div style={{ marginBottom: "48px" }}>
            <label style={labelStyle}>Phonetic Override — Scraped Rules</label>
            <span style={subtitleStyle}>Acoustic constraints extracted from PHOIBLE phonological data. Read-only. Injected into the agent's speech generation layer.</span>
            <div style={{ border: "2px solid #F0EAD630", padding: "14px", background: "#0a0a0a" }}>
              <p style={{ margin: 0, fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880", lineHeight: "1.6" }}>
                {language.typingGuide}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Initialize button — full width, inverted */}
      <div style={{ flexShrink: 0 }}>
        <button
          onClick={handleInitializeEntity}
          disabled={isInitializing}
          style={{
            display: "block",
            width: "100%",
            background: isInitializing ? "#a09880" : "#F0EAD6",
            color: "#121212",
            border: "none",
            borderTop: "4px solid #F0EAD6",
            fontFamily: "'VT323', monospace",
            fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
            letterSpacing: "0.14em",
            padding: "22px",
            cursor: isInitializing ? "not-allowed" : "pointer",
            textTransform: "uppercase",
          }}
        >
          {isInitializing ? "> UPLOADING NEURAL PATHWAYS..." : "[ Initialize Entity Connection ]"}
        </button>
        {initError && (
          <div style={{
            padding: "12px 22px",
            background: "#1a0000",
            borderTop: "1px solid #F0EAD618",
            fontFamily: "'VT323', monospace",
            fontSize: "1rem",
            color: "#ff6b6b",
            letterSpacing: "0.06em",
          }}>
            &gt; ERROR: {initError}
          </div>
        )}
      </div>

    </div>
  );
}

// ─── SCREEN 3: The Interrogation Terminal ─────────────────────────────────────

const VIZ_COLS = 28;
const SILENT_LINE = "----------------------------";
const WAIT_PHASES = [
  "> DECRYPTING INTENT...",
  "> ACCESSING ANCIENT MEMORIES...",
  "> SYNTHESIZING VOCAL RESPONSE...",
  "> AWAITING UPLINK...",
];

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
  const [isConnected, setIsConnected] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blinkOn, setBlinkOn] = useState(true);
  const [vizBars, setVizBars] = useState<number[]>(() => Array.from({ length: VIZ_COLS }, () => 0));
  const [subtitlePhonetic, setSubtitlePhonetic] = useState<string | null>(null);
  const [subtitleEnglish, setSubtitleEnglish] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<string | null>(null);
  const [waitPhase, setWaitPhase] = useState(0);
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; message: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasResponse = subtitlePhonetic !== null;

  useEffect(() => {
    setIsConnected(true);
    setTimeout(() => inputRef.current?.focus(), 80);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setBlinkOn((v) => !v), 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let vizInterval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      vizInterval = setInterval(() => {
        setVizBars(Array.from({ length: VIZ_COLS }, () => Math.floor(Math.random() * 8)));
      }, 80);
    } else {
      setVizBars(Array.from({ length: VIZ_COLS }, () => 0));
    }
    return () => { if (vizInterval) clearInterval(vizInterval); };
  }, [isPlaying]);

  // Cinematic latency masking — cycle through terminal phases while waiting
  useEffect(() => {
    if (!isWaiting) {
      setWaitPhase(0);
      return;
    }
    setWaitPhase(0);
    const t1 = setTimeout(() => setWaitPhase(1), 1500);
    const t2 = setTimeout(() => setWaitPhase(2), 3500);
    const t3 = setTimeout(() => setWaitPhase(3), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isWaiting]);

  async function handleSendText(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !isConnected || isWaiting) return;
    const message = input.trim();

    // Capture history snapshot before the state update (last 6 exchanges = 12 items)
    const historySnapshot = chatHistory.slice(-12);

    setInput("");
    setTelemetry(null);
    setIsWaiting(true);
    // Optimistically append user turn so it's visible immediately
    setChatHistory((prev) => [...prev, { role: "user" as const, message }]);

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/interrogate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agentConfig.agentId,
          voiceId: agentConfig.voiceId,
          userMessage: message,
          languageName: agentConfig.languageName,
          systemPrompt: agentConfig.systemPrompt,
          phoneticRules: agentConfig.phoneticRules,
          history: historySnapshot,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `API returned ${res.status}`);
      }

      const data = (await res.json()) as {
        phonetic: string;
        english: string;
        audioBase64: string | null;
        telemetry?: string | null;
      };

      // Append assistant turn to history
      setChatHistory((prev) => [...prev, { role: "assistant" as const, message: data.english }]);

      // Set telemetry flash (null clears any previous fragment)
      setTelemetry(data.telemetry ?? null);

      setSubtitlePhonetic(`> "${data.phonetic}"`);
      setSubtitleEnglish(data.english.toUpperCase());

      if (data.audioBase64) {
        try {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }
          const audio = new Audio(`data:audio/mpeg;base64,${data.audioBase64}`);
          audioRef.current = audio;
          audio.onplay = () => setIsPlaying(true);
          audio.onended = () => setIsPlaying(false);
          audio.onpause = () => setIsPlaying(false);
          audio.onerror = () => setIsPlaying(false);
          await audio.play();
        } catch (playErr) {
          console.error("[Babelsounds] Audio playback error:", playErr);
          setIsPlaying(false);
        }
      }
    } catch (err) {
      console.error("[Babelsounds] Interrogation error:", err);
      setTelemetry(null);
      setSubtitlePhonetic("> TRANSMISSION FAILED");
      setSubtitleEnglish(err instanceof Error ? err.message.toUpperCase() : "UNKNOWN ERROR");
    } finally {
      setIsWaiting(false);
    }
  }

  return (
    <div className="screen-fade-in" style={{ height: "100vh", width: "100%", overflow: "hidden", background: "#121212", color: "#F0EAD6", display: "flex", flexDirection: "column" }}>

      {/* ── Telemetry Header ── */}
      <div style={{ borderBottom: "2px solid #F0EAD6", display: "flex", alignItems: "center", minHeight: "44px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 20px", borderRight: "2px solid #F0EAD620" }}>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: isConnected ? "#4ade80" : "#F0EAD640", letterSpacing: "0.06em", opacity: blinkOn ? 1 : 0.2 }}>●</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.85rem", color: "#F0EAD6", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            STATUS: {isConnected ? "CONNECTED" : "STANDBY"}
          </span>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: "0.8rem", color: "#a09880", letterSpacing: "0.1em", textTransform: "uppercase" }}>ENTITY:</span>
          <span style={{ fontFamily: "'Rubik Mono One', monospace", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{language.name}</span>
        </div>
        <button
          onClick={onBack}
          style={{ ...outlineBtn, border: "none", borderLeft: "2px solid #F0EAD6", fontSize: "0.85rem", padding: "0 20px", height: "44px", letterSpacing: "0.1em" }}
        >
          [ TERMINATE LINK ]
        </button>
      </div>

      {/* ── Center Stage ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", padding: "20px 40px" }}>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.6rem", color: "#a0988035", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "4px" }}>
          / / ACOUSTIC FREQUENCY MONITOR / /
        </div>
        {/* Visualizer bars — flat when silent, animated when playing */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "clamp(60px, 16vh, 130px)" }}>
          {vizBars.map((h, i) => (
            <div
              key={i}
              style={{
                width: "11px",
                background: isPlaying ? "#F0EAD6" : "#F0EAD620",
                height: isPlaying ? `${Math.max(6, (h / 7) * 100)}%` : "3px",
                transition: isPlaying ? "none" : "height 0.6s ease, background 0.5s",
              }}
            />
          ))}
        </div>
        {/* ASCII frequency readout */}
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: "clamp(0.85rem, 1.6vw, 1.1rem)",
          letterSpacing: "0.04em",
          userSelect: "none",
          textAlign: "center",
          transition: "color 0.4s",
          color: isPlaying ? "#F0EAD680" : "#F0EAD618",
        }}>
          {isPlaying
            ? vizBars.map((h) => ["▁","▂","▃","▄","▅","▆","▇","█"][Math.min(h, 7)]).join("")
            : SILENT_LINE}
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: "0.6rem", color: "#a0988035", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "4px" }}>
          {isPlaying ? "— ENTITY TRANSMITTING —" : isWaiting ? "— DECRYPTING FREQUENCY —" : "— SIGNAL INACTIVE —"}
        </div>
      </div>

      {/* ── Subtitle Engine ── */}
      <div style={{ flexShrink: 0, borderTop: "1px solid #F0EAD615", borderBottom: "1px solid #F0EAD615", padding: "20px 40px 22px", background: "#080808", minHeight: "116px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>
        {isWaiting && !hasResponse ? (
          /* Cinematic wait — first message, no prior response */
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.05rem", color: "#F0EAD640", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {WAIT_PHASES[waitPhase]}{blinkOn ? "" : ""}
          </div>

        ) : !hasResponse && !isWaiting ? (
          /* Cold start blinking cursor */
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.4rem", color: "#F0EAD660", letterSpacing: "0.06em" }}>
            {">"} {blinkOn ? "_" : " "}
          </div>

        ) : (
          /* Response subtitles — shown once entity has spoken at least once */
          <>
            {/* Telemetry flash — blinks, visible only when response used live web data */}
            {telemetry && !isWaiting && (
              <div style={{
                fontFamily: "'VT323', monospace",
                fontSize: "0.85rem",
                color: "#8a9ab5",
                letterSpacing: "0.08em",
                opacity: blinkOn ? 1 : 0.5,
                transition: "opacity 0.15s",
                textTransform: "uppercase",
                marginBottom: "2px",
              }}>
                {">"} MEMORY RECOVERED: {telemetry.split(/\s+/).slice(0, 5).join(" ")}...
              </div>
            )}

            {/* Phonetic line — shows wait phase text while waiting, snaps to response */}
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.05rem", color: "#F0EAD648", letterSpacing: "0.06em", lineHeight: 1.3 }}>
              {isWaiting ? WAIT_PHASES[waitPhase] : subtitlePhonetic}
            </div>

            {/* English translation — dims during wait, snaps to full opacity on arrival */}
            <div style={{
              fontFamily: "'Rubik Mono One', monospace",
              fontSize: "clamp(1rem, 2.4vw, 1.4rem)",
              color: "#F0EAD6",
              letterSpacing: "0.05em",
              lineHeight: 1.25,
              opacity: isWaiting ? 0.25 : 1,
              transition: "opacity 0.3s",
            }}>
              {subtitleEnglish ?? ""}
            </div>
          </>
        )}
      </div>

      {/* ── Input Deck ── */}
      <div style={{ flexShrink: 0, borderTop: "4px solid #F0EAD6", display: "flex", alignItems: "stretch", minHeight: "64px" }}>
        <form onSubmit={handleSendText} style={{ flex: 1, display: "flex", alignItems: "stretch" }}>
          <input
            ref={inputRef}
            type="text"
            placeholder=">_ TYPE DIRECTIVE OVERRIDE..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!isConnected || isWaiting}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#F0EAD6",
              fontFamily: "'VT323', monospace",
              fontSize: "1.2rem",
              padding: "0 24px",
              outline: "none",
              letterSpacing: "0.04em",
              opacity: isConnected && !isWaiting ? 1 : 0.25,
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || !isConnected || isWaiting}
            style={{
              ...solidBtn,
              border: "none",
              borderLeft: "2px solid #F0EAD6",
              fontSize: "1rem",
              padding: "0 30px",
              letterSpacing: "0.1em",
              opacity: (!input.trim() || !isConnected || isWaiting) ? 0.3 : 1,
              cursor: (!input.trim() || !isConnected || isWaiting) ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
            }}
          >
            {isWaiting ? "[ ... ]" : "[ TRANSMIT ]"}
          </button>
        </form>
      </div>

    </div>
  );
}

// ─── Data Synthesis Transition ────────────────────────────────────────────────

function DataSynthesisTransition({
  synthesisState,
  synthesisError,
  onComplete,
  onAbort,
}: {
  synthesisState: "loading" | "done" | "error";
  synthesisError: string | null;
  onComplete: () => void;
  onAbort: () => void;
}) {
  const [animationDone, setAnimationDone] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const [visibleLines, setVisibleLines] = useState(0);
  const completeCalled = useRef(false);

  const lines = [
    "> INITIATING NEURAL HANDOFF...",
    "> EXTRACTING PHONETIC INVENTORY...",
    "> SYNTHESIZING VOCAL PROFILE...",
    "> HANDSHAKING WITH ELEVENLABS API...",
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), i * 500));
    });
    timers.push(setTimeout(() => setAnimationDone(true), lines.length * 500 + 200));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (animationDone && synthesisState === "done" && !completeCalled.current) {
      completeCalled.current = true;
      setTimeout(() => onComplete(), 600);
    }
  }, [animationDone, synthesisState]);

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
          </div>
        ))}

        {animationDone && synthesisState === "loading" && (
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem", color: "#a09880", letterSpacing: "0.05em" }}>
            {"> AWAITING VOICE SIGNATURE..."}
            <span style={{ opacity: cursorOn ? 1 : 0 }}> _</span>
          </div>
        )}

        {animationDone && synthesisState === "done" && (
          <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem", color: "#F0EAD6", letterSpacing: "0.05em" }}>
            {"> VOCAL SYNTHESIS COMPLETE."}
          </div>
        )}

        {animationDone && synthesisState === "error" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem", color: "#c44", letterSpacing: "0.05em" }}>
              {`> ERROR: VOCAL SYNTHESIS FAILED.`}
            </div>
            {synthesisError && (
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "1.1rem", color: "#a09880", letterSpacing: "0.05em" }}>
                {`> ${synthesisError}`}
              </div>
            )}
            <button
              onClick={onAbort}
              style={{ ...outlineBtn, marginTop: "16px", fontSize: "1.2rem", padding: "10px 28px", alignSelf: "flex-start" }}
            >
              ← Return to Archives
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("archives");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageSignal | null>(null);
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null);
  const [synthesisState, setSynthesisState] = useState<"loading" | "done" | "error">("loading");
  const [synthesisError, setSynthesisError] = useState<string | null>(null);
  const [voiceSynthResult, setVoiceSynthResult] = useState<VoiceSynthResult | null>(null);

  async function handleSelectLanguage(sig: LanguageSignal) {
    setSelectedLanguage(sig);
    setSynthesisState("loading");
    setSynthesisError(null);
    setVoiceSynthResult(null);
    setScreen("transition");

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/synthesize-voice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vocalBlueprint: sig.vocalBlueprint, phoneticFirstMessage: sig.phoneticFirstMessage }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `API returned ${res.status}`);
      }
      const data = (await res.json()) as VoiceSynthResult;
      setVoiceSynthResult(data);
      setSynthesisState("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Babelsounds] Voice synthesis error:", msg);
      setSynthesisError(msg);
      setSynthesisState("error");
    }
  }

  if (screen === "transition") {
    return (
      <DataSynthesisTransition
        synthesisState={synthesisState}
        synthesisError={synthesisError}
        onComplete={() => setScreen("recording")}
        onAbort={() => { setSynthesisState("loading"); setScreen("archives"); }}
      />
    );
  }

  if (screen === "recording" && selectedLanguage) {
    return (
      <RecordingScreen
        language={selectedLanguage}
        voiceSynthResult={voiceSynthResult}
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
