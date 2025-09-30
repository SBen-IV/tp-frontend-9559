<script setup lang="ts">
import Layout from "../layout/Layout.vue";
import ConfigurationItemForm from "../components/forms/NewConfigItem.vue";
// import RegisterForm from "../components/forms/RegisterForm.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
</script>

<template>
  <Layout>
    <Card class="mx-auto mt-6 max-w-md">
      <CardHeader class="text-center text-xl">
        <CardTitle> Crear un Item de Configuración </CardTitle>
      </CardHeader>
      <CardContent>
        <ConfigurationItemForm />
      </CardContent>
      <CardFooter class="justify-center"> </CardFooter>
    </Card>
  </Layout>
</template>
