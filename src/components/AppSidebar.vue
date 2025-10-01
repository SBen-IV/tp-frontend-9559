<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Bug,
  Cog,
  RefreshCcw,
} from "lucide-vue-next";
import NavMain from "@/components/NavMain.vue";
import NavProjects from "@/components/NavProjects.vue";
import NavUser from "@/components/NavUser.vue";
import TeamSwitcher from "@/components/TeamSwitcher.vue";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

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
      url: "#",
      icon: Cog,
      isActive: true,
      items: [
        {
          title: "Crear",
          url: "/config-items/new",
        },
        {
          title: "Consultar",
          url: "/config-items",
        },
      ],
    },
    {
      title: "Incidencias",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Crear",
          url: "#",
        },
        {
          title: "Consultar",
          url: "#",
        },
      ],
    },
    {
      title: "Problemas",
      url: "#",
      icon: Bug,
      isActive: true,
      items: [
        {
          title: "Crear",
          url: "#",
        },
        {
          title: "Consultar",
          url: "#",
        },
      ],
    },
    {
      title: "Cambios",
      url: "#",
      icon: RefreshCcw,
      isActive: true,
      items: [
        {
          title: "Crear",
          url: "#",
        },
        {
          title: "Consultar",
          url: "#",
        },
      ],
    },
  ],
};
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
      <!-- <NavUser :user="data.user" /> -->
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
