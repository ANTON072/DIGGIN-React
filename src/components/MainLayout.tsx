import * as React from "react"
import { Route } from "react-router-dom"
import styled from "styled-components"

import HeaderContainer from "containers/HeaderContainer"
import SidebarContainer from "containers/SidebarContainer"

const MainLayout: React.SFC<any> = ({
  component: Component,
  ...rest
}: {
  component: React.ComponentClass<{}, {}>
}) => (
  <Route
    {...rest}
    render={matchProps => (
      <Root>
        <SidebarContainer />
        <Main>
          <HeaderContainer />
          <Component {...matchProps} />
        </Main>
      </Root>
    )}
  />
)

export default MainLayout

const Root = styled.div`
  width: 930px;
  padding: 16px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

const Main = styled.main`
  width: 591px;
`
