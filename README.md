<h1 align="center">TanStack Query — Full Notes & Demo Project (My Reference Guide)</h1>

This project is a simple but complete walkthrough of the most important parts of TanStack Query (React Query), based on the topics I needed to learn:

• Fetching data

• Polling (refetch intervals)

• Fetching data by ID

• Posting new data (mutations)

• Optimistic updates

• Referring to (invalidating) other queries

This README is meant to act as my personal notes so I can come back later and refresh myself instantly.

Reference video: https://www.youtube.com/watch?v=e74rB-14-m8

<hr>

### 1. Setting Up TanStack Query

To use TanStack Query, we wrap the app in a `QueryClientProvider`.
```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}
```
This gives the whole app access to caching, queries, mutations, etc.

<hr>

### 2. Fetching Data (Basic useQuery)

Fetching all todos:
```jsx
useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos
});
```
**Important points:**

• `queryKey` = identifier for caching

• `queryFn` = function that fetches data

• React Query auto-caches, auto-refetches, and keeps stale data

**From the demo:**

```jsx
const { data: todos } = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos
});
```

<hr>

### 3. Polling (Refetch Every X ms)

You can make a query refetch automatically using refetchInterval

```jsx
useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  refetchInterval: 5000 // fetch every 5 seconds
});
```

This creates live updating data without WebSockets

<hr>

### 4. Fetching Data by ID

We fetch by ID using another query that depends on 'selectedId'

```jsx
useQuery({
  queryKey: ["todo", selectedId],
  queryFn: () => fetchTodoById(selectedId),
  enabled: !!selectedId
});
```
Why `enabled`?
Because queries normally auto-run.
`enabled: false` until we actually select an ID

Example in UI:

```jsx
<button onClick={() => setSelectedId(t.id)}>Fetch by ID</button>
```

<hr>

### 5. Posting Data (Mutation)

Mutations are used to change server data, like POST, PUT, DELETE.

```jsx
useMutation({
  mutationFn: (data) => postTodo(data),
  onSuccess: () => {
    queryClient.invalidateQueries(["todos"]);
  }
});
```

Why `invalidateQueries`?

It tells React Query: “This data is outdated — refetch it.”

Example usage:

```jsx
postMutation.mutate({ title: newTodoTitle });
```

<hr>

### 6. Optimistic Updates

This is one of the most powerful features.

It makes UI update instantly, before the server responds.

**Steps:**

1) Cancel outgoing refetches

2) Snapshot previous cache

3) Immediately update UI

4) Roll back on error

5) Refetch final data

**From the project:**

```jsx
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
```

If the server fails, we undo the optimistic update:

```jsx
onError: (_err, _vars, ctx) => {
  queryClient.setQueryData(["todos"], ctx.previousTodos);
};
```

And always finalize:

```jsx
onSettled: () => {
  queryClient.invalidateQueries(["todos"]);
};
```

<hr>

### 7. Referring To Other Queries (invalidateQueries)

Sometimes a mutation affects data in another query.

Example:
Posting a new todo should update the list of todos.

**So we invalidate:**

```jsx
queryClient.invalidateQueries(["todos"]);
```
This triggers a refetch.

<hr>

### 8. Summary — What I Learned

| Concept | Meaning | Example from this project |
| :--- | :--- | :--- |
| `useQuery` | Fetch and cache data | Fetch all todos |
| `refetchInterval` | Polling | Refresh todos every 5s |
| `enabled` | Conditional queries | Only fetch todo if ID is selected |
| `useMutation` | Post/put/delete | Add new todo |
| `invalidateQueries` | Refresh related queries | Refresh todos after posting |
| Optimistic updates | Update UI before server | Add "!" to todo title instantly |
