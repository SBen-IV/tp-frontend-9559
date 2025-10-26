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
import { toast } from "vue-sonner";
import { rollbackChange } from "@/api/changes";
import ChangeHistory from "@/components/ChangeHistory.vue";

const route = useRoute();

const change = ref<Change>();
const changeAudits = shallowRef<ChangeAudit[]>([]);
const changeVersions = ref<ChangeVersion[]>([]);

const handleRollback = async (versionID: string) => {
  try {
    await rollbackChange(route.params.id as string, versionID);
    toast.success("Se restauró el cambio correctamente");
    fetchChange();
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
  const changeID = route.params.id as string;
  change.value = await getChangeByID(changeID);
  console.log("Change data:", change.value);
};

const fetchChangePage = async (changeID: string) => {
  changeAudits.value = await getChangeAuditsByID(changeID);
};

onMounted(() => {
  fetchChange();
  fetchChangePage(route.params.id as string);
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
        <ChangeHistory :change-versions="changeVersions" :handleRollback="handleRollback"/>
      </div>
      <div v-else>No se encontraron versiones anteriores para este cambio.</div>
    </div>
  </div>
</template>
