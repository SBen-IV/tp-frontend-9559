<script setup lang="ts">
import type { ConfigItem } from "@/models/config_items";
import {
  CardHeader,
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  CodeXml,
  FileText,
  Wrench,
  Eye,
  Trash2,
  Pencil,
} from "lucide-vue-next";
import { computed } from "vue";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

const props = defineProps<{ item: ConfigItem }>();

const dateToString = (date: Date): String => {
  // For some reason `date` is not a `Date`
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${day.toString().padStart(2, "0")}-${month.toString().padStart(2, "0")}-${year}`;
};

const categoryIcons: Record<string, any> = {
  SOFTWARE: CodeXml,
  HARDWARE: Wrench,
  DOCUMENTACION: FileText,
};

const itemIcon = computed(() => {
  return categoryIcons[props.item.categoria];
});
</script>

<template>
  <Card class="py-6 max-h-50" key="item.id">
    <CardHeader>
      <div class="flex">
        <CardTitle class="mr-2">{{ item.nombre }}</CardTitle>
        <CardDescription>{{ item.version }}</CardDescription>
      </div>
      <Badge>
        <component :is="itemIcon" class="w-3 h-3 flex-shrink-0" />
        {{ item.categoria }}</Badge
      >
    </CardHeader>
    <CardContent class="overflow-hidden text-ellipsis text-wrap max-h-30">
      <p class="italic text-xs">
        Fecha creación: {{ dateToString(item.fecha_creacion) }}
      </p>
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="ghost" class="mt-2">
            <Eye class="w-4 h-4 mr-2" />Ver más</Button
          >
        </DialogTrigger>
        <DialogContent
          class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[50dvh]"
        >
          <DialogHeader class="p-6 pb-0">
            <DialogTitle
              >Nombre: <b>{{ item.nombre }}</b></DialogTitle
            >
            <DialogDescription
              >Versión: <b>{{ item.version }}</b></DialogDescription
            >
            <p>
              Categoría:
              <Badge>
                <component :is="itemIcon" class="w-3 h-3 flex-shrink-0" />
                {{ item.categoria }}</Badge
              >
            </p>
            <p class="italic text-xs">
              Fecha creación: {{ dateToString(item.fecha_creacion) }}
            </p>
          </DialogHeader>
          <div class="grid gap-4 py-4 overflow-y-auto px-6">
            <p>
              {{ item.descripcion }}
            </p>
          </div>
          <DialogFooter class="">
            <div class="flex gap-2 pb-4 px-4">
              <Button> <Pencil class="w-2 h-4" />Edit</Button>
              <Button variant="destructive">
                <Trash2 class="w-2 h-4" />Delete</Button
              >
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardContent>
  </Card>
</template>
