import { useState } from "react";
import {QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchTodos, fetchTodoById, postTodo, editTodoTitle} from "./api";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}

function Todos() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    refetchInterval: 5000
  });

  const { data: todoById } = useQuery({
    queryKey: ["todo", selectedId],
    queryFn: () => fetchTodoById(selectedId),
    enabled: !!selectedId
  });

  const postMutation = useMutation({
    mutationFn: (data) => postTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    }
  });

  const editMutation = useMutation({
    mutationFn: ({ id, title }) => editTodoTitle(id, title),
    onMutate: async ({ id, title }) => {
      await queryClient.cancelQueries(["todos"]);
      const previousTodos = queryClient.getQueryData(["todos"]);
      queryClient.setQueryData(["todos"], (old) =>
        old.map((todo) =>
          todo.id === id ? { ...todo, title } : todo
        )
      );

      return { previousTodos };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["todos"], ctx.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["todos"]);
    }
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1>TanStack Query Demo</h1>
      <h2>All Todos (refetches every 5s)</h2>
      {todos.map((t) => (
        <div key={t.id} style={{ marginBottom: "8px" }}>
          <b>{t.title}</b>

          <button style={{ marginLeft: "8px" }} onClick={() =>editMutation.mutate({ id: t.id, title: t.title + "!" })}>
            Optimistically Add "!"
          </button>

          <button style={{ marginLeft: "8px" }} onClick={() => setSelectedId(t.id)}>Fetch by ID</button>
        </div>
      ))}

      {selectedId && (
        <>
          <h3>Fetched by ID:</h3>
          <p>{todoById?.title}</p>
        </>
      )}

      <h2>Add Todo</h2>
      <form onSubmit={(e) => {e.preventDefault(); postMutation.mutate({ title: newTodoTitle }); setNewTodoTitle("");}}>
        <input value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} placeholder="Todo title..."/>
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

