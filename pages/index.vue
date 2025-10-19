<template>
  <div class="bg-gray-900 text-white min-h-screen font-sans">
    <header class="text-center py-8">
      <h1 class="text-3xl font-bold text-center text-indigo-400">
        🎵 AI-Powered EDM music tool
      </h1>

      <p class="text-indigo-400 mt-2">Rock the party with AI!</p>
    </header>

    <main class="container mx-auto px-4">
      <div class="flex justify-center space-x-4 mb-8">
        <button
          @click="showComponent = 'generator'"
          :class="buttonClass(showComponent === 'generator')"
        >
          Generator
        </button>
        <button
          @click="showComponent = 'deconstructor'"
          :class="buttonClass(showComponent === 'deconstructor')"
        >
          Deconstructor
        </button>
      </div>

      <Generator v-if="showComponent === 'generator'" />
      <Deconstructor v-if="showComponent === 'deconstructor'" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Generator from "~/components/Generator.vue";
import Deconstructor from "~/components/Deconstructor.vue";

useHead({
  title: "🎵 AI-Powered EDM music tool | Rock the Party with AI!",
  meta: [
    {
      name: "description",
      content: "Generate or deconstruct EDM tracks using AI-powered tools.",
    },
    { property: "og:title", content: "AI-Powered EDM music tool" },
    {
      property: "og:description",
      content: "Create and remix EDM music tracks with AI.",
    },
    { property: "og:type", content: "website" },
  ],
});

const showComponent = ref<"generator" | "deconstructor">("generator");

function buttonClass(active: boolean) {
  return [
    "px-4 py-2 rounded font-semibold",
    active
      ? "bg-indigo-600 text-white"
      : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white",
  ];
}
</script>
