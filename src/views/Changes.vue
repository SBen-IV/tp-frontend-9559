<script setup lang="ts">
import Layout from "../layout/Layout.vue";
import CreateChangeForm from "../components/forms/CreateChangeForm.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
