<script setup lang="ts">
import { computed } from "vue";
import LineChart from "./ui/chart-line/LineChart.vue";
import { LIGHT_BLUE } from "@/models/colors";
import type { ByDayMetric } from "@/models/metrics";
import type { Incident } from "@/models/incidents";
import type { Problem } from "@/models/problems";
import { CurveType } from "@unovis/ts";

const props = defineProps<{ data: Problem[] | Incident[]; title: string }>();

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const byDayData = computed(() => {
  const length = days.length;
  const byDay: ByDayMetric[] = Array.from(
    { length },
    (_, index): ByDayMetric => {
      return {
        dia: days[index],
        cantidad: 0,
      };
    },
  );

  props.data.forEach((problemOrIncident: Problem | Incident) => {
    const day = new Date(problemOrIncident.fecha_creacion).getDay();

    byDay[day].cantidad += 1;
  });

  return byDay;
});
</script>

<template>
  <h1 class="font-bold text-xl text-center">{{ title }} por día</h1>
  <LineChart
    :data="byDayData"
    index="dia"
    :categories="['cantidad']"
    :show-grid-line="true"
    :colors="[LIGHT_BLUE.rgb]"
    :curve-type="CurveType.Step"
  />
</template>
