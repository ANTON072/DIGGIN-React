import * as React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { compose, withHandlers } from "recompose"
import {
  EditableText,
  Card,
  Intent,
  H2,
  Button,
  TagInput
} from "@blueprintjs/core"

import { UserProps } from "redux/modules/user"

export const PostsContainer: React.SFC<{}> = () => {
  return <div>post</div>
}

const mapStateToProps = ({ user }: { user: UserProps }) => ({
  user
})

export default compose(connect())(PostsContainer)
