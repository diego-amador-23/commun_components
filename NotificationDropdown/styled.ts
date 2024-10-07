import styled from 'styled-components'
import { colors } from '../styleGuide'

export const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  margin: 0 1rem 0 0;
  position: relative;

  svg {
    height: 28px;
    width: auto;
    cursor: pointer;
    margin: 0 -4px;
  }

  label {
    background-color: ${colors.danger.solid};
    color: ${colors.white};
    font-size: 0.7rem;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    border: 1px solid ${colors.danger.solid};
    position: absolute;
    right: 8px;
    top: 2px;
    cursor: pointer;
    margin-right: -12px;
  }
`
export const Dropdown = styled.div`
  position: absolute;
  top: 50px;
  right: -32px;
  width: 280px;
  background-color: ${colors.white};
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0;
  z-index: 1000;

  /* Seta no topo do dropdown */
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    right: 30px;
    border-width: 0 10px 10px 10px;
    border-style: solid;
    border-color: transparent transparent ${colors.default.solid} transparent;
  }
  @media (max-width: 768px) {
  }
`
export const NotificationTitle = styled.h3`
  margin: 0;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.white};
  background-color: ${colors.default.solid};
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`
export const NotificationItem = styled.div<{ read: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${colors.black};
  padding: 12px 16px;
  cursor: pointer;
  opacity: ${({ read }) => (read ? '0.6' : '1')}; /* Opacidade para lidas */
  font-weight: ${({ read }) =>
    read ? 'normal' : 'bold'}; /* Negrito para não lidas */

  &:hover {
    background-color: ${colors.collapsible.background.blue};
  }
`
export const NotificationItemDate = styled.div``
export const NotificationItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
export const NotificationFooter = styled.div`
  margin-top: 0;
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  font-size: 0.9rem;
  color: ${colors.white};
  background-color: ${colors.default.solid};
  font-weight: 700;
  cursor: pointer;
  border-radius: 0 0 8px 8px;

  &:hover {
    background-color: ${colors.default.solid};
  }

  svg {
    margin-left: 8px;
  }
`
export const ModalTitleContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const ModalTitle = styled.div`
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: initial;
`
export const ModalId = styled.div`
  font-size: 12px;
  color: #a1a1a1;
`
export const ModalDate = styled.div`
  font-size: 12px;
  color: #a1a1a1;
  display: flex;
  flex-direction: column;
`
export const ModalBodyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  word-break: break-word; /* Garante que palavras longas sejam quebradas */
  overflow-wrap: break-word; /* Garante que o texto se ajuste à largura do modal */
  padding: 0rem; /* Adiciona um espaçamento interno */
  max-width: 100%; /* Garante que o conteúdo não ultrapasse a largura do modal */
`
export const ModalContent = styled.p`
  border: 1px solid;
  padding: 1rem 1rem 0.5rem 1rem;
  border-color: #dfdfdf;
  border-radius: 0.75rem;
  max-width: 100%; /* Limita a largura máxima do conteúdo */
  overflow: hidden; /* Garante que o conteúdo não extrapole as bordas */
  word-break: break-word; /* Garante quebra de palavra */
  text-align: justify; /* Centraliza o texto no modal */
`
export const ModalButton = styled.button`
  background-color: #00568b;
  color: #f2f7fb;
  border-radius: 0.25rem;
  border-color: transparent;
  padding: 0.25rem 2rem;
  cursor: pointer;
  a {
    text-decoration: none;
    color: #f2f7fb;
  }
`
export const ToggleContainer = styled.div`
  margin: 10px 0;
`
export const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 16px;
`
export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
  margin-right: 10px;

  & input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  & .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
  }

  & input:checked + .slider {
    background-color: #007bff;
  }

  & .slider:before {
    position: absolute;
    content: '';
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background-color: white;
    transition: 0.4s;
    left: 4px;
    bottom: 4px;
  }

  & input:checked + .slider:before {
    transform: translateX(14px);
  }
`
