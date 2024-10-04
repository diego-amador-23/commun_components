import React, { type ReactNode } from 'react'
import { Modal as BModal } from 'react-bootstrap'
import { styled } from 'styled-components'
import { CloseIcon } from '../icons'
import Button from '../../src/components/Button'

const Container = styled.div`
  .modal-header {
    padding: 24px 24px 20px;
    font-size: 28px;
    border: none;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    & > button {
      border: none;
    }

    & .h4 {
      font-weight: 700 !important;
    }
  }

  .modal-body {
    padding: 0 16px 16px;
    border: none;
  }
`

interface Properties {
  show: boolean
  onClose: () => void
  title: React.ReactNode
  children?: ReactNode
}

const Modal: React.FC<Properties> = (properties) => {
  return (
    <BModal show={properties.show} onHide={properties.onClose} centered>
      <Container>
        <BModal.Header>
          <BModal.Title>{properties.title}</BModal.Title>
          <Button variant="secondary" onClick={properties.onClose}>
            <CloseIcon />
          </Button>
        </BModal.Header>
        <BModal.Body>{properties.children}</BModal.Body>
      </Container>
    </BModal>
  )
}

export default Modal
