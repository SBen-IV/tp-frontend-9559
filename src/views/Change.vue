<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { BrushCleaning } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { computed, onMounted, ref, shallowRef } from "vue";
import { RouterLink } from "vue-router";
import { toast } from "vue-sonner";
import { Plus } from "lucide-vue-next";
import ChangePreview from "@/components/ChangePreview.vue";
import {
  SelectValue,
  Select,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectContent,
} from "@/components/ui/select";
import { changeStatus } from "@/models/changes";
import { sortByDate, sortByName } from "@/lib/utils";
import type { Change } from "@/models/changes";
import { getAllChanges } from "@/api/changes";
import { priorities } from "@/models/commons";

const data = shallowRef<Change[]>([]);
const isLoading = ref(false);
const searchTitulo = ref("");
const searchPrioridad = ref("");
const searchEstado = ref("");
const searchDescripcion = ref("");

const fetchItems = async () => {
  isLoading.value = true;
  try {
    const changes: Change[] = await getAllChanges();
    data.value = changes.sort((change1, change2) => {
      const res = sortByDate(change1.fecha_creacion, change2.fecha_creacion);

      return res != 0 ? res : sortByName(change1.titulo, change2.titulo);
    });
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los cambios");
    data.value = [];
  } finally {
    isLoading.value = false;
  }
};

const formattedStatus = computed(() =>
  changeStatus.map((status) => ({
    value: status,
    label:
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase().split("_").join(" "),
  })),
);

const formattedPriorities = computed(() =>
  priorities.map((priority) => ({
    value: priority,
    label: priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
  })),
);

const filteredItems = computed(() => {
  let filters: ((item: Change) => boolean)[] = [];

  if (searchTitulo.value !== "") {
    filters.push((item: Change) => {
      return item.titulo
        .toLowerCase()
        .includes(searchTitulo.value.toLowerCase());
    });
  }

  if (searchDescripcion.value !== "") {
    filters.push((item: Change) => {
      return item.descripcion
        .toLowerCase()
        .includes(searchDescripcion.value.toLowerCase());
    });
  }

  if (searchPrioridad.value !== "") {
    filters.push((item: Change) => {
      return item.prioridad == searchPrioridad.value;
    });
  }

  if (searchEstado.value !== "") {
    filters.push((item: Change) => {
      return item.estado == searchEstado.value;
    });
  }

  return data.value.filter((item: Change) => {
    let isItemFiltered = true;
    for (let i = 0; i < filters.length; i++) {
      isItemFiltered = isItemFiltered && filters[i](item);
    }

    return isItemFiltered;
  });
});

const resetSearch = () => {
  searchTitulo.value = "";
  searchPrioridad.value = "";
  searchEstado.value = "";
  searchPrioridad.value = "";
};

const handleChangesUpdated = () => {
  fetchItems();
};

onMounted(() => {
  fetchItems();
});
</script>

<template>
  <!-- HACK: there's probably a better way to align this -->
  <div class="flex items-center my-2">
    <h1 class="margin-0">Cambios</h1>
    <Button class="ml-auto">
      <RouterLink to="/changes/new" class="flex">
        <Plus class="w-2 h-4 mr-2" />Crear</RouterLink
      >
    </Button>
  </div>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 flex py-6">
    <div>
      <b>Titulo</b>
      <Input
        id="search"
        type="text"
        placeholder="Buscar por título..."
        v-model="searchTitulo"
      />
    </div>
    <div>
      <b>Descripción</b>
      <Input
        id="search"
        type="text"
        placeholder="Buscar por descripción..."
        v-model="searchDescripcion"
      />
    </div>
    <div>
      <b>Prioridad</b>
      <Select v-model="searchPrioridad">
        <SelectTrigger>
          <SelectValue placeholder="Buscar por prioridad..." />
        </SelectTrigger>
        <SelectContent class="capitalize">
          <SelectGroup>
            <SelectItem
              v-for="priority in formattedPriorities"
              :key="priority.value"
              :value="priority.value"
              >{{ priority.label }}</SelectItem
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
              v-for="status in formattedStatus"
              :key="status.value"
              :value="status.value"
              >{{ status.label }}</SelectItem
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
        <ChangePreview :change="item" @changes-updated="handleChangesUpdated"/>
      </li>
    </div>
  </ul>
</template>
