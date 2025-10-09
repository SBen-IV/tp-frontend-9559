<script setup lang="ts">
import { BrushCleaning } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { RouterLink } from "vue-router";
import {
  SelectValue,
  Select,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectContent,
} from "@/components/ui/select";
import type { Incident as Incident } from "@/models/incidents";
import { Button } from "@/components/ui/button";
import { sortByDate, sortByName } from "@/lib/utils";
import { Plus } from "lucide-vue-next";
import { incidentStatus as estados } from "@/models/incidents";
import { shallowRef, ref, computed, onMounted } from "vue";
import { toast } from "vue-sonner";
import { getAllIncidents } from "@/api/incidents";
import IncidentPreview from "@/components/IncidentPreview.vue";
import { priorities } from "@/models/commons";
import { incidentCategory as categorias } from "@/models/incidents";

const data = shallowRef<Incident[]>([]);
const isLoading = ref(false);
const searchTitulo = ref("");
const searchCategoria = ref("");
const searchPrioridad = ref("");
const searchEstado = ref("");

const fetchItems = async () => {
  isLoading.value = true;
  try {
    const items: Incident[] = await getAllIncidents();
    data.value = items.sort((item1, item2) => {
      const res = sortByDate(item1.fecha_creacion, item2.fecha_creacion);

      return res != 0 ? res : sortByName(item1.titulo, item2.titulo);
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
    label: categoria.replace(/_/g, " "),
  }))
);

const formattedPrioridades = computed(() =>
  priorities.map((prioridad) => ({
    value: prioridad,
    label: prioridad,
  }))
);

const formattedEstados = computed(() =>
  estados.map((estado) => ({
    value: estado,
    label:
      estado.charAt(0).toUpperCase() +
      estado.replace("_", " ").slice(1).toLowerCase(),
  }))
);

const filteredIncidents = computed(() => {
  let filters: ((incident: Incident) => boolean)[] = [];

  if (searchTitulo.value !== "") {
    filters.push((incident: Incident) => {
      return incident.titulo
        .toLowerCase()
        .includes(searchTitulo.value.toLowerCase());
    });
  }

  if (searchCategoria.value !== "") {
    filters.push((item: Incident) => {
      return item.categoria == searchCategoria.value;
    });
  }

  if (searchPrioridad.value !== "") {
    filters.push((incident: Incident) => {
      return incident.prioridad == searchPrioridad.value;
    });
  }

  if (searchEstado.value !== "") {
    filters.push((incident: Incident) => {
      return incident.estado == searchEstado.value;
    });
  }

  return data.value.filter((incident: Incident) => {
    let isIncidentFiltered = true;
    for (let i = 0; i < filters.length; i++) {
      isIncidentFiltered = isIncidentFiltered && filters[i](incident);
    }

    return isIncidentFiltered;
  });
});

const resetSearch = () => {
  searchTitulo.value = "";
  searchPrioridad.value = "";
  searchEstado.value = "";
  searchCategoria.value = "";
};

onMounted(() => {
  fetchItems();
});
</script>

<template>
  <div class="flex items-center my-2">
    <h1 class="margin-0">Incidentes</h1>
    <Button class="ml-auto">
      <RouterLink to="/problems/new" class="flex">
        <Plus class="w-2 h-4 mr-2" />Crear</RouterLink
      >
    </Button>
  </div>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 flex py-6">
    <div class="">
      <b>Titulo</b>
      <Input
        id="search"
        v-model="searchTitulo"
        type="text"
        placeholder="Buscar por nombre..."
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
      <b>Prioridad</b>
      <Select v-model="searchPrioridad">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Buscar por prioridad..." />
        </SelectTrigger>
        <SelectContent class="capitalize">
          <SelectGroup>
            <SelectItem
              v-for="prioridad in formattedPrioridades"
              :key="prioridad.value"
              :value="prioridad.value"
              >{{ prioridad.label }}</SelectItem
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
    <div v-for="item in filteredIncidents" :key="item.id" class="grid">
      <li class="grid gap-4">
        <IncidentPreview :incident="item" />
      </li>
    </div>
  </ul>
</template>
