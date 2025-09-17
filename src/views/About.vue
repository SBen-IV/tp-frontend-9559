<script setup lang="ts">
import { onMounted, reactive } from "vue";
import Layout from "../layout/Layout.vue";
import type { BackendVersion } from "../models/version";
import { getVersion } from "../services/utils";

const version: BackendVersion = reactive({ version: "" });

onMounted(async () => {
  getVersion().then((value) => {
    if (value) {
      version.version = value.version;
    }
  });
});
</script>

<template>
  <Layout>
    <h1>About</h1>
    <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
    <p v-if="version.version">
      {{ version.version }}
    </p>
    <p v-else>Loading...</p>
  </Layout>
</template>
