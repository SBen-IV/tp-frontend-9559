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
  ArrowLeft,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { prettyDate } from "@/lib/utils";
import EditConfigItemForm from "./forms/EditConfigItemForm.vue";
import { deleteConfigItem } from "@/api/config_items";
import { toast } from "vue-sonner";

const props = defineProps<{ item: ConfigItem }>();

const categoryIcons: Record<string, any> = {
  SOFTWARE: CodeXml,
  HARDWARE: Wrench,
  DOCUMENTACION: FileText,
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
      <Badge>
        <component :is="itemIcon" class="w-3 h-3 flex-shrink-0" />
        {{ item.categoria }}</Badge
      >
      <Badge variant="secondary">{{ item.estado }}</Badge>
    </CardHeader>
    <CardContent class="overflow-hidden text-ellipsis text-wrap max-h-30">
      <p class="italic text-xs">
        Fecha creación: {{ prettyDate(item.fecha_creacion) }}
      </p>
      <Dialog @update:open="handleDialogClose">
        <DialogTrigger as-child>
          <Button variant="ghost" class="mt-2">
            <Eye class="w-4 h-4 mr-2" />Ver más</Button
          >
        </DialogTrigger>
        <DialogContent
          class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[50dvh]"
        >
          <div v-if="!editView">
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
              <p>
                Estado:
                <Badge variant="secondary">{{ item.estado }}</Badge>
              </p>
              <p class="italic text-xs">
                Fecha creación: {{ prettyDate(item.fecha_creacion) }}
              </p>
            </DialogHeader>
            <div class="grid gap-4 py-4 overflow-y-auto px-6">
              <p>
                {{ item.descripcion }}
              </p>
            </div>
            <DialogFooter>
              <div class="flex gap-2 pb-4 px-4">
                <!-- TODO: These buttons should have actions associated -->
                <Button @click="editView = true">
                  <Pencil class="w-2 h-4" />Edit</Button
                >
                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button variant="destructive">
                      <Trash2 class="w-2 h-4" />Borrar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle
                        >Está por borrar '{{ item.nombre }}'</AlertDialogTitle
                      >
                      <AlertDialogDescription>
                        Esta acción no puede deshacerse.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction @click="handleDelete"
                        >Eliminar definitivamente</AlertDialogAction
                      >
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
