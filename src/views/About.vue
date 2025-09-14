<script setup lang="ts">
import { onMounted, ref } from "vue";
import Layout from "../layout/Layout.vue";
import { getVersion } from "../services/utils";

const version = ref();

onMounted(async () => (version.value = await getVersion()));
</script>

<template>
  <Layout>
    <h1>About</h1>
    <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
    {{ version?.value?.version }}
  </Layout>
</template>
