<script setup lang="ts">
import Badge from "@/components/ui/badge/Badge.vue";
import Card from "@/components/ui/card/Card.vue";
import { prettyDate } from "@/lib/utils";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import RollbackAlertDialog from "@/components/RollbackAlertDialog.vue";
import type { ConfigItemVersion } from "@/models/config_items";
import { CodeXml, FileText, Wrench } from "lucide-vue-next";

defineProps<{
  configItemVersions: ConfigItemVersion[];
  handleRollback: (versionID: string) => Promise<void>;
}>();

const categoryIcons: Record<string, any> = {
  SOFTWARE: CodeXml,
  HARDWARE: Wrench,
  DOCUMENTACION: FileText,
};

const getConfigItemIcon = (configItemVersion: ConfigItemVersion) => {
  return categoryIcons[configItemVersion.categoria];
};
</script>

<template>
  <Card v-for="version in configItemVersions" :key="version.id" class="p-6">
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
        {{ version.nombre }}
      </span>

      <div class="flex justify-end">
        <RollbackAlertDialog
          :handle-rollback="() => handleRollback(version.id)"
        />
      </div>
    </CardHeader>

    <CardContent class="text-sm space-y-6">
      <div class="grid grid-cols-3 gap-6">
        <div>
          <p class="text-muted-foreground mb-1 font-medium">Estado</p>
          <Badge variant="secondary">
            {{ version.estado }}
          </Badge>
        </div>

        <div>
          <p class="font-medium text-muted-foreground">Versión</p>
          <p>{{ version.version }}</p>
        </div>

        <div>
          <p class="font-medium text-muted-foreground">Categoría</p>
          <Badge>
            <component
              :is="getConfigItemIcon(version)"
              class="w-3 h-3 flex-shrink-0 inline-block mr-1"
            />
            {{ version.categoria }}
          </Badge>
        </div>
      </div>

      <div>
        <p class="text-muted-foreground mb-1 font-medium">Descripción</p>
        <div class="max-h-[20dvh] overflow-y-auto">
          <p class="text-sm leading-relaxed">
            {{ version.descripcion }}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
