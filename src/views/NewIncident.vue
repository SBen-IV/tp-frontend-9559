<script setup lang="ts">
import CreateIncidentForm from "../components/forms/CreateIncidentForm.vue";
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
          Registrar un nuevo incidente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CreateIncidentForm/>
      </CardContent>
    </Card>
</template>
