<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import { useUserStore } from '@/stores/userStore'

const store = useUserStore()

const username = ref('')
const loading = ref(true)
const message = ref('')

onMounted(async () => {
  await getProfile()
})

async function getProfile() {
  if (!store.user) return

  try {
    loading.value = true
    const { data, error, status } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', store.user.id)
      .single()

    if (error && status !== 406) throw error

    if (data) {
      username.value = data.username
    }
  } catch (error) {
    if (error instanceof Error) alert(error.message)
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  if (!store.user) return

  try {
    loading.value = true
    const updates = {
      username: username.value,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', store.user.id)

    if (error) throw error
    message.value = 'Profile updated successfully!'
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="account-container">
    <h1>My Account</h1>
    <p>This is where you can update your profile information.</p>
    <div v-if="loading">Loading profile...</div>
    <form @submit.prevent="updateProfile" v-else>
      <div>
        <label for="email">Email</label>
        <input id="email" type="text" :value="store.user?.email" disabled />
      </div>
      <div>
        <label for="username">Username</label>
        <input id="username" type="text" v-model="username" />
      </div>

      <div>
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Saving...' : 'Update Profile' }}
        </button>
      </div>
    </form>

    <p v-if="message" class="success-message">{{ message }}</p>
  </div>
</template>

<style scoped>
.account-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--text-light);
  border-radius: 16px;
  box-shadow: 0 4px 12px var(--shadow-color);
}

form div {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 1rem;
}

input:disabled {
  background-color: #f3f4f6;
  color: #6b7280;
}

.btn-primary {
  display: inline-block;
  background-color: var(--blue-ui);
  color: var(--text-light);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.success-message {
  color: var(--green-correct);
  text-align: center;
  margin-top: 1rem;
}
</style>
