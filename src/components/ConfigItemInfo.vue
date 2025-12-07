<script setup lang="ts">
import type { ConfigItem } from "@/models/config_items";
import {
  colorsByConfigItemEstado,
  prettyDate,
  prettyEstado,
} from "@/lib/utils";
import Card from "./ui/card/Card.vue";
import Badge from "./ui/badge/Badge.vue";
import Separator from "./ui/separator/Separator.vue";
import { CodeXml, FileText, Wrench } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{ configItem: ConfigItem }>();

const categoryIcons: Record<string, any> = {
  SOFTWARE: CodeXml,
  HARDWARE: Wrench,
  DOCUMENTACION: FileText,
};

const itemIcon = computed(() => {
  return categoryIcons[props.configItem.categoria];
});

const getBadgeColor = (key: string): string => {
  return colorsByConfigItemEstado[key].tw;
};
</script>

<template>
  <Card class="p-6">
    <h1 class="text-4xl text-center font-bold">
      {{ configItem.nombre }}
    </h1>
    <div class="grid grid-cols-5 text-sm">
      <div>
        <p class="font-medium text-muted-foreground">ID</p>
        <p>{{ configItem.id }}</p>
      </div>
      <div>
        <p class="font-medium text-muted-foreground">Versión</p>
        <p>{{ configItem.version }}</p>
      </div>
      <div>
        <p class="font-medium text-muted-foreground">Estado</p>
        <Badge
          variant="secondary"
          class="text-black"
          :class="getBadgeColor(configItem.estado)"
          >{{ prettyEstado(configItem.estado) }}</Badge
        >
      </div>
      <div>
        <p class="font-medium text-muted-foreground">Categoría</p>
        <Badge>
          <component :is="itemIcon" class="w-3 h-3 flex-shrink-0" />
          {{ configItem.categoria }}</Badge
        >
      </div>
      <div>
        <p class="font-medium text-muted-foreground">Fecha de creación</p>
        <p>{{ prettyDate(configItem.fecha_creacion) }}</p>
      </div>
    </div>

    <Separator class="my-4" />

    <p class="font-medium text-muted-foreground">Descripción</p>
    <div class="max-h-[200px] overflow-y-auto">
      <p class="text-sm leading-relaxed">
        {{ configItem.descripcion }}
      </p>
    </div>
  </Card>
</template>
