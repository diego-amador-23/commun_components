import React, { useEffect, useState, type ReactNode } from 'react'
import { LeftIcon, RightIcon } from '../icons'
import {
  MenuContainer,
  MenuExpandToggler,
  MenuItem,
  MenuList,
  MenuMobile,
  OptionsMenuMobile
} from './styles'

export interface MenuOption {
  key: string
  description: string
  icon: ReactNode
}

interface Properties {
  defaultOption: string
  options: MenuOption[]
  onChange: (key: string) => void
}

export const Menu: React.FC<Properties> = (properties) => {
  const [selected, setSelected] = useState(properties.defaultOption)
  const [expandMenu, setExpandMenu] = useState(true)

  useEffect(() => {
    properties.onChange(properties.defaultOption)
  }, [])

  useEffect(() => {
    if (window.screen.width < 991.98) {
      setExpandMenu(false)
    }
  }, [window.screen.width])

  return (
    <>
      <MenuContainer
        expand={expandMenu}
        className={`d-none d-sm-flex ${expandMenu ? 'expanded' : ''}`}
      >
        <div style={{ display: 'flex', flex: '1' }}>
          <MenuList>
            {properties.options.map((option) => (
              <MenuItem
                selected={option.key === selected}
                key={option.key}
                expand={expandMenu}
                onClick={() => {
                  setSelected(option.key)
                  properties.onChange(option.key)
                }}
              >
                {option.icon}
                <span className={expandMenu ? 'show' : undefined}>
                  {option.description}
                </span>
              </MenuItem>
            ))}
          </MenuList>
          <MenuExpandToggler
            className="d-none d-lg-flex"
            onClick={() => {
              setExpandMenu(!expandMenu)
            }}
          >
            {expandMenu ? <LeftIcon /> : <RightIcon />}
          </MenuExpandToggler>
        </div>
      </MenuContainer>

      <MenuMobile
        className="fixed-bottom w-100 d-flex d-sm-none justify-content-evenly align-items-center bg-white"
        style={{ height: '55px' }}
      >
        {properties.options.map((option) => (
          <OptionsMenuMobile
            selected={option.key === selected}
            key={option.key}
            expand={expandMenu}
            onClick={() => {
              setSelected(option.key)
              properties.onChange(option.key)
            }}
          >
            {option.icon}
          </OptionsMenuMobile>
        ))}
      </MenuMobile>
    </>
  )
}
