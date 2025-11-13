<script setup lang="ts">
import { type User } from '@/models/users';
import { incidentStatus, type Incident } from '@/models/incidents';
import { computed } from 'vue';
import type { EmployeeMetric } from '@/models/metrics';
import { colorsByIncidenteEstado, mapToMetric } from '@/lib/utils';
import type { UUID } from 'crypto';
import BarChart from './ui/chart-bar/BarChart.vue';

const props = defineProps<{employees: User[], incidents: Incident[]}>()

const estadosProblemChart: Record<string, string> = incidentStatus.reduce((acc, estado) => {
  acc[estado] = estado.toLowerCase().replace(/_/g, ' ');
  return acc;
}, {} as Record<string, string>);

const problemColors = computed(() => {
  return Object.keys(estadosProblemChart).map(estado => 
    colorsByIncidenteEstado[estado as keyof typeof colorsByIncidenteEstado].rgb
  );
});

const incidentsData = computed(() => {
  const stats: Record<UUID, EmployeeMetric> = {};

  props.employees.forEach(employee => {
    const byEstado: Map<string, number> = new Map(
      incidentStatus.map(estado => [estado, 0])
    );
    
    stats[employee.id] = {
      nombre: `${employee.nombre} ${employee.apellido}`, 
      byEstado: mapToMetric(byEstado)
    };
  });
  
  props.incidents.filter(problem => problem.responsable_id != null).forEach(problem => {
    const employee_id = problem.responsable_id;

    if (stats[employee_id]) {
      const statusMetric = stats[employee_id].byEstado.find(metric => metric.name === problem.estado);
      if (statusMetric) {
        statusMetric.total += 1;
      }
    }
  });

  return Object.values(stats);
});

const incidentsChartData = computed(() => {
  return incidentsData.value.map(employee => {
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
    :data="incidentsChartData"
    index="nombre"
    :categories="Object.values(estadosProblemChart)"
    :y-formatter="(tick, i) => {
      return Number.isInteger(tick)
        ? tick.toString()
        : ''
    }"
    :x-formatter="(tick) => Number.isInteger(tick) ? incidentsData[tick]?.nombre ?? '' : ''"
    :colors="problemColors"
    />
</template>