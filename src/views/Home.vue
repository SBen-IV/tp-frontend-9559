<script setup lang="ts"></script>

<template>
  <h1>Home</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/about">Go to About</RouterLink>
  </nav>
</template>
