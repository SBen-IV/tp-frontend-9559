<script setup lang="ts">
import type { Change } from '@/models/changes';
import { getPrioridadColor } from '@/lib/utils';
import { prettyDate } from '@/lib/utils';
import Card from './ui/card/Card.vue';
import Badge from './ui/badge/Badge.vue';
import Separator from './ui/separator/Separator.vue';
import ItemOption from './ItemOption.vue';

defineProps<{ change: Change }>();
</script>

<template>
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

    <p class="font-medium text-muted-foreground">Descripción</p>
    <div class="max-h-[200px] overflow-y-auto">
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
        <div v-if="change.config_items.length > 0" class="grid grid-cols-1 sm:grid-cols-5 gap-2">
          <ItemOption
            v-for="item in change.config_items"
            :key="item.id"
            :item="item"
            class="hover:bg-accent rounded-md p-2"
          />
        </div>
        <div v-else class="text-sm">
          Sin ítem relacionados.
        </div>
      </div>
    </div>
  </Card>
</template>
