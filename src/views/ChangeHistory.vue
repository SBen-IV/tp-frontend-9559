<script lang="ts">
import { getChangeAuditsByID, getChangeByID } from '@/api/changes';
import type { Change, ChangeAudit } from '@/models/changes';
import { onMounted, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const change = shallowRef<Change>();
const changeVersions = shallowRef<ChangeAudit[]>([]);

const fetchChange = async (changeID: string) => {
  change.value = await getChangeByID(changeID)
}

const fetchChangeHistory = async (changeID: string) => {
  changeVersions.value = await getChangeAuditsByID(changeID)
}

onMounted(() => {
  fetchChange(route.params.id as string);
  fetchChangeHistory(route.params.id as string)
});
</script>

<template>
  <h1 class="text-6xl text-center font-bold mb-2">Historial</h1>
</template>