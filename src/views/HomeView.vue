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
  <div class="home-container">
    <h1>Lessons</h1>
    <div v-if="lessons.length === 0">Loading lessons...</div>

    <ul v-else class="lesson-list">
      <li v-for="lesson in lessons" :key="lesson.id">
        <RouterLink :to="`/lesson/${lesson.id}`">
          {{ lesson.title }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  color: var(--text-dark);
}

.lesson-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lesson-list a {
  display: block;
  padding: 1.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px var(--shadow-color);
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 700;
  font-size: 1.2rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.lesson-list a:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px var(--shadow-color);
}
</style>
