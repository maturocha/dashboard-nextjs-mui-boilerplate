// lib/auth.ts
export interface AuthResponse {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
    auth_token: string;
  }
  
  export async function loginWithCredentials(username: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await res.json();
  
    if (!res.ok || !data?.auth_token) {
      throw new Error(data?.message || 'Error al iniciar sesión');
    }
  
    return data;
  }
  