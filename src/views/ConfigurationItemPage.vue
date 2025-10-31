<script setup lang="ts">
import { getConfigItemAuditsByID, getConfigItemById } from "@/api/config_items";
import type { ConfigItem, ConfigItemAudit, ConfigItemVersion } from "@/models/config_items";
import { onMounted, ref, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";
import Separator from "@/components/ui/separator/Separator.vue";
import { toast } from "vue-sonner";
import ConfigItemInfo from "@/components/ConfigItemInfo.vue";

const route = useRoute();

const configItem = ref<ConfigItem>();
const configItemAudits = shallowRef<ConfigItemAudit[]>([]);
const configItemVersions = ref<ConfigItemVersion[]>([]);

watch(
  () => configItemAudits.value,
  async (audits) => {
    if (!audits || audits.length === 0) return;

    const versions = await Promise.all(
      audits.map(async (audit) => {
        const { estado_nuevo, ...auditWithoutEstadoNuevo } = audit;

        // We remove nested structure from the audit and we add the config_items
        const configItemVersion: ConfigItemVersion = {
          ...audit.estado_nuevo,  // the configItem version
          ...auditWithoutEstadoNuevo, // fecha_actualizacion, (audit) ID, ... 
        };

        return configItemVersion;
      })
    );

    configItemVersions.value = versions;
  }
);

const fetchConfigItem = async () => {
  try {
    const configItemID = route.params.id as string;
    configItem.value = await getConfigItemById(configItemID);
  } catch (error: any) {
    toast.error(error.message || "Error al cargar el ítem")
  }
};

const fetchConfigItemHistory = async () => {
  try {
    const configItemID = route.params.id as string;
    configItemAudits.value = await getConfigItemAuditsByID(configItemID);
  } catch (error: any) {
    toast.error(error.message || "Error al cargar el historial")
  }
};

onMounted(() => {
  fetchConfigItem();
  fetchConfigItemHistory();
});
</script>

<template>
  <div v-if="configItem" class="space-y-6">
    <ConfigItemInfo :config-item="configItem" />
  </div>
</template>