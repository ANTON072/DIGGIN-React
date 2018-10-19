import * as React from "react"
import { compose, lifecycle } from "recompose"
import styled from "styled-components"

import EditPostContainer from "containers/EditPostContainer"

const Home: React.SFC<{}> = () => {
  return (
    <Root>
      <EditPostContainer />
      <p>home</p>
    </Root>
  )
}

export default compose()(Home)

const Root = styled.div``
