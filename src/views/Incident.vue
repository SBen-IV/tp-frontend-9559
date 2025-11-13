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
import {
  mapToMetric,
  sortByDate,
  sortByName,
  colorsByPrioridad,
  colorsByIncidenteEstado,
  colorsByIncidenteCategoria,
  formatAverageResolutionTime,
  prettyUser,
  fetchEmpleados,
} from "@/lib/utils";
import { Plus } from "lucide-vue-next";
import { incidentStatus as estados } from "@/models/incidents";
import { shallowRef, ref, computed, onMounted, reactive } from "vue";
import { toast } from "vue-sonner";
import { getAllIncidents } from "@/api/incidents";
import IncidentPreview from "@/components/IncidentPreview.vue";
import { priorities } from "@/models/commons";
import { incidentCategory as categorias } from "@/models/incidents";
import CustomPieChart from "@/components/CustomPieChart.vue";
import type { IncidentMetric } from "@/models/metrics";
import TextMetrics from "@/components/TextMetrics.vue";
import type { User } from "@/models/users";

const sinResponsable: string = "sin-responsable";

const data = shallowRef<Incident[]>([]);
const users = shallowRef<User[]>([]);
const metricsData = reactive<IncidentMetric>({
  total: 0,
  byEstado: [],
  byPrioridad: [],
  byCategoria: [],
  tiempoPromedioCierre: 0,
});
const isLoading = ref(false);
const searchTitulo = ref("");
const searchCategoria = ref("");
const searchPrioridad = ref("");
const searchEstado = ref("");
const searchResponsable = ref("");

const calculateMetrics = (changes: Incident[]) => {
  const byEstado: Map<string, number> = new Map();
  const byPrioridad: Map<string, number> = new Map();
  const byCategoria: Map<string, number> = new Map();

  const closedIncidents = changes.filter(
    (incident) => incident.estado === "CERRADO" && incident.fecha_cierre,
  );

  if (closedIncidents.length > 0) {
    const totalMs = closedIncidents.reduce((total, incident) => {
      const fechaCreacion = new Date(incident.fecha_creacion);
      const fechaCierre = new Date(incident.fecha_cierre!);
      return total + (fechaCierre.getTime() - fechaCreacion.getTime());
    }, 0);

    metricsData.tiempoPromedioCierre = totalMs / closedIncidents.length;
  }

  changes.forEach((change: Incident) => {
    const valueEstado: number | undefined = byEstado.get(change.estado)
      ? byEstado.get(change.estado)! + 1
      : 1;

    byEstado.set(change.estado, valueEstado);

    const valuePrioridad: number | undefined = byPrioridad.get(change.prioridad)
      ? byPrioridad.get(change.prioridad)! + 1
      : 1;

    byPrioridad.set(change.prioridad, valuePrioridad);

    const valueCategoria: number | undefined = byCategoria.get(change.categoria)
      ? byCategoria.get(change.categoria)! + 1
      : 1;

    byCategoria.set(change.categoria, valueCategoria);
  });

  metricsData.total = changes.length;
  metricsData.byEstado = mapToMetric(byEstado);
  metricsData.byPrioridad = mapToMetric(byPrioridad);
  metricsData.byCategoria = mapToMetric(byCategoria);
};

const fetchItems = async () => {
  isLoading.value = true;
  try {
    const incidents: Incident[] = await getAllIncidents();
    calculateMetrics(incidents);
    data.value = incidents.sort((item1, item2) => {
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
  })),
);

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

const formattedResponsables = computed(() => {
  return users.value
    .map((user: User) => ({
      value: user.id,
      label: prettyUser(user),
    }))
    .concat({
      value: sinResponsable,
      label: "Sin responsable",
    });
});

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

  if (searchResponsable.value !== "") {
    filters.push((incident: Incident) => {
      if (searchResponsable.value === sinResponsable) {
        return !incident.responsable_id;
      }
      return incident.responsable_id == searchResponsable.value;
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
  searchResponsable.value = "";
};

const handleIncidentsUpdated = () => {
  fetchItems();
};

onMounted(async () => {
  fetchItems();
  users.value = await fetchEmpleados();
});
</script>

<template>
  <h1 class="text-6xl text-center font-bold mb-2">Incidentes</h1>
  <div class="flex items-center my-2">
    <Button class="ml-auto">
      <RouterLink to="/incidents/new" class="flex">
        <Plus class="w-2 h-4 mr-2" />Crear</RouterLink
      >
    </Button>
  </div>
  <!-- In this case 4 items on grid look broken (pie charts come out of card) so
 change the layout as it's not important -->
  <div class="gap-6 items-center">
    <TextMetrics
      :total="metricsData.total"
      :tiempo-promedio-cierre="metricsData.tiempoPromedioCierre"
    />
    <div class="grid grid-cols-3 gap-6 flex items-center">
      <CustomPieChart
        :title="'Por estados'"
        :metrics="metricsData.byEstado"
        :colors="colorsByIncidenteEstado"
      />
      <CustomPieChart
        :title="'Por prioridades'"
        :metrics="metricsData.byPrioridad"
        :colors="colorsByPrioridad"
      />
      <CustomPieChart
        :title="'Por categorías'"
        :metrics="metricsData.byCategoria"
        :colors="colorsByIncidenteCategoria"
      />
    </div>
  </div>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 flex py-6">
    <div>
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

    <div>
      <b>Responsable</b>
      <Select v-model="searchResponsable">
        <SelectTrigger>
          <SelectValue placeholder="Buscar por responsable..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-for="responsable in formattedResponsables"
              :key="responsable.value"
              :value="responsable.value"
              >{{ responsable.label }}</SelectItem
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
        <IncidentPreview
          :incident="item"
          @incidents-updated="handleIncidentsUpdated"
        />
      </li>
    </div>
  </ul>
</template>
