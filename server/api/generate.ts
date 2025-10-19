interface TrackResponse {
  id: string;
  title: string;
  duration: number;
  music_file_path: string;
}

interface TrackForClient {
  id: string;
  title: string;
  audio_url: string;
}

export default defineEventHandler(async (event) => {
  const { prompt } = await readBody(event);
  const apiKey = process.env.LOUDY_API_KEY;

  if (!prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: "Prompt is required.",
    });
  }

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Server configuration error: API Key is missing.",
    });
  }

  const LOUDLY_ENDPOINT = "https://soundtracks.loudly.com/api/ai/prompt/songs";

  // generate single track
  const generateTrack = async (): Promise<TrackForClient | null> => {
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("duration", "45");
    form.append("test", "false");

    try {
      const res = await fetch(LOUDLY_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "API-KEY": apiKey,
        },
        body: form,
      });

      const result = (await res.json()) as TrackResponse;

      if (!result.music_file_path) {
        console.warn("Empty music_file_path in result:", result);
        return null;
      }

      return {
        id: result.id,
        title: result.title,
        audio_url: result.music_file_path,
      };
    } catch (err) {
      console.error("Loudly API error:", err);
      return null;
    }
  };

  // generate 3 tracks in parallel
  const tracks = await Promise.all([
    generateTrack(),
    generateTrack(),
    generateTrack(),
  ]);

  return tracks.filter((track): track is TrackForClient => !!track);
});
