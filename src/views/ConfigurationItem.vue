<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { onMounted, ref, shallowRef } from "vue";
import { RouterLink } from "vue-router";
import type { ConfigItem } from "@/models/config_items";
import { getAllConfigItems } from "@/api/config_items";
import { toast } from "vue-sonner";
import { Plus } from "lucide-vue-next";
import ConfigItemPreview from "@/components/ConfigItemPreview.vue";

const data = shallowRef<ConfigItem[]>([]);
const isLoading = ref(false);

const sortByDate = (fecha1: Date, fecha2: Date) => {
  if (fecha1 < fecha2) {
    return 1;
  }

  if (fecha1 > fecha2) {
    return -1;
  }

  return 0;
};

const sortByName = (nombre1: string, nombre2: string) => {
  if (nombre1 < nombre2) {
    return 1;
  }

  if (nombre1 > nombre2) {
    return -1;
  }

  return 0;
};

const fetchItems = async () => {
  isLoading.value = true;
  try {
    const items: ConfigItem[] = await getAllConfigItems();
    data.value = items.sort((item1, item2) => {
      const res = sortByDate(item1.fecha_creacion, item2.fecha_creacion);
      if (res == 0) {
        return sortByName(item1.nombre, item2.nombre);
      }

      return res;
    });
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los ítems");
    data.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchItems();
});
</script>

<template>
  <!-- HACK: there's probably a better way to align this -->
  <div class="flex items-center my-2">
    <h1 class="margin-0">Ítems de Configuración</h1>
    <Button class="ml-auto">
      <RouterLink to="/config-items/new" class="flex">
        <Plus class="w-2 h-4 mr-2" />Crear</RouterLink
      >
    </Button>
  </div>
  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
    <div v-for="item in data" class="grid">
      <li class="grid gap-4">
        <ConfigItemPreview :item="item" />
      </li>
    </div>
  </ul>
</template>
