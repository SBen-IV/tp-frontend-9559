<script setup lang="ts">
import {
  CardHeader,
  Card,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Eye, ArrowLeft, Pencil } from "lucide-vue-next";
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
import type { Problem } from "@/models/problems";
import { getPrioridadColor, prettyDate } from "@/lib/utils";
import { ref } from "vue";
import EditProblemForm from "@/components/forms/EditProblemForm.vue";
import IncidentOption from "./IncidentOption.vue";
import { deleteProblem } from "@/api/problems";
import { toast } from "vue-sonner";
import DeleteAlertDialog from "./DeleteAlertDialog.vue";

const props = defineProps<{ problem: Problem }>();

const prettyEstado = (estado: String): String => {
  return estado.replace("_", " ");
};

const editView = ref(false);

const handleDialogClose = () => {
  // To prevent a minor visual glitch
  setTimeout(() => {
    editView.value = false;
  }, 200);
};

const emit = defineEmits<{
  problemsUpdated: [];
}>();

const handleEditSubmitted = () => {
  // Let parent know a Problem was updated so it can re-fetch the Changes
  emit("problemsUpdated");
  editView.value = false;
};

const cancelEdit = () => {
  editView.value = false;
};

const handleDelete = async () => {
  try {
    await deleteProblem(props.problem.id);
    toast.success("Se eliminó el problema correctamente");
    emit("problemsUpdated");
  } catch (err: any) {
    toast.error(err.message);
  }
};
</script>

<template>
  <Card class="py-6" key="item.id">
    <CardHeader>
      <div class="flex">
        <CardTitle class="flex justify-between mr-2 gap-2">
          <p>{{ problem.titulo }}</p>
        </CardTitle>
      </div>
      <Badge variant="default" :class="getPrioridadColor(problem.prioridad)">{{
        problem.prioridad
      }}</Badge>
      <Badge variant="secondary">{{ prettyEstado(problem.estado) }}</Badge>
    </CardHeader>
    <CardContent class="overflow-hidden text-ellipsis text-wrap max-h-30">
      <p class="italic text-xs">
        Fecha creación: {{ prettyDate(problem.fecha_creacion) }}
      </p>
    </CardContent>
    <CardFooter>
      <Dialog @update:open="handleDialogClose">
        <DialogTrigger as-child class="ml-auto">
          <Button variant="ghost"> <Eye class="w-4 h-4 mr-2" />Ver más </Button>
        </DialogTrigger>
        <DialogContent
          class="sm:max-w-[450px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[50dvh]"
        >
          <div v-if="!editView">
            <DialogHeader class="p-6 pb-0">
              <DialogTitle class="flex justify-between">
                <p>{{ problem.titulo }}</p>
                <p class="italic text-xs font-light mr-2">
                  Fecha creación: {{ prettyDate(problem.fecha_creacion) }}
                </p>
              </DialogTitle>
              <DialogDescription>
                <Badge variant="secondary">{{
                  prettyEstado(problem.estado)
                }}</Badge>
              </DialogDescription>
            </DialogHeader>

            <Tabs default-value="descripcion" class="w-full px-6 max-h-[35dvh]">
              <TabsList class="grid w-full grid-cols-3">
                <!-- NOTE: Keep tab names short so that it doesn't overflow -->
                <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                <TabsTrigger value="config_items">Ítems</TabsTrigger>
                <TabsTrigger value="incidentes">Incidentes</TabsTrigger>
              </TabsList>
              <TabsContent value="descripcion" class="overflow-y-auto">
                <p class="pt-4">
                  {{ problem.descripcion }}
                </p>
              </TabsContent>
              <TabsContent value="config_items" class="overflow-y-auto">
                <!-- TODO: Should link to the CI -->
                <ItemOption
                  v-for="item in problem.config_items"
                  :key="item.id"
                  :item="item"
                  class="hover:bg-accent rounded-md mb-2 pt-4"
                />
              </TabsContent>
              <TabsContent value="incidentes" class="overflow-y-auto">
                <IncidentOption
                  v-for="incidente in problem.incidentes"
                  :key="incidente.id"
                  :incident="incidente"
                  class="hover:bg-accent rounded-md mb-2 pt-4"
                />
              </TabsContent>
            </Tabs>
            <DialogFooter class="">
              <div class="flex gap-2 pb-4 px-4 pt-4">
                <!-- TODO: These buttons should have actions associated -->
                <Button @click="editView = true">
                  <Pencil class="w-2 h-4" />Edit
                </Button>
                <DeleteAlertDialog
                  :title="problem.titulo"
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
              <DialogTitle>Editar Problema</DialogTitle>
            </DialogHeader>

            <EditProblemForm
              class="p-6 pb-0 flex-1 min-h-0 overflow-y-auto px-6"
              :problem="problem"
              @submitted="handleEditSubmitted"
            />
          </div>
        </DialogContent>
      </Dialog>
    </CardFooter>
  </Card>
</template>
