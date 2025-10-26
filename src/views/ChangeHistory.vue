<script setup lang="ts">
import { getChangeAuditsByID, getChangeByID } from "@/api/changes";
import type { Change, ChangeAudit, ChangeVersion } from "@/models/changes";
import { onMounted, ref, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";
import { getPrioridadColor } from "@/lib/utils";
import Badge from "@/components/ui/badge/Badge.vue";
import Separator from "@/components/ui/separator/Separator.vue";
import Card from "@/components/ui/card/Card.vue";
import { prettyDate } from "@/lib/utils";
import ItemOption from "@/components/ItemOption.vue";
import { getConfigItemById } from "@/api/config_items";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import RollbackAlertDialog from "@/components/RollbackAlertDialog.vue";
import { toast } from "vue-sonner";
import { rollbackChange } from "@/api/changes";

const route = useRoute();

const change = ref<Change>();
const changeAudits = shallowRef<ChangeAudit[]>([]);
const changeVersions = ref<ChangeVersion[]>([]);

const handleRollback = async (versionID: string) => {
  try {
    await rollbackChange(route.params.id as string, versionID);
    toast.success("Se restauró el cambio correctamente");
    fetchChange()
  } catch (err: any) {
    toast.error(err.message);
  }
};

watch(
  () => changeAudits.value,
  async (audits) => {
    if (!audits || audits.length === 0) return;

    const versions = await Promise.all(
      audits.map(async (audit) => {
        const configItems = await Promise.all(
          audit.estado_nuevo.id_config_items.map((id) => getConfigItemById(id))
        );

        const { estado_nuevo, ...auditWithoutEstadoNuevo } = audit;

        const changeVersion: ChangeVersion = {
          ...audit.estado_nuevo,
          ...auditWithoutEstadoNuevo,
          config_items: configItems,
        };

        return changeVersion;
      })
    );

    changeVersions.value = versions;
  }
);

const fetchChange = async () => {
  const changeID = route.params.id as string
  change.value = await getChangeByID(changeID);
  console.log("Change data:", change.value);
};

const fetchChangeHistory = async (changeID: string) => {
  changeAudits.value = await getChangeAuditsByID(changeID);
};

onMounted(() => {
  fetchChange();
  fetchChangeHistory(route.params.id as string);
});
</script>

<template>
  <div v-if="change" class="space-y-6">
    <Card class="p-6">
      <h1 class="text-4xl text-center font-bold">
        {{ change.titulo }}
      </h1>
      <div class="grid grid-cols-4 gap-6 text-sm">
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
          <p class="font-medium text-muted-foreground">Fecha de creación</p>
          <p>{{ prettyDate(change.fecha_creacion) }}</p>
        </div>
      </div>

      <Separator class="my-4" />

      <div>
        <p class="font-medium text-muted-foreground mb-1">Descripción</p>
        <p class="text-sm leading-relaxed">
          {{ change.descripcion }}
        </p>
      </div>

      <Separator class="my-4" />

      <div>
        <p class="font-medium text-muted-foreground mb-1">
          Ítems de configuración
        </p>
        <div class="max-h-[120px] overflow-y-auto">
          <div class="grid grid-cols-1 sm:grid-cols-5 gap-2">
            <ItemOption
              v-for="item in change.config_items"
              :key="item.id"
              :item="item"
              class="hover:bg-accent rounded-md p-2"
            />
          </div>
        </div>
      </div>
    </Card>

    <Separator class="my-4" />

    <div>
      <h3 class="text-xl font-bold mb-4">Historial de Versiones</h3>
      <div v-if="changeAudits.length > 0" class="space-y-4">
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

            <RollbackAlertDialog
              :handleRollback="() => handleRollback(version.id)"
            />
          </CardHeader>

          <CardContent class="grid grid-cols-3 gap-6 text-sm">
            <div class="col-span-2 space-y-6">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <p class="text-muted-foreground mb-1 font-medium">Estado</p>
                  <Badge variant="secondary">{{ version.estado }}</Badge>
                </div>
                <div>
                  <p class="text-muted-foreground mb-1 font-medium">
                    Prioridad
                  </p>
                  <Badge :class="getPrioridadColor(version.prioridad)">
                    {{ version.prioridad }}
                  </Badge>
                </div>
              </div>

              <div class="max-h-[20dvh] overflow-y-auto">
                <p class="text-muted-foreground mb-1 font-medium">
                  Descripción
                </p>
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
      </div>
      <div v-else>No se encontraron versiones anteriores para este cambio.</div>
    </div>
  </div>
</template>
