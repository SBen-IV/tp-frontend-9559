<script setup lang="ts">
import type ConfigItem from '@/models/items';
import { CodeXml, Wrench, FileText } from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps<{ item: ConfigItem }>();

const categoryIcons: Record<string, any> = {
  "SOFTWARE": CodeXml,
  "HARDWARE": Wrench,
  "DOCUMENTACION": FileText,
};

const itemIcon = computed(() => {
  return categoryIcons[props.item.categoria] 
});
</script>

<template>
  <div class="flex items-center gap-1.5 w-full min-w-[50px] max-w-[180px] px-1.5 py-1">
    <component :is="itemIcon" class="w-3 h-3 flex-shrink-0 text-muted-foreground" />
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-1">
        <span class="text-xs font-medium wrap">{{ item.nombre }}</span>
        <span v-if="item.version" class="text-[10px] text-muted-foreground flex-shrink-0">
          v{{ item.version }}
        </span>
      </div>
      <div class="text-[10px] text-muted-foreground wrap">ID: {{ item.id }}</div>
    </div>
  </div>
</template>