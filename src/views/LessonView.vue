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

const progressPercentage = computed(() => {
  if (questions.value.length === 0) {
    return 0
  }

  let answeredCount = currentQuestionIndex.value

  if (selectionStatus.value !== null) {
    answeredCount++
  }

  if (lessonIsComplete.value) {
    answeredCount = questions.value.length
  }

  return (answeredCount / questions.value.length) * 100
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
    <div v-if="lessonIsComplete" class="lesson-complete-container">
      <h2>Lesson Complete!</h2>
      <p>Great job! You've finished the lesson.</p>
      <RouterLink to="/" class="btn-primary">Back to Lessons</RouterLink>
    </div>
    <div v-else>
      <div class="progress-bar-background">
        <div class="progress-bar-filler" :style="{ width: progressPercentage + '%' }"></div>
      </div>
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
          <button @click="goToNextQuestion" class="btn-primary">Continue</button>
        </div>
      </div>

      <div v-else>Loading questions...</div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar-background {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.progress-bar-filler {
  height: 100%;
  background-color: var(--green-correct);
  border-radius: 10px;
  width: 0%;
  transition: width 0.3s ease-in-out;
}

.lesson-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--text-light);
  border-radius: 16px;
  box-shadow: 0 4px 12px var(--shadow-color);
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
  border: 1px solid var(--border-light);
  background-color: var(--text-light);
  border-radius: 8px;
}

button.correct {
  background-color: var(--green-correct);
  color: var(--text-light);
  border-color: var(--green-correct);
}

button.incorrect {
  background-color: var(--red-incorrect);
  color: var(--text-light);
  border-color: var(--red-incorrect);
}

button:disabled {
  cursor: not-allowed;
}

.lesson-complete-container {
  text-align: center;
}

.lesson-complete-container h2 {
  color: var(--green-correct);
  font-size: 2.5rem;
}

.lesson-complete-container p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.continue-container {
  margin-top: 2rem;
  text-align: center;
}

.btn-primary {
  display: inline-block;
  background-color: var(--blue-ui);
  color: var(--text-light);
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
}
</style>
