<script setup lang="ts"></script>

<template>
  <h1>About</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav><RouterLink to="/">Go to Home</RouterLink><br /></nav>
</template>
