import React from 'react'
import DOMPurify from 'dompurify'
import Modal from '../Modal/Modal'
import { InfoIcon, ProdIcon, PromoIcon, WarningIcon } from '../icons'
import {
  ModalTitleContent,
  ModalTitle,
  ModalDate,
  ModalBodyContent,
  ModalContent,
  ModalButton,
  NotificationItemIcon,
  ModalId
} from './styled'
import { colors } from '../styleGuide'

interface Notification {
  notificationId: string
  title: string
  body?: string
  notificationType: NotificationType
  read: boolean
  date: number
  linkButton?: string
  textButton?: string
}

interface NotificationModalProps {
  show: boolean
  onClose: () => void
  notification: Notification
}

type NotificationType =
  | 'alertAlarm'
  | 'alertProductivity'
  | 'alertPromotion'
  | 'alertCommunication'

export const getIconByType = (
  notificationType: NotificationType,
  read: boolean
): React.ReactElement => {
  const getColor = (defaultColor: string): string =>
    read ? '#d3d3d3' : defaultColor

  const renderIcon = (
    Icon: React.ComponentType,
    color: string
  ): React.ReactElement => (
    <Icon
      style={{
        fill: getColor(color),
        color: getColor(color),
        width: '2.2rem',
        height: '2.2rem'
      }}
    />
  )

  switch (notificationType) {
    case 'alertAlarm':
      return renderIcon(WarningIcon, '#991435')
    case 'alertProductivity':
      return renderIcon(ProdIcon, colors.default.solid)
    case 'alertPromotion':
      return renderIcon(PromoIcon, colors.rental.default)
    case 'alertCommunication':
      return renderIcon(InfoIcon, colors.default.solid)
    default:
      return renderIcon(InfoIcon, colors.default.solid)
  }
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  show,
  onClose,
  notification
}) => {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Sanitizing the HTML content using DOMPurify before rendering
  const sanitizedBody = notification.body
    ? DOMPurify.sanitize(notification.body)
    : 'No content available'

  return (
    <Modal
      show={show}
      onClose={onClose}
      title={
        <ModalTitleContent>
          <NotificationItemIcon>
            {getIconByType(notification.notificationType, false)}
          </NotificationItemIcon>
          <ModalTitle>
            {notification.title || 'Notification Details'}
            <ModalDate>{formatDate(notification.date)}</ModalDate>
          </ModalTitle>
        </ModalTitleContent>
      }
    >
      <ModalBodyContent>
        <ModalContent>
          <p dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
          <ModalId>Notification ID: {notification.notificationId}</ModalId>
        </ModalContent>
        {notification.textButton && notification.linkButton && (
          <ModalButton>
            <a
              href={notification.linkButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              {notification.textButton}
            </a>
          </ModalButton>
        )}
      </ModalBodyContent>
    </Modal>
  )
}

export default NotificationModal
