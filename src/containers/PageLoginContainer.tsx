import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import styled from "styled-components"
import { Button, Callout, Intent } from "@blueprintjs/core"
import { FaGithub } from "react-icons/fa"
import { compose, withHandlers, lifecycle } from "recompose"
import { Redirect } from "react-router-dom"
import { Helmet } from "react-helmet"

import {
  actions as pageLoginActions,
  LoginState
} from "redux/modules/pageLogin"
import { withLoggedIn } from "redux/modules/user"
import { AppToaster } from "factories/toaster"

interface HandlerProps {
  loginAction: () => void
  handleSubmit: React.FormEventHandler<HTMLFormElement>
}

type EnhancedProps = LoginState & HandlerProps

const Login: React.SFC<EnhancedProps> = ({
  loading,
  handleSubmit,
  error,
  loggedIn
}) => {
  if (loggedIn) {
    return <Redirect to="/" />
  }
  return (
    <Root>
      <Helmet>
        <title>ログイン</title>
      </Helmet>
      <Form onSubmit={handleSubmit}>
        {error.code && (
          <ErrorBlock title="ログインエラー" intent={Intent.DANGER}>
            <ul>
              <li>{error.code}</li>
              <li>{error.message}</li>
            </ul>
          </ErrorBlock>
        )}
        <LoginButton type="submit" loading={loading}>
          <Icon size="1.2em" />
          Sign in with GitHub
        </LoginButton>
      </Form>
    </Root>
  )
}

const mapStateToProps = ({ pageLogin }: { pageLogin: LoginState }) => ({
  error: pageLogin.error,
  loading: pageLogin.loading,
  loggedIn: pageLogin.loggedIn
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      loginAction: pageLoginActions.login.started
    },
    dispatch
  )

export default compose<EnhancedProps, {}>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withLoggedIn,
  withHandlers<EnhancedProps, {}>({
    handleSubmit: ({ loginAction }) => (
      e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault()
      loginAction()
    }
  }),
  lifecycle<EnhancedProps, {}>({
    shouldComponentUpdate(nextProps) {
      if (nextProps.loggedIn !== this.props.loggedIn) {
        AppToaster.show({ message: "ログインしました", intent: Intent.PRIMARY })
      }
      return true
    }
  })
)(Login)

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Form = styled.form`
  width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const ErrorBlock = styled(Callout)`
  margin-bottom: 20px;
  ul {
    padding: 0;
  }
`

const LoginButton = styled(Button)`
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-weight: bold;
`

const Icon = styled(FaGithub)`
  margin-right: 5px;
  vertical-align: middle;
`
