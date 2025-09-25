<script setup lang='ts'>
import { Button } from '@/components/ui/button'
import  ModeToggle  from '@/components/ModeToggle.vue'
import { useCookies } from "vue3-cookies";

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
      <ul class="flex space-x-4">
        <Button variant='link' class='hover:no-underline'>
        <li>
          <a href="/" class="text-foreground hover:text-primary">Home</a>
        </li>
        </Button>

        <Button variant='link' class='hover:no-underline'>
        <li>
          <a href="/login" class="text-foreground hover:text-primary">Ingresar</a>
        </li>
        </Button>

        <li>
        <Button>
          <a href="/register" >Registrarse</a>
        </Button>
        </li>
      <ModeToggle/>
      </ul>
    </nav>
  </header>
</template>
