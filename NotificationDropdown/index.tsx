import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaCog } from 'react-icons/fa'
import { NotificationsIcon } from '../icons'
import {
  notificationSelectors,
  markNotificationAsReadAsync,
  saveUserPreferences,
  notificationActions
} from '../reducers/notification'
import { fetchNotifications, fetchUserPreferences } from '../hooks/notification'
import { intlSelections } from '../reducers'
import {
  Container,
  Dropdown,
  NotificationTitle,
  NotificationItem,
  NotificationFooter,
  NotificationItemDate,
  ModalTitleContent,
  ModalTitle,
  ModalBodyContent,
  ModalContent,
  ModalButton,
  ToggleContainer,
  Label,
  ToggleSwitch
} from './styled'
import Modal from '../Modal/Modal'
import { AppDispatch } from '../../src/store'
import _ from 'lodash'
import NotificationModal from './NotificationModal'

interface Notification {
  notificationId: string
  title: string
  read: boolean
  body: string
  priority: number
  date: number
}

const Notification: React.FC = () => {
  // Format date utility function
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // State management
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [produtividade, setProdutividade] = useState(false)
  const [comunicacao, setComunicacao] = useState(false)
  const [promocoes, setPromocoes] = useState(false)
  const [loading, setLoading] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch<AppDispatch>()
  const notifications = useSelector(notificationSelectors.notifications)

  // Redux state selectors
  const preferences = useSelector(notificationSelectors.preferences)
  const userId = useSelector(
    (state: { notifications: { userId: string } }) => state.notifications.userId
  )
  const dictionary = useSelector(intlSelections.dictionary)

  // Helper variables
  const hasNotifications = notifications && notifications.length > 0
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.read
  )
  const isButtonDisabled = loading || !hasNotifications

  // Fetch notifications and user preferences on component mount
  useEffect(() => {
    dispatch(
      notificationActions.setUserId('23031972-9a89-4d8e-b789-4d892e4a5d08')
    )
    dispatch(fetchNotifications())
    if (userId) dispatch(fetchUserPreferences(userId))
  }, [dispatch, userId])

  // Update toggles based on user preferences
  useEffect(() => {
    if (preferences) {
      setProdutividade(preferences.produtividade)
      setComunicacao(preferences.comunicacao)
      setPromocoes(preferences.promocoes)
    }
  }, [preferences])

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification)
    setShowModal(true)

    if (!notification.read) {
      dispatch(markNotificationAsReadAsync(notification.notificationId))
    }
  }

  // Handle historical click
  const handleHistoricoClick = () => {
    window.location.href = 'http://127.0.0.1:4000/'
  }

  // Save user preferences
  const handleSaveConfig = () => {
    setLoading(true)
    const updatedPreferences = { produtividade, comunicacao, promocoes }

    dispatch(saveUserPreferences({ userId, preferences: updatedPreferences }))
      .unwrap()
      .catch((error: string) => {
        console.log(`Error saving preferences:${error}`)
      })
      .then(() => {
        setShowConfigModal(false)
      })
  }

  // Sort notifications using memoization
  const sortedNotifications = useMemo(() => {
    return _.orderBy(
      notifications,
      ['read', 'priority', 'date'],
      ['asc', 'desc', 'desc']
    ).slice(0, 6)
  }, [notifications])

  return (
    <Container>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => !isButtonDisabled && setShowDropdown(!showDropdown)}
          disabled={isButtonDisabled}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
            opacity: isButtonDisabled ? 0.5 : 1
          }}
        >
          <NotificationsIcon />
          {hasUnreadNotifications && <label />}
        </button>
      </div>
      {showDropdown && (
        <Dropdown ref={dropdownRef}>
          <NotificationTitle>
            {dictionary.header.menuDropdown.titulo}
            <FaCog
              onClick={() => setShowConfigModal(true)}
              style={{ cursor: 'pointer', width: '1rem', position: 'relative' }}
            />
          </NotificationTitle>
          {sortedNotifications.map((notification) => (
            <NotificationItem
              key={notification.notificationId}
              read={notification.read}
              onClick={() => handleNotificationClick(notification)}
            >
              {notification.title}
              <NotificationItemDate>
                {formatDate(notification.date)}
              </NotificationItemDate>
            </NotificationItem>
          ))}
          <NotificationFooter onClick={handleHistoricoClick}>
            {dictionary.header.menuDropdown.botaoHistorico}
          </NotificationFooter>
        </Dropdown>
      )}

      {selectedNotification && (
        <NotificationModal
          show={showModal}
          onClose={() => setShowModal(false)}
          notification={selectedNotification}
        />
      )}

      {showConfigModal && (
        <Modal
          show={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          title={
            <ModalTitleContent>
              <ModalTitle>{dictionary.header.modalConfig.titulo}</ModalTitle>
            </ModalTitleContent>
          }
        >
          <ModalBodyContent>
            <ModalContent>
              <p>{dictionary.header.modalConfig.texto}</p>
              <ToggleContainer>
                <Label>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      checked={produtividade}
                      onChange={() => setProdutividade(!produtividade)}
                    />
                    <span className="slider"></span>
                  </ToggleSwitch>
                  {dictionary.header.modalConfig.produtividade}
                </Label>
              </ToggleContainer>

              <ToggleContainer>
                <Label>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      checked={comunicacao}
                      onChange={() => setComunicacao(!comunicacao)}
                    />
                    <span className="slider"></span>
                  </ToggleSwitch>
                  {dictionary.header.modalConfig.comunicacao}
                </Label>
              </ToggleContainer>

              <ToggleContainer>
                <Label>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      checked={promocoes}
                      onChange={() => setPromocoes(!promocoes)}
                    />
                    <span className="slider"></span>
                  </ToggleSwitch>
                  {dictionary.header.modalConfig.promocoes}
                </Label>
              </ToggleContainer>
            </ModalContent>

            <ModalButton onClick={handleSaveConfig} disabled={loading}>
              {loading
                ? dictionary.header.modalConfig.botaoSalvando
                : dictionary.header.modalConfig.botaoSalvar}
            </ModalButton>
          </ModalBodyContent>
        </Modal>
      )}
    </Container>
  )
}

export default Notification
