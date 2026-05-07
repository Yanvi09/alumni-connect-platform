const base = () => import.meta.env.VITE_API_URL ?? ''

export type ApiError = Error & { code?: string; status?: number }

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base()}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    const err = new Error((data.message as string) || res.statusText) as ApiError
    err.status = res.status
    if (typeof data.code === 'string') err.code = data.code
    throw err
  }
  return data as T
}
