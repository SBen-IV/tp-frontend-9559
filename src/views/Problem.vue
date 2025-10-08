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
import type { Problem } from "@/models/problems";
import { Button } from "@/components/ui/button";
import { sortByDate, sortByName } from "@/lib/utils";
import { Plus } from "lucide-vue-next";
import { estados } from "@/models/problems";
import { shallowRef, ref, computed, onMounted } from "vue";
import { toast } from "vue-sonner";
import { getAllProblems } from "@/api/problems";
import ProblemPreview from "@/components/ProblemPreview.vue";
import { priorities } from "@/models/commons";

const data = shallowRef<Problem[]>([]);
const isLoading = ref(false);
const searchTitulo = ref("");
const searchPrioridad = ref("");
const searchEstado = ref("");

const fetchItems = async () => {
  isLoading.value = true;
  try {
    const items: Problem[] = await getAllProblems();
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

const formattedPrioridades = computed(() =>
  priorities.map((prioridad) => ({
    value: prioridad,
    label: prioridad,
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

const filteredProblemas = computed(() => {
  let filters: ((problema: Problem) => boolean)[] = [];

  if (searchTitulo.value !== "") {
    filters.push((problema: Problem) => {
      return problema.titulo
        .toLowerCase()
        .includes(searchTitulo.value.toLowerCase());
    });
  }

  if (searchPrioridad.value !== "") {
    filters.push((problema: Problem) => {
      return problema.prioridad == searchPrioridad.value;
    });
  }

  if (searchEstado.value !== "") {
    filters.push((problema: Problem) => {
      return problema.estado == searchEstado.value;
    });
  }

  return data.value.filter((problema: Problem) => {
    let isProblemaFiltered = true;
    for (let i = 0; i < filters.length; i++) {
      isProblemaFiltered = isProblemaFiltered && filters[i](problema);
    }

    return isProblemaFiltered;
  });
});

const resetSearch = () => {
  searchTitulo.value = "";
  searchPrioridad.value = "";
  searchEstado.value = "";
};

onMounted(() => {
  fetchItems();
});
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
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 flex py-6">
    <div>
      <b>Titulo</b>
      <Input
        id="search"
        type="text"
        placeholder="Buscar por nombre..."
        v-model="searchTitulo"
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
  </div>
  <div class="pb-4">
    <Button @click="resetSearch()"><BrushCleaning /> Limpiar filtro</Button>
  </div>
  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
    <div v-for="item in filteredProblemas" class="grid">
      <li class="grid gap-4">
        <ProblemPreview :problem="item" />
      </li>
    </div>
  </ul>
</template>
