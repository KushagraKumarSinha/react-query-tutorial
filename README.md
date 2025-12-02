📘 TanStack Query — Full Notes & Demo Project (My Reference Guide)

This project is a complete walkthrough of the most important parts of TanStack Query (React Query). It serves as my personal reference guide.

Fetching data

Polling (refetch intervals)

Fetching data by ID

Posting new data (mutations)

Optimistic updates

Invalidating (referring to) other queries

1. Setting Up TanStack Query

To use TanStack Query, wrap the app in a QueryClientProvider.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>

2. Fetching Data (Basic useQuery)

Fetch all todos:

useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos
});


From the demo:

const { data: todos } = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos
});

3. Polling (Refetch Every X ms)
useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  refetchInterval: 5000
});

4. Fetching Data by ID
useQuery({
  queryKey: ["todo", selectedId],
  queryFn: () => fetchTodoById(selectedId),
  enabled: !!selectedId
});


Example UI trigger:

<button onClick={() => setSelectedId(t.id)}>Fetch by ID</button>

5. Posting Data (Mutation)
const mutation = useMutation({
  mutationFn: (data) => postTodo(data),
  onSuccess: () => {
    queryClient.invalidateQueries(["todos"]);
  }
});


Usage:

mutation.mutate({ title: newTodoTitle });

6. Optimistic Updates
onMutate: async ({ id, title }) => {
  await queryClient.cancelQueries(["todos"]);

  const previousTodos = queryClient.getQueryData(["todos"]);

  queryClient.setQueryData(["todos"], (old) =>
    old.map((todo) =>
      todo.id === id ? { ...todo, title } : todo
    )
  );

  return { previousTodos };
}


Rollback:

onError: (_error, _vars, ctx) => {
  queryClient.setQueryData(["todos"], ctx.previousTodos);
};


Finalize:

onSettled: () => {
  queryClient.invalidateQueries(["todos"]);
};

7. Invalidating Other Queries
queryClient.invalidateQueries(["todos"]);

8. Summary
Concept	Meaning	Example
useQuery	Fetch + cache data	Fetch all todos
refetchInterval	Polling	Refresh every 5 seconds
enabled	Conditional query	Fetch only when ID selected
useMutation	POST/PUT/DELETE	Add new todo
invalidateQueries	Refresh related data	Refetch todos
Optimistic updates	Instant UI update	Edit todo title immediately
9. Running the Project

Install:

npm install @tanstack/react-query


Run:

npm run dev

10. What This Project Covers
Topic	Implemented With
Fetch data	useQuery(fetchTodos)
Polling	refetchInterval: 5000
Fetch by ID	useQuery(["todo", id])
Posting data	useMutation(postTodo)
Optimistic updates	onMutate, onError, onSettled
Invalidating queries	invalidateQueries(["todos"])
