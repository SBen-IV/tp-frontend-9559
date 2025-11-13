<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { BrushCleaning } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { computed, onMounted, reactive, ref, shallowRef } from "vue";
import { RouterLink } from "vue-router";
import type { ConfigItem } from "@/models/config_items";
import { getAllConfigItems } from "@/api/config_items";
import { toast } from "vue-sonner";
import { Plus } from "lucide-vue-next";
import ConfigItemPreview from "@/components/ConfigItemPreview.vue";
import {
  SelectValue,
  Select,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectContent,
} from "@/components/ui/select";
import { categorias, estados } from "@/models/config_items";
import { mapToMetric, sortByDate, sortByName } from "@/lib/utils";
import type { ConfigItemMetric } from "@/models/metrics";
import {
  BLUE,
  GREEN,
  LIGHT_BLUE,
  LIGHT_GREEN,
  PINK,
  VIOLET,
  YELLOW,
  type Color,
} from "@/models/colors";
import CustomPieChart from "@/components/CustomPieChart.vue";
import TextMetrics from "@/components/TextMetrics.vue";

const data = shallowRef<ConfigItem[]>([]);
const metricsData = reactive<ConfigItemMetric>({
  total: 0,
  byEstado: [],
  byCategoria: [],
});
const isLoading = ref(false);
const searchNombre = ref("");
const searchVersion = ref("");
const searchCategoria = ref("");
const searchEstado = ref("");

const colorsByCategoria: Record<string, Color> = {
  SOFTWARE: PINK,
  HARDWARE: VIOLET,
  DOCUMENTACION: BLUE,
};

const colorsByEstado: Record<string, Color> = {
  PLANEADO: PINK,
  ENCARGADO: VIOLET,
  EN_CREACION: BLUE,
  EN_PRUEBA: LIGHT_BLUE,
  EN_ALMACEN: GREEN,
  EN_PRODUCCION: LIGHT_GREEN,
  EN_MANTENIMIENTO: YELLOW,
};

const calculateMetrics = (items: ConfigItem[]) => {
  const byEstado: Map<string, number> = new Map();
  const byCategoria: Map<string, number> = new Map();

  items.forEach((item: ConfigItem) => {
    const valueEstado: number | undefined = byEstado.get(item.estado)
      ? byEstado.get(item.estado)! + 1
      : 1;

    byEstado.set(item.estado, valueEstado);

    const valueCategoria: number | undefined = byCategoria.get(item.categoria)
      ? byCategoria.get(item.categoria)! + 1
      : 1;

    byCategoria.set(item.categoria, valueCategoria);
  });

  metricsData.total = items.length;
  metricsData.byEstado = mapToMetric(byEstado);
  metricsData.byCategoria = mapToMetric(byCategoria);
};

const fetchItems = async () => {
  isLoading.value = true;
  try {
    const items: ConfigItem[] = await getAllConfigItems();
    calculateMetrics(items);
    data.value = items.sort((item1, item2) => {
      const res = sortByDate(item1.fecha_creacion, item2.fecha_creacion);

      return res != 0 ? res : sortByName(item1.nombre, item2.nombre);
    });
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los ítems");
    data.value = [];
  } finally {
    isLoading.value = false;
  }
};

const formattedCategorias = computed(() =>
  categorias.map((categoria) => ({
    value: categoria,
    label: categoria,
  })),
);

const formattedEstados = computed(() =>
  estados.map((estado) => ({
    value: estado,
    label:
      estado.charAt(0).toUpperCase() +
      estado.replace("_", " ").slice(1).toLowerCase(),
  })),
);

const filteredItems = computed(() => {
  let filters: ((item: ConfigItem) => boolean)[] = [];

  if (searchNombre.value !== "") {
    filters.push((item: ConfigItem) => {
      return item.nombre
        .toLowerCase()
        .includes(searchNombre.value.toLowerCase());
    });
  }

  if (searchVersion.value !== "") {
    filters.push((item: ConfigItem) => {
      return item.version
        .toLowerCase()
        .includes(searchVersion.value.toLowerCase());
    });
  }

  if (searchCategoria.value !== "") {
    filters.push((item: ConfigItem) => {
      return item.categoria == searchCategoria.value;
    });
  }

  if (searchEstado.value !== "") {
    filters.push((item: ConfigItem) => {
      return item.estado == searchEstado.value;
    });
  }

  return data.value.filter((item: ConfigItem) => {
    let isItemFiltered = true;
    for (let i = 0; i < filters.length; i++) {
      isItemFiltered = isItemFiltered && filters[i](item);
    }

    return isItemFiltered;
  });
});

const resetSearch = () => {
  searchNombre.value = "";
  searchVersion.value = "";
  searchCategoria.value = "";
  searchEstado.value = "";
};

const handleChangesUpdated = () => {
  fetchItems();
};

onMounted(() => {
  fetchItems();
});
</script>

<template>
  <h1 class="text-6xl text-center font-bold mb-2">Items de configuración</h1>
  <div class="flex items-center my-2">
    <Button class="ml-auto">
      <RouterLink to="/config-items/new" class="flex">
        <Plus class="w-2 h-4 mr-2" />Crear</RouterLink
      >
    </Button>
  </div>
  <TextMetrics :total="metricsData.total" />
  <div class="grid grid-cols-3 gap-8 flex items-center">
    <CustomPieChart
      :title="'Por estados'"
      :metrics="metricsData.byEstado"
      :colors="colorsByEstado"
    />
    <CustomPieChart
      :title="'Por categorías'"
      :metrics="metricsData.byCategoria"
      :colors="colorsByCategoria"
    />
  </div>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 flex py-6">
    <div>
      <b>Nombre</b>
      <Input
        id="searchNombre"
        type="text"
        placeholder="Buscar por nombre..."
        v-model="searchNombre"
      />
    </div>
    <div>
      <b>Versión</b>
      <Input
        id="searchVersion"
        type="text"
        placeholder="Buscar por versión..."
        v-model="searchVersion"
      />
    </div>
    <div>
      <b>Categoría</b>
      <Select v-model="searchCategoria">
        <SelectTrigger>
          <SelectValue placeholder="Buscar por categoría..." />
        </SelectTrigger>
        <SelectContent class="capitalize">
          <SelectGroup>
            <SelectItem
              v-for="categoria in formattedCategorias"
              :key="categoria.value"
              :value="categoria.value"
              >{{ categoria.label }}</SelectItem
            >
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div>
      <b>Estado</b>
      <Select v-model="searchEstado">
        <SelectTrigger>
          <SelectValue placeholder="Buscar por estado..." />
        </SelectTrigger>
        <SelectContent class="capitalize">
          <SelectGroup>
            <SelectItem
              v-for="estado in formattedEstados"
              :key="estado.value"
              :value="estado.value"
              >{{ estado.label }}</SelectItem
            >
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div class="pt-6">
      <Button @click="resetSearch()"><BrushCleaning /> Limpiar filtro</Button>
    </div>
  </div>
  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
    <div v-for="item in filteredItems" class="grid">
      <li class="grid gap-4">
        <ConfigItemPreview
          :item="item"
          @config-item-updated="handleChangesUpdated"
        />
      </li>
    </div>
  </ul>
</template>
