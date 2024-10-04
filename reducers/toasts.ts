import {
  createSelector,
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit'
import { type AxiosError } from 'axios'
import { v4 as uuidV4 } from 'uuid'

export type ToastVariants = 'neutral' | 'success' | 'danger' | 'warning'

export interface Toast {
  head: string
  body: string
  variant: ToastVariants
  error?: AxiosError<{ message?: string }>
}

interface InitialState {
  toasts: Record<string, Toast>
}

const initialState: InitialState = {
  toasts: {}
}

const toastSlice = createSlice({
  name: 'Toast',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Toast>) => {
      const { variant, body, head } = action.payload
      const toast = Object.values(state.toasts).find(
        (toast) =>
          toast.variant === variant &&
          toast.body === body &&
          toast.head === head
      )
      if (toast === undefined) {
        state.toasts[uuidV4()] = action.payload
      }
    },
    remove: (state, action: PayloadAction<string>) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.toasts[action.payload]
    },
    clear: (state, _: PayloadAction<void>) => {
      if (Object.keys(state.toasts).length > 4) {
        state.toasts = {}
      }
    }
  }
})

export const toastReducer = toastSlice.reducer
export const toastActions = toastSlice.actions
export const toastSelects = {
  allToasts: createSelector(
    (state: any) => state.toasts.toasts,
    (toasts: Record<string, Toast>) =>
      Object.keys(toasts).map((key) => ({ key, ...toasts[key] }))
  )
}
