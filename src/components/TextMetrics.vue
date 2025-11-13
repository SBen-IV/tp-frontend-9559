<script setup lang="ts">
import { formatAverageResolutionTime } from "@/lib/utils";
import { Card } from "./ui/card";

defineProps<{
  total: number;
  tiempoPromedioCierre?: number;
  cantidadSinResponsable?: number;
}>();
</script>

<template>
  <Card class="mx-6 mb-4">
    <div class="justify-items-center items-center">
      <div class="text-4xl font-bold">Total {{ total }}</div>
      <div v-if="tiempoPromedioCierre" class="text-xl font-light">
        Tiempo promedio de cierre:
        {{ formatAverageResolutionTime(tiempoPromedioCierre) }}
      </div>
      <div
        v-if="cantidadSinResponsable !== undefined"
        class="text-xl"
        v-bind:class="{
          'text-red-500': cantidadSinResponsable > 0,
        }"
      >
        Cantidad sin responsable:
        {{ cantidadSinResponsable }}
      </div>
    </div>
  </Card>
</template>
