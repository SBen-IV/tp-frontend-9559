<script setup lang="ts">
import { getUserById } from "@/api/users";
import type { User } from "@/models/users";
import { onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import { UserCheck } from "lucide-vue-next";

const user = ref<User | null>();
const props = defineProps<{ responsableId: string | null}>();

const fetchUser = async () => {
  if (!props.responsableId) {
    user.value = null;
    return;
  }

  try {
    const userData = await getUserById(props.responsableId);
    user.value = userData;
  } catch (error: any) {
    toast.error(error.message || "Error al cargar la info del empleado asignado");
  }
};

onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div v-if="user" class="flex gap-1 text-sm">
    <UserCheck class="w-4 h-4" />
    <span
      >{{ user.nombre }} {{ user.apellido }} - {{ user.email }}</span
    >
  </div>
  <div v-else class="text-red-500 flex gap-1 text-sm">
    <UserCheck class="w-4 h-4" /> No hay responsable asignado
  </div>
</template>
