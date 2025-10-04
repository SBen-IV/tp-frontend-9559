<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Search, ChevronsUpDown, Check } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { computed, onMounted, ref, shallowRef } from "vue";
import { RouterLink } from "vue-router";
import type { ConfigItem } from "@/models/config_items";
import { getAllConfigItems } from "@/api/config_items";
import { toast } from "vue-sonner";
import { Plus } from "lucide-vue-next";
import ConfigItemPreview from "@/components/ConfigItemPreview.vue";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SelectValue,
  Select,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectContent,
} from "@/components/ui/select";
import { useForm } from "vee-validate";
import { cn } from "../lib/utils.ts";
import { categorias, estados } from "@/models/config_items";

const data = shallowRef<ConfigItem[]>([]);
const isLoading = ref(false);
const searchTerms = ref<{ nombre: String }>();
const searchNombre = ref("");

const sortByDate = (fecha1: Date, fecha2: Date) => {
  if (fecha1 < fecha2) {
    return 1;
  }

  if (fecha1 > fecha2) {
    return -1;
  }

  return 0;
};

const sortByName = (nombre1: string, nombre2: string) => {
  if (nombre1 < nombre2) {
    return 1;
  }

  if (nombre1 > nombre2) {
    return -1;
  }

  return 0;
};

const fetchItems = async () => {
  isLoading.value = true;
  try {
    const items: ConfigItem[] = await getAllConfigItems();
    data.value = items.sort((item1, item2) => {
      const res = sortByDate(item1.fecha_creacion, item2.fecha_creacion);
      if (res == 0) {
        return sortByName(item1.nombre, item2.nombre);
      }

      return res;
    });
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los ítems");
    data.value = [];
  } finally {
    isLoading.value = false;
  }
};

// const formattedCategorias = computed(() =>
//   categorias.map((categoria) => ({
//     value: categoria,
//     // label: categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase(),
//     label: categoria,
//   })),
// );

// const { handleSubmit, isSubmitting, setFieldValue } = useForm({
//   validationSchema: searchTerms,
//   initialValues: {
//     nombre: "",
//     version: "",
//     categoria: "",
//     estado: "",
//   },
// });

// const onSubmit = handleSubmit(async (values) => {
//   console.log(values);
//   toast.success(values);
// });

const filteredItems = async () => {
  return data.value.filter((item) => {
    item.nombre.toLowerCase().includes(searchNombre.value.toLowerCase());
  });
};

onMounted(() => {
  fetchItems();
});
</script>

<template>
  <!-- HACK: there's probably a better way to align this -->
  <div class="flex items-center my-2">
    <h1 class="margin-0">Ítems de Configuración</h1>
    <Button class="ml-auto">
      <RouterLink to="/config-items/new" class="flex">
        <Plus class="w-2 h-4 mr-2" />Crear</RouterLink
      >
    </Button>
  </div>
  <!--
  <form
    @submit="onSubmit"
    class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 flex py-6"
  >
    <FormField v-slot="{ componentField }" name="nombre">
      <FormItem>
        <FormLabel>Nombre</FormLabel>
        <Input
          id="search-nombre"
          type="text"
          placeholder="Buscar por nombre..."
          v-bind="componentField"
        />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="version">
      <FormItem>
        <FormLabel>Versión</FormLabel>
        <Input
          id="search-version"
          type="text"
          placeholder="Buscar por versión..."
          v-bind="componentField"
        />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="categoria">
      <FormItem>
        <FormLabel>Categoría</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione la categoría..." />
            </SelectTrigger>
          </FormControl>
          <SelectContent class="capitalize">
            <SelectGroup>
              <SelectItem
                v-for="categoria in formattedCategorias"
                :key="categoria.value"
                :value="categoria.value"
              >
                {{ categoria.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
-->
  <!--
        <Combobox by="label">
          <FormControl>
            <ComboboxAnchor>
              <div class="relative w-full max-w-sm items-center">
                <ComboboxInput
                  :display-value="(val) => val?.label ?? ''"
                  placeholder="Seleccione categoría..."
                />
                <ComboboxTrigger
                  class="absolute end-0 inset-y-0 flex items-center justify-center px-3"
                >
                  <ChevronsUpDown class="size-4 text-muted-foreground" />
                </ComboboxTrigger>
              </div>
            </ComboboxAnchor>
          </FormControl>
          <ComboboxList>
            <ComboboxEmpty> No hay categorías. </ComboboxEmpty>

            <ComboboxGroup>
              <ComboboxItem
                v-for="categoria in categorias"
                :key="categoria.value"
                :value="categoria"
                @select="
                  () => {
                    setFieldValue('categoria', categoria.value);
                  }
                "
              >
                {{ categoria.label }}
                <ComboboxItemIndicator>
                  <Check :class="cn('ml-auto h-4 w-4')" />
                </ComboboxItemIndicator>
              </ComboboxItem>
            </ComboboxGroup>
          </ComboboxList>
        </Combobox>
      </FormItem>
    </FormField>
    <FormField name="estado">
      <FormItem>
        <FormLabel>Estado</FormLabel>
        <Combobox by="label">
          <FormControl>
            <ComboboxAnchor>
              <div class="relative w-full max-w-sm items-center">
                <ComboboxInput
                  :display-value="(val) => val?.label ?? ''"
                  placeholder="Seleccione estado..."
                />
                <ComboboxTrigger
                  class="absolute end-0 inset-y-0 flex items-center justify-center px-3"
                >
                  <ChevronsUpDown class="size-4 text-muted-foreground" />
                </ComboboxTrigger>
              </div>
            </ComboboxAnchor>
          </FormControl>
          <ComboboxList>
            <ComboboxEmpty> No hay estados. </ComboboxEmpty>

            <ComboboxGroup>
              <ComboboxItem
                v-for="estado in estados"
                :key="estado.value"
                :value="estado"
                @select="
                  () => {
                    setFieldValue('estado', estado.value);
                  }
                "
              >
                {{ estado.label }}
                <ComboboxItemIndicator>
                  <Check :class="cn('ml-auto h-4 w-4')" />
                </ComboboxItemIndicator>
              </ComboboxItem>
            </ComboboxGroup>
          </ComboboxList>
        </Combobox>
      </FormItem>
    </FormField>
-->
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 flex py-6">
    <div>
      <b>Nombre</b>
      <Input
        id="search"
        type="text"
        placeholder="Buscar por nombre..."
        v-model="searchNombre"
      />
    </div>
    <div>
      <b>Versión</b>
      <Input id="search" type="text" placeholder="Buscar por versión..." />
    </div>
    <div>
      <b>Categoría</b>
      <Combobox by="label"></Combobox>
    </div>
    <div>
      <b>Estado</b>
      <Combobox by="label"></Combobox>
    </div>
  </div>
  <!--
    <Button
      :disabled="isSubmitting"
      type="submit"
      class="flex mx-auto bold"
      size="lg"
      >Buscar</Button
    >
  </form>
  -->
  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
    <div v-for="item in data" class="grid">
      <li class="grid gap-4">
        <ConfigItemPreview :item="item" />
      </li>
    </div>
  </ul>
</template>
