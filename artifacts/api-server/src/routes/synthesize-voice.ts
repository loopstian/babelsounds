import { Router } from "express";
import { ElevenLabsClient } from "elevenlabs";

const router = Router();

router.post("/synthesize-voice", async (req, res) => {
  const { vocalBlueprint, firstMessage } = req.body as {
    vocalBlueprint?: string;
    firstMessage?: string;
  };

  if (!vocalBlueprint || !firstMessage) {
    res.status(400).json({ error: "vocalBlueprint and firstMessage are required" });
    return;
  }

  const apiKey = process.env.ELEVEN_SECRET;
  if (!apiKey) {
    console.error("[synthesize-voice] ELEVEN_SECRET not configured");
    res.status(500).json({ error: "ElevenLabs API key not configured" });
    return;
  }

  try {
    const client = new ElevenLabsClient({ apiKey });

    const result = await client.textToVoice.createPreviews({
      voice_description: vocalBlueprint,
      text: firstMessage,
    });

    const preview = result.previews?.[0];
    if (!preview) {
      throw new Error("No preview returned from ElevenLabs API");
    }

    console.log(`[synthesize-voice] Voice generated: ${preview.generated_voice_id}`);

    res.json({
      voiceId: preview.generated_voice_id,
      audioBase64: preview.audio_sample,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[synthesize-voice] ElevenLabs error:", message);
    res.status(500).json({ error: "Vocal synthesis failed", detail: message });
  }
});

export default router;
