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

const props = defineProps<{ incident: Incident }>();

const users = ref<User[]>([]);
const isLoading = ref(false);

const emit = defineEmits<{
  // Let parent know the form was submitted
  submitted: [];
}>();

const { values, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(incidentEditSchema),
  initialValues: props.incident,
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
  isLoading.value = true;
  try {
    // users.value = await getAllUsers("EMPLEADO");
    // As the endpoint does not exist yet, use some mocked data
    users.value = [
      {
        nombre: "Bob",
        apellido: "Smith",
        email: "bob@company.com",
        rol: "EMPLEADO",
        id: "25a9468f-c18d-4d6b-993a-6719056437e9",
      },
      {
        nombre: "Carl",
        apellido: "Johnson",
        email: "carl@company.com",
        rol: "EMPLEADO",
        id: "4070b8fd-6145-46aa-b0e5-26e2677e9c3d",
      },
    ];
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
