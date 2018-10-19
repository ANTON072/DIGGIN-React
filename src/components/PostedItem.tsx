import * as React from "react"
import styled from "styled-components"
import {
  EditableText,
  Card,
  Intent,
  H2,
  Button,
  Spinner
} from "@blueprintjs/core"

import Avatar from "components/Avatar"
import GithubCard from "components/GithubCard"

const PostedItem: React.SFC<{}> = () => {
  return (
    <Root>
      <Wrapper>
        <Avatar
          // className={loadingStyle(loading)}
          avatarUrl="https://avatars3.githubusercontent.com/u/1940565?v=4"
          width={40}
          height={40}
        />
        <Main>
          <GithubCard />
        </Main>
      </Wrapper>
    </Root>
  )
}

const Root = styled(Card)`
  margin-top: 15px;
  position: relative;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const Main = styled.div`
  width: calc(100% - 55px);
`

export default PostedItem
