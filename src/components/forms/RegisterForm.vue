<script setup lang="ts">
import { userCreateSchema } from "../../models/users";
import { createUser } from "@/api/users";
import { loginUser } from "@/api/users";
import router from "@/router/index";
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Button } from '@/components/ui/button'
import { Loader2 } from "lucide-vue-next"
import { toast } from "vue-sonner"
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const { values, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(userCreateSchema)
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await createUser(values)
    toast.success('Te registraste correctamente')
    loginUser(values)
    router.push('/')
  } catch (err: any) {
    toast.error(err.message)
  }
})


</script>

<template>
  <form @submit="onSubmit" class="space-y-6">

    <div class="flex justify-between items-start">
      <FormField v-slot="{ componentField }" name="nombre">
        <FormItem>
          <FormLabel>Nombre</FormLabel>
          <FormControl>
            <Input type="text" placeholder="John" v-bind="componentField"></Input>
          </FormControl>
          <FormMessage class="whitespace-normal break-words" />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="apellido">
        <FormItem>
          <FormLabel>Apellido</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Doe" v-bind="componentField"></Input>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="text" placeholder="john@gmail.com" v-bind="componentField" />
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

    <FormField v-slot="{ componentField }" name="rol">
      <FormItem>
        <FormLabel>Rol</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione su rol" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="CLIENTE">
                Cliente
              </SelectItem>
              <SelectItem value="EMPLEADO">
                Empleado
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button :disabled="isSubmitting" type="submit" class="flex mx-auto bold" size="lg">
      <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
      Registrar
    </Button>
  </form>

  
</template>
