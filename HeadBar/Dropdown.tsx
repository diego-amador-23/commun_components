import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { sessionSelects } from '..'
import { LogoutIcon } from '../icons'
import { Container, OptionsList, UserImage } from './styled'

const LogoutDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [cursorInList, setCursorInList] = useState(false)

  const userName = useSelector(sessionSelects.userName)

  const userNameSplit = useMemo(() => {
    const names = userName.split(' ')
    let name = names[0]
    const lastName = names[names.length - 1]

    if (lastName !== name && lastName !== '') {
      name = `${name} ${lastName}`
    }

    return name
  }, [userName])

  const handleLogout = (): void => {
    setIsOpen(false)
    setCursorInList(false)
    const mdspLogoutButton = document.getElementById('mdsp-logout-submit')
    if (mdspLogoutButton !== null) mdspLogoutButton.click()
  }

  return (
    <Container className="dropdown">
      <main
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <UserImage>
          {userNameSplit
            .split(' ')
            .map((name) => name[0])
            .join('')}
        </UserImage>
        <span className="d-none d-sm-flex">{userNameSplit}</span>
      </main>
      <OptionsList
        $isOpen={isOpen || cursorInList}
        onMouseEnter={() => {
          setCursorInList(true)
        }}
        onMouseLeave={() => {
          setIsOpen(false)
          setCursorInList(false)
        }}
      >
        <li className="d-flex d-sm-none">
          <span>{userName}</span>
        </li>
        <hr className="m-0" />
        <li onClick={handleLogout}>
          <LogoutIcon /> Sair
        </li>
      </OptionsList>
    </Container>
  )
}

export default LogoutDropdown
