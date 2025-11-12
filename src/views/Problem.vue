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
import {
  colorsByPrioridad,
  colorsByProblemaEstado,
  formatAverageResolutionTime,
  mapToMetric,
  prettyUser,
  sortByDate,
  sortByName,
} from "@/lib/utils";
import { Plus } from "lucide-vue-next";
import { estados } from "@/models/problems";
import { shallowRef, ref, computed, onMounted, reactive } from "vue";
import { toast } from "vue-sonner";
import { getAllProblems } from "@/api/problems";
import ProblemPreview from "@/components/ProblemPreview.vue";
import { priorities } from "@/models/commons";
import type { ProblemMetric } from "@/models/metrics";
import { Card } from "@/components/ui/card";
import CustomPieChart from "@/components/CustomPieChart.vue";
import { getAllUsers } from "@/api/users";
import type { User } from "@/models/users";

const sinResponsable: string = "sin-responsable";

const data = shallowRef<Problem[]>([]);
const users = shallowRef<User[]>([]);
const metricsData = reactive<ProblemMetric>({
  total: 0,
  byEstado: [],
  byPrioridad: [],
  tiempoPromedioCierre: 0,
});
const isLoading = ref(false);
const searchTitulo = ref("");
const searchPrioridad = ref("");
const searchEstado = ref("");
const searchResponsable = ref("");

const calculateMetrics = (problems: Problem[]) => {
  const byEstado: Map<string, number> = new Map();
  const byPrioridad: Map<string, number> = new Map();

  const closedProblems = problems.filter(
    (problem) => problem.estado === "CERRADO" && problem.fecha_cierre,
  );

  if (closedProblems.length > 0) {
    const totalMs = closedProblems.reduce((total, problem) => {
      const fechaCreacion = new Date(problem.fecha_creacion);
      const fechaCierre = new Date(problem.fecha_cierre!);
      return total + (fechaCierre.getTime() - fechaCreacion.getTime());
    }, 0);

    metricsData.tiempoPromedioCierre = totalMs / closedProblems.length;
  }

  problems.forEach((problem: Problem) => {
    const valueEstado: number | undefined = byEstado.get(problem.estado)
      ? byEstado.get(problem.estado)! + 1
      : 1;

    byEstado.set(problem.estado, valueEstado);

    const valuePrioridad: number | undefined = byPrioridad.get(
      problem.prioridad,
    )
      ? byPrioridad.get(problem.prioridad)! + 1
      : 1;

    byPrioridad.set(problem.prioridad, valuePrioridad);
  });

  metricsData.total = problems.length;
  metricsData.byEstado = mapToMetric(byEstado);
  metricsData.byPrioridad = mapToMetric(byPrioridad);
};

const fetchItems = async () => {
  isLoading.value = true;
  try {
    const problems: Problem[] = await getAllProblems();
    calculateMetrics(problems);
    data.value = problems.sort((item1, item2) => {
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

const fetchUsers = async () => {
  try {
    const empleados = await getAllUsers("EMPLEADO");
    users.value = empleados;
  } catch (error: any) {
    users.value = [];
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

  if (searchResponsable.value !== "") {
    filters.push((problema: Problem) => {
      if (searchResponsable.value === sinResponsable) {
        return !problema.responsable_id;
      }

      return problema.responsable_id == searchResponsable.value;
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
  searchResponsable.value = "";
};

const handleProblemsUpdated = () => {
  fetchItems();
};

onMounted(() => {
  fetchItems();
  fetchUsers();
});
</script>

<template>
  <h1 class="text-6xl text-center font-bold mb-2">Problemas</h1>
  <div class="flex items-center my-2">
    <Button class="ml-auto">
      <RouterLink to="/problems/new" class="flex">
        <Plus class="w-2 h-4 mr-2" />Crear</RouterLink
      >
    </Button>
  </div>
  <div class="grid grid-cols-3 gap-8 flex items-center">
    <Card class="mx-6 max-w-3/4">
      <div class="justify-items-center items-center">
        <div class="text-4xl font-light">Total {{ metricsData.total }}</div>
        <div class="text-xl font-light">
          Tiempo promedio de cierre:
          {{ formatAverageResolutionTime(metricsData.tiempoPromedioCierre) }}
        </div>
      </div>
    </Card>
    <CustomPieChart
      :title="'Por estados'"
      :metrics="metricsData.byEstado"
      :colors="colorsByProblemaEstado"
    />
    <CustomPieChart
      :title="'Por prioridades'"
      :metrics="metricsData.byPrioridad"
      :colors="colorsByPrioridad"
    />
  </div>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 flex py-6">
    <div class="">
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
    <div v-for="problem in filteredProblemas" class="grid">
      <li class="grid gap-4">
        <ProblemPreview
          :problem="problem"
          @problems-updated="handleProblemsUpdated"
        />
      </li>
    </div>
  </ul>
</template>
