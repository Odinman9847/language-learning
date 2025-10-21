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
        <span>{{ store.user.email }}</span>
        <button @click="handleLogout">Logout</button>
      </div>
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
  background-color: #ff4b4b;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
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
