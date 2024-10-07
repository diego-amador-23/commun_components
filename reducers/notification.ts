import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchUserPreferences } from '../hooks/notification'
import {
  Notification,
  UserPreferences,
  NotificationState
} from '../types/notificationTypes'

const initialState: NotificationState = {
  notifications: [],
  preferences: null,
  userId: null,
  loading: false,
  error: null
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://192.168.23.98:3000'

// Função utilitária para mapear preferências para o array de strings
const mapPreferencesToArray = (preferences: UserPreferences): string[] => {
  const preferencesArray: string[] = []

  if (preferences.produtividade) preferencesArray.push('alertProductivity')
  if (preferences.comunicacao) preferencesArray.push('alertCommunication')
  if (preferences.promocoes) preferencesArray.push('alertPromotion')

  preferencesArray.push('alertAlarm')

  return preferencesArray
}

// Thunk para salvar as preferências do usuário
export const saveUserPreferences = createAsyncThunk<
  void,
  { userId: string; preferences: UserPreferences },
  { rejectValue: string }
>(
  'notifications/savePreferences',
  async ({ userId, preferences }, { dispatch, rejectWithValue }) => {
    try {
      const preferencesArray = mapPreferencesToArray(preferences)
      const body = {
        user_id: userId,
        notifications_user_preferences: {
          notification_types: preferencesArray // Enviando apenas as preferências selecionadas
        }
      }
      const response = await fetch(
        `${API_BASE_URL}/notifications_user_preferences`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao salvar preferências do usuário')
      }

      await dispatch(fetchUserPreferences(userId)) // Atualizando as preferências do estado após salvar
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Erro desconhecido ao salvar preferências'
      )
    }
  }
)

// Thunk para marcar notificação como lida
export const markNotificationAsReadAsync = createAsyncThunk<void, string>(
  'notifications/markAsRead',
  async (notificationId, { dispatch }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notification_id: notificationId })
      })

      if (!response.ok) {
        throw new Error(
          `Erro ao marcar notificação como lida: ${response.statusText}`
        )
      }

      dispatch(notificationActions.markNotificationAsRead(notificationId))
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
    }
  }
)

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
      state.loading = false
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setUserPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.preferences = action.payload
      state.loading = false
    },
    setUserPreferencesError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.notificationId === action.payload
      )
      if (notification != null) {
        notification.read = true
      }
    },
    clearNotifications: (state) => {
      state.notifications = []
      state.loading = false
    },
    clearError: (state) => {
      state.error = null
    }
  }
})

// Exportando as ações e thunks
export const notificationActions = {
  ...notificationSlice.actions,
  markNotificationAsReadAsync,
  fetchUserPreferences,
  saveUserPreferences // Adicionando o novo thunk
}

// Exportando o reducer
export const notificationReducer = notificationSlice.reducer

// Seletores
export const notificationSelectors = {
  notifications: (state: any) => state.notifications.notifications,
  loading: (state: any) => state.notifications.loading,
  preferences: (state: any) => state.notifications.preferences
}
