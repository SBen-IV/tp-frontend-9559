<script setup lang="ts">
import type { ConfigItem } from "@/models/config_items";
import DeleteAlertDialog from "./DeleteAlertDialog.vue";
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
  Calendar,
  FileText,
  Wrench,
  Eye,
  Pencil,
  ArrowLeft,
  History,
} from "lucide-vue-next";
import { computed, ref } from "vue";
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
import {
  colorsByConfigItemCategoria,
  colorsByConfigItemEstado,
  prettyDate,
  prettyEstado,
} from "@/lib/utils";
import EditConfigItemForm from "./forms/EditConfigItemForm.vue";
import { deleteConfigItem } from "@/api/config_items";
import { toast } from "vue-sonner";
import OwnerInfo from "./OwnerInfo.vue";
import type { Color } from "@/models/colors";

const props = defineProps<{ item: ConfigItem }>();

const categoryIcons: Record<string, any> = {
  SOFTWARE: CodeXml,
  HARDWARE: Wrench,
  DOCUMENTACION: FileText,
};

const getBadgeColor = (colors: Record<string, Color>, key: string): string => {
  return colors[key].tw;
};

const itemIcon = computed(() => {
  return categoryIcons[props.item.categoria];
});

// Whether it should show the form to edit the Change or not
const editView = ref(false);

const handleDialogClose = () => {
  // To prevent a minor visual glitch
  setTimeout(() => {
    editView.value = false;
  }, 200);
};

const emit = defineEmits<{
  configItemUpdated: [];
}>();

const handleEditSubmitted = () => {
  // Let parent know a Change was updated so it can re-fetch the Changes
  editView.value = false;
  emit("configItemUpdated");
};

const cancelEdit = () => {
  editView.value = false;
};

const handleDelete = async () => {
  try {
    await deleteConfigItem(props.item.id);
    toast.success("Se eliminó el ítem correctamente");
    emit("configItemUpdated");
  } catch (err: any) {
    toast.error(err.message);
  }
};
</script>

<template>
  <Card class="py-6" key="item.id">
    <CardHeader>
      <div class="flex">
        <CardTitle class="mr-2">{{ item.nombre }}</CardTitle>
        <CardDescription>{{ item.version }}</CardDescription>
      </div>
      <Badge
        :class="getBadgeColor(colorsByConfigItemCategoria, item.categoria)"
      >
        <component :is="itemIcon" class="w-3 h-3 flex-shrink-0" />
        {{ item.categoria }}</Badge
      >
      <Badge
        variant="secondary"
        class="text-black"
        :class="getBadgeColor(colorsByConfigItemEstado, item.estado)"
        >{{ prettyEstado(item.estado) }}</Badge
      >
    </CardHeader>
    <CardContent
      class="text-xs overflow-hidden text-ellipsis text-wrap max-h-30"
    >
      <p class="flex items-center gap-1">
        <Calendar class="w-3 h-3" />
        <span class="font-semibold">Fecha creación:</span>
        {{ prettyDate(item.fecha_creacion) }}
      </p>
      <Dialog @update:open="handleDialogClose">
        <DialogTrigger as-child>
          <Button variant="ghost" class="mt-2">
            <Eye class="w-4 h-4 mr-2" />Ver más</Button
          >
        </DialogTrigger>
        <DialogContent
          class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[70dvh]"
        >
          <div v-if="!editView">
            <DialogHeader class="p-6 pb-0">
              <DialogTitle class="text-center"
                ><b>{{ item.nombre }}</b>
              </DialogTitle>
              <OwnerInfo class="m-auto" :owner-id="item.owner_id" />
              <DialogDescription class="text-foreground">
                <span class="font-bold">Versión: </span>
                {{ item.version }}
                <br />
                <span class="font-bold">Categoría: </span>
                <Badge>
                  <component :is="itemIcon" class="w-3 h-3 flex-shrink-0" />
                  {{ item.categoria }}</Badge
                >
                <br />
                <span class="font-bold">Estado: </span>
                <Badge
                  variant="secondary"
                  class="text-black"
                  :class="getBadgeColor(item.estado)"
                  >{{ prettyEstado(item.estado) }}</Badge
                >
                <br />
                <span class="font-bold">Fecha creación: </span>
                {{ prettyDate(item.fecha_creacion) }}
              </DialogDescription>
            </DialogHeader>

            <div class="p-6 pb-0 mt-1 overflow-y-auto max-h-[30dvh]">
              <p>
                {{ item.descripcion }}
              </p>
            </div>
            <DialogFooter>
              <div class="w-full flex justify-between items-center px-4 pt-4">
                <div class="flex">
                  <Button variant="secondary" class="relative p-0">
                    <RouterLink
                      :to="`/config-items/${item.id}`"
                      class="flex items-center gap-2 w-full h-full px-4 py-2"
                    >
                      <History class="w-2 h-4" />
                      Historial
                    </RouterLink>
                  </Button>
                </div>
                <!-- TODO: These buttons should have actions associated -->
                <Button @click="editView = true">
                  <Pencil class="w-2 h-4" />Edit</Button
                >
                <DeleteAlertDialog
                  :title="item.nombre"
                  :handleDelete="handleDelete"
                />
              </div>
            </DialogFooter>
          </div>

          <div v-else class="flex flex-col flex-1 min-h-0">
            <DialogHeader class="p-6 pb-0 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                class="h-6 w-6"
                @click="cancelEdit"
              >
                <ArrowLeft class="h-4 w-4" />
              </Button>
              <DialogTitle>Editar Item de Configuración</DialogTitle>
            </DialogHeader>

            <EditConfigItemForm
              class="p-6 pb-0 flex-1 min-h-0 overflow-y-auto px-6"
              :item="item"
              @submitted="handleEditSubmitted"
            />
          </div>
        </DialogContent>
      </Dialog>
    </CardContent>
  </Card>
</template>
