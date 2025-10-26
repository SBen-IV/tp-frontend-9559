<script setup lang="ts">
import type { ChangeVersion } from '@/models/changes';
import { getPrioridadColor } from "@/lib/utils";
import Badge from "@/components/ui/badge/Badge.vue";
import Card from "@/components/ui/card/Card.vue";
import { prettyDate } from "@/lib/utils";
import ItemOption from "@/components/ItemOption.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import RollbackAlertDialog from "@/components/RollbackAlertDialog.vue";

defineProps<{ changeVersions: ChangeVersion[], handleRollback: (versionID: string) => Promise<void> }>();
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
      <div class="col-span-2 space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <p class="text-muted-foreground mb-1 font-medium">Estado</p>
            <Badge variant="secondary">{{ version.estado }}</Badge>
          </div>
          <div>
            <p class="text-muted-foreground mb-1 font-medium">Prioridad</p>
            <Badge :class="getPrioridadColor(version.prioridad)">
              {{ version.prioridad }}
            </Badge>
          </div>
        </div>

        <p class="text-muted-foreground mb-1 font-medium">Descripción</p>
        <div class="max-h-[20dvh] overflow-y-auto">
          <p class="text-sm leading-relaxed">{{ version.descripcion }}</p>
        </div>
      </div>

      <div class="row-span-2">
        <p class="text-muted-foreground mb-2 font-medium">
          Ítems de configuración
        </p>
        <div class="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
          <ItemOption
            v-for="item in version.config_items"
            :key="item.id"
            :item="item"
            class="hover:bg-accent rounded-md max-w-full"
          />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
