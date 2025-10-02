<script setup lang="ts">
import CreateChangeForm from "../components/forms/CreateChangeForm.vue";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

</script>

<template>
    <Card class="mx-auto mt-6 max-w-md" >
      <CardHeader class="text-center text-xl" >
        <CardTitle>
          Solicitar Cambio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CreateChangeForm/>
      </CardContent>
    </Card>
</template>
