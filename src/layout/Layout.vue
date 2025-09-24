<script setup lang="ts">
import Header from "./Header.vue";
import Footer from "./Footer.vue";
</script>

<template>
  <Header />
  <slot class='bg-black'/>
  <Footer />
</template>
