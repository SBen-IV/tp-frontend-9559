<script setup lang="ts">
import type { ChangeVersion } from "@/models/changes";
import { getImpactoColor, getPrioridadColor } from "@/lib/utils";
import Badge from "@/components/ui/badge/Badge.vue";
import Card from "@/components/ui/card/Card.vue";
import { prettyDate } from "@/lib/utils";
import ItemOption from "@/components/ItemOption.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import RollbackAlertDialog from "@/components/RollbackAlertDialog.vue";
import ResponsableInfo from "./ResponsableInfo.vue";
import ProblemOption from "./ProblemOption.vue";
import IncidentOption from "./IncidentOption.vue";

defineProps<{
  changeVersions: ChangeVersion[];
  handleRollback: (versionID: string) => Promise<void>;
}>();
</script>

<template>
  <Card v-for="version in changeVersions" :key="version.id" class="p-6">
    <CardHeader class="grid grid-cols-3">
      <div class="flex space-x-3">
        <span class="text-xl font-medium text-left">
          {{ prettyDate(version.fecha_actualizacion) }}
        </span>
        <Badge
          variant="outline"
          class="font-medium text-muted-foreground content-right"
        >
          {{ version.operacion }}
        </Badge>
      </div>

      <span class="text-xl font-medium text-center">
        {{ version.titulo }}
      </span>

      <div class="flex justify-end">
        <RollbackAlertDialog
          :handleRollback="() => handleRollback(version.id)"
        />
      </div>
    </CardHeader>

    <CardContent class="grid grid-cols-3 gap-6 text-sm">
      <div class="col-span-3 space-y-6">
        <div class="grid grid-cols-3 gap-6">
          <div>
            <p class="text-muted-foreground mb-1 font-medium">Estado</p>
            <Badge variant="secondary">{{ version.estado }}</Badge>
            <p
              v-if="version.fecha_cierre"
              class="text-xs text-muted-foreground mt-1"
            >
              Fecha cierre: {{ prettyDate(version.fecha_cierre) }}
            </p>
          </div>
          <div>
            <p class="text-muted-foreground mb-1 font-medium">Prioridad</p>
            <Badge :class="getPrioridadColor(version.prioridad)">
              {{ version.prioridad }}
            </Badge>
          </div>
          <div>
            <p class="text-muted-foreground mb-1 font-medium">Impacto</p>
            <Badge :class="getImpactoColor(version.impacto)">
              {{ version.impacto }}
            </Badge>
          </div>
        </div>

        <p class="font-medium text-muted-foreground">Empleado responsable</p>
        <ResponsableInfo
          :key="version.responsable_id"
          :responsable-id="version.responsable_id"
        />

        <p class="text-muted-foreground mb-1 font-medium">Descripción</p>
        <div class="max-h-[20dvh] overflow-y-auto">
          <p class="text-sm leading-relaxed">{{ version.descripcion }}</p>
        </div>
      </div>

      <div class="row-span-2">
        <p class="text-muted-foreground mb-2 font-medium">
          Ítems de configuración
        </p>
        <div
          v-if="version.config_items.length > 0"
          class="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2"
        >
          <ItemOption
            v-for="item in version.config_items"
            :key="item.id"
            :item="item"
            class="hover:bg-accent rounded-md max-w-full"
          />
        </div>
        <div v-else class="text-sm">Sin ítem relacionados.</div>
      </div>
      <div class="row-span-2">
        <p class="text-muted-foreground mb-2 font-medium">Problemas</p>
        <div
          v-if="version.problemas.length > 0"
          class="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2"
        >
          <ProblemOption
            v-for="problem in version.problemas"
            :key="problem.id"
            :problem="problem"
            class="hover:bg-accent rounded-md max-w-full"
          />
        </div>
        <div v-else class="text-sm">Sin problemas relacionados.</div>
      </div>

      <div class="row-span-2">
        <p class="text-muted-foreground mb-2 font-medium">Incidentes</p>
        <div
          v-if="version.incidentes.length > 0"
          class="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2"
        >
          <IncidentOption
            v-for="incident in version.incidentes"
            :key="incident.id"
            :incident="incident"
            class="hover:bg-accent rounded-md max-w-full"
          />
        </div>
        <div v-else class="text-sm">Sin incidentes relacionados.</div>
      </div>
    </CardContent>
  </Card>
</template>
