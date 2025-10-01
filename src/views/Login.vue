<script setup lang="ts">
import LoginForm from "../components/forms/LoginForm.vue";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
</script>

<template>
  <Card class="mx-auto mt-6 max-w-md">
    <CardHeader class="text-center text-xl">
      <CardTitle> Ingresar </CardTitle>
    </CardHeader>
    <CardContent>
      <LoginForm />
    </CardContent>
    <CardFooter class="justify-center">
      <Button variant="link"
        ><RouterLink to="/register">No tengo cuenta</RouterLink></Button
      >
    </CardFooter>
  </Card>
</template>
