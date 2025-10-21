<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase.ts'

interface Lesson {
  id: number
  created_at: string
  title: string
  order: number
}

const lessons = ref<Lesson[]>([])

onMounted(() => {
  const fetchLessons = async () => {
    const { data, error } = await supabase.from('lessons').select('*').order('order')

    if (error) {
      console.error('Error fetching lessons:', error)
    } else {
      lessons.value = data
    }
  }

  fetchLessons()
})
</script>

<template>
  <h1>Home Page</h1>
  <p>Here are the available lessons:</p>

  <div v-if="lessons.length === 0">Loading lessons...</div>

  <ul v-else>
    <li v-for="lesson in lessons" :key="lesson.id">{{ lesson.title }}</li>
  </ul>
</template>
