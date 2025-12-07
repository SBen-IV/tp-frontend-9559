<script setup lang="ts">
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ModeToggle.vue";
import NavLink from "@/components/NavLink.vue";
import { useAuthStore } from "@/stores/auth";
import router from "@/router/index";
import { useUserStore } from "@/stores/user";

const authStore = useAuthStore();
const userStore = useUserStore();
console.log("is user logged in? ", authStore.isLoggedIn);

const handleLogout = async () => {
  authStore.logout();
  userStore.unset();
  router.push("/");
};
</script>

<template>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ITIL</title>
  </head>
  <header class="bg-base text-foreground border-b">
    <nav class="flex justify-between items-center p-4">
      <a href="/" class="text-2xl font-bold">ITIL</a>
      <div class="flex space-x-4">
        <NavLink href="/">Home</NavLink>
        <NavLink v-if="!authStore.isLoggedIn" href="/login">Ingresar</NavLink>
        <Button v-if="!authStore.isLoggedIn">
          <RouterLink to="/register">Registrarse</RouterLink>
        </Button>
        <Button v-else @click="handleLogout"> Cerrar sesión </Button>
        <ModeToggle />
      </div>
    </nav>
  </header>
</template>
