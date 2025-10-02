<script setup lang="ts"></script>

<template>
  <h1>Not Found :(</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav><RouterLink to="/">Go back Home</RouterLink><br /></nav>
</template>
