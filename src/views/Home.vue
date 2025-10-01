<script setup lang="ts">
import { Button } from "@/components/ui/button";
</script>

<template>
  <h1>Home</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <!--
      NOTE: this should probably be moved somewhere else, leaving it here now
      just to make it easy to access
    -->
  <Button>
    <RouterLink to="/config-items/new">Crear ítem de configuración</RouterLink>
  </Button>
</template>
