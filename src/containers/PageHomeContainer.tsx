import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { compose, lifecycle } from "recompose"
import styled from "styled-components"

import EditorContainer from "containers/EditorContainer"
import PostsContainer from "containers/PostsContainer"
import { actions as entitiesActions } from "redux/modules/entities"

const Home: React.SFC<{}> = () => {
  return (
    <Root>
      <EditorContainer />
      <PostsContainer />
    </Root>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetch: entitiesActions.fetch.started
    },
    dispatch
  )

export default compose(
  connect(
    null,
    mapDispatchToProps
  )
  // lifecycle({
  //   componentDidMount() {
  //     this.props.fetch({ category: "Post" })
  //   }
  // })
)(Home)

const Root = styled.div``
