import * as React from "react"
import styled from "styled-components"

export default class Login extends React.Component {
  render() {
    return (
      <Root>
        <Contents>root</Contents>
      </Root>
    )
  }
}

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.Colors.LIGHT_GRAY5};
`

const Contents = styled.div``
