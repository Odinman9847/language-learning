<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  background-color: #ffffff;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

nav a {
  font-weight: bold;
  color: #4b4b4b;
  text-decoration: none;
}

nav a + a {
  margin-left: 1rem;
}
</style>
