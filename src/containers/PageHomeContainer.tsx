import * as React from "react"
import { compose, lifecycle } from "recompose"
import styled from "styled-components"

import SearchBarContainer from "containers/SearchBarContainer"
import EditPostContainer from "containers/EditPostContainer"
import PostedItem from "components/PostedItem"

const Home: React.SFC<{}> = () => {
  return (
    <Root>
      <SearchBarContainer />
      <EditPostContainer />
      <Posts>
        <PostedItem />
      </Posts>
    </Root>
  )
}

export default compose()(Home)

const Root = styled.div``

const Posts = styled.div``
