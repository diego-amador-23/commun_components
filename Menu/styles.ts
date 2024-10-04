import { css, styled } from 'styled-components'
import { colors } from '../styleGuide'

interface MenuItemProperties {
  selected: boolean
  expand: boolean
}

export const MenuContainer = styled.div<{ expand: boolean }>`
  width: 48px;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  background-color: ${colors.white};
  box-shadow: 3px 0px 6px #00000029;
  transition: width 0.3s;

  &.expanded {
    width: 260px;
  }
`

export const MenuList = styled.ul`
  flex: 1;
  margin: 0;
  padding: 0;
  list-style: none;
`
export const MenuItem = styled.li<MenuItemProperties>`
  display: flex;
  align-items: center;
  ${({ expand }) =>
    expand
      ? css`
          padding: 0 0 0 24px;
        `
      : css`
          padding: 0 0 0 12px;
        `};
  margin: 0;
  gap: 8px;
  height: 48px;
  transition: padding 0.3s, background-color 0.5s, color 0.5s;

  svg {
    width: 24px;
    height: 24px;
  }
  svg path {
    transition: fill 0.5s;
  }

  span {
    flex: 1;
    margin: 0;
    visibility: hidden;
    opacity: 0;
    width: 0px;
    transition: visibility 0.3s, opacity 0.3s, width 0.3s;
    transition-delay: 1;
  }
  span.show {
    visibility: visible;
    width: 150px;
    opacity: 1;
  }

  &:nth-child(2) svg path.dashboard-path {
    stroke: #000;
  }

  ${(properties) =>
    properties.selected
      ? css`
          background-color: ${colors.default.solid};
          color: ${colors.white};
          font-weight: 700;

          svg path {
            fill: ${colors.white};
          }

          &:nth-child(2) svg path.dashboard-path {
            stroke: #fff;
            fill: ${colors.default.solid} !important;
          }

          &:hover {
            cursor: default;
          }
        `
      : css`
          &:hover {
            cursor: pointer;
            background-color: ${colors.default.light};
            color: ${colors.default.solid};

            svg path {
              fill: ${colors.default.solid};
            }

            &:nth-child(2) svg path.dashboard-path {
              stroke: ${colors.default.solid};
              fill: white;
            }
          }
        `};
`

export const MenuExpandToggler = styled.div`
  background-color: ${colors.default.solid};
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 20px;
  cursor: pointer;
  margin: auto 0px;
  margin-left: -20px;
  padding: 0;
  position: relative;
  left: 21px;
  z-index: 100;

  svg {
    width: 20px;
    height: 20px;
  }
  svg path {
    fill: white;
  }
`

export const OptionsMenuMobile = styled.div<MenuItemProperties>`
  svg {
    width: 28px;
    height: 28px;
  }
  ${(properties) =>
    properties.selected
      ? css`
          &:first-child svg path {
            fill: #4682b4;
          }

          &:nth-child(2) svg path {
            stroke: #4682b4;
          }
        `
      : css``};
`

export const MenuMobile = styled.div`
  box-shadow: 0px -3px 6px #00000029;
`
