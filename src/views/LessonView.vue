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
const lessonIsComplete = ref(false)
const selectedOption = ref<string | null>(null)
const selectionStatus = ref<'correct' | 'incorrect' | null>(null)

const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value]
})

function checkAnswer(option: string) {
  if (!currentQuestion.value) return
  if (selectionStatus.value !== null) return
  selectedOption.value = option
  const correctAnswer = currentQuestion.value.answer

  if (option === correctAnswer) {
    selectionStatus.value = 'correct'
  } else {
    selectionStatus.value = 'incorrect'
  }
}

function goToNextQuestion() {
  if (!currentQuestion.value) return
  const isLastQuestion = currentQuestionIndex.value === questions.value.length - 1

  if (isLastQuestion) {
    lessonIsComplete.value = true
  } else {
    currentQuestionIndex.value++
  }

  selectedOption.value = null
  selectionStatus.value = null
}

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
  <div class="lesson-container">
    <div v-if="lessonIsComplete">
      <h2>Lesson Complete!</h2>
      <p>Great job! You've finished the lesson.</p>
    </div>
    <div v-else>
      <div v-if="currentQuestion">
        <h2>{{ currentQuestion.question_text }}</h2>
        <div class="options-container">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="checkAnswer(option)"
            :disabled="selectionStatus !== null"
            :class="{
              correct: selectedOption === option && selectionStatus === 'correct',
              incorrect: selectedOption === option && selectionStatus === 'incorrect',
            }"
          >
            {{ option }}
          </button>
        </div>
        <div class="continue-container" v-if="selectionStatus !== null">
          <button @click="goToNextQuestion">Continue</button>
        </div>
      </div>

      <div v-else>Loading questions...</div>
    </div>
  </div>
</template>

<style scoped>
.lesson-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 700;
}
.options-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

button {
  padding: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 8px;
}

button.correct {
  background-color: #58cc02;
  color: white;
  border-color: #58cc02;
}

button.incorrect {
  background-color: #ff4b4b;
  color: white;
  border-color: #ff4b4b;
}

button:disabled {
  cursor: not-allowed;
}

.continue-container {
  margin-top: 2rem;
  text-align: center;
}

.continue-container button {
  background-color: #1cb0f6;
  color: white;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
}
</style>
