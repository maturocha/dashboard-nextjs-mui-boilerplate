import axios, { AxiosResponse, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiWrapper = {
  get,
  post,
  put,
  delete: _delete,
};

async function getAuthHeaders() {
  const session = await getSession();
  return session?.accessToken 
    ? { 
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    : { 'Content-Type': 'application/json' };
}

async function get<T = any>(
  url: string,
  params = {},
  headers: { [key: string]: string } = {}
): Promise<T> {
  try {
    const authHeaders = await getAuthHeaders();
    const response: AxiosResponse<T> = await axios.get(`${API_URL}${url}`, {
      params,
      headers: { ...authHeaders, ...headers }
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error as AxiosError);
  }
}

async function post<T = any>(
  url: string,
  body = {},
  params = {},
  headers: { [key: string]: string } = {}
): Promise<T> {
  try {
    const authHeaders = await getAuthHeaders();
    const response: AxiosResponse<T> = await axios.post(`${API_URL}${url}`, body, {
      params,
      headers: { ...authHeaders, ...headers }
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error as AxiosError);
  }
}

async function put<T = any>(
  url: string,
  body = {},
  params = {},
  headers: { [key: string]: string } = {},
  id: string | null = null
): Promise<T> {
  try {
    const authHeaders = await getAuthHeaders();
    const endpoint = id ? `${API_URL}${url}/${id}` : `${API_URL}${url}`;
    const response: AxiosResponse<T> = await axios.put(endpoint, body, {
      params,
      headers: { ...authHeaders, ...headers }
    });
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError);
  }
}

async function _delete<T = any>(
  url: string,
  body = {},
  headers: { [key: string]: string } = {},
  id: string | null = null
): Promise<T> {
  try {
    const authHeaders = await getAuthHeaders();
    const endpoint = id ? `${API_URL}${url}/${id}` : `${API_URL}${url}`;
    const response: AxiosResponse<T> = await axios.delete(endpoint, {
      data: body,
      headers: { ...authHeaders, ...headers }
    });
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError);
  }
}

function handleResponse<T>(response: AxiosResponse<T>): T {
  return response.data;
}

function handleError(error: AxiosError): never {
  if (error.response) {
    const { response } = error;
    
    // Handle 401 unauthorized
    if (response.status === 401) {
      signOut({ redirect: true, callbackUrl: '/login' })
    }
    
    // Handle 422 validation errors
    if (response.status === 422) {
      const validationErrors = response.data as Record<string, string[]>;
      throw validationErrors;
    }

    // Handle other errors
    throw new Error((response.data as { message?: string }).message || response.statusText);
  } else if (error.request) {
    throw new Error('No se pudo recibir respuesta del servidor.');
  } else {
    throw new Error('Error al procesar la solicitud.');
  }
}