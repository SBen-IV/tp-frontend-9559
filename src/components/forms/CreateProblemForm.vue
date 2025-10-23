<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useFilter } from "reka-ui";
import { Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { ConfigItem } from "@/models/config_items";
import { getAllConfigItems } from "@/api/config_items";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ItemOption from "@/components/ItemOption.vue";
import IncidentOption from "@/components/IncidentOption.vue";
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
import { createProblem } from "@/api/problems";
import { problemCreateSchema } from "@/models/problems";
import { priorities } from "@/models/commons";
import router from "@/router";
import { getAllIncidents } from "@/api/incidents";
import type { Incident } from "@/models/incidents";

const items = ref<ConfigItem[]>([]);
const incidents = ref<Incident[]>([]);
const openItems = ref(false);
const openIncidents = ref(false);
const searchItemTerm = ref("");
const searchIncidentTerm = ref("");
const isLoading = ref(false);

const { values, handleSubmit, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(problemCreateSchema),
  initialValues: {
    id_config_items: [],
  },
});

const formattedPriorities = computed(() =>
  priorities.map((priority) => ({
    value: priority,
    label: priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
  })),
);

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

const getItemById = (id: string) => items.value.find((item) => item.id === id)!;

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

const getIncidentById = (id: string) =>
  incidents.value.find((incident) => incident.id === id)!;

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
  const currentIncidents = values.id_incidentes || [];
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

const onSubmit = handleSubmit(async (values) => {
  try {
    await createProblem(values);
    toast.success("Se registró problema correctamente");
    router.push("/problems");
  } catch (err: any) {
    toast.error(err.message);
  }
});

onMounted(() => {
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
            placeholder="VPN no conecta"
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
              <div
                class="flex gap-2 flex-wrap items-center overflow-y-auto max-h-40"
              >
                <TagsInputItem
                  v-for="itemID in componentField.modelValue"
                  :key="itemID"
                  :value="itemID"
                  class="h-full"
                >
                  <ItemOption :item="getItemById(itemID)" />
                  <TagsInputItemDelete />
                </TagsInputItem>
              </div>

              <ComboboxInput
                v-model="searchItemTerm"
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
                  <IncidentOption :incident="getIncidentById(incidentID)" />
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
