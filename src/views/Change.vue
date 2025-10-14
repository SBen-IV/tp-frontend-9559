<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { BrushCleaning } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { computed, onMounted, reactive, ref, shallowRef } from "vue";
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
import { mapToMetric, sortByDate, sortByName } from "@/lib/utils";
import type { Change } from "@/models/changes";
import { getAllChanges } from "@/api/changes";
import { priorities } from "@/models/commons";
import type { ChangeMetric } from "@/models/metrics";
import CustomPieChart from "@/components/CustomPieChart.vue";
import {
  BLUE,
  GREEN,
  LIGHT_BLUE,
  PINK,
  VIOLET,
  type Color,
} from "@/models/colors";
import { Card } from "@/components/ui/card";
import { colorsByPrioridad } from "@/lib/utils";

const data = shallowRef<Change[]>([]);
const metricsData = reactive<ChangeMetric>({
  total: 0,
  byEstado: [],
  byPrioridad: [],
});
const isLoading = ref(false);
const searchTitulo = ref("");
const searchPrioridad = ref("");
const searchEstado = ref("");
const searchDescripcion = ref("");

const colorsByEstado: Record<string, Color> = {
  RECIBIDO: PINK,
  ACEPTADO: VIOLET,
  RECHAZADO: BLUE,
  EN_PROGRESO: LIGHT_BLUE,
  CERRADO: GREEN,
};

const calculateMetrics = (changes: Change[]) => {
  const byEstado: Map<string, number> = new Map();
  const byPrioridad: Map<string, number> = new Map();

  changes.forEach((change: Change) => {
    const valueEstado: number | undefined = byEstado.get(change.estado)
      ? byEstado.get(change.estado)! + 1
      : 1;

    byEstado.set(change.estado, valueEstado);

    const valuePrioridad: number | undefined = byPrioridad.get(change.prioridad)
      ? byPrioridad.get(change.prioridad)! + 1
      : 1;

    byPrioridad.set(change.prioridad, valuePrioridad);
  });

  metricsData.total = changes.length;
  metricsData.byEstado = mapToMetric(byEstado);
  metricsData.byPrioridad = mapToMetric(byPrioridad);
};

const fetchItems = async () => {
  isLoading.value = true;
  try {
    const changes: Change[] = await getAllChanges();
    calculateMetrics(changes);
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
  <h1 class="text-6xl text-center font-bold mb-2">Cambios</h1>
  <div class="flex items-center my-2">
    <Button class="ml-auto">
      <RouterLink to="/changes/new" class="flex">
        <Plus class="w-2 h-4 mr-2" />Crear</RouterLink
      >
    </Button>
  </div>
  <div class="grid grid-cols-3 gap-8 flex items-center">
    <Card class="mx-6 max-w-3/4">
      <div class="justify-items-center items-center">
        <div class="text-4xl font-light">Total {{ metricsData.total }}</div>
      </div>
    </Card>
    <CustomPieChart
      :title="'Por estados'"
      :metrics="metricsData.byEstado"
      :colors="colorsByEstado"
    />
    <CustomPieChart
      :title="'Por prioridades'"
      :metrics="metricsData.byPrioridad"
      :colors="colorsByPrioridad"
    />
  </div>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 flex py-6">
    <div>
      <b>Titulo</b>
      <Input
        id="searchTitulo"
        type="text"
        placeholder="Buscar por título..."
        v-model="searchTitulo"
      />
    </div>
    <div>
      <b>Descripción</b>
      <Input
        id="searchDescripcion"
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
        <ChangePreview :change="item" @changes-updated="handleChangesUpdated" />
      </li>
    </div>
  </ul>
</template>
