import { addTodo } from "~~/server/utils/todo-store";

interface CreateTodoBody {
  text?: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateTodoBody>(event);
  const text = body?.text?.trim();

  if (!text) {
    throw createError({
      statusCode: 400,
      statusMessage: "Todo text is required",
    });
  }

  return addTodo(text);
});
