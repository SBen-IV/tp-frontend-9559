<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { incidentEditSchema, type Incident } from "../../models/incidents";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ItemOption from "@/components/ItemOption.vue";
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
import { incidentStatus as status } from "@/models/incidents";
import { priorities } from "@/models/commons";
import { incidentCategory } from "@/models/incidents";
import { updateIncident } from "@/api/incidents";
import type { User } from "@/models/users";
import { getAllUsers } from "@/api/users";
import { useFilter } from "reka-ui";
import type { ConfigItem } from "@/models/config_items";
import { getAllConfigItems } from "@/api/config_items";

const props = defineProps<{ incident: Incident }>();

const users = ref<User[]>([]);
const isLoading = ref(false);
const items = ref<ConfigItem[]>([]);
const open = ref(false);
const searchTerm = ref("");

const emit = defineEmits<{
  // Let parent know the form was submitted
  submitted: [];
}>();

const { values, handleSubmit, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(incidentEditSchema),
  initialValues: {...props.incident, id_config_items: props.incident.config_items.map(item => item.id)},
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

const filteredItems = computed(() => {
  const currentItems = values.id_config_items || [];
  console.log("current items: ", currentItems)
  const { contains } = useFilter({ sensitivity: "base" });
  const availableItems = items.value.filter(
    (i) => !currentItems.includes(i.id),
  );
  return searchTerm.value
    ? availableItems.filter((item) => contains(item.nombre, searchTerm.value))
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
  searchTerm.value = "";
  if (filteredItems.value.length === 0) {
    open.value = false;
  }
};

const handleItemSelect = (event: { detail: { value: string } }) => {
  if (typeof event.detail.value === "string") {
    addItemToForm(event.detail.value);
  }
};

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    users.value = await getAllUsers("EMPLEADO");
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los ítems");
    users.value = [];
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = handleSubmit(async (values) => {
  try {
    await updateIncident(props.incident.id, values)
    toast.success("Se modificó el incidente correctamente");
    emit('submitted');
  } catch (err: any) {
    toast.error(err.message);
  }
});

onMounted(() => {
  fetchUsers();
  fetchItems();
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

    <FormField v-slot="{ componentField }" name="categoria">
      <FormItem>
        <FormLabel>Categoría</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione la categoría del incidente" />
            </SelectTrigger>
          </FormControl>
          <SelectContent class="capitalize">
            <SelectGroup>
              <SelectItem
                v-for="category in incidentCategory"
                :key="category"
                :value="category"
              >
                {{ category }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="prioridad">
      <FormItem>
        <FormLabel>Prioridad</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione la prioridad del incidente" />
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
              <SelectValue placeholder="Seleccione el estado del incidente" />
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
        <FormLabel>Items afectados</FormLabel>
        <Combobox v-model:open="open" :ignore-filter="true">
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
                  <ItemOption v-if="getItemById(itemID)" :item="getItemById(itemID)" />
                  <TagsInputItemDelete />
                </TagsInputItem>
              </div>

              <ComboboxInput v-model="searchTerm" as-child @click="open = true">
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
