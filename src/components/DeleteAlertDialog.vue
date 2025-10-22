<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-vue-next";
import { Button } from "./ui/button";

defineProps<{ title: string; handleDelete: () => void }>();
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button variant="destructive"> <Trash2 class="w-2 h-4" />Borrar </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Está por borrar '{{ title }}'</AlertDialogTitle>
        <AlertDialogDescription>
          Esta acción no puede deshacerse.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction @click="handleDelete"
          >Eliminar definitivamente</AlertDialogAction
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
