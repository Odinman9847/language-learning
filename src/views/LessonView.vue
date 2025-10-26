<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'

interface Question {
  id: number
  question_text: string
  answer: string
  options: string[]
  lesson_id: number
}

const questions = ref<Question[]>([])
const route = useRoute()
const currentQuestionIndex = ref(0)

const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value]
})

onMounted(() => {
  const fetchQuestions = async () => {
    const lessonId = route.params.id
    const { data, error } = await supabase.from('questions').select('*').eq('lesson_id', lessonId)

    if (error) {
      console.error('Error fetching questions:', error)
    } else if (data) {
      questions.value = data
    }
  }
  fetchQuestions()
})
</script>

<template>
  <div>
    <h1>A Lesson Page</h1>
    <div v-if="currentQuestion">
      <h2>{{ currentQuestion.question_text }}</h2>
    </div>

    <div v-else>Loading questions...</div>
  </div>
</template>
