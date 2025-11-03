<script setup lang="ts">
import { getUserById } from "@/api/users";
import type { User } from "@/models/users";
import { onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import { CircleUser } from "lucide-vue-next";

const user = ref<User>();
const props = defineProps<{ ownerId: string }>();

const fetchUser = async () => {
  try {
    const userData = await getUserById(props.ownerId);
    user.value = userData;
  } catch (error: any) {
    toast.error(error.message || "Error al cargar owner info");
  }
};

onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div class="flex gap-1 text-sm">
    <CircleUser class="w-4 h-4" />
    <span v-if="user"
      >{{ user.nombre }} {{ user.apellido }} - {{ user.email }}</span
    >
  </div>
</template>
