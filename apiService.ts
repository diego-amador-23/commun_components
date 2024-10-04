import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios'

const domain = import.meta.env.VITE_APPLICATION_DOMAIN as string | undefined
const endpoint = import.meta.env.VITE_APPLICATION_ENDPOINT as string

export function createApiServiceWith(
  config?: CreateAxiosDefaults<any>
): AxiosInstance {
  return axios.create({
    baseURL: `${domain ?? ''}${
      process.env.NODE_ENV !== 'development' ? endpoint : ''
    }`,
    withCredentials: process.env.NODE_ENV === 'development' ? undefined : true,
    ...config
  })
}

export function createApiServiceWithToken(token: string): AxiosInstance {
  return createApiServiceWith({
    headers: { 'Permissions-Token': token }
  })
}

export const httpApiService = createApiServiceWith()
