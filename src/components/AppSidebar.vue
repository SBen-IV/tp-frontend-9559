<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar";
import ModeToggle from "./ModeToggle.vue";

import { Bot, Command, Bug, Cog, RefreshCcw, LogOut } from "lucide-vue-next";
import NavMain from "@/components/NavMain.vue";
import router from "@/router/index";

import NavLink from "@/components/NavLink.vue";
import { RouterLink } from "vue-router";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth";
import { useSidebar } from "@/components/ui/sidebar";

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
});

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Items de Configuración",
      url: "/config-items",
      icon: Cog,
    },
    {
      title: "Incidencias",
      url: "/incidents",
      // TODO: Choose a better icon?
      icon: Bot,
    },
    {
      title: "Problemas",
      url: "/problems",
      icon: Bug,
    },
    {
      title: "Cambios",
      url: "/changes",
      icon: RefreshCcw,
    },
  ],
};

const authStore = useAuthStore();
const handleLogout = async () => {
  authStore.logout();
  router.push("/login");
};

const { open } = useSidebar();
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a href="/" class="flex space-x-6">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <Command class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">ITIL</span>
                <span class="truncate text-xs">Enterprise</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <!--
      <NavLink v-if="!authStore.isLoggedIn" href="/login">Ingresar</NavLink>
      <Button v-if="!authStore.isLoggedIn">
        <RouterLink to="/register">Registrarse</RouterLink>
      </Button> -->
      <Button v-if="authStore.isLoggedIn" @click="handleLogout">
        <!-- Manually handle collapsible sidebar -->
        <LogOut /> {{ open ? "Cerrar sesión" : "" }}</Button
      >
      <ModeToggle />
      <!-- <NavUser :user="data.user" /> -->
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
