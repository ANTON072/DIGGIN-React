import * as React from "react"
import styled from "styled-components"
import { Card, Elevation, H3 } from "@blueprintjs/core"

import Avatar from "components/Avatar"

export interface GithubCardProps {
  fullName: string | null
  htmlUrl: string | null
  description: string | null
  avatarUrl: string | null
}

const GithubCard: React.SFC<{ data: GithubCardProps }> = ({ data }) => {
  return (
    <Root interactive={true} elevation={Elevation.TWO}>
      <Wrapper>
        <Avatar avatarUrl={data.avatarUrl} width={90} height={90} />
        <Main>
          <H3>{data.fullName}</H3>
          <div>
            <p>{data.description}</p>
          </div>
        </Main>
      </Wrapper>
    </Root>
  )
}

const Root = styled(Card)`
  position: relative;
  width: 100%;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const Main = styled.div`
  width: calc(100% - 105px);
`

export default GithubCard
