<script setup lang="ts">
import Layout from "../layout/Layout.vue";
import RegisterForm from "../components/forms/RegisterForm.vue";
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
  <Layout>
    <Card class="mx-auto mt-6 max-w-md" >
      <CardHeader class="text-center text-xl" >
        <CardTitle>
          Crear una cuenta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterForm/>
      </CardContent>
      <CardFooter class="justify-center">
        <Button variant="link"><RouterLink to="/login">Ya tengo cuenta</RouterLink></Button>
      </CardFooter>
    </Card>
  </Layout>
</template>
