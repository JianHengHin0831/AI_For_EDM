<template>
  <div
    class="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md text-white"
  >
    <div class="flex flex-col sm:flex-row items-center gap-4 mb-6">
      <input
        type="file"
        @change="onFileChange"
        accept="audio/*"
        class="file-input file-input-bordered file-input-accent w-full sm:w-auto text-white-900"
      />
      <button
        :disabled="!file || isLoading"
        @click="uploadAndSplit"
        class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded transition"
      >
        Upload & Deconstruct
      </button>
    </div>

    <p v-if="error" class="text-red-500 mb-4 font-semibold">{{ error }}</p>
    <p v-if="isLoading" class="text-yellow-400 mb-4 font-medium animate-pulse">
      ⏳ Processing... please wait
    </p>

    <div v-if="fileId" class="mt-6">
      <div v-if="splitStatus?.result && !isLoading" class="mt-6">
        <h4 class="text-xl font-semibold mb-3">Stems:</h4>
        <ul class="space-y-6">
          <li
            v-for="item in splitTracks"
            :key="item.stem"
            class="bg-gray-700 p-4 rounded shadow-sm"
          >
            <p class="mb-2 font-semibold text-indigo-400">{{ item.stem }}</p>
            <audio :src="item.url" controls class="w-full"></audio>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const file = ref<File | null>(null);
const fileId = ref<string>("");
const splitStatus = ref<any>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const splitTracks = computed(() => {
  const result = splitStatus.value?.result?.[fileId.value]?.split || {};
  return Object.entries(result)
    .filter(([key, value]) => key.endsWith("_track") && value)
    .map(([key, value]) => ({
      stem: key.replace("_track", ""),
      url: value as string,
    }));
});

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    file.value = input.files[0] ?? null;
  }
}

async function uploadAndSplit() {
  if (!file.value) return;
  error.value = null;
  isLoading.value = true;

  try {
    // 读取文件为arrayBuffer
    const arrayBuffer = await file.value.arrayBuffer();

    const res = await fetch("/api/deconstructor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: Array.from(new Uint8Array(arrayBuffer)),
        filename: file.value.name,
      }),
    });

    const data = await res.json();
    if (data.error) {
      console.log("Deconstructor API error:", data.error);
      error.value = data.error;
      isLoading.value = false;
      return;
    }
    console.log("Deconstructor API response:", data);
    fileId.value = data.fileId;

    // 轮询状态
    await checkStatus();
  } catch (e: any) {
    error.value = e.message || "Failed to upload and split";
  } finally {
    isLoading.value = false;
  }
}

async function checkStatus() {
  if (!fileId.value) return;
  isLoading.value = true;
  try {
    const res = await fetch(`/api/deconstructorStatus?fileId=${fileId.value}`);
    const data = await res.json();
    splitStatus.value = data;
  } catch (e: any) {
    error.value = e.message || "Failed to check status";
  } finally {
    isLoading.value = false;
  }
}

const isProcessing = computed(() => {
  const status = splitStatus.value?.result?.[fileId.value]?.task?.state;
  return status === "progress" || status === undefined;
});
</script>
