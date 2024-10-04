import { useDispatch } from 'react-redux'
import { toastActions, type Toast } from '../reducers/toasts'

type ToastReturn = (toast: Toast) => void

export function useToast(): ToastReturn {
  const dispatch = useDispatch()

  return (toast) => {
    dispatch(toastActions.add(toast))
  }
}
