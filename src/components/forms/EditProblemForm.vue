<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useFilter } from "reka-ui";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { problemEditSchema, type Problem } from "@/models/problems";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
} from "@/components/ui/tags-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { estados as status } from "@/models/problems";
import { priorities } from "@/models/commons";
import { updateProblem } from "@/api/problems";
import type { User } from "@/models/users";
import { getAllUsers } from "@/api/users";
import { getAllIncidents } from "@/api/incidents";
import type { Incident } from "@/models/incidents";
import IncidentOption from "../IncidentOption.vue";
import type { ConfigItem } from "@/models/config_items";
import { getAllConfigItems } from "@/api/config_items";
import ItemOption from "../ItemOption.vue";

const users = ref<User[]>([]);
const incidents = ref<Incident[]>([]);
const items = ref<ConfigItem[]>([]);
const openIncidents = ref(false);
const openItems = ref(false);
const searchIncidentTerm = ref("");
const searchItemTerm = ref("");
const isLoadingUsers = ref(false);
const isLoadingIncidents = ref(false);
const isLoadingItems = ref(false);

const props = defineProps<{ problem: Problem }>();

const emit = defineEmits<{
  // Let parent know the form was submitted
  submitted: [];
}>();

const { values, handleSubmit, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(problemEditSchema),
  initialValues: {
    ...props.problem,
    id_config_items: props.problem.config_items?.map((item) => item.id) || [],
    id_incidentes:
      props.problem.incidentes?.map((incident) => incident.id) || [],
  },
});

const formattedPriorities = computed(() =>
  priorities.map((priority) => ({
    value: priority,
    label: priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
  })),
);

const formattedStatus = computed(() =>
  status.map((status) => ({
    value: status,
    label: status.replace(/_/g, " "),
  })),
);

const fetchUsers = async () => {
  isLoadingUsers.value = true;
  try {
    users.value = await getAllUsers("EMPLEADO");
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los ítems");
    users.value = [];
  } finally {
    isLoadingUsers.value = false;
  }
};

const fetchIncidents = async () => {
  isLoadingIncidents.value = true;
  try {
    incidents.value = await getAllIncidents();
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los incidentes");
    incidents.value = [];
  } finally {
    isLoadingIncidents.value = false;
  }
};

const getIncidentById = (id: string) =>
  incidents.value.find((incident) => incident.id === id);

const addIncidentToForm = (incidentId: string) => {
  const currentIncidents = values.id_incidentes || [];
  if (!currentIncidents.includes(incidentId)) {
    setFieldValue("id_incidentes", [...currentIncidents, incidentId]);
  }
  searchIncidentTerm.value = "";

  if (filteredIncidents.value.length === 0) {
    openIncidents.value = false;
  }
};

const handleIncidentSelect = (event: { detail: { value: string } }) => {
  if (typeof event.detail.value === "string") {
    addIncidentToForm(event.detail.value);
  }
};

const filteredIncidents = computed(() => {
  const initialIncidents = props.problem.incidentes.map(
    (incident) => incident.id,
  );
  const currentIncidents = values.id_incidentes || initialIncidents || [];
  const { contains } = useFilter({ sensitivity: "base" });

  const availableIncidents = incidents.value.filter(
    (i) => !currentIncidents.includes(i.id),
  );

  return searchIncidentTerm.value
    ? availableIncidents.filter((incident) =>
        contains(incident.titulo, searchIncidentTerm.value),
      )
    : availableIncidents;
});

const fetchItems = async () => {
  isLoadingItems.value = true;
  try {
    items.value = await getAllConfigItems();
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los incidentes");
    items.value = [];
  } finally {
    isLoadingItems.value = false;
  }
};

const getItemById = (id: string) => items.value.find((item) => item.id === id);

const addItemToForm = (itemId: string) => {
  const currentItems = values.id_config_items || [];
  if (!currentItems.includes(itemId)) {
    setFieldValue("id_config_items", [...currentItems, itemId]);
  }
  searchItemTerm.value = "";

  if (filteredItems.value.length === 0) {
    openItems.value = false;
  }
};

const handleItemSelect = (event: { detail: { value: string } }) => {
  if (typeof event.detail.value === "string") {
    addItemToForm(event.detail.value);
  }
};

const filteredItems = computed(() => {
  const currentItems = values.id_config_items || [];
  const { contains } = useFilter({ sensitivity: "base" });

  const availableItems = items.value.filter(
    (i) => !currentItems.includes(i.id),
  );

  return searchItemTerm.value
    ? availableItems.filter((item) =>
        contains(item.nombre, searchItemTerm.value),
      )
    : availableItems;
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await updateProblem(props.problem.id, values);
    toast.success("Se modificó el problema correctamente");
    emit("submitted");
  } catch (err: any) {
    toast.error(err.message);
  }
});

