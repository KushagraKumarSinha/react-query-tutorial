// Mock API layer

// Pretend "server data"
let todos = [
  { id: 1, title: "Learn TanStack Query" },
  { id: 2, title: "Build a demo project" }
];

// Simulate network delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const fetchTodos = async () => {
  await delay(500);
  return todos;
};

export const fetchTodoById = async (id) => {
  await delay(300);
  return todos.find((t) => t.id === Number(id));
};

export const postTodo = async (newTodo) => {
  await delay(300);
  const todo = { id: Date.now(), ...newTodo };
  todos.push(todo);
  return todo;
};

export const editTodoTitle = async (id, title) => {
  await delay(300);
  const index = todos.findIndex((t) => t.id === id);
  todos[index].title = title;
  return todos[index];
};
