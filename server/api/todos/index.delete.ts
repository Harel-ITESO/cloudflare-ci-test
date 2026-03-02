import { clearCompletedTodos } from '~~/server/utils/todo-store'

export default defineEventHandler(() => {
  const removed = clearCompletedTodos()

  return { removed }
})
