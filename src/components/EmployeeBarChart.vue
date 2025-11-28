<script setup lang="ts">
import { type User } from '@/models/users';
import { type IncidentProps } from '@/models/incidents';
import { computed } from 'vue';
import type { EmployeeMetric } from '@/models/metrics';
import { mapToMetric } from '@/lib/utils';
import type { UUID } from 'crypto';
import BarChart from './ui/chart-bar/BarChart.vue';
import type { ProblemProps } from '@/models/problems';
import type { ChangeProps } from '@/models/changes';

type Props = (IncidentProps | ProblemProps | ChangeProps) & {
  title: string;
};
const props = defineProps<Props>()

const estados: Record<string, string> = props.status.reduce((acc, estado) => {
  acc[estado] = estado.toLowerCase().replace(/_/g, ' ');
  return acc;
}, {} as Record<string, string>);

const ticketColors = computed(() => {
  return Object.keys(estados).map(estado => 
    props.colorsByStatus[estado as keyof typeof props.colorsByStatus].rgb
  );
});

const ticketData = computed(() => {
  const stats: Record<UUID, EmployeeMetric> = {};

  props.employees.forEach(employee => {
    const byEstado: Map<string, number> = new Map(
      props.status.map(estado => [estado, 0])
    );
    
    stats[employee.id as keyof typeof stats] = {
      nombre: `${employee.nombre} ${employee.apellido}`, 
      byEstado: mapToMetric(byEstado)
    };
  });
  
  props.tickets.filter(ticket => ticket.responsable_id != null).forEach(ticket => {
    const employee_id = ticket.responsable_id;

    if (stats[employee_id as keyof typeof stats]) {
      const statusMetric = stats[employee_id as keyof typeof stats].byEstado.find(metric => metric.name === ticket.estado);
      if (statusMetric) {
        statusMetric.total += 1;
      }
    }
  });

  return Object.values(stats);
});

const chartData = computed(() => {
  return ticketData.value.map(employee => {
    const flatItem: Record<string, any> = { nombre: employee.nombre };
    
    employee.byEstado.forEach(metric => {
      const chartKey = estados[metric.name];
      if (chartKey) {
        flatItem[chartKey] = metric.total;
      }
    });
    
    return flatItem;
  });
});
</script>

<template>
  <h1 class="font-bold text-xl text-center">{{ title }}</h1>
  <BarChart
  :data="chartData"
  index="nombre"
  :categories="Object.values(estados)"
  :y-formatter="(tick, i) => {
    return Number.isInteger(tick)
      ? tick.toString()
      : ''
  }"
  :x-formatter="(tick) => Number.isInteger(tick) ? ticketData[tick]?.nombre ?? '' : ''"
  :colors="ticketColors"
  />
</template>