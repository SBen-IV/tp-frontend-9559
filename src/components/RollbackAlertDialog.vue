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
import { Button } from "./ui/button";
import { History } from "lucide-vue-next";

defineProps<{ handleRollback: () => void }>();
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <div class="flex">
        <Button variant="secondary" class="relative p-0">
          <History class="w-2 h-4" />
          Restaurar
        </Button>
      </div>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Restaurar versión</AlertDialogTitle>
        <AlertDialogDescription>
          ¿Está seguro que quiere continuar?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction @click="handleRollback">Restaurar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
