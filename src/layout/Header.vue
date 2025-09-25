<script setup lang='ts'>
import { Button } from '@/components/ui/button'
import ModeToggle from '@/components/ModeToggle.vue'
import { useCookies } from "vue3-cookies";
import NavLink from '@/components/NavLink.vue';

const { cookies } = useCookies();
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
        <NavLink href="/login">Ingresar</NavLink>
        <Button>
          <a href="/register">Registrarse</a>
        </Button>
        <ModeToggle />
      </div>
    </nav>
  </header>
</template>
