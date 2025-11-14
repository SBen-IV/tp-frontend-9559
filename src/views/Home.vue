<script setup lang="ts">
import { BarChart } from "@/components/ui/chart-bar";
import { onMounted, ref, shallowRef } from "vue";
import { fetchEmpleados } from "@/lib/utils";
import type { User } from "@/models/users";
import { type Problem } from "@/models/problems";
import { getAllProblems } from "@/api/problems";
import { toast } from "vue-sonner";
import type { SolvedMetric } from "@/models/metrics";
import type { UUID } from "crypto";
import { colorsByProblemaEstado } from "@/lib/utils";
import QuantityByHourMetric from "@/components/QuantityByHourMetric.vue";

const isLoading = ref(false);
const employees = shallowRef<User[]>([]);
const problems = shallowRef<Problem[]>([]);
const problemsData = ref<SolvedMetric[]>([]);
const estadosProblemChart: Record<string, keyof Omit<SolvedMetric, "nombre">> =
  {
    DETECTADO: "detectados",
    EN_ANALISIS: "enAnalisis",
    RESUELTO: "resueltos",
    CERRADO: "cerrados",
  };
const problemLabels = Object.values(estadosProblemChart);
const problemColors: Record<keyof Omit<SolvedMetric, "nombre">, string> = {
  detectados: colorsByProblemaEstado.DETECTADO.rgb,
  enAnalisis: colorsByProblemaEstado.EN_ANALISIS.rgb,
  resueltos: colorsByProblemaEstado.RESUELTO.rgb,
  cerrados: colorsByProblemaEstado.CERRADO.rgb,
};

const calculateMetrics = (problems: Problem[]) => {
  const stats: Record<
    UUID,
    {
      detectados: number;
      resueltos: number;
      enAnalisis: number;
      cerrados: number;
    }
  > = {};

  problems
    .filter((problem) => problem.responsable_id != null)
    .forEach((problem) => {
      const id: UUID = problem.responsable_id as UUID;

      if (!stats[id]) {
        stats[id] = { detectados: 0, resueltos: 0, enAnalisis: 0, cerrados: 0 };
      }

      const estado = estadosProblemChart[problem.estado];
      if (estado) stats[id][estado]++;
    });

  problemsData.value = Object.entries(stats).map(([id, data]) => {
    const employee = employees.value.find((employee) => employee.id === id);

    return {
      ...data,
      nombre: `${employee?.nombre} ${employee?.apellido}`,
    };
  });
};

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
        :data="problemsData"
        index="nombre"
        :categories="problemLabels"
        :y-formatter="
          (tick, _) => {
            return Number.isInteger(tick) ? tick.toString() : '';
          }
        "
        :x-formatter="
          (tick) =>
            Number.isInteger(tick)
              ? (problemsData[tick as number]?.nombre ?? '')
              : ''
        "
        :colors="problemLabels.map((label) => problemColors[label])"
      />
    </div>
    <div>
      <QuantityByHourMetric :data="problems" :title="'Problemas'" />
    </div>
  </div>
</template>
