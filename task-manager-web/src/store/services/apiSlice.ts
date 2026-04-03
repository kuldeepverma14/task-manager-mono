import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../slices/authSlice';
import { Mutex } from 'async-mutex';

// Create a new mutex
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = (api.getState() as any).auth.refreshToken;
        if (refreshToken) {
          const refreshResult = await baseQuery(
            {
              url: '/auth/refresh',
              method: 'POST',
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const { accessToken, refreshToken: newRefreshToken } = (refreshResult.data as any).data;
            api.dispatch(setCredentials({ accessToken, refreshToken: newRefreshToken }));
            // Retry the initial query
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
        } else {
          api.dispatch(logout());
        }
      } finally {
        // release must be called once the mutex should be released
        release();
      }
    } else {
      // wait until the mutex is available and retry the initial query
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Task', 'User'],
  endpoints: () => ({}),
});
