<template>
  <div
    class="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-2xl space-y-6"
  >
    <div class="space-y-4">
      <label class="block text-sm mb-1">1. Select Genre</label>
      <select
        v-model="selectedGenre"
        class="w-full p-3 rounded bg-gray-800 border border-gray-700"
      >
        <option v-for="genre in genres" :key="genre" :value="genre">
          {{ genre }}
        </option>
      </select>

      <label class="block text-sm mt-4 mb-1">2. Describe Your Track</label>
      <div class="relative">
        <textarea
          v-model="prompt"
          rows="3"
          class="w-full p-4 rounded bg-gray-800 border border-gray-700 resize-none"
          placeholder="e.g., Indian festival style drop with aggressive leads"
        />
        <button
          @click="fetchRandomPrompt"
          class="absolute right-2 top-2 text-xs px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          ✨ Surprise Me
        </button>
      </div>

      <button
        @click="generateMusic"
        :disabled="isLoading || isFetchingAux"
        class="w-full mt-4 p-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
      >
        {{ isLoading ? "Generating Tracks..." : "3. Generate My Tracks" }}
      </button>

      <div v-if="errorMessage" class="text-red-400 mt-4 text-sm text-center">
        {{ errorMessage }}
      </div>
    </div>

    <!-- generated result -->
    <div v-if="generatedTracks.length" class="mt-8 space-y-4">
      <h2 class="text-xl font-semibold text-green-400">
        Pick Your Favorite Track
      </h2>
      <div
        v-for="track in generatedTracks"
        :key="track.id"
        class="bg-gray-800 p-4 rounded border border-gray-700 flex items-center gap-4"
      >
        <div class="flex-grow truncate">{{ track.title }}</div>
        <audio :src="track.audio_url" controls class="w-full max-w-xs" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const prompt = ref("A high-energy EDM drop with Indian percussion and flute.");
const genres = ref<string[]>([]);
const selectedGenre = ref("EDM");
const generatedTracks = ref<{ id: string; audio_url: string; title: string }[]>(
  []
);
const isLoading = ref(false);
const isFetchingAux = ref(false);
const errorMessage = ref("");

// load genres on mount
onMounted(async () => {
  isFetchingAux.value = true;
  try {
    genres.value = await $fetch<string[]>("/api/genres");
  } catch {
    errorMessage.value = "Failed to load genres.";
  } finally {
    isFetchingAux.value = false;
  }
});

// random prompt
async function fetchRandomPrompt() {
  isFetchingAux.value = true;
  try {
    const { prompt: newPrompt } = await $fetch<{ prompt: string }>(
      "/api/random-prompt"
    );
    prompt.value = newPrompt;
  } catch {
    errorMessage.value = "Could not fetch a random prompt.";
  } finally {
    isFetchingAux.value = false;
  }
}

// handle generate music
async function generateMusic() {
  if (!prompt.value || !selectedGenre.value || isLoading.value) return;
  isLoading.value = true;
  errorMessage.value = "";
  generatedTracks.value = [];
  const mergedPrompt = `A ${selectedGenre.value} track: ${prompt.value}`;

  try {
    const tracks = await $fetch("/api/generate", {
      method: "POST",
      body: { prompt: mergedPrompt },
    });
    generatedTracks.value = tracks;
    if (tracks.length === 0) {
      errorMessage.value = "No tracks generated. Try another prompt.";
    }
  } catch (e: any) {
    errorMessage.value = e.data?.statusMessage || "Failed to generate tracks.";
  } finally {
    isLoading.value = false;
  }
}
</script>
