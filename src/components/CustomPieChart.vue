<script setup lang="ts">
import type { Metric } from "@/models/metrics";
import { Card, CardTitle, CardContent } from "./ui/card";
import { DonutChart } from "./ui/chart-donut";
import { Badge } from "./ui/badge";
import type { Color } from "@/models/colors";
import { computed } from "vue";

const props = defineProps<{
  title: string;
  metrics: Metric[];
  colors: Record<string, Color>;
}>();

const sortMetrics = (a: Metric, b: Metric): number => {
  if (a.name < b.name) {
    return -1;
  }
  return 1;
};

const sortedMetrics = computed(() => {
  return props.metrics.sort(sortMetrics);
});

const getBadgeColor = (key: string): string => {
  return props.colors[key].tw;
};

const getDonutColor = (colors: Record<string, Color>) => {
  const metricNames = sortedMetrics.value.map((m: Metric) => m.name);

  const donutColors = Object.keys(colors)
    .filter((key: string) => metricNames.includes(key))
    .sort((a, b) => {
      if (a < b) {
        return -1;
      }
      return 1;
    });

  return donutColors.map((key) => colors[key].rgb);
};
</script>

<template>
  <Card class="max-w-max">
    <CardTitle class="text-2xl font-bold text-center">{{ title }}</CardTitle>
    <CardContent>
      <div class="flex">
        <div>
          <Badge
            v-for="metric in sortedMetrics"
            :class="getBadgeColor(metric.name)"
          >
            {{ metric.name }} ({{ metric.total }})
          </Badge>
        </div>
        <DonutChart
          index="name"
          :category="'total'"
          :data="sortedMetrics"
          :show-legend="true"
          :type="'pie'"
          :colors="getDonutColor(colors)"
        />
      </div>
    </CardContent>
  </Card>
</template>
