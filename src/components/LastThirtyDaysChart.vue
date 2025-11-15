<script setup lang="ts">
import { daysBetweenDates } from "@/lib/utils";
import type { Incident } from "@/models/incidents";
import { computed } from "vue";
import BarChart from "./ui/chart-bar/BarChart.vue";
import { colors } from "@unovis/ts";

const props = defineProps<{ incidents: Incident[] }>();

const recentIncidents = computed(() =>
  props.incidents.filter((incident) =>
    daysBetweenDates(incident.fecha_creacion, new Date()) <= 30
  )
);

const chartData = computed(() => {
  let today = new Date().getDate()
  const byDate: Map<string, number> = new Map();

  // Initialize all days within 30 days
  for(let  i = 30; i >= 0; i--){
    byDate.set(new Date(new Date().setDate( today - i)).toLocaleDateString(), 0)
  }

  recentIncidents.value.forEach((incident) => {
    const date = new Date(incident.fecha_creacion).toLocaleDateString();
    const incidentes: number | undefined = byDate.get(date)
      ? byDate.get(date)! + 1
      : 1;

    byDate.set(date, incidentes);
  });

  return Array.from(byDate.entries()).map(([fecha, incidentes]) => ({
    fecha,
    incidentes,
  }));
});
</script>

<template>
  <BarChart
    :data="chartData"
    index="fecha"
    :categories="['incidentes']"
    :colors="[colors[0]]"
  />
</template>