onMounted(() => {
  fetchUsers();
  fetchItems();
  fetchIncidents();
});
</script>

<template>
  <form class="space-y-6" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="titulo">
      <FormItem>
        <FormLabel>Título</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Titulo del problema"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="descripcion">
      <FormItem>
        <FormLabel>Descripción</FormLabel>
        <FormControl>
          <Textarea placeholder="Detalle el problema" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="prioridad">
      <FormItem>
        <FormLabel>Prioridad</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione la prioridad del problema" />
            </SelectTrigger>
          </FormControl>
          <SelectContent class="capitalize">
            <SelectGroup>
              <SelectItem
                v-for="priority in formattedPriorities"
                :key="priority.value"
                :value="priority.value"
              >
                {{ priority.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="estado">
      <FormItem>
        <FormLabel>Estado</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el estado del problema" />
            </SelectTrigger>
          </FormControl>
          <SelectContent class="capitalize">
            <SelectGroup>
              <SelectItem
                v-for="status in formattedStatus"
                :key="status.value"
                :value="status.value"
              >
                {{ status.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="responsable_id">
      <FormItem>
        <FormLabel>Responsable</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el responsable" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="user in users" :key="user.id" :value="user.id">
                {{ `${user.nombre} ${user.apellido} - ${user.email}` }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="id_config_items">
      <FormItem>
        <FormLabel>Ítems afectados</FormLabel>
        <Combobox v-model:open="openItems" :ignore-filter="true">
          <ComboboxAnchor as-child>
            <TagsInput
              :model-value="componentField.modelValue"
              class="px-2 gap-2 w-80"
              @update:model-value="componentField['onUpdate:modelValue']"
            >
              <div
                class="flex gap-2 flex-wrap items-center overflow-y-auto max-h-40"
              >
                <TagsInputItem
                  v-for="itemID in componentField.modelValue"
                  :key="itemID"
                  :value="itemID"
                  class="h-full"
                >
                  <ItemOption
                    v-if="getItemById(itemID)"
                    :item="getItemById(itemID)!"
                  />
                  <TagsInputItemDelete />
                </TagsInputItem>
              </div>

              <ComboboxInput
                v-model="searchItemTerm"
                as-child
                @click="openItems = true"
              >
                <TagsInputInput
                  placeholder="Ítems..."
                  class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                  @keydown.enter.prevent
                />
              </ComboboxInput>
            </TagsInput>

            <ComboboxList class="w-[--reka-popper-anchor-width]">
              <ComboboxEmpty />
              <ComboboxGroup class="max-h-60 overflow-y-auto">
                <ComboboxItem
                  v-for="item in filteredItems"
                  :key="item.id"
                  :value="item.id"
                  @select.prevent="handleItemSelect"
                >
                  <ItemOption :item="item" />
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxList>
          </ComboboxAnchor>
        </Combobox>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="id_incidentes">
      <FormItem>
        <FormLabel>Incidentes relacionados</FormLabel>
        <Combobox v-model:open="openIncidents" :ignore-filter="true">
          <ComboboxAnchor as-child>
            <TagsInput
              :model-value="componentField.modelValue"
              class="px-2 gap-2 w-80"
              @update:model-value="componentField['onUpdate:modelValue']"
            >
              <div
                class="flex gap-2 flex-wrap items-center overflow-y-auto max-h-40"
              >
                <TagsInputItem
                  v-for="incidentID in componentField.modelValue"
                  :key="incidentID"
                  :value="incidentID"
                  class="h-full"
                >
                  <IncidentOption
                    v-if="getIncidentById(incidentID)"
                    :incident="getIncidentById(incidentID)!"
                  />
                  <TagsInputItemDelete />
                </TagsInputItem>
              </div>

              <ComboboxInput
                v-model="searchIncidentTerm"
                as-child
                @click="openIncidents = true"
              >
                <TagsInputInput
                  placeholder="Incidentes..."
                  class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                  @keydown.enter.prevent
                />
              </ComboboxInput>
            </TagsInput>

            <ComboboxList class="w-[--reka-popper-anchor-width]">
              <ComboboxEmpty />
              <ComboboxGroup class="max-h-60 overflow-y-auto">
                <ComboboxItem
                  v-for="incident in filteredIncidents"
                  :key="incident.id"
                  :value="incident.id"
                  @select.prevent="handleIncidentSelect"
                >
                  <IncidentOption :incident="incident" />
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxList>
          </ComboboxAnchor>
        </Combobox>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button
      :disabled="isSubmitting"
      type="submit"
      class="flex mx-auto bold"
      size="lg"
    >
      <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
      Enviar
    </Button>
  </form>
</template>
