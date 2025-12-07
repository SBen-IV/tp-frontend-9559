<script setup lang="ts">
import type { User } from "@/models/users";
import { Badge } from "./ui/badge";
import { UserCheck } from "lucide-vue-next";
import { getBadgeColor } from "@/lib/utils";
import { LIGHT_BLUE, PINK, type Color } from "@/models/colors";

defineProps<{ user: User; isOpen: boolean }>();

const colorsByUserRol: Record<string, Color> = {
  EMPLEADO: PINK,
  CLIENTE: LIGHT_BLUE,
};
</script>

<template>
  <div v-if="isOpen" class="text-center mb-2 text-lg">
    <p class="text-x">{{ user.nombre }} {{ user.apellido }}</p>
    <Badge :class="getBadgeColor(colorsByUserRol, user.rol)">{{
      user.rol
    }}</Badge>
  </div>
  <div v-else class="text-center mb-2">
    <p>{{ user.nombre.charAt(0) }}{{ user.apellido.charAt(0) }}</p>
    <Badge
      class="h-5 min-w-5 rounded-full px-1"
      :class="getBadgeColor(colorsByUserRol, user.rol)"
      >{{ user.rol.charAt(0) }}</Badge
    >
  </div>
</template>
