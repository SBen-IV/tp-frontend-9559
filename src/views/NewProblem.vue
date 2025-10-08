<script setup lang="ts">
import CreateProblemForm from "@/components/forms/CreateProblemForm.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
</script>

<template>
  <Card class="mx-auto mt-6 max-w-md">
    <CardHeader class="text-center text-xl">
      <CardTitle> Registrar un nuevo problema </CardTitle>
    </CardHeader>
    <CardContent>
      <CreateProblemForm />
    </CardContent>
  </Card>
</template>
