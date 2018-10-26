import * as React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { compose, withHandlers, lifecycle } from "recompose"
import {
  EditableText,
  Card,
  Intent,
  H2,
  Button,
  TagInput
} from "@blueprintjs/core"

import { UserProps } from "redux/modules/user"
import { actions as postsActions } from "redux/modules/posts"

export const PostsContainer: React.SFC<{}> = () => {
  return <div>post</div>
}

const mapStateToProps = ({ user }: { user: UserProps }) => ({
  user
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      get: postsActions.get.started
    },
    dispatch
  )

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  lifecycle({
    componentDidMount() {
      console.log("did mount")
      this.props.get()
    }
  })
)(PostsContainer)
