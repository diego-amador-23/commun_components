import React, { useMemo, useState, type ReactNode } from 'react'
import { Toast as BSToast, ToastContainer } from 'react-bootstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'
import {
  CheckIcon,
  ErrorIcon,
  ExpandLessIcon,
  NotificationsIcon,
  WarningIcon
} from '../icons'
import {
  toastActions,
  toastSelects,
  type ToastVariants
} from '../reducers/toasts'
import { colors } from '../styleGuide'
import { extractLogs } from './extractor'

interface Variant {
  primaryColor: string
  secondaryColor: string
}
interface ToastProperties {
  variant: Variant
}

const variants: Record<ToastVariants, Variant> = {
  neutral: {
    primaryColor: colors.gray.solid,
    secondaryColor: colors.white
  },
  success: {
    primaryColor: colors.success,
    secondaryColor: '#e6fbeb'
  },
  danger: {
    primaryColor: colors.danger.solid,
    secondaryColor: colors.danger.light
  },
  warning: {
    primaryColor: '#c3bc00',
    secondaryColor: '#fbfbe6'
  }
}
const icons: Record<ToastVariants, ReactNode> = {
  neutral: <NotificationsIcon />,
  success: <CheckIcon />,
  danger: <ErrorIcon />,
  warning: <WarningIcon />
}

const Container = styled.div`
  padding: 16px;
  max-height: 100vh;
  overflow-y: visible;
  display: flex;
  flex-direction: column;
`

// eslint-disable-next-line prettier/prettier
const Toast = styled(BSToast) <ToastProperties>`
  border: none;
  box-shadow: none;
  background-color: #00000000;
  width: 450px;

  .toast-sub-container {
    border-radius: 8px;
    border: 1px solid #0000002d;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }

  .toast-header {
    display: flex;
    padding-right: 16px;
    gap: 12px;
    border-bottom: none;

    background-color: ${({ variant }) => variant.primaryColor} !important;
    color: ${({ variant }) => variant.secondaryColor} !important;
    & strong {
      flex: 1;
    }

    & svg path {
      fill: ${({ variant }) => variant.secondaryColor} !important;
    }
  }

  .toast-body {
    background-color: ${({ variant }) => variant.secondaryColor} !important;
    border-end-end-radius: 8px;
    border-end-start-radius: 8px;

    main {
      display: flex;
      justify-content: space-between;
      align-items: center;

      svg {
        height: 24px;
        width: 24px;
        border-radius: 12px;
        cursor: pointer;
      }
      svg:hover {
        background-color: ${colors.danger.solid};
      }
      svg:hover path {
        fill: ${colors.danger.light};
      }
      svg path {
        fill: ${colors.danger.solid};
      }
    }

    pre {
      font-size: 10px;
      margin-top: 20px;
      width: 424px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
  .toast-body main.show-logs svg {
    transform: rotate(0.5turn);
  }
`

export const ToastProvider: React.FC = () => {
  const dispatch = useDispatch()

  const toasts = useSelector(toastSelects.allToasts)

  const [showLogs, setShowLogs] = useState(false)

  const useLogs = useMemo(() => {
    const enviroment = import.meta.env.VITE_VERSION as string | undefined
    if (enviroment === undefined) return false
    return enviroment.includes('dev-') || enviroment.includes('qa-')
  }, [import.meta.env.VITE_VERSION])

  return (
    <ToastContainer position="top-end" style={{ maxHeight: '100vh' }}>
      <PerfectScrollbar>
        <Container>
          {toasts.map((toast) => (
            <Toast
              show
              key={toast.key}
              variant={variants[toast.variant]}
              onClose={() => {
                dispatch(toastActions.remove(toast.key))
              }}
            >
              <div className="toast-sub-container">
                <BSToast.Header>
                  {icons[toast.variant]}
                  <strong>{toast.head}</strong>
                </BSToast.Header>
                <BSToast.Body>
                  <main className={showLogs ? 'show-logs' : ''}>
                    {toast.body}
                    {useLogs && (
                      <ExpandLessIcon
                        onClick={() => {
                          setShowLogs(!showLogs)
                        }}
                      />
                    )}
                  </main>

                  {showLogs && useLogs && (
                    <pre>{extractLogs(toast.error) ?? 'Erro nos logs'}</pre>
                  )}
                </BSToast.Body>
              </div>
            </Toast>
          ))}
        </Container>
      </PerfectScrollbar>
    </ToastContainer>
  )
}
