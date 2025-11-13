<script setup lang="ts">
import { BarChart } from "@/components/ui/chart-bar"
import { computed, onMounted, ref, shallowRef } from "vue";
import { fetchEmpleados, mapToMetric } from "@/lib/utils";
import type { User } from "@/models/users";
import { estados, type Problem } from "@/models/problems";
import { getAllProblems } from "@/api/problems";
import { toast } from "vue-sonner";
import type { EmployeeMetric } from "@/models/metrics";
import type { UUID } from "crypto";
import { colorsByProblemaEstado } from "@/lib/utils";

const isLoading = ref(false); 
const employees = shallowRef<User[]>([]);
const problems = shallowRef<Problem[]>([]);
const problemsData = ref<EmployeeMetric[]>([])

const estadosProblemChart: Record<string, string> = estados.reduce((acc, estado) => {
  acc[estado] = estado.toLowerCase().replace(/_/g, ' ');
  return acc;
}, {} as Record<string, string>);

const problemColors = computed(() => {
  return Object.keys(estadosProblemChart).map(estado => 
    colorsByProblemaEstado[estado as keyof typeof colorsByProblemaEstado].rgb
  );
});

const problemsChartData = computed(() => {
  return problemsData.value.map(employee => {
    const flatItem: Record<string, any> = { nombre: employee.nombre };
    
    employee.byEstado.forEach(metric => {
      const chartKey = estadosProblemChart[metric.name];
      if (chartKey) {
        flatItem[chartKey] = metric.total;
      }
    });
    
    return flatItem;
  });
});

const calculateMetrics = (problems: Problem[]) => {
  const stats: Record<UUID, EmployeeMetric> = {};
  
  problems.filter(problem => problem.responsable_id != null).forEach(problem => {
    const employee_id = problem.responsable_id;

    if (!stats[employee_id]) {
      const employee = employees.value.find(employee => employee.id === employee_id);
      const byEstado: Map<string, number> = new Map(
        estados.map(estado => [estado, 0])
      );

      stats[employee_id] = {nombre: `${employee?.nombre} ${employee?.apellido}`, byEstado: mapToMetric(byEstado)};
    }

    const statusMetric = stats[employee_id].byEstado.find(metric => metric.name === problem.estado);
    
    if (statusMetric) {
      statusMetric.total += 1;
    } 
  });

  problemsData.value = Object.values(stats);
} 

const fetchProblems = async () => {
  isLoading.value = true;
  try {
    problems.value = await getAllProblems();
    calculateMetrics(problems.value);
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los ítems");
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  employees.value = await fetchEmpleados();
  fetchProblems();
});
</script>

<template>
  <h1>Bienvenido/a</h1>
  <div class="grid grid-cols-2">
    <div>
      <h1 class="font-bold text-center">Problemas Según Responsable</h1>
      <BarChart
      :data="problemsChartData"
      index="nombre"
      :categories="Object.values(estadosProblemChart)"
      :y-formatter="(tick, i) => {
        return Number.isInteger(tick)
          ? tick.toString()
          : ''
      }"
      :x-formatter="(tick) => Number.isInteger(tick) ? problemsData[tick]?.nombre ?? '' : ''"
      :colors="problemColors"
      />
    </div>

  </div>

</template>
