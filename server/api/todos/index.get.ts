import { listTodos } from '~~/server/utils/todo-store'

export default defineEventHandler(() => {
  return listTodos()
})
