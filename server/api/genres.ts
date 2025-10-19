interface Genre {
  id: number;
  name: string;
  description: string;
  image_url: string;
  instruments: string[];
  bpm: {
    low: number;
    high: number;
  };
  suggested_instruments: string[];
  micro_genres: Record<string, any>[];
}

export default defineEventHandler(async () => {
  const apiKey = process.env.LOUDY_API_KEY;

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Server configuration error: API Key is missing.",
    });
  }

  const LOUDY_GENRES_ENDPOINT = "https://soundtracks.loudly.com/api/ai/genres";

  try {
    const genres = await $fetch<Genre[]>(LOUDY_GENRES_ENDPOINT, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "API-KEY": apiKey,
      },
    });

    // return only genre names
    return genres.map((genre) => genre.name);
  } catch (error: any) {
    console.error("Error fetching Loudly genres:", error.data || error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch genres from Loudly.",
    });
  }
});
