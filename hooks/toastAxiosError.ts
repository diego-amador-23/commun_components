import { type AxiosError } from 'axios'
import { type Toast } from '../reducers/toasts'
import { useToast } from './toast'

export function useToastAxiosError(): (error: any, title: string) => void {
  const toast = useToast()

  return (e, title: string) => {
    const error = e as AxiosError<{ message?: string }>
    const logError = Boolean(sessionStorage.getItem('logError'))
    if (logError) {
      console.log(title, '=>', error)
    }
    const toastData: Toast = {
      variant: 'danger',
      head: title,
      body: error.message,
      error
    }
    if (
      error.response?.data.message !== undefined &&
      error.response.data.message !== ''
    ) {
      toastData.body = error.response.data.message
    }
    toast(toastData)
  }
}
