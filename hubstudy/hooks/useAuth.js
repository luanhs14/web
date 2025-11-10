import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => {
  if (res.status === 401) throw new Error('UNAUTH');
  return res.json();
});

export function useAuth() {
  const { data, error, mutate, isLoading } = useSWR('/api/auth/me', fetcher);
  return {
    user: data?.user ?? null,
    isLoading,
    isAuthenticated: Boolean(data?.user),
    error,
    refresh: mutate,
  };
}
