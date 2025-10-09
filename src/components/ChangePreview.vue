<script setup lang="ts">
import {
  CardHeader,
  Card,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Eye, Trash2, Pencil } from "lucide-vue-next";
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
import type { Change } from "@/models/changes";
import ItemOption from "./ItemOption.vue";
import { prettyDate, getPrioridadColor } from "@/lib/utils";

defineProps<{ change: Change }>();
</script>

<template>
  <Card class="py-6" key="item.id">
    <CardHeader>
      <div class="flex">
        <CardTitle class="flex justify-between mr-2 gap-2">
          <p>{{ change.titulo }}</p>

          <p class="italic text-xs font-light">
            Fecha creación: {{ prettyDate(change.fecha_creacion) }}
          </p>
        </CardTitle>
      </div>
      <Badge variant="default" :class="getPrioridadColor(change.prioridad)">{{
        change.prioridad
      }}</Badge>
      <Badge variant="secondary">{{ change.estado }}</Badge>
    </CardHeader>
    <CardContent class="overflow-hidden text-ellipsis text-wrap max-h-30">
      <p class="text-sm">
        {{ change.descripcion }}
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
              <p>{{ change.titulo }}</p>
              <p class="italic text-xs font-light mr-2">
                Fecha creación: {{ prettyDate(change.fecha_creacion) }}
              </p>
            </DialogTitle>
            <DialogDescription>
              <Badge variant="secondary">{{ change.estado }}</Badge>
            </DialogDescription>
          </DialogHeader>

          <Tabs default-value="descripcion" class="w-full px-6">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="descripcion">Descripción</TabsTrigger>
              <TabsTrigger value="config_items">Ítems afectados</TabsTrigger>
            </TabsList>
            <TabsContent value="descripcion" class="overflow-y-auto">
              <p class="pt-4">
                {{ change.descripcion }}
              </p>
            </TabsContent>
            <TabsContent value="config_items" class="overflow-y-auto">
              <!-- TODO: Should link to the CI -->
              <ItemOption
                v-for="item in change.config_items"
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
