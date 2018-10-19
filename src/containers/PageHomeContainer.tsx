import * as React from "react"
import { compose, lifecycle } from "recompose"
import styled from "styled-components"

const Home: React.SFC<{}> = () => {
  return <Root>Home</Root>
}

export default compose()(Home)

const Root = styled.div``
