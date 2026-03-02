import { updateTodo } from '~~/server/utils/todo-store'

interface UpdateTodoBody {
  completed?: boolean
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid todo id'
    })
  }

  const body = await readBody<UpdateTodoBody>(event)
  const todo = updateTodo(id, body?.completed)

  if (!todo) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Todo not found'
    })
  }

  return todo
})
