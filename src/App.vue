<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { supabase } from '@/supabase.ts'
import { useUserStore } from '@/stores/userStore'

const store = useUserStore()

supabase.auth.onAuthStateChange((event, session) => {
  store.user = session?.user ?? null
})
</script>

<template>
  <AppHeader />
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  padding: 2rem;
}
</style>
