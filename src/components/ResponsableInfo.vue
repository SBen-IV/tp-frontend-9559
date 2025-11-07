<script setup lang="ts">
import { getUserById } from "@/api/users";
import type { User } from "@/models/users";
import { ref, onMounted } from "vue";
import { toast } from "vue-sonner";
import { UserCheck, Loader2 } from "lucide-vue-next";

const user = ref<User | null>(null);
const isLoading = ref(true);
const props = defineProps<{ responsableId: string | null}>();

const fetchUser = async () => {
  if (!props.responsableId) {
    user.value = null;
    setTimeout(() => {
      isLoading.value = false;
    }, 100);
    return;
  }

  isLoading.value = true;
  
  try {
    const userData = await getUserById(props.responsableId);
    user.value = userData;
  } catch (error: any) {
    toast.error(error.message || "Error al cargar la info del empleado asignado");
    user.value = null;
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 100);
  }
};

onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div v-if="isLoading">
    <Loader2 class="w-4 h-4 animate-spin" />
  </div>
  
  <div v-else-if="user" class="flex gap-1 text-sm items-center">
    <UserCheck class="w-4 h-4" />
    <span>{{ user.nombre }} {{ user.apellido }} - {{ user.email }}</span>
  </div>
  <div v-else class="text-red-500 flex gap-1 text-sm items-center">
    <UserCheck class="w-4 h-4" /> No hay responsable asignado
  </div>
</template>