<script setup lang="ts">
import {
  CardHeader,
  Card,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Eye, Pencil, ArrowLeft, History, Calendar } from "lucide-vue-next";
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
import IncidentOption from "./IncidentOption.vue";
import { prettyDate, getPrioridadColor, getImpactoColor } from "@/lib/utils";
import { ref } from "vue";
import EditChangeForm from "./forms/EditChangeForm.vue";
import { toast } from "vue-sonner";
import { deleteChange } from "@/api/changes";
import DeleteAlertDialog from "./DeleteAlertDialog.vue";
import OwnerInfo from "./OwnerInfo.vue";
import ProblemOption from "./ProblemOption.vue";
import ResponsableInfo from "./ResponsableInfo.vue";

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
        </CardTitle>
      </div>
      <Badge variant="default" :class="getPrioridadColor(change.prioridad)">{{
        change.prioridad
      }}</Badge>
      <Badge variant="default" :class="getImpactoColor(change.impacto)">{{
        change.impacto
      }}</Badge>
      <Badge variant="secondary">{{ change.estado }}</Badge>
    </CardHeader>
    <CardContent class="space-y-1 text-xs text-foreground">
      <p class="flex items-center gap-1">
        <Calendar class="w-3 h-3" />
        <span class="font-semibold">Fecha creación:</span>
        {{ prettyDate(change.fecha_creacion) }}
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
            <DialogHeader class="p-6 pb-0 mb-1">
              <DialogTitle class="text-center">
                <p>{{ change.titulo }}</p>
              </DialogTitle>
              <OwnerInfo class="m-auto" :owner-id="change.owner_id" />
              <DialogDescription class="text-foreground">
                <b>Estado: </b>
                <Badge variant="secondary">{{ change.estado }}</Badge>
                <br />
                <b>Fecha creación: </b>
                {{ prettyDate(change.fecha_creacion) }}
                <br />
                <b>Impacto: </b>
                <Badge :class="getImpactoColor(change.impacto)">{{
                  change.impacto
                }}</Badge>
              </DialogDescription>
              <ResponsableInfo
                :key="change.responsable_id"
                :responsable-id="change.responsable_id"
              />
            </DialogHeader>

            <Tabs default-value="descripcion" class="w-full px-6 max-h-[45dvh]">
              <TabsList class="grid w-full grid-cols-4">
                <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                <TabsTrigger value="config_items">Ítems</TabsTrigger>
                <TabsTrigger value="incidentes">Incidentes</TabsTrigger>
                <TabsTrigger value="problemas">Problemas</TabsTrigger>
              </TabsList>
              <TabsContent value="descripcion" class="overflow-y-auto">
                <p class="pt-4">
                  {{ change.descripcion }}
                </p>
              </TabsContent>
              <TabsContent
                value="config_items"
                class="overflow-y-auto grid grid-cols-2"
              >
                <!-- TODO: Should link to the CI -->
                <ItemOption
                  v-for="item in change.config_items"
                  :key="item.id"
                  :item="item"
                  class="hover:bg-accent rounded-md mb-2 pt-4"
                />
              </TabsContent>
              <TabsContent
                value="incidentes"
                class="overflow-y-auto grid grid-cols-2"
              >
                <IncidentOption
                  v-for="incidente in change.incidentes"
                  :key="incidente.id"
                  :incident="incidente"
                  class="hover:bg-accent rounded-md mb-2 pt-4"
                />
              </TabsContent>
              <TabsContent
                value="problemas"
                class="overflow-y-auto grid grid-cols-2"
              >
                <ProblemOption
                  v-for="problema in change.problemas"
                  :key="problema.id"
                  :problem="problema"
                  class="hover:bg-accent rounded-md mb-2 pt-4"
                />
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <div
                class="w-full flex justify-between items-center pb-4 px-4 pt-4"
              >
                <div class="flex">
                  <Button variant="secondary" class="relative p-0">
                    <RouterLink
                      :to="`/changes/${change.id}`"
                      class="flex items-center gap-2 w-full h-full px-4 py-2"
                    >
                      <History class="w-2 h-4" />
                      Historial
                    </RouterLink>
                  </Button>
                </div>

                <div class="flex gap-2">
                  <Button @click="editView = true">
                    <Pencil class="w-2 h-4" />Edit
                  </Button>
                  <DeleteAlertDialog
                    :title="change.titulo"
                    :handleDelete="handleDelete"
                  />
                </div>
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
