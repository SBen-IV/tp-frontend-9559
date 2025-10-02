<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
</script>

<template>
  <h1 v-if="!authStore.isLoggedIn">Home page</h1>
  <h1 v-else>Bienvenido/a</h1>
</template>
