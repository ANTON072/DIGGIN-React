import * as React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { compose, withHandlers, branch, renderComponent } from "recompose"
import { Button, Intent } from "@blueprintjs/core"
import { FaGithub } from "react-icons/fa"

import {
  actions as userActions,
  UserEntityProps
} from "redux/modules/user/entity"
import { UserProps, withLoggedIn } from "redux/modules/user"

import SearchBarContainer from "containers/SearchBarContainer"

interface HeaderContainerProps {
  user: UserProps
  handleLogin: () => void
  handleSubmit: React.FormEventHandler<HTMLFormElement>
}

export const HeaderContainer: React.SFC<HeaderContainerProps> = ({
  handleSubmit,
  user
}) => {
  const { loading } = user.app
  return (
    <Root>
      <form onSubmit={handleSubmit}>
        {/* {error.code && (
          <ErrorBlock title="ログインエラー" intent={Intent.DANGER}>
            <ul>
              <li>{error.code}</li>
              <li>{error.message}</li>
            </ul>
          </ErrorBlock>
        )} */}
        <Button type="submit" loading={loading} intent={Intent.PRIMARY}>
          <Icon size="1.2em" />
          Sign in with GitHub
        </Button>
      </form>
    </Root>
  )
}

const mapStateToProps = ({ user }: { user: UserProps }) => ({
  user
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      handleLogin: userActions.login.started
    },
    dispatch
  )

export default compose<HeaderContainerProps, {}>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withLoggedIn,
  withHandlers<HeaderContainerProps, {}>({
    handleSubmit: ({ handleLogin }) => (
      e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault()
      handleLogin()
    }
  })
)(HeaderContainer)

const Root = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
`
const Icon = styled(FaGithub)`
  margin-right: 5px;
  vertical-align: middle;
`
