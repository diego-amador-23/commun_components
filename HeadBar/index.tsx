import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { RomiIcon, RomiLogo } from '../icons'
import { colors } from '../styleGuide'
import LogoutDropdown from './Dropdown'
import Notification from '../NotificationDropdown'

type Variant = 'blue' | 'green'

const background: Record<Variant, string> = {
  blue: colors.headBarBackground,
  green: colors.rental.default
}

const Container = styled.div<{ $variant: Variant }>`
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ $variant }) => background[$variant]};
  box-shadow: 3px 0px 8px #00000090;
  z-index: 999;
  width: 100%;
  position: fixed;
  top: 0;

  & > .romi-logo-container {
    flex: 1;
  }

  .romi-logo {
    margin-left: 24px;
    height: 32px;
    width: auto;
  }

  .romi-icon {
    margin-left: 24px;
    height: 38px;
    width: auto;
  }

  svg path {
    fill: white;
  }

  & > div.version {
    text-align: center;
    color: #ffffff40;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 16px;

    &:hover {
      color: ${colors.white};
    }
  }
`

const homePage = import.meta.env.VITE_LINK_TO_HOME_PAGE as string | undefined

interface Properties {
  variant?: Variant
}

export const HeadBar: React.FC<Properties> = (properties) => {
  const [copyVersion, setCopyVersion] = useState(false)

  const initOsBar = (): void => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.onload = () => {
      _mdsp.init({
        initialize: true,
        appId: 'root'
      })
    }
    script.src = 'https://static.eu1.mindsphere.io/osbar/v4/js/main.min.js'
    document.head.appendChild(script)
    const style = document.createElement('style')
    style.innerHTML = '#_mdspbar { display: none !important; }'
    document.head.appendChild(style)
  }

  useEffect(() => {
    initOsBar()
    if (copyVersion) {
      void navigator.clipboard.writeText(
        import.meta.env.VITE_VERSION.split('-')[1]
      )
      setTimeout(() => {
        setCopyVersion(false)
      }, 2000)
    }
  }, [copyVersion])

  return (
    <Container $variant={properties.variant ?? 'blue'}>
      {homePage !== undefined && homePage !== '' ? (
        <a href={homePage} className="romi-logo-container">
          <RomiLogo className="romi-logo d-none d-sm-block" />
          <RomiIcon className="romi-icon d-block d-sm-none" />
        </a>
      ) : (
        <div className="romi-logo-container">
          <RomiLogo className="romi-logo d-none d-sm-block" />
          <RomiIcon className="romi-icon d-block d-sm-none" />
        </div>
      )}

      <div
        className="version"
        onClick={() => {
          setCopyVersion(true)
        }}
      >
        {copyVersion
          ? 'versão copiada!'
          : `v_${import.meta.env.VITE_VERSION as string}`}
      </div>
      <div>
        <Notification />
      </div>
      <LogoutDropdown />
    </Container>
  )
}
