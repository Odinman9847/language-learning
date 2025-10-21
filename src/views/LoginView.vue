<script setup lang="ts">
import { supabase } from '@/supabase.ts'

async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  if (error) {
    console.error('Error logging in with Google.', error.message)
  }
}
</script>

<template>
  <div>
    <h1>Login Page</h1>
    <p>Users will log in from this page.</p>
    <button @click="signInWithGoogle">Login with Google</button>
  </div>
</template>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}
</style>
