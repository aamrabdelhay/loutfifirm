/**
 * Speech-to-text interface. OFF unless STT_API_KEY is set. Provider: any OpenAI-compatible
 * /audio/transcriptions endpoint (STT_API_URL, STT_MODEL). Audio is sent to that provider only when the office
 * triggers a transcription from the admin and the provider is configured.
 */
export function sttConfigured(): boolean {
  return Boolean(process.env.STT_API_KEY?.trim());
}

export const STT_MAX_BYTES = 4 * 1024 * 1024;

export async function transcribe(file: File, language = "ar"): Promise<string> {
  const url = process.env.STT_API_URL?.trim() || "https://api.openai.com/v1/audio/transcriptions";
  const fd = new FormData();
  fd.set("file", file, file.name);
  fd.set("model", process.env.STT_MODEL?.trim() || "whisper-1");
  fd.set("language", language);
  fd.set("response_format", "json");
  const res = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${process.env.STT_API_KEY}` }, body: fd, signal: AbortSignal.timeout(110_000) });
  if (!res.ok) throw new Error(`transcription provider returned ${res.status}`);
  const data = (await res.json()) as { text?: string };
  if (!data.text?.trim()) throw new Error("empty transcript");
  return data.text.trim();
}
