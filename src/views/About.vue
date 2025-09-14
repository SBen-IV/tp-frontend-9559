<script setup lang="ts">
import Layout from "../layout/Layout.vue";
</script>

<template>
  <Layout>
    <h1>About</h1>
    <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  </Layout>
</template>
