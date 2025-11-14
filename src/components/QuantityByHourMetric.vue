<script setup lang="ts">
import { computed } from "vue";
import LineChart from "./ui/chart-line/LineChart.vue";
import { GREEN } from "@/models/colors";
import type { ByHourMetric } from "@/models/metrics";
import type { Incident } from "@/models/incidents";
import type { Problem } from "@/models/problems";

const props = defineProps<{ data: Problem[] | Incident[]; title: string }>();

const byHourData = computed(() => {
  const length = 24;
  const byHour: ByHourMetric[] = Array.from(
    { length },
    (_, index): ByHourMetric => {
      return {
        hora: index,
        cantidad: 0,
      };
    },
  );

  props.data.forEach((d: Problem | Incident) => {
    const hours = new Date(d.fecha_creacion).getHours();

    byHour[hours].cantidad += 1;
  });

  return byHour;
});
</script>

<template>
  <h1 class="font-bold text-center">{{ title }} por hora del día</h1>
  <LineChart
    :data="byHourData"
    index="hora"
    :categories="['cantidad']"
    :show-grid-line="true"
    :x-formatter="
      (tick, _) => {
        return typeof tick === 'number' ? `${tick}:00h` : '';
      }
    "
    :colors="[GREEN.rgb]"
  />
</template>
