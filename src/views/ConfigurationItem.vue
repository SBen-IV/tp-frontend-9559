<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { BrushCleaning } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { computed, onMounted, ref, shallowRef } from "vue";
import { RouterLink } from "vue-router";
import type { ConfigItem } from "@/models/config_items";
import { getAllConfigItems } from "@/api/config_items";
import { toast } from "vue-sonner";
import { Plus } from "lucide-vue-next";
import ConfigItemPreview from "@/components/ConfigItemPreview.vue";
import {
  SelectValue,
  Select,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectContent,
} from "@/components/ui/select";
import { categorias, estados } from "@/models/config_items";
import { sortByDate, sortByName } from "@/lib/utils";

const data = shallowRef<ConfigItem[]>([]);
const isLoading = ref(false);
const searchNombre = ref("");
const searchVersion = ref("");
const searchCategoria = ref("");
const searchEstado = ref("");

const fetchItems = async () => {
  isLoading.value = true;
  try {
    const items: ConfigItem[] = await getAllConfigItems();
    data.value = items.sort((item1, item2) => {
      const res = sortByDate(item1.fecha_creacion, item2.fecha_creacion);

      return res != 0 ? res : sortByName(item1.nombre, item2.nombre);
    });
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los ítems");
    data.value = [];
  } finally {
    isLoading.value = false;
  }
};

const formattedCategorias = computed(() =>
  categorias.map((categoria) => ({
    value: categoria,
    label: categoria,
  })),
);

const formattedEstados = computed(() =>
  estados.map((estado) => ({
    value: estado,
    label:
      estado.charAt(0).toUpperCase() +
      estado.replace("_", " ").slice(1).toLowerCase(),
  })),
);

const filteredItems = computed(() => {
  let filters: ((item: ConfigItem) => boolean)[] = [];

  if (searchNombre.value !== "") {
    filters.push((item: ConfigItem) => {
      return item.nombre
        .toLowerCase()
        .includes(searchNombre.value.toLowerCase());
    });
  }

  if (searchVersion.value !== "") {
    filters.push((item: ConfigItem) => {
      return item.version
        .toLowerCase()
        .includes(searchVersion.value.toLowerCase());
    });
  }

  if (searchCategoria.value !== "") {
    filters.push((item: ConfigItem) => {
      return item.categoria == searchCategoria.value;
    });
  }

  if (searchEstado.value !== "") {
    filters.push((item: ConfigItem) => {
      return item.estado == searchEstado.value;
    });
  }

  return data.value.filter((item: ConfigItem) => {
    let isItemFiltered = true;
    for (let i = 0; i < filters.length; i++) {
      isItemFiltered = isItemFiltered && filters[i](item);
    }

    return isItemFiltered;
  });
});

const resetSearch = () => {
  searchNombre.value = "";
  searchVersion.value = "";
  searchCategoria.value = "";
  searchEstado.value = "";
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
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 flex py-6">
    <div>
      <b>Nombre</b>
      <Input
        id="search"
        type="text"
        placeholder="Buscar por nombre..."
        v-model="searchNombre"
      />
    </div>
    <div>
      <b>Versión</b>
      <Input
        id="search"
        type="text"
        placeholder="Buscar por versión..."
        v-model="searchVersion"
      />
    </div>
    <div>
      <b>Categoría</b>
      <Select v-model="searchCategoria">
        <SelectTrigger>
          <SelectValue placeholder="Buscar por categoría..." />
        </SelectTrigger>
        <SelectContent class="capitalize">
          <SelectGroup>
            <SelectItem
              v-for="categoria in formattedCategorias"
              :key="categoria.value"
              :value="categoria.value"
              >{{ categoria.label }}</SelectItem
            >
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div>
      <b>Estado</b>
      <Select v-model="searchEstado">
        <SelectTrigger>
          <SelectValue placeholder="Buscar por estado..." />
        </SelectTrigger>
        <SelectContent class="capitalize">
          <SelectGroup>
            <SelectItem
              v-for="estado in formattedEstados"
              :key="estado.value"
              :value="estado.value"
              >{{ estado.label }}</SelectItem
            >
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div class="pt-6">
      <Button @click="resetSearch()"><BrushCleaning /> Limpiar filtro</Button>
    </div>
  </div>
  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
    <div v-for="item in filteredItems" class="grid">
      <li class="grid gap-4">
        <ConfigItemPreview :item="item" />
      </li>
    </div>
  </ul>
</template>
