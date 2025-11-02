<script setup lang="ts">
import {
  CardHeader,
  Card,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Eye,
  Calendar,
  Clock,
  Pencil,
  CodeXml,
  Wrench,
  ShieldAlert,
  MessageCircleQuestion,
  ArrowLeft,
} from "lucide-vue-next";
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
import { computed, ref } from "vue";
import EditIncidentForm from "./forms/EditIncidentForm.vue";
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
import { deleteIncident } from "@/api/incidents";
import { toast } from "vue-sonner";
import DeleteAlertDialog from "./DeleteAlertDialog.vue";

const props = defineProps<{ incident: Incident }>();

const categoryIcons: Record<string, any> = {
  SOFTWARE: CodeXml,
  HARDWARE: Wrench,
  SEGURIDAD: ShieldAlert,
  SOLICITUD_DE_SERVICIO: MessageCircleQuestion,
};

// Whether it should show the form to edit the Incident or not
const editView = ref(false);

const handleDialogClose = () => {
  // To prevent a minor visual glitch
  setTimeout(() => {
    editView.value = false;
  }, 200);
};

const emit = defineEmits<{
  incidentsUpdated: [];
}>();

const handleEditSubmitted = () => {
  // Let parent know an Incident was updated so it can re-fetch the Incidents
  editView.value = false;
  emit("incidentsUpdated");
};

const cancelEdit = () => {
  editView.value = false;
};

const categoryIcon = computed(() => {
  return categoryIcons[props.incident.categoria];
});

const prettyEstado = (estado: String): String => {
  // Replace all ocurrences of _
  return estado.replace(/_/g, " ");
};

const handleDelete = async () => {
  try {
    await deleteIncident(props.incident.id);
    toast.success("Se eliminó incidente correctamente");
    emit("incidentsUpdated");
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
    <CardContent class="space-y-1 text-xs text-foreground">
      <p class="flex items-center gap-1">
        <Calendar class="w-3 h-3" />
        <span class="font-semibold">Fecha creación:</span>
        {{ prettyDate(incident.fecha_creacion) }}
      </p>
      <p class="flex items-center gap-1">
        <Clock class="w-3 h-3" />
        <span class="font-semibold">Fecha cierre:</span>
        {{ incident.fecha_cierre ? prettyDate(incident.fecha_cierre) : "N/A" }}
      </p>
    </CardContent>
    <CardFooter @update:open="handleDialogClose">
      <Dialog>
        <DialogTrigger as-child class="ml-auto">
          <Button variant="ghost"> <Eye class="w-4 h-4 mr-2" />Ver más </Button>
        </DialogTrigger>
        <DialogContent
          class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[50dvh]"
        >
          <div v-if="editView === false">
            <DialogHeader class="p-6 pb-1">
              <div class="flex justify-between items-start">
                <DialogTitle>{{ incident.titulo }}</DialogTitle>
                <Badge variant="secondary">{{
                  prettyEstado(incident.estado)
                }}</Badge>
              </div>

              <div class="mt-1 text-xs italic font-light">
                <p>
                  <span class="font-medium">Fecha creación:</span>
                  {{ prettyDate(incident.fecha_creacion) }}
                </p>
                <p>
                  <span class="font-medium">Fecha cierre:</span>
                  {{
                    incident.fecha_cierre
                      ? prettyDate(incident.fecha_cierre)
                      : "N/A"
                  }}
                </p>
              </div>
            </DialogHeader>
            <Tabs default-value="descripcion" class="w-full px-6 max-h-[35dvh]">
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
              <div class="flex gap-2 px-4 pt-4">
                <Button @click="editView = true">
                  <Pencil class="w-2 h-4" />Editar
                </Button>
                <DeleteAlertDialog
                  :title="incident.titulo"
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
              <DialogTitle>Editar Incidente</DialogTitle>
            </DialogHeader>

            <EditIncidentForm
              class="p-6 pb-0 flex-1 min-h-0 overflow-y-auto px-6"
              :incident="incident"
              @submitted="handleEditSubmitted"
            />
          </div>
        </DialogContent>
      </Dialog>
    </CardFooter>
  </Card>
</template>
