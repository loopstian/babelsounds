import { Router } from "express";
import { ElevenLabsClient } from "elevenlabs";

const router = Router();

if (!process.env.ELEVEN_SECRET) {
  console.warn("[create-agent] WARNING: ELEVEN_SECRET is not set — agent creation will fail.");
}

router.post("/create-agent", async (req, res) => {
  console.log("[create-agent] Request received:", JSON.stringify(req.body).slice(0, 300));

  const { voiceId, languageName, systemPrompt, phoneticRules, phoneticFirstMessage } = req.body as {
    voiceId?: string;
    languageName?: string;
    systemPrompt?: string;
    phoneticRules?: string;
    phoneticFirstMessage?: string;
  };

  if (!voiceId?.trim() || !languageName?.trim() || !systemPrompt?.trim() || !phoneticRules?.trim() || !phoneticFirstMessage?.trim()) {
    res.status(400).json({ error: "voiceId, languageName, systemPrompt, phoneticRules, and phoneticFirstMessage are all required" });
    return;
  }

  const apiKey = process.env.ELEVEN_SECRET;
  if (!apiKey) {
    res.status(500).json({ error: "ElevenLabs API key not configured on server" });
    return;
  }

  const masterPrompt = `You are an ancient entity speaking ${languageName}. Your history: ${systemPrompt}. You are trapped in a digital terminal. Your personality is intimidating, cryptic, and ancient. CRITICAL: You do not speak English. You only speak your native phonetic tongue using these rules: ${phoneticRules}.`;

  console.log(`[create-agent] Creating agent "Entity: ${languageName}" with voiceId=${voiceId}, prompt length=${masterPrompt.length}, firstMessage length=${phoneticFirstMessage.length}`);

  try {
    const client = new ElevenLabsClient({ apiKey });

    const agent = await client.conversationalAi.createAgent({
      name: `Entity: ${languageName}`,
      conversation_config: {
        tts: {
          voice_id: voiceId,
          model_id: "eleven_multilingual_v2" as string,
        },
        agent: {
          first_message: phoneticFirstMessage,
          prompt: {
            prompt: masterPrompt,
          },
        },
      },
    });

    console.log(`[create-agent] Agent created successfully: ${agent.agent_id}`);

    res.json({ agentId: agent.agent_id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[create-agent] ElevenLabs API Error:", message);
    if (err instanceof Error && "body" in err) {
      console.error("[create-agent] Error body:", JSON.stringify((err as Record<string, unknown>).body));
    }
    res.status(500).json({ error: message });
  }
});

export default router;
