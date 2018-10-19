import * as React from "react"
import styled from "styled-components"
import {
  EditableText,
  Card,
  Elevation,
  Intent,
  H3,
  Button,
  Spinner,
  Icon
} from "@blueprintjs/core"

import Avatar from "components/Avatar"

const GithubCard: React.SFC<{}> = () => {
  return (
    <Root interactive={true} elevation={Elevation.TWO}>
      <LinkIcon icon="link" />
      <Wrapper>
        <Avatar
          // className={loadingStyle(loading)}
          avatarUrl="https://avatars3.githubusercontent.com/u/1940565?v=4"
          width={90}
          height={90}
        />
        <Main>
          <H3>Card heading</H3>
          <div>
            <p>このライブラリは最高にいいです。</p>
          </div>
        </Main>
      </Wrapper>
    </Root>
  )
}

const Root = styled(Card)`
  position: relative;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const Main = styled.div`
  width: calc(100% - 105px);
`

const LinkIcon = styled(Icon)`
  position: absolute;
  top: 15px;
  right: 15px;
  color: #2b95d6;
`

export default GithubCard
