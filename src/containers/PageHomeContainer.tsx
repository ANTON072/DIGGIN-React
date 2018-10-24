import * as React from "react"
import { compose, lifecycle } from "recompose"
import styled from "styled-components"

import EditorContainer from "containers/EditorContainer"
import PostedItem from "components/PostedItem"

const Home: React.SFC<{}> = () => {
  return (
    <Root>
      <EditorContainer />
      {/* <Posts>
        <PostedItem />
      </Posts> */}
    </Root>
  )
}

export default compose()(Home)

const Root = styled.div``

const Posts = styled.div``
