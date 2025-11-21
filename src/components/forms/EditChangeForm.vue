<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { changeEditSchema, type Change } from "../../models/changes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ItemOption from "@/components/ItemOption.vue";
import IncidentOption from "../IncidentOption.vue";
import ProblemOption from "../ProblemOption.vue";
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
import { changeStatus as status } from "@/models/changes";
import { impactos, priorities } from "@/models/commons";
import { updateChange } from "@/api/changes";
import { useFilter } from "reka-ui";
import type { ConfigItem } from "@/models/config_items";
import { getAllConfigItems } from "@/api/config_items";
import type { Incident } from "@/models/incidents";
import { getAllIncidents } from "@/api/incidents";
import type { Problem } from "@/models/problems";
import { getAllProblems } from "@/api/problems";

const props = defineProps<{ change: Change }>();

const items = ref<ConfigItem[]>([]);
const incidents = ref<Incident[]>([]);
const problems = ref<Problem[]>([]);
const openItems = ref(false);
const openIncidents = ref(false);
const openProblems = ref(false);
const searchTermItem = ref("");
const searchTermIncident = ref("");
const searchTermProblem = ref("");
const isLoading = ref(false);

const emit = defineEmits<{
  // Let parent know the form was submitted
  submitted: [];
}>();

const { values, handleSubmit, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(changeEditSchema),
  initialValues: {
    ...props.change,
    id_config_items: props.change.config_items.map((item) => item.id),
    id_incidentes: props.change.incidentes.map((incident) => incident.id),
    id_problemas: props.change.problemas?.map((problem) => problem.id),
  },
});

const formattedPriorities = computed(() =>
  priorities.map((priority) => ({
    value: priority,
    label: priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
  }))
);

const formattedImpact = computed(() =>
  impactos.map((impacto) => ({
    value: impacto,
    label: impacto.charAt(0).toUpperCase() + impacto.slice(1).toLowerCase(),
  }))
);

const formattedStatus = computed(() =>
  status.map((status) => ({
    value: status,
    label: status.replace(/_/g, " "),
  }))
);

const filteredItems = computed(() => {
  const currentItems = values.id_config_items || [];
  const { contains } = useFilter({ sensitivity: "base" });

  const availableItems = items.value.filter(
    (i) => !currentItems.includes(i.id)
  );

  return searchTermItem.value
    ? availableItems.filter((item) =>
        contains(item.nombre, searchTermItem.value)
      )
    : availableItems;
});

const fetchItems = async () => {
  isLoading.value = true;
  try {
    items.value = await getAllConfigItems();
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los ítems");
    items.value = [];
  } finally {
    isLoading.value = false;
  }
};

const getItemById = (id: string) => items.value.find((item) => item.id === id);

const addItemToForm = (itemId: string) => {
  const currentItems = values.id_config_items || [];
  if (!currentItems.includes(itemId)) {
    setFieldValue("id_config_items", [...currentItems, itemId]);
  }
  searchTermItem.value = "";

  if (filteredItems.value.length === 0) {
    openItems.value = false;
  }
};

const handleItemSelect = (event: { detail: { value: string } }) => {
  if (typeof event.detail.value === "string") {
    addItemToForm(event.detail.value);
  }
};

const fetchIncidents = async () => {
  isLoading.value = true;
  try {
    incidents.value = await getAllIncidents();
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los incidentes");
    incidents.value = [];
  } finally {
    isLoading.value = false;
  }
};

const filteredIncidents = computed(() => {
  const currentIncidents = values.id_incidentes || [];
  const { contains } = useFilter({ sensitivity: "base" });

  const availableIncidents = incidents.value.filter(
    (i) => !currentIncidents.includes(i.id)
  );

  return searchTermIncident.value
    ? availableIncidents.filter((incident) =>
        contains(incident.titulo, searchTermIncident.value)
      )
    : availableIncidents;
});

const getIncidentById = (id: string) =>
  incidents.value.find((incident) => incident.id === id);

const addIncidentToForm = (incidentId: string) => {
  const currentIncidents = values.id_incidentes || [];
  if (!currentIncidents.includes(incidentId)) {
    setFieldValue("id_incidentes", [...currentIncidents, incidentId]);
  }

  searchTermIncident.value = "";

  if (filteredIncidents.value.length === 0) {
    openIncidents.value = false;
  }
};

const handleIncidentSelect = (event: { detail: { value: string } }) => {
  if (typeof event.detail.value === "string") {
    addIncidentToForm(event.detail.value);
  }
};

const fetchProblems = async () => {
  isLoading.value = true;
  try {
    problems.value = await getAllProblems();
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los problemas");
    problems.value = [];
  } finally {
    isLoading.value = false;
  }
};

const filteredProblems = computed(() => {
  const currentProblems = values.id_problemas || [];
  const { contains } = useFilter({ sensitivity: "base" });

  const availableProblems = problems.value.filter(
    (i) => !currentProblems.includes(i.id)
  );

  return searchTermProblem.value
    ? availableProblems.filter((problem) =>
        contains(problem.titulo, searchTermProblem.value)
      )
    : availableProblems;
});

