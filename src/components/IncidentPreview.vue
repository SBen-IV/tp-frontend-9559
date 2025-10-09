<script setup lang="ts">
import {
  CardHeader,
  Card,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Eye, Trash2, Pencil, CodeXml, Wrench, ShieldAlert, MessageCircleQuestion } from "lucide-vue-next";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import ItemOption from "./ItemOption.vue";
import type { Incident } from "@/models/incidents";
import { getPrioridadColor, prettyDate } from "@/lib/utils";
import { computed } from "vue";

const props = defineProps<{ incident: Incident }>();

const categoryIcons: Record<string, any> = {
  SOFTWARE: CodeXml,
  HARDWARE: Wrench,
  SEGURIDAD: ShieldAlert,
  SOLICITUD_DE_SERVICIO: MessageCircleQuestion,
};

const categoryIcon = computed(() => {
  return categoryIcons[props.incident.categoria];
});

const prettyEstado = (estado: String): String => {
  // Replace all ocurrences of _ 
  return estado.replace(/_/g, " "); 
};
</script>

<template>
  <Card class="py-6" key="item.id">
    <CardHeader>
      <div class="flex">
        <CardTitle class="flex justify-between mr-2 gap-2">
          <p>{{ incident.titulo }}</p>
        </CardTitle>
      </div>
      <Badge>
        <component :is="categoryIcon" class="w-3 h-3 flex-shrink-0" />
        {{ prettyEstado(incident.categoria) }}</Badge
      >
      <Badge variant="default" :class="getPrioridadColor(incident.prioridad)">{{
        incident.prioridad
      }}</Badge>
      <Badge variant="secondary">{{ prettyEstado(incident.estado) }}</Badge>
    </CardHeader>
    <CardContent class="overflow-hidden text-ellipsis text-wrap max-h-30">
      <p class="italic text-xs">
        Fecha creación: {{ prettyDate(incident.fecha_creacion) }}
      </p>
    </CardContent>
    <CardFooter>
      <Dialog>
        <DialogTrigger as-child class="ml-auto">
          <Button variant="ghost"> <Eye class="w-4 h-4 mr-2" />Ver más </Button>
        </DialogTrigger>
        <DialogContent
          class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[50dvh]"
        >
          <DialogHeader class="p-6 pb-0">
            <DialogTitle class="flex justify-between">
              <p>{{ incident.titulo }}</p>
              <p class="italic text-xs font-light mr-2">
                Fecha creación: {{ prettyDate(incident.fecha_creacion) }}
              </p>
            </DialogTitle>
            <DialogDescription>
              <Badge variant="secondary">{{
                prettyEstado(incident.estado)
              }}</Badge>
            </DialogDescription>
          </DialogHeader>

          <Tabs default-value="descripcion" class="w-full px-6">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="descripcion">Descripción</TabsTrigger>
              <TabsTrigger value="config_items">Ítems afectados</TabsTrigger>
            </TabsList>
            <TabsContent value="descripcion" class="overflow-y-auto">
              <p class="pt-4">
                {{ incident.descripcion }}
              </p>
            </TabsContent>
            <TabsContent value="config_items" class="overflow-y-auto">
              <!-- TODO: Should link to the CI -->
              <ItemOption
                v-for="item in incident.config_items"
                :key="item.id"
                :item="item"
                class="hover:bg-accent rounded-md mb-2 pt-4"
              />
            </TabsContent>
          </Tabs>
          <DialogFooter class="">
            <div class="flex gap-2 pb-4 px-4">
              <!-- TODO: These buttons should have actions associated -->
              <Button> <Pencil class="w-2 h-4" />Edit </Button>
              <Button variant="destructive">
                <Trash2 class="w-2 h-4" />Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardFooter>
  </Card>
</template>
