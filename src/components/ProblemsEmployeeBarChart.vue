<script setup lang="ts">
import { type User } from '@/models/users';
import { estados, type Problem } from '@/models/problems';
import { computed } from 'vue';
import type { EmployeeMetric } from '@/models/metrics';
import { colorsByProblemaEstado, mapToMetric } from '@/lib/utils';
import type { UUID } from 'crypto';
import BarChart from './ui/chart-bar/BarChart.vue';

const props = defineProps<{employees: User[], problems: Problem[]}>()

const estadosProblemChart: Record<string, string> = estados.reduce((acc, estado) => {
  acc[estado] = estado.toLowerCase().replace(/_/g, ' ');
  return acc;
}, {} as Record<string, string>);

const problemColors = computed(() => {
  return Object.keys(estadosProblemChart).map(estado => 
    colorsByProblemaEstado[estado as keyof typeof colorsByProblemaEstado].rgb
  );
});

const problemsData = computed(() => {
  const stats: Record<UUID, EmployeeMetric> = {};
  
  props.problems.filter(problem => problem.responsable_id != null).forEach(problem => {
    const employee_id = problem.responsable_id;

    if (!stats[employee_id]) {
      const employee = props.employees.find(employee => employee.id === employee_id);
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

  return Object.values(stats);
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
</script>

<template>
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
</template>