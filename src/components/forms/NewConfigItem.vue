<script setup lang="ts">
import { userCreateSchema } from "../../models/users";
import { configItemCreateSchema } from "../../models/config_items.ts";
import { createUser } from "@/api/users";
import { loginUser } from "@/api/users";
import router from "@/router/index";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Input, TextArea } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createConfigItem } from "@/api/config_items.ts";

const { values, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(configItemCreateSchema),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const configItem = await createConfigItem(values);
    console.log(configItem);
    toast.success("Item de configuración creado correctamente");
    // TODO: on next ticket
    // It should redirect to the view of the config item,
    // router.push(`/config-item/${configItem.data.id}`);
  } catch (err: any) {
    toast.error(err.message);
  }
});
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
    <FormField v-slot="{ componentField }" name="nombre">
      <FormItem>
        <FormLabel>Nombre</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Windows"
            v-bind="componentField"
          ></Input>
        </FormControl>
        <FormMessage class="whitespace-normal break-words" />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="descripcion">
      <FormItem>
        <FormLabel>Descripción</FormLabel>
        <FormControl>
          <TextArea
            type="text"
            placeholder="Sistema operativo..."
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="version">
      <FormItem>
        <FormLabel>Versión</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="1.0.0"
            v-bind="componentField"
          ></Input>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="categoria">
      <FormItem>
        <FormLabel>Categoría</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione la categoría" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="SOFTWARE">Software</SelectItem>
              <SelectItem value="HARDWARE">Hardware</SelectItem>
              <SelectItem value="DOCUMENTACION">Documentación</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
      Crear
    </Button>
  </form>
</template>
