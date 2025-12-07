<script setup lang="ts">
import type { Change } from "@/models/changes";
import { getImpactoColor, getPrioridadColor } from "@/lib/utils";
import { prettyDate } from "@/lib/utils";
import Card from "./ui/card/Card.vue";
import Badge from "./ui/badge/Badge.vue";
import Separator from "./ui/separator/Separator.vue";
import ItemOption from "./ItemOption.vue";
import ResponsableInfo from "./ResponsableInfo.vue";
import IncidentOption from "./IncidentOption.vue";
import ProblemOption from "./ProblemOption.vue";

defineProps<{ change: Change }>();
</script>

<template>
  <Card class="p-6">
    <h1 class="text-4xl text-center font-bold">
      {{ change.titulo }}
    </h1>
    <div class="grid grid-cols-6 gap-6 text-sm">
      <div>
        <p class="font-medium text-muted-foreground">ID</p>
        <p>{{ change.id }}</p>
      </div>
      <div>
        <p class="font-medium text-muted-foreground">Estado</p>
        <Badge variant="secondary">{{ change.estado }}</Badge>
      </div>
      <div>
        <p class="font-medium text-muted-foreground">Prioridad</p>
        <Badge :class="getPrioridadColor(change.prioridad)">
          {{ change.prioridad }}
        </Badge>
      </div>
      <div>
        <p class="font-medium text-muted-foreground">Impacto</p>
        <Badge :class="getImpactoColor(change.impacto)">
          {{ change.impacto }}
        </Badge>
      </div>
      <div>
        <p class="font-medium text-muted-foreground">Fecha de creación</p>
        <p>{{ prettyDate(change.fecha_creacion) }}</p>
      </div>
      <div>
        <p class="font-medium text-muted-foreground">Fecha de cierre</p>
        {{
          change.fecha_cierre
            ? prettyDate(change.fecha_cierre)
            : "N/A"
        }}
      </div>
    </div>

    <Separator class="my-4" />

    <p class="font-medium text-muted-foreground">Empleado responsable</p>
    <ResponsableInfo
      :key="change.responsable_id"
      :responsable-id="change.responsable_id"
    />

    <Separator class="my-4" />

    <p class="font-medium text-muted-foreground">Descripción</p>
    <div class="max-h-[200px] overflow-y-auto">
      <p class="text-sm leading-relaxed">
        {{ change.descripcion }}
      </p>
    </div>

    <Separator class="my-4" />

    <div class="grid grid-cols-3 gap-6">
      <div>
        <p class="font-medium text-muted-foreground mb-1">
          Ítems de configuración
        </p>
        <div class="max-h-[120px] overflow-y-auto">
          <div
            v-if="change.config_items.length > 0"
            class="flex flex-col gap-2 max-h-60 pr-2"
          >
            <ItemOption
              v-for="item in change.config_items"
              :key="item.id"
              :item="item"
              class="hover:bg-accent rounded-md max-w-full"
            />
          </div>
          <div v-else class="text-sm">Sin ítem relacionados.</div>
        </div>
      </div>

      <div>
        <p class="font-medium text-muted-foreground mb-1">Problemas</p>
        <div class="max-h-[120px] overflow-y-auto">
          <div
            v-if="change.problemas.length > 0"
            class="flex flex-col gap-2 max-h-60 pr-2"
          >
            <ProblemOption
              v-for="problem in change.problemas"
              :key="problem.id"
              :problem="problem"
              class="hover:bg-accent rounded-md max-w-full"
            />
          </div>
          <div v-else class="text-sm">Sin problemas relacionados.</div>
        </div>
      </div>

      <div>
        <p class="font-medium text-muted-foreground mb-1">Incidentes</p>
        <div class="max-h-[120px] overflow-y-auto">
          <div
            v-if="change.incidentes.length > 0"
            class="flex flex-col gap-2 max-h-60 pr-2"
          >
            <IncidentOption
              v-for="incident in change.incidentes"
              :key="incident.id"
              :incident="incident"
              class="hover:bg-accent rounded-md max-w-full"
            />
          </div>
          <div v-else class="text-sm">Sin incidentes relacionados.</div>
        </div>
      </div>
    </div>
  </Card>
</template>
