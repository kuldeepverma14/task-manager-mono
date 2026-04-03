import { apiSlice } from './apiSlice';

export const taskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (params) => ({
        url: '/tasks',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.tasks.map(({ id }: { id: string }) => ({ type: 'Task', id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    getTask: builder.query({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
    createTask: builder.mutation({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    toggleTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useToggleTaskMutation,
} = taskApi;
