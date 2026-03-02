import { removeTodo } from "~~/server/utils/todo-store";

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, "id"));

  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid todo id",
    });
  }

  const removed = removeTodo(id);

  if (!removed) {
    throw createError({
      statusCode: 404,
      statusMessage: "Todo not found",
    });
  }

  return { ok: true };
});
