import * as React from "react"
import styled from "styled-components"
import { compose } from "recompose"
import { Tag } from "@blueprintjs/core"

const TagIndex: React.SFC<{}> = ({ ...rest }) => {
  return (
    <Root {...rest}>
      <List>util</List>
      <List>redux</List>
      <List>router</List>
      <List>animation</List>
      <List>tips</List>
      <List>mobx</List>
      <List>store</List>
      <List>設計</List>
    </Root>
  )
}

export default TagIndex

const Root = styled.div`
  margin: -2px;
`

const List = styled(Tag)`
  margin: 2px;
`
