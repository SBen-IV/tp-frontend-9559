<script setup lang="ts">
import { getChangeAuditsByID, getChangeByID } from '@/api/changes';
import type { Change, ChangeAudit } from '@/models/changes';
import { onMounted, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { getPrioridadColor } from '@/lib/utils';
import Badge from '@/components/ui/badge/Badge.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import Card from '@/components/ui/card/Card.vue';
import { prettyDate } from '@/lib/utils';
import ItemOption from '@/components/ItemOption.vue';

const route = useRoute()

const change = ref<Change>();
const changeVersions = shallowRef<ChangeAudit[]>([]);

const fetchChange = async (changeID: string) => {
  change.value = await getChangeByID(changeID)
  console.log('Change data:', change.value); 
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
  <div v-if="change" class="space-y-6">
    <div>
      <h1 class="text-4xl text-center font-bold">
        {{ change.titulo }}
      </h1>
    </div>

    <Card class="p-6">
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
        <p class="font-medium text-muted-foreground mb-1">Ítems de configuración</p>
        <div class="flex">
          <ItemOption
            v-for="item in change.config_items"
            :key="item.id"
            :item="item"
            class="hover:bg-accent rounded-md mb-2 pt-4"
          />
        </div>
      </div>
    </Card>

    <Separator class="my-4" />


  </div>
</template>