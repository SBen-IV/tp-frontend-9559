<script setup lang="ts">
import type { Metric } from "@/models/metrics";
import { Card, CardTitle, CardContent } from "./ui/card";
import { DonutChart } from "./ui/chart-donut";
import { Badge } from "./ui/badge";
import type { Color } from "@/models/colors";

const props = defineProps<{
  title: string;
  metrics: Metric[];
  colors: Record<string, Color>;
}>();

const getBadgeColor = (key: string): string => {
  return props.colors[key].tw;
};

const getDonutColor = (colors: Record<string, Color>) => {
  return Object.keys(colors).map((key: string) => colors[key].rgb);
};
</script>

<template>
  <Card class="max-w-max">
    <CardTitle class="text-2xl font-bold text-center">{{ title }}</CardTitle>
    <CardContent>
      <div class="flex">
        <div>
          <Badge v-for="metric in metrics" :class="getBadgeColor(metric.name)">
            {{ metric.name }} ({{ metric.total }})
          </Badge>
        </div>
        <DonutChart
          index="name"
          :category="'total'"
          :data="metrics"
          :show-legend="true"
          :type="'pie'"
          :colors="getDonutColor(colors)"
        />
      </div>
    </CardContent>
  </Card>
</template>
