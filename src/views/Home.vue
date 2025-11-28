<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue";
import { colorsByCambioEstado, colorsByIncidenteEstado, colorsByProblemaEstado, fetchEmpleados } from "@/lib/utils";
import type { User } from "@/models/users";
import { estados, type Problem } from "@/models/problems";
import { getAllProblems } from "@/api/problems";
import { toast } from "vue-sonner";
import QuantityByHourMetric from "@/components/QuantityByHourMetric.vue";
import QuantityByDayMetric from "@/components/QuantityByDayMetric.vue";
import { getAllIncidents } from "@/api/incidents";
import { incidentStatus, type Incident } from "@/models/incidents";
import LastThirtyDaysChart from "@/components/LastThirtyDaysChart.vue";
import EmployeeBarChart from "@/components/EmployeeBarChart.vue";
import { changeStatus, type Change } from "@/models/changes";
import { getAllChanges } from "@/api/changes";

const isLoading = ref(false);
const employees = shallowRef<User[]>([]);
const problems = shallowRef<Problem[]>([]);
const incidents = shallowRef<Incident[]>([]);
const changes = shallowRef<Change[]>([]);

const fetchData = async () => {
  isLoading.value = true;
  try {
    employees.value = await fetchEmpleados();
    problems.value = await getAllProblems();
    incidents.value = await getAllIncidents();
    changes.value = await getAllChanges();
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
  <div class="grid grid-cols-2 gap-20 p-5 w-[1500px] mx-auto overflow-auto">
    <div class="col-span-2">
      <h1 class="font-bold text-center">Últimos 30 Días</h1>
      <LastThirtyDaysChart :incidents="incidents" :problems="problems"/>
    </div>
    <div>
      <EmployeeBarChart :employees="employees" :tickets="problems" :status="estados" :colors-by-status="colorsByProblemaEstado" :title="'Problemas Según Responsable'"/>
    </div>
    <div>
      <EmployeeBarChart :employees="employees" :tickets="incidents" :status="incidentStatus" :colors-by-status="colorsByIncidenteEstado" :title="'Incidentes Según Responsable'"/>
    </div>
    <div>
      <EmployeeBarChart :employees="employees" :tickets="changes" :status="changeStatus" :colors-by-status="colorsByCambioEstado" :title="'Cambios Según Responsable'"/>
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
