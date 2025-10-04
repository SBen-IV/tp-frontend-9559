<script setup lang="ts">
import type { ConfigItem } from "@/models/config_items";
import {
  CardHeader,
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { CodeXml, FileText, Wrench } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{ item: ConfigItem }>();

const dateToString = (date: Date): String => {
  // For some reason `date` is not a `Date`
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDay();
  return `${day}-${month}-${year}`;
};

const categoryIcons: Record<string, any> = {
  SOFTWARE: CodeXml,
  HARDWARE: Wrench,
  DOCUMENTACION: FileText,
};

const itemIcon = computed(() => {
  return categoryIcons[props.item.categoria];
});
</script>

<template>
  <Card class="py-6">
    <CardHeader class="flex">
      <CardTitle>{{ item.nombre }}</CardTitle>
      <CardDescription>{{ item.version }}</CardDescription>
      <Badge>
        <component :is="itemIcon" class="w-3 h-3 flex-shrink-0" />
        {{ item.categoria }}</Badge
      >
    </CardHeader>
    <CardContent class="overflow-hidden text-ellipsis text-wrap max-h-30">
      <p class="italic text-xs">
        Fecha creación: {{ dateToString(item.fecha_creacion) }}
      </p>
      <!-- <p>
        {{ item.descripcion }}
      </p>-->
    </CardContent>
  </Card>
</template>
