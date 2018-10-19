import * as React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { compose, withStateHandlers } from "recompose"
import {} from "@blueprintjs/core"
import { Suggest } from "@blueprintjs/select"

export const SearchBar: React.SFC<{}> = () => {
  return (
    <Root>
      <Suggest items={[]} itemRenderer={() => {}} onItemSelect={() => {}} />
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
`

export default compose(connect(null))(SearchBar)
