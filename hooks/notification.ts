import { notificationActions } from '../reducers/notification'
import { RootState } from '../../src/store'
import {
  Notification,
  NotificationText,
  UserPreferences
} from '../types/notificationTypes'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://192.168.23.98:3000'

const userId = '1ada6ffc-0215-4b22-8902-e50772ad4f2f'

type NotificationTextCategory = Record<string, NotificationText>

type NotificationTexts = Record<string, NotificationTextCategory>

export const loadNotifications = async (
  baseUrl: string,
  userID: string
): Promise<any[]> => {
  try {
    const response = await fetch(`${baseUrl}/notifications/${userID}`)
    if (!response.ok) {
      throw new Error(
        `Failed to load notifications from API: ${response.status} ${response.statusText}`
      )
    }
    const data = await response.json()
    if (!data || data.length === 0) {
      throw new Error('No data returned from API')
    }
    return data
  } catch (error) {
    console.error('Error loading notifications from API:', error)
    try {
      const response = await fetch('/json/notifications.json')
      if (!response.ok) {
        throw new Error(
          `Failed to load notifications from local JSON: ${response.status} ${response.statusText}`
        )
      }
      const data = await response.json()
      return data
    } catch (localError) {
      console.error('Error loading notifications from local JSON:', localError)
      return []
    }
  }
}

export const loadNotificationTexts = async (
  language: string
): Promise<NotificationTexts> => {
  const supportedLanguages = ['pt-BR', 'en-US'] // Adicione outros idiomas suportados aqui
  const lang = supportedLanguages.includes(language) ? language : 'pt-BR' // Define o idioma padrão

  try {
    const response = await fetch(`/json/notificationReturn-${lang}.json`)
    if (!response.ok) {
      throw new Error(`Failed to load notification texts for language: ${lang}`)
    }
    const data = await response.json()
    return data.notification as NotificationTexts
  } catch (error) {
    console.error(
      `Error loading notification texts for language ${lang}:`,
      error
    )
    // Fallback para o idioma padrão
    if (lang !== 'pt-BR') {
      try {
        const fallbackResponse = await fetch(
          '/json/notificationReturn-pt-BR.json'
        )
        if (!fallbackResponse.ok) {
          throw new Error('Failed to load fallback notification texts')
        }
        const fallbackData = await fallbackResponse.json()
        return fallbackData.notification as NotificationTexts
      } catch (fallbackError) {
        console.error(
          'Error loading fallback notification texts:',
          fallbackError
        )
        return {}
      }
    }
    return {}
  }
}

export const fetchNotifications =
  () => async (dispatch: any, getState: () => RootState) => {
    try {
      dispatch(notificationActions.setLoading(true))

      const userID = userId // 'userId' definido como string
      dispatch(notificationActions.setUserId(userID)) // Armazena o userId no Redux

      const baseUrl = API_BASE_URL

      // Obtém o idioma do Redux ou do navegador
      const state = getState()
      const language =
        state.intl.dictionaryName || navigator.language || 'pt-BR'

      const [notifications, notificationTexts] = await Promise.all([
        loadNotifications(baseUrl, userID),
        loadNotificationTexts(language)
      ])

      const mergedNotifications = mergeNotificationsWithTexts(
        notifications,
        notificationTexts
      )
      dispatch(notificationActions.setNotifications(mergedNotifications))
    } catch (error) {
      console.error('Error fetching notifications:', error)
      dispatch(notificationActions.setLoading(false))
    }
  }

