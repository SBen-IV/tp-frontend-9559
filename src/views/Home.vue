<script setup lang="ts">
import { BarChart } from "@/components/ui/chart-bar"
import { onMounted, ref, shallowRef } from "vue";
import { fetchEmpleados } from "@/lib/utils";
import type { User } from "@/models/users";
import { estados, type Problem } from "@/models/problems";
import { getAllProblems } from "@/api/problems";
import { toast } from "vue-sonner";
import type { SolvedMetric } from "@/models/metrics";
import type { UUID } from "crypto";

const isLoading = ref(false); 
const employees = shallowRef<User[]>([]);
const problems = shallowRef<Problem[]>([]);
const solvedProblemsData = ref<SolvedMetric[]>([])

const calculateMetrics = (problems: Problem[]) => {
  const stats: Record<UUID, { assigned: number; solved: number }> = {};
  
  problems.filter(problem => problem.responsable_id != null).forEach(problem => {
    const id = problem.responsable_id;
    
    if (!stats[id]) {
      stats[id] = { assigned: 0, solved: 0 };
    }
    
    stats[id].assigned++;
    
    if (problem.estado === estados[2]) {
      stats[id].solved++;
    }
  });

  solvedProblemsData.value = Object.entries(stats).map(([id, data]) => {
    const employee = employees.value.find(employee => employee.id === id);

    return {
      nombre: `${employee?.nombre} ${employee?.apellido}`,
      asignados: data.assigned,
      resueltos: data.solved
    }
  });
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
      :data="solvedProblemsData"
      index="nombre"
      :categories="['asignados', 'resueltos']"
      :y-formatter="(tick, i) => {
        return Number.isInteger(tick)
          ? tick.toString()
          : ''
      }"
      :x-formatter="(tick) => Number.isInteger(tick) ? solvedProblemsData[tick]?.nombre ?? '' : ''"
      />
    </div>

  </div>

</template>
