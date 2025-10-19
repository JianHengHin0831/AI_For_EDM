export default defineEventHandler(async () => {
  const apiKey = process.env.LOUDY_API_KEY;

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Server configuration error: API Key is missing.",
    });
  }

  const LOUDY_RANDOM_ENDPOINT =
    "https://soundtracks.loudly.com/api/ai/prompt/random";

  try {
    const promptResponse = await $fetch<{ prompt: string }>(
      LOUDY_RANDOM_ENDPOINT,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "API-KEY": apiKey,
        },
      }
    );

    console.log("Successfully fetched random prompt:", promptResponse);

    return promptResponse;
  } catch (error: any) {
    console.error("Error fetching Loudly random prompt:", error.data || error);

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch a random prompt.",
    });
  }
});
