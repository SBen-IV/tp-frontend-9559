<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';

defineProps<{ href: string }>();

</script>

<template>
    <Button variant='link' class='hover:no-underline'>
      <RouterLink :to="href" class='text-foreground hover:text-primary'>
      <slot/>
      </RouterLink>
    </Button>
</template>