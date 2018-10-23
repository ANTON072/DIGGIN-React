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

const Root = styled.div``

export default compose(connect(null))(SearchBar)
