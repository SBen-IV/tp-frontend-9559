<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useFilter } from "reka-ui";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { problemEditSchema, type Problem } from "@/models/problems";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
} from "@/components/ui/tags-input";
import {
  FormControl,
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
import { estados as status } from "@/models/problems";
import { priorities } from "@/models/commons";
import { updateProblem } from "@/api/problems";
import type { User } from "@/models/users";
import { getAllUsers } from "@/api/users";
import { getAllIncidents } from "@/api/incidents";
import type { Incident } from "@/models/incidents";
import IncidentOption from "../IncidentOption.vue";
import type { ConfigItem } from "@/models/config_items";
import { getAllConfigItems } from "@/api/config_items";
import ItemOption from "../ItemOption.vue";

const props = defineProps<{ problem: Problem }>();

const emit = defineEmits<{
  // Let parent know the form was submitted
  submitted: [];
}>();

const { values, handleSubmit, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(problemEditSchema),
  initialValues: {
    ...props.problem,
    id_config_items: props.problem.config_items?.map((item) => item.id) || [],
    id_incidentes:
      props.problem.incidentes?.map((incident) => incident.id) || [],
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await updateProblem(props.problem.id, values);
    toast.success("Se agregó la solución correctamente");
    emit("submitted");
  } catch (err: any) {
    toast.error(err.message);
  }
});
</script>

<template>
  <form class="space-y-6" @submit="onSubmit">

    <FormField v-slot="{ componentField }" name="solucion">
      <FormItem>
        <FormLabel>Solución</FormLabel>
        <FormControl>
          <Textarea placeholder="Describa los pasos a tomar para resolver el problema" v-bind="componentField" />
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
      Agregar
    </Button>
  </form>
</template>
