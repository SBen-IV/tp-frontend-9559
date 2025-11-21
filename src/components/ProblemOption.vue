<script setup lang="ts">
import type { Problem } from "@/models/problems";
import { Bug } from "lucide-vue-next";

const props = defineProps<{ problem: Problem }>();
</script>

<template>
  <div
    class="flex items-center gap-1.5 w-full min-w-[50px] max-w-[180px] px-1.5 py-1"
  >
    <Bug class="w-3 h-3 flex-shrink-0 text-muted-foreground"/>
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-1">
        <span class="text-xs font-medium wrap">{{ problem.titulo }}</span>
        <span
          v-if="problem.estado"
          class="text-[10px] text-muted-foreground flex-shrink-0"
        >
          {{ problem.estado }}
        </span>
      </div>
      <div class="text-[10px] text-muted-foreground wrap">
        ID: {{ problem.id }}
      </div>
    </div>
  </div>
</template>
