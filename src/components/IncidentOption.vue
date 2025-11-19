<script setup lang="ts">
import type { Incident } from "@/models/incidents";
import { CodeXml, Wrench, ShieldAlert, Plug } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{ incident: Incident }>();

const categoryIcons: Record<string, any> = {
  SOFTWARE: CodeXml,
  HARDWARE: Wrench,
  SEGURIDAD: ShieldAlert,
  SOLICITUD_DE_SERVICIO: Plug,
};

const itemIcon = computed(() => {
  return categoryIcons[props.incident.categoria];
});
</script>

<template>
  <div
    class="flex items-center gap-1.5 w-full min-w-[50px] max-w-[180px] px-1.5 py-1"
  >
    <component
      :is="itemIcon"
      class="w-3 h-3 flex-shrink-0 text-muted-foreground"
    />
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-1">
        <span class="text-xs font-medium wrap">{{ incident.titulo }}</span>
        <span
          v-if="incident.estado"
          class="text-[10px] text-muted-foreground flex-shrink-0"
        >
          {{ incident.estado }}
        </span>
      </div>
      <div class="text-[10px] text-muted-foreground wrap">
        ID: {{ incident.id }}
      </div>
    </div>
  </div>
</template>
