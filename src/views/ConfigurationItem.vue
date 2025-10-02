<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { RouterLink } from "vue-router";
</script>

<template>
  <!-- HACK: there's probably a better way to align this -->
  <div class="flex items-center">
    <h1 class="margin-0">Ítems de Configuración</h1>
    <Button class="ml-auto" size="lg">
      <RouterLink to="/config-items/new">Crear</RouterLink>
    </Button>
  </div>
  <div>Contenido</div>
</template>
