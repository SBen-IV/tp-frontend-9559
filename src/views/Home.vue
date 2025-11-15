<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue";
import { fetchEmpleados } from "@/lib/utils";
import type { User } from "@/models/users";
import { type Problem } from "@/models/problems";
import { getAllProblems } from "@/api/problems";
import { toast } from "vue-sonner";
import QuantityByHourMetric from "@/components/QuantityByHourMetric.vue";
import QuantityByDayMetric from "@/components/QuantityByDayMetric.vue";
import ProblemsEmployeeBarChart from "@/components/ProblemsEmployeeBarChart.vue";
import IncidentsEmployeeBarChart from "@/components/IncidentsEmployeeBarChart.vue";
import { getAllIncidents } from "@/api/incidents";
import type { Incident } from "@/models/incidents";

const isLoading = ref(false);
const employees = shallowRef<User[]>([]);
const problems = shallowRef<Problem[]>([]);
const incidents = shallowRef<Incident[]>([]);

const fetchData = async () => {
  isLoading.value = true;
  try {
    employees.value = await fetchEmpleados();
    problems.value = await getAllProblems();
    incidents.value = await getAllIncidents();
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los ítems");
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  fetchData();
});
</script>

<template>
  <h1 class="text-4xl">Bienvenido/a</h1>
  <div class="grid grid-cols-2 gap-20 p-5">
    <div>
      <h1 class="font-bold text-xl text-center">Problemas Según Responsable</h1>
      <ProblemsEmployeeBarChart :employees="employees" :problems="problems" />
    </div>
    <div>
      <h1 class="font-bold text-xl text-center">
        Incidentes Según Responsable
      </h1>
      <IncidentsEmployeeBarChart
        :employees="employees"
        :incidents="incidents"
      />
    </div>
    <div>
      <QuantityByHourMetric :data="problems" :title="'Problemas'" />
    </div>
    <div>
      <QuantityByDayMetric :data="problems" :title="'Problemas'" />
    </div>
    <div>
      <QuantityByHourMetric :data="incidents" :title="'Incidentes'" />
    </div>
    <div>
      <QuantityByDayMetric :data="incidents" :title="'Incidentes'" />
    </div>
  </div>
</template>
