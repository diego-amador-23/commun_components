import { styled } from 'styled-components'
import { colors } from '../styleGuide'

export const Container = styled.div`
  main {
    height: 100%;
    color: ${colors.white};
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: default;
    padding: 0 24px;
    border-left: 1px solid ${colors.white};
  }
`

export const OptionsList = styled.ul<{ $isOpen: boolean }>`
  list-style: none;
  display: ${(properties) => (properties.$isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: #f9f9f9;
  min-width: 100%;
  padding: 0;
  z-index: 100;
  border: 1px solid ${colors.gray.solid};
  border-radius: 4px;
  top: 48px;
  right: 5px;

  li {
    color: ${colors.default.solid};
    font-weight: 700;
    margin: 8px 0px;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 20px;
    cursor: pointer;

    svg {
      width: 24px;
      height: 24px;
    }
    svg path {
      fill: ${colors.default.solid};
    }

    &:hover {
      background-color: #0067a61a;
    }
  }
`

export const UserImage = styled.div`
  background-color: ${colors.white};
  color: ${colors.default.solid};
  height: 32px;
  width: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`
