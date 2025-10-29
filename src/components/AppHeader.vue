<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore.ts'
import { supabase } from '@/supabase.ts'

const store = useUserStore()

async function handleLogout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error logging out:', error.message)
  }
}
</script>

<template>
  <header class="app-header">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink v-if="!store.user" to="/login">Login</RouterLink>
      <div v-else class="user-info">
        <RouterLink to="/account">Account</RouterLink>
        <button @click="handleLogout">Logout</button>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--test-light);
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border-light);
  box-shadow: 0 2px 4px var(--shadow-color);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info button {
  background-color: var(--red-incorrect);
  color: var(--text-light);
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

nav a {
  font-weight: bold;
  color: var(--text-dark);
  text-decoration: none;
  padding: 8px;
}

nav a + a {
  margin-left: 1rem;
}
</style>
