<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { changeCreateSchema } from "../../models/changes";
import { changePriority } from "../../models/changes";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  TagsInputItemText,
} from "@/components/ui/tags-input";
import { Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Input } from "@/components/ui/input";
import router from "@/router/index";
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
import { loginUser } from "@/api/users";
import { useFilter } from "reka-ui";
import ItemOption from "@/components/ItemOption.vue";

const { values, handleSubmit, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(changeCreateSchema),
  initialValues: {
    config_items: [],
  },
});

function onSuccess(values: any) {
  console.log("values", values);
}

function onInvalidSubmit({ values, errors, results }) {
  console.log(values);
  console.log(errors);
  console.log(results);
}

const onSubmit = handleSubmit(onSuccess, onInvalidSubmit);

const formattedPriorities = computed(() => {
  return changePriority.map((priority) => ({
    value: priority,
    label: priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
  }));
});

const items = [
  {
    id: "5df45a8a-46e1-472f-8dbc-74c7c15b32b6",
    categoria: "HARDWARE",
    nombre: "Teclado",
    version: "1",
  },
  {
    id: "93b5251b-640c-4402-876b-3f8492cdc610",
    categoria: "HARDWARE",
    nombre: "Monitor",
    version: "12",
  },
  {
    id: "7bcb154c-8be9-47bb-932e-9edffd1e0864",
    categoria: "SOFTWARE",
    nombre: "OS",
    version: "5",
  },
  {
    id: "f2bbd459-4cf8-4c44-b463-0e3e3955909c",
    categoria: "DOCUMENTACION",
    nombre: "Manual de Uso",
    version: "LLY",
  },
];

const open = ref(false);
const searchTerm = ref("");

const { contains } = useFilter({ sensitivity: "base" });
const filteredItems = computed(() => {
  const currentItems = values.config_items || [];
  const options = items.filter((i) => !currentItems.includes(i.id));
  return searchTerm.value
    ? options.filter((option) => contains(option.nombre, searchTerm.value))
    : options;
});

const getItemByID = (id: string) => {
  return items.find((item) => item.id === id);
};

const addItemToForm = (itemId: string) => {
  const currentItems = values.config_items || [];
  if (!currentItems.includes(itemId)) {
    setFieldValue("config_items", [...currentItems, itemId]);
  }
  searchTerm.value = "";
  if (filteredItems.value.length === 0) {
    open.value = false;
  }
};
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

    <FormField v-slot="{ componentField }" name="config_items">
      <FormItem>
        <FormLabel>Items afectados</FormLabel>

        <Combobox v-model:open="open" :ignore-filter="true">
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
                  <ItemOption :item="getItemByID(itemID)" />
                  <TagsInputItemDelete />
                </TagsInputItem>
              </div>

              <ComboboxInput
                v-model="searchTerm"
                as-child
                @click="() => (open = true)"
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
                  @select.prevent="(ev: { detail: { value: string } }) => {
                    if (typeof ev.detail.value === 'string') {
                      addItemToForm(ev.detail.value)
                    }
                  }"
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
