<script setup lang="ts">
import Layout from "../layout/Layout.vue";
</script>

<template>
  <Layout>
    <h1>Not Found :(</h1>
    <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
    <nav><RouterLink to="/">Go back Home</RouterLink><br /></nav>
  </Layout>
</template>
