export interface Notification {
  notificationId: string
  notificationType: string
  notificationClass: string
  userId: string
  priority: number
  date: number
  read: boolean
  add: {
    assetId?: string
    assetNickname: string
    data: string[]
  } | null
  title: string
  body?: string | null | undefined
  textButton?: string | null
  linkButton?: string | null
  isFeedback?: boolean
}

export interface NotificationText {
  title: string
  body: string
  textButton: string | null
  linkButton: string | null
}

export interface UserPreferences {
  produtividade: boolean
  comunicacao: boolean
  promocoes: boolean
}

export interface NotificationState {
  notifications: Notification[]
  preferences: UserPreferences | null
  userId: string | null
  loading: boolean
  error: string | null
}
