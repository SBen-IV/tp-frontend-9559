<script setup lang="ts">
import { daysBetweenDates } from "@/lib/utils";
import type { Incident } from "@/models/incidents";
import { computed } from "vue";
import BarChart from "./ui/chart-bar/BarChart.vue";
import { colors } from "@unovis/ts";
import type { Problem } from "@/models/problems";

const props = defineProps<{ incidents: Incident[], problems: Problem[] }>();

const recentIncidents = computed(() =>
  props.incidents.filter((incident) =>
    daysBetweenDates(incident.fecha_creacion, new Date()) <= 30
  )
);

const recentProblems = computed(() =>
  props.problems.filter((problem) =>
    daysBetweenDates(problem.fecha_creacion, new Date()) <= 30
  )
);

const chartData = computed(() => {
  let today = new Date().getDate()
  const byDate: Map<string, { incidentes: number; problemas: number }> = new Map();

  // Initialize all days within 30 days
  for(let  i = 30; i >= 0; i--){
    const date = new Date(new Date().setDate( today - i)).toLocaleDateString()
    byDate.set(date, { incidentes: 0, problemas: 0 })
  }

  recentIncidents.value.forEach((incident) => {
    const date = new Date(incident.fecha_creacion).toLocaleDateString();
    const dateData = byDate.get(date) || { incidentes: 0, problemas: 0 };
    dateData.incidentes += 1;
    byDate.set(date, dateData);
  });

  recentProblems.value.forEach((problem) => {
    const date = new Date(problem.fecha_creacion).toLocaleDateString();
    const dateData = byDate.get(date) || { incidentes: 0, problemas: 0 };
    dateData.problemas += 1;
    byDate.set(date, dateData);
  });

  return Array.from(byDate.entries()).map(([fecha, data]) => ({
    fecha,
    ...data
  }));
});
</script>

<template>
  <BarChart
    :data="chartData"
    index="fecha"
    :categories="['incidentes', 'problemas']"
    :colors="[colors[0], colors[1]]"
  />
</template>
