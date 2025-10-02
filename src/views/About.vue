<script setup lang="ts">
import { onMounted, reactive } from "vue";
import type { BackendVersion } from "../models/version";
import { getVersion } from "../services/utils";

const version: BackendVersion = reactive({ version: "" });

onMounted(async () => {
  const newVersion = await getVersion();
  version.version = newVersion?.data?.version;
});
</script>

<template>
  <h1>About</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <p v-if="version.version">
    {{ version.version }}
  </p>
  <p v-else>Loading...</p>
</template>