const getProblemByID = (id: string) =>
  problems.value.find((problem) => problem.id === id);

const addProblemToForm = (problemID: string) => {
  const currentProblems = values.id_problemas || [];
  if (!currentProblems.includes(problemID)) {
    setFieldValue("id_problemas", [...currentProblems, problemID]);
  }

  searchTermProblem.value = "";

  if (filteredProblems.value.length === 0) {
    openProblems.value = false;
  }
};

const handleProblemSelect = (event: { detail: { value: string } }) => {
  if (typeof event.detail.value === "string") {
    addProblemToForm(event.detail.value);
  }
};

const onSubmit = handleSubmit(async (values) => {
  try {
    await updateChange(props.change.id, values);
    toast.success("Se modificó el cambio correctamente");
    emit("submitted");
  } catch (err: any) {
    toast.error(err.message);
  }
});

onMounted(() => {
  fetchItems();
  fetchIncidents();
  fetchProblems();
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
            placeholder="Aumentar almacenamiento"
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
          <Textarea
            placeholder="Detalle el cambio solicitado"
            v-bind="componentField"
          />
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
              <SelectValue placeholder="Seleccione la prioridad del cambio" />
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

    <FormField v-slot="{ componentField }" name="impacto">
      <FormItem>
        <FormLabel>Impacto</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el impacto del cambio" />
            </SelectTrigger>
          </FormControl>
          <SelectContent class="capitalize">
            <SelectGroup>
              <SelectItem
                v-for="impact in formattedImpact"
                :key="impact.value"
                :value="impact.value"
              >
                {{ impact.label }}
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
              <SelectValue placeholder="Seleccione el estado del cambio" />
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

    <FormField v-slot="{ componentField }" name="id_config_items">
      <FormItem>
        <FormLabel>Items afectados</FormLabel>
        <Combobox v-model:open="openItems" :ignore-filter="true">
          <ComboboxAnchor as-child>
            <TagsInput
              :model-value="componentField.modelValue"
              class="px-2 gap-2 w-80"
              @update:model-value="componentField['onUpdate:modelValue']"
            >
              <div class="flex gap-2 flex-wrap items-center">
                <TagsInputItem
                  v-for="itemID in componentField.modelValue"
                  :key="itemID"
                  :value="itemID"
                  class="h-full"
                >
                  <!-- Add v-if condition since ItemOption can't handle undefined -->
                  <ItemOption
                    v-if="getItemById(itemID)"
                    :item="getItemById(itemID)!"
                  />
                  <TagsInputItemDelete />
                </TagsInputItem>
              </div>

              <ComboboxInput
                v-model="searchTermItem"
                as-child
                @click="openItems = true"
              >
                <TagsInputInput
                  placeholder="Items..."
                  class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                  @keydown.enter.prevent
                />
              </ComboboxInput>
            </TagsInput>

            <ComboboxList class="w-[--reka-popper-anchor-width]">
              <ComboboxEmpty />
              <ComboboxGroup>
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
              @update:model-value="componentField['onUpdate:modelValue']"
              class="px-2 gap-2 w-80"
            >
              <div class="flex gap-2 flex-wrap items-center">
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
                v-model="searchTermIncident"
                as-child
                @click="openIncidents = true"
              >
                <TagsInputInput
                  placeholder="Items..."
                  class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                  @keydown.enter.prevent
                />
              </ComboboxInput>
            </TagsInput>

            <ComboboxList class="w-[--reka-popper-anchor-width]">
              <ComboboxEmpty />
              <ComboboxGroup>
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

    <FormField v-slot="{ componentField }" name="id_problemas">
      <FormItem>
        <FormLabel>Problemas relacionados</FormLabel>
        <Combobox v-model:open="openProblems" :ignore-filter="true">
          <ComboboxAnchor as-child>
            <TagsInput
              :model-value="componentField.modelValue"
              @update:model-value="componentField['onUpdate:modelValue']"
              class="px-2 gap-2 w-80"
            >
              <div
                class="flex gap-2 flex-wrap items-center overflow-y-auto max-h-40"
              >
                <TagsInputItem
                  v-for="problemID in componentField.modelValue"
                  :key="problemID"
                  :value="problemID"
                  class="h-full"
                >
                  <ProblemOption
                    v-if="getProblemByID(problemID)"
                    :problem="getProblemByID(problemID)!"
                  />
                  <TagsInputItemDelete />
                </TagsInputItem>
              </div>

              <ComboboxInput
                v-model="searchTermProblem"
                as-child
                @click="openProblems = true"
              >
                <TagsInputInput
                  placeholder="Problemas..."
                  class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                  @keydown.enter.prevent
                />
              </ComboboxInput>
            </TagsInput>

            <ComboboxList class="w-[--reka-popper-anchor-width]">
              <ComboboxEmpty />
              <ComboboxGroup class="max-h-60 overflow-y-auto">
                <ComboboxItem
                  v-for="problem in filteredProblems"
                  :key="problem.id"
                  :value="problem.id"
                  @select.prevent="handleProblemSelect"
                >
                  <ProblemOption :problem="problem" />
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
