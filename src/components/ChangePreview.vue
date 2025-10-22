<script setup lang="ts">
import {
  CardHeader,
  Card,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Eye, Trash2, Pencil, ArrowLeft } from "lucide-vue-next";
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
import { ref } from "vue";
import EditChangeForm from "./forms/EditChangeForm.vue";
import { toast } from "vue-sonner";
import { deleteChange } from "@/api/changes";
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
import DeleteAlertDialog from "./DeleteAlertDialog.vue";

const props = defineProps<{ change: Change }>();

// Whether it should show the form to edit the Change or not
const editView = ref(false);

const handleDialogClose = () => {
  // To prevent a minor visual glitch
  setTimeout(() => {
    editView.value = false;
  }, 200);
};

const emit = defineEmits<{
  changesUpdated: [];
}>();

const handleEditSubmitted = () => {
  // Let parent know a Change was updated so it can re-fetch the Changes
  editView.value = false;
  emit("changesUpdated");
};

const cancelEdit = () => {
  editView.value = false;
};

const handleDelete = async () => {
  try {
    await deleteChange(props.change.id);
    toast.success("Se eliminó cambio correctamente");
    emit("changesUpdated");
  } catch (err: any) {
    toast.error(err.message);
  }
};
</script>

<template>
  <Card key="item.id" class="py-6">
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
      <Dialog @update:open="handleDialogClose">
        <DialogTrigger as-child class="ml-auto">
          <Button variant="ghost"> <Eye class="w-4 h-4 mr-2" />Ver más </Button>
        </DialogTrigger>

        <DialogContent
          class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[70dvh]"
        >
          <div v-if="editView === false">
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

            <Tabs default-value="descripcion" class="w-full px-6 max-h-[50dvh]">
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
            <DialogFooter>
              <div class="flex gap-2 pb-4 px-4 pt-4">
                <Button @click="editView = true">
                  <Pencil class="w-2 h-4" />Edit
                </Button>
                <DeleteAlertDialog
                  :title="change.titulo"
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
              <DialogTitle>Editar Cambio</DialogTitle>
            </DialogHeader>

            <EditChangeForm
              class="p-6 pb-0 flex-1 min-h-0 overflow-y-auto px-6"
              :change="change"
              @submitted="handleEditSubmitted"
            />
          </div>
        </DialogContent>
      </Dialog>
    </CardFooter>
  </Card>
</template>
