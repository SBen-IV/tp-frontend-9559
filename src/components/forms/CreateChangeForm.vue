<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useFilter } from "reka-ui";
import { Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { ConfigItem } from "@/models/config_items";
import { changeCreateSchema } from "../../models/changes";
import { getAllConfigItems } from "@/api/config_items";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ItemOption from "@/components/ItemOption.vue";
import IncidentOption from "../IncidentOption.vue";
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
import { createChange } from "@/api/changes";
import { priorities, impactos } from "@/models/commons";
import router from "@/router";
import type { Incident } from "@/models/incidents";
import { getAllIncidents } from "@/api/incidents";

const items = ref<ConfigItem[]>([]);
const incidents = ref<Incident[]>([]);
const openItems = ref(false);
const openIncidents = ref(false);
const searchTermItem = ref("");
const searchTermIncident = ref("");
const isLoading = ref(false);

const { values, handleSubmit, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(changeCreateSchema),
  initialValues: {
    id_config_items: [],
    id_incidentes: [],
  },
});

const formattedPriorities = computed(() =>
  priorities.map((priority) => ({
    value: priority,
    label: priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
  })),
);

const formattedImpactos = computed(() =>
  impactos.map((impacto) => ({
    value: impacto,
    label: impacto.charAt(0).toUpperCase() + impacto.slice(1).toLowerCase(),
  })),
);

const filteredItems = computed(() => {
  const currentItems = values.id_config_items || [];
  const { contains } = useFilter({ sensitivity: "base" });

  const availableItems = items.value.filter(
    (i) => !currentItems.includes(i.id),
  );

  return searchTermItem.value
    ? availableItems.filter((item) =>
        contains(item.nombre, searchTermItem.value),
      )
    : availableItems;
});

const fetchItems = async () => {
  isLoading.value = true;
  try {
    items.value = await getAllConfigItems();
    incidents.value = await getAllIncidents();
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los ítems");
    items.value = [];
    incidents.value = [];
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

const filteredIncidents = computed(() => {
  const currentIncidents = values.id_incidentes || [];
  const { contains } = useFilter({ sensitivity: "base" });

  const availableIncidents = incidents.value.filter(
    (i) => !currentIncidents.includes(i.id),
  );

  return searchTermIncident.value
    ? availableIncidents.filter((incident) =>
        contains(incident.titulo, searchTermIncident.value),
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

const onSubmit = handleSubmit(async (values) => {
  try {
    await createChange(values);
    toast.success("Se solicitó el cambio correctamente");
    router.push("/changes");
  } catch (err: any) {
    toast.error(err.message);
  }
});

onMounted(() => {
  fetchItems();
});
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
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
                v-for="impacto in formattedImpactos"
                :key="impacto.value"
                :value="impacto.value"
              >
                {{ impacto.label }}
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
              @update:model-value="componentField['onUpdate:modelValue']"
              class="px-2 gap-2 w-80"
            >
              <div class="flex gap-2 flex-wrap items-center">
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
                  <IncidentOption :incident="getIncidentById(incidentID)!" />
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
