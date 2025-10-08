<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-vue-next";
</script>

<template>
  <div class="flex items-center my-2">
    <h1 class="margin-0">Problemas</h1>
    <Button class="ml-auto">
      <RouterLink to="/problems/new" class="flex">
        <Plus class="w-2 h-4 mr-2" />Crear</RouterLink
      >
    </Button>
  </div>
</template>

