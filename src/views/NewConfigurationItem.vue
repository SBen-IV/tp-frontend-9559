<script setup lang="ts">
import ConfigurationItemForm from "../components/forms/NewConfigItem.vue";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
</script>

<template>
  <Card class="mx-auto mt-6 max-w-md">
    <CardHeader class="text-center text-xl">
      <CardTitle> Crear un Item de Configuración </CardTitle>
    </CardHeader>
    <CardContent>
      <ConfigurationItemForm />
    </CardContent>
    <CardFooter class="justify-center"> </CardFooter>
  </Card>
</template>
