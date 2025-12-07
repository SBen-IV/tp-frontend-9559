<script setup lang="ts">
import { getChangeAuditsByID, getChangeByID } from "@/api/changes";
import type { Change, ChangeAudit, ChangeVersion } from "@/models/changes";
import { onMounted, ref, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";
import Separator from "@/components/ui/separator/Separator.vue";
import { getConfigItemById } from "@/api/config_items";
import { toast } from "vue-sonner";
import { rollbackChange } from "@/api/changes";
import ChangeHistory from "@/components/ChangeHistory.vue";
import ChangeInfo from "@/components/ChangeInfo.vue";
import { getAllIncidents, getIncidentById } from "@/api/incidents";
import { getProblemById } from "@/api/problems";

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
          audit?.estado_nuevo?.id_config_items?.map((id) =>
            getConfigItemById(id),
          ) || [],
        );

        const incidentes = await Promise.all(
          audit?.estado_nuevo?.id_incidentes?.map((id) =>
            getIncidentById(id),
          ) || [],
        );

        const problemas = await Promise.all(
          audit?.estado_nuevo?.id_problemas?.map((id) => getProblemById(id)) ||
            [],
        );

        const { estado_nuevo, ...auditWithoutEstadoNuevo } = audit;

        // We remove nested structure from the audit and we add the config_items
        const changeVersion: ChangeVersion = {
          ...audit.estado_nuevo, // the Change version
          ...auditWithoutEstadoNuevo, // fecha_actualizacion, (audit) ID, ...
          config_items: configItems,
          incidentes: incidentes,
          problemas: problemas,
        };

        return changeVersion;
      }),
    );

    changeVersions.value = versions;
  },
);

const fetchChange = async () => {
  const changeID = route.params.id as string;
  change.value = await getChangeByID(changeID);
  console.log("Change data:", change.value);
};

const fetchChangeHistory = async () => {
  const changeID = route.params.id as string;
  changeAudits.value = await getChangeAuditsByID(changeID);
};

onMounted(() => {
  fetchChange();
  fetchChangeHistory();
});
</script>

<template>
  <div v-if="change" class="space-y-6">
    <ChangeInfo :change="change" />

    <Separator class="my-4" />

    <h3 class="text-xl font-bold mb-4">Historial de Versiones</h3>
    <div v-if="changeAudits.length > 0" class="space-y-4">
      <ChangeHistory
        :change-versions="changeVersions"
        :handle-rollback="handleRollback"
      />
    </div>
    <div v-else>No se encontraron versiones anteriores para este cambio.</div>
  </div>
</template>
