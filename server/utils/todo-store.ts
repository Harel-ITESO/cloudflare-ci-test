export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: number
}

const todos: Todo[] = []
let nextId = 1

export function listTodos(): Todo[] {
  return [...todos].sort((a, b) => b.createdAt - a.createdAt)
}

export function addTodo(text: string): Todo {
  const todo: Todo = {
    id: nextId,
    text,
    completed: false,
    createdAt: Date.now()
  }

  nextId += 1
  todos.push(todo)

  return todo
}

export function updateTodo(id: number, completed?: boolean): Todo | null {
  const todo = todos.find((item) => item.id === id)

  if (!todo) {
    return null
  }

  if (typeof completed === 'boolean') {
    todo.completed = completed
  } else {
    todo.completed = !todo.completed
  }

  return todo
}

export function removeTodo(id: number): boolean {
  const index = todos.findIndex((item) => item.id === id)

  if (index === -1) {
    return false
  }

  todos.splice(index, 1)
  return true
}

export function clearCompletedTodos(): number {
  const before = todos.length

  for (let index = todos.length - 1; index >= 0; index -= 1) {
    if (todos[index]?.completed) {
      todos.splice(index, 1)
    }
  }

  return before - todos.length
}
