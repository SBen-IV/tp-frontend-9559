<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table";
import { Button } from "@/components/ui/button";
import { onMounted, ref, shallowRef } from "vue";
import { RouterLink } from "vue-router";
import type { ConfigItem } from "@/models/config_items";
import { getAllConfigItems } from "@/api/config_items";
import { toast } from "vue-sonner";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { h } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { valueUpdater } from "@/components/ui/table/utils";
import ConfigItemPreview from "@/components/ConfigItemPreview.vue";

const data = shallowRef<ConfigItem[]>([]);
const isLoading = ref(false);

const fetchItems = async () => {
  isLoading.value = true;
  try {
    data.value = await getAllConfigItems();
  } catch (error: any) {
    toast.error(error.message || "Error al cargar los ítems");
    data.value = [];
  } finally {
    isLoading.value = false;
  }
};

const columns: ColumnDef<ConfigItem>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        modelValue:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:modelValue": (value) =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => h("div", row.getValue("nombre")),
  },
  {
    accessorKey: "categoria",
    header: "Categoría",
    cell: ({ row }) =>
      h("div", { class: "capitalize" }, row.getValue("categoria")),
  },
  {
    accessorKey: "version",
    header: "Versión",
    cell: ({ row }) => h("div", row.getValue("version")),
  },
];

const dateToString = (date: Date): String => {
  // For some reason `date` is not a `Date`
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDay();
  return `${year}/${month}/${day}`;
};

const rowSelection = ref({});

const table = useVueTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  onRowSelectionChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, rowSelection),
  state: {
    get rowSelection() {
      return rowSelection.value;
    },
  },
});

onMounted(() => {
  fetchItems();
});
</script>

<template>
  <!-- HACK: there's probably a better way to align this -->
  <div class="flex items-center my-2">
    <h1 class="margin-0">Ítems de Configuración</h1>
    <Button class="ml-auto" size="lg">
      <RouterLink to="/config-items/new">Crear</RouterLink>
    </Button>
  </div>
  <ul class="grid grid-cols-4 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div v-for="item in data" class="grid">
      <li class="grid gap-4">
        <ConfigItemPreview :item="item" />
      </li>
    </div>
  </ul>
  <!-- <template v-for="item in data">
      <Card>
        <CardHeader class="flex">
          <CardTitle>{{ item.nombre }}</CardTitle>
          <CardDescription>{{ item.version }}</CardDescription>
          <Badge>{{ item.categoria }}</Badge>
        </CardHeader>
        <CardContent>
          <div>{{ item.descripcion }}</div>
          <p class="italic text-xs">{{ dateToString(item.fecha_creacion) }}</p>
        </CardContent>
      </Card>
    </template> -->
  <!--  <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <template v-for="row in table.getRowModel().rows" :key="row.id">
            <TableRow :data-state="row.getIsSelected() && 'selected'">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
            <TableRow v-if="row.getIsExpanded()">
              <TableCell :colspan="row.getAllCells().length">
                {{ JSON.stringify(row.original) }}
              </TableCell>
            </TableRow>
          </template>
        </template>

        <TableRow v-else>
          <TableCell :colspan="columns.length" class="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
-->
  <!-- 
  <div class="py-4 mx-2" v-for="item in items">
<Card>

      <CardHeader class="flex">
        <CardTitle>{{ item.nombre }}</CardTitle>
        <CardDescription>{{ item.version }}</CardDescription>
        <Badge>{{ item.categoria }}</Badge>
      </CardHeader>
      <CardContent>
        <div>{{ item.descripcion }}</div>
        <p class="italic text-xs">{{ dateToString(item.fecha_creacion) }}</p>
      </CardContent>
    </Card>
  </div>
--></template>
