import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function loadStore() {
  vi.resetModules();
  return import("../../server/utils/todo-store");
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("todo-store", () => {
  it("adds todos with default fields", async () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const store = await loadStore();

    const todo = store.addTodo("Write tests");

    expect(todo).toEqual({
      id: 1,
      text: "Write tests",
      completed: false,
      createdAt: new Date("2026-01-01T00:00:00.000Z").getTime(),
    });
  });

  it("lists todos sorted by newest first", async () => {
    const store = await loadStore();

    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const first = store.addTodo("first");

    vi.setSystemTime(new Date("2026-01-01T00:00:01.000Z"));
    const second = store.addTodo("second");

    expect(store.listTodos().map((todo) => todo.id)).toEqual([second.id, first.id]);
  });

  it("updates todos when completed is passed", async () => {
    const store = await loadStore();
    const todo = store.addTodo("toggle me");

    const updated = store.updateTodo(todo.id, true);

    expect(updated?.completed).toBe(true);
  });

  it("toggles todos when completed is omitted", async () => {
    const store = await loadStore();
    const todo = store.addTodo("toggle me");

    const firstToggle = store.updateTodo(todo.id);
    const firstValue = firstToggle?.completed;
    const secondToggle = store.updateTodo(todo.id);
    const secondValue = secondToggle?.completed;

    expect(firstValue).toBe(true);
    expect(secondValue).toBe(false);
  });

  it("returns null or false for missing todos", async () => {
    const store = await loadStore();

    expect(store.updateTodo(999)).toBeNull();
    expect(store.removeTodo(999)).toBe(false);
  });

  it("removes a todo by id", async () => {
    const store = await loadStore();
    const todo = store.addTodo("remove me");

    const removed = store.removeTodo(todo.id);

    expect(removed).toBe(true);
    expect(store.listTodos()).toHaveLength(0);
  });

  it("clears only completed todos and returns removed count", async () => {
    const store = await loadStore();
    const keep = store.addTodo("keep");
    const doneOne = store.addTodo("done one");
    const doneTwo = store.addTodo("done two");

    store.updateTodo(doneOne.id, true);
    store.updateTodo(doneTwo.id, true);

    const removedCount = store.clearCompletedTodos();

    expect(removedCount).toBe(2);
    expect(store.listTodos().map((todo) => todo.id)).toEqual([keep.id]);
  });
});
