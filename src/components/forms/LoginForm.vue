<script setup lang="ts">
import { userLoginSchema } from "../../models/users";
// import { loginUser } from "@/api/users";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Input } from "@/components/ui/input";
import router from "@/router/index";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginUser } from "@/api/users";

const { values, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(userLoginSchema),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await loginUser(values);
    toast.success("Bienvenido");
    // router.push('/')
  } catch (err: any) {
    toast.error(err.message);
  }
});
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="john@gmail.com"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="contraseña">
      <FormItem>
        <FormLabel>Contraseña</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button
      :disabled="isSubmitting"
      type="submit"
      class="flex mx-auto bold"
      size="lg"
    >
      <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
      Ingresar
    </Button>
  </form>
</template>
