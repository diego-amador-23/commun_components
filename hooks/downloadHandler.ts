import axios, { type AxiosRequestConfig } from 'axios'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { sessionSelects, useToastAxiosError } from '..'

type DownloadHandler = (fileName: string, endpoint: string) => Promise<void>

export function useDownloadHandler(baseURL: string): DownloadHandler {
  const toast = useToastAxiosError()

  const token = useSelector(sessionSelects.token)

  const service = useMemo(() => {
    return axios.create({
      baseURL,
      withCredentials:
        process.env.NODE_ENV === 'development' ? undefined : true,
      headers: { 'Permissions-Token': token }
    })
  }, [token, baseURL])

  return async (fileName, endpoint) => {
    const configurations: AxiosRequestConfig = { responseType: 'blob' }

    try {
      const response = await service.get(endpoint, configurations)

      const url = URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      toast(error, `Falha ao tentar baixar arquivo ${fileName}.`)
    }
  }
}
