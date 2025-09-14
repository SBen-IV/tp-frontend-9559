<script setup lang="ts"></script>

<template>
  <h1>Not Found :(</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink><br />
    <RouterLink to="/about">Go to About</RouterLink>
  </nav>
</template>