export const fetchUserPreferences = (userId: any) => async (dispatch: any) => {
  try {
    const userID = userId

    const response = await fetch(
      `${API_BASE_URL}/notifications_user_preferences/${userID}`
    )
    if (!response.ok) {
      throw new Error('Erro ao buscar preferências do usuário')
    }

    const data: string[] | null = await response.json() // Certifique-se de que o tipo seja string[] ou null

    if (!data) {
      throw new Error('A resposta da API retornou null ou está vazia')
    }

    // Mapeia o array para o objeto UserPreferences com verificação se data está preenchido
    const preferences: UserPreferences = {
      produtividade: data.includes('alertProductivity'),
      comunicacao: data.includes('alertCommunication'),
      promocoes: data.includes('alertPromotion')
    }

    dispatch(notificationActions.setUserPreferences(preferences)) // Envia a ação para atualizar o estado
  } catch (error) {
    console.error('Erro ao buscar preferências do usuário:', error)
    dispatch(
      notificationActions.setUserPreferencesError(
        'Erro ao buscar preferências do usuário'
      )
    )
  }
}

export const fetchNotificationsAndPreferences =
  () => async (dispatch: any, getState: any) => {
    try {
      dispatch(notificationActions.setLoading(true))

      const state = getState()
      const userID = state.notifications.userId || userId // Ensure userId is obtained
      const baseUrl = API_BASE_URL

      // Obtain the language from the Redux store or the browser
      const language =
        state.intl.dictionaryName || navigator.language || 'pt-BR'

      await dispatch(fetchUserPreferences(userID))

      const [notifications, notificationTexts] = await Promise.all([
        loadNotifications(baseUrl, userID),
        loadNotificationTexts(language)
      ])

      const mergedNotifications = mergeNotificationsWithTexts(
        notifications,
        notificationTexts
      )
      dispatch(notificationActions.setNotifications(mergedNotifications))
    } catch (error) {
      console.error('Error fetching notifications and preferences:', error)
      dispatch(notificationActions.setLoading(false))
    }
  }

export function parseAddField(add: any): {
  assetId: string
  assetNickname: string
  data: string[]
} {
  if (typeof add === 'object') {
    return add
  }
  try {
    return JSON.parse(add)
  } catch (error) {
    console.error('Erro ao analisar o campo "add":', error)
    return { assetId: '', assetNickname: '', data: [] }
  }
}

export const mergeNotificationsWithTexts = (
  notifications: any[],
  notificationTexts: NotificationTexts
): Notification[] => {
  return notifications.map((notification) => {
    const notificationId = notification.notificationId
    const notificationClass = notification.notificationClass
    const notificationPriority =
      typeof notification.priority === 'number'
        ? notification.priority
        : parseInt(notification.priority, 10) || 0
    const userId = notification.userId
    const read = !!notification.read // Ensure it's a boolean
    const date =
      typeof notification.date === 'number'
        ? notification.date
        : new Date(notification.date).getTime()

    // Check if "add" is not null
    const add = notification.add ? parseAddField(notification.add) : null

    // Find the correct notification text data
    const textData: NotificationText | undefined = Object.values(
      notificationTexts || {}
    )
      .flatMap((category: NotificationTextCategory) =>
        Object.entries(category || {})
      )
      .find(([key]) => key === notificationClass)?.[1] as NotificationText

    // Check if textData is defined
    if (textData) {
      const body = textData.body
        ?.replace(
          '{maquina}',
          add?.assetNickname ? `<b>${add.assetNickname}</b>` : ''
        )
        .replace('{data}', add?.data ? add.data.join(', ') : '')
        .replace('{data[0]}', add?.data?.[0] || '')
        .replace('{data[1]}', add?.data?.[1] || '')
        .replace('{data[2]}', add?.data?.[2] || '')
        .replace('{data[3]}', add?.data?.[3] || '')
        .replace('{data[4]}', add?.data?.[4] || '')

      return {
        notificationId,
        notificationType: notification.notificationType,
        notificationClass,
        userId,
        priority: notificationPriority,
        date,
        read,
        add, // Pode ser null, mas é tratado acima
        title: textData.title || 'No title available', // Check if title exists
        body: body || null, // Default to null if no body
        textButton: textData.textButton || null,
        linkButton: textData.linkButton || null
      }
    }

    return {
      notificationId,
      notificationType: notification.notificationType,
      notificationClass,
      userId,
      priority: notificationPriority,
      date,
      read,
      add,
      title: 'No title available',
      body: null,
      textButton: null,
      linkButton: null
    }
  })
}
