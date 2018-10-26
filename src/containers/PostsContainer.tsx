import * as React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { compose, withHandlers, lifecycle, pure } from "recompose"
import {
  EditableText,
  Card,
  Intent,
  H2,
  Button,
  TagInput
} from "@blueprintjs/core"

import { UserProps } from "redux/modules/user"
import { PostProps } from "redux/modules/posts"
import { actions as postsActions, withEntities } from "redux/modules/posts/list"

import PostedItem from "components/PostedItem"

export const PostsContainer: React.SFC<{}> = ({ postData }) => {
  return postData.map(post => {
    return <PostedItem key={post.id} {...post} />
  })
}

const mapStateToProps = ({
  user,
  posts,
  entities
}: {
  user: UserProps
  posts: PostProps
}) => ({
  user,
  posts,
  entities
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
  withEntities,
  lifecycle({
    componentDidMount() {
      // this.props.get()
    }
  })
)(PostsContainer)
