const API_URL = import.meta.env.VITE_API_URL;

export async function request<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: options.body
        ? {
            'Content-Type': 'application/json',
            ...options.headers,
            }
        : options.headers,
    });

    if (!response.ok) {
        const data = await response
        .json()
        .catch(() => null);

        const message = Array.isArray(data?.message)
        ? data.message.join(', ')
        : data?.message ||
            'Error al realizar la operación';

        throw new Error(message);
    }

    return response.json();
}