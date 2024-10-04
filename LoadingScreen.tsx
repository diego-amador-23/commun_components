import React from 'react'
import styled from 'styled-components'
import { RomiLogo } from './icons'

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`

const LoadingScreen: React.FC = () => {
  return (
    <Container>
      <RomiLogo />
      <h3>Loading settings...</h3>
    </Container>
  )
}

export default LoadingScreen
