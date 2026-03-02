<script setup lang="ts">
interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: number
}

const newTodo = ref('')
const isSubmitting = ref(false)

const { data: todos, pending, error } = await useFetch<Todo[]>('/api/todos', {
  default: () => []
})

const remainingCount = computed(() => {
  return todos.value.filter((todo) => !todo.completed).length
})

const completedCount = computed(() => {
  return todos.value.filter((todo) => todo.completed).length
})

async function addTodo() {
  const text = newTodo.value.trim()

  if (!text || isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  try {
    const createdTodo = await $fetch<Todo>('/api/todos', {
      method: 'POST',
      body: { text }
    })

    todos.value.unshift(createdTodo)
    newTodo.value = ''
  } finally {
    isSubmitting.value = false
  }
}

async function toggleTodo(id: number, completed: boolean | 'indeterminate') {
  const updatedTodo = await $fetch<Todo>(`/api/todos/${id}`, {
    method: 'PATCH',
    body: { completed: Boolean(completed) }
  })

  const todoIndex = todos.value.findIndex((todo) => todo.id === id)

  if (todoIndex !== -1) {
    todos.value[todoIndex] = updatedTodo
  }
}

async function removeTodo(id: number) {
  await $fetch(`/api/todos/${id}`, {
    method: 'DELETE'
  })

  todos.value = todos.value.filter((todo) => todo.id !== id)
}

async function clearCompleted() {
  if (!completedCount.value) {
    return
  }

  await $fetch('/api/todos', {
    method: 'DELETE'
  })

  todos.value = todos.value.filter((todo) => !todo.completed)
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-10">
    <UCard>
      <template #header>
        <div>
          <h1 class="text-2xl font-semibold">Simple Todo</h1>
          <p class="mt-1 text-sm text-muted">In-memory todos powered by Nuxt server routes.</p>
        </div>
      </template>

      <form class="flex gap-2" @submit.prevent="addTodo">
        <UInput
          v-model="newTodo"
          class="flex-1"
          placeholder="Add a task"
          :disabled="isSubmitting"
        />
        <UButton type="submit" :loading="isSubmitting">Add</UButton>
      </form>

      <p v-if="error" class="mt-4 text-sm text-error">Failed to load todos.</p>

      <div v-else class="mt-4 space-y-2">
        <p v-if="pending" class="text-sm text-muted">Loading...</p>

        <p v-else-if="!todos.length" class="text-sm text-muted">No todos yet.</p>

        <div
          v-for="todo in todos"
          v-else
          :key="todo.id"
          class="flex items-center justify-between gap-3 rounded border border-default p-3"
        >
          <UCheckbox
            :model-value="todo.completed"
            :label="todo.text"
            @update:model-value="(value) => toggleTodo(todo.id, value)"
          />

          <UButton color="error" variant="ghost" icon="i-lucide-trash-2" @click="removeTodo(todo.id)" />
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted">{{ remainingCount }} left</span>
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            :disabled="!completedCount"
            @click="clearCompleted"
          >
            Clear completed
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
