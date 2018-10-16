import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import styled from "styled-components"
import { FormGroup, Button, InputGroup } from "@blueprintjs/core"
import { compose, withHandlers } from "recompose"

import {
  actions as pageLoginActions,
  PageLoginState,
  InputAction
} from "redux/modules/pageLogin"

interface Props {
  inputAction: (params: InputAction) => void
  loginAction: () => void
}

interface HandlerProps {
  handleSubmit: React.FormEventHandler<HTMLFormElement>
  handleChange: (inputType: string) => React.FormEventHandler<HTMLInputElement>
}

type EnhancedProps = Props & PageLoginState & HandlerProps

const Login: React.SFC<EnhancedProps> = ({
  input,
  error,
  handleSubmit,
  handleChange
}) => {
  return (
    <Root>
      <Contents>
        <form onSubmit={handleSubmit}>
          <FormGroup
            label="Your Email Address"
            labelInfo="(required)"
            helperText={error.email}
          >
            <InputGroup
              type="email"
              value={input.email}
              onChange={handleChange("email")}
              autoFocus
              required
            />
          </FormGroup>
          <FormGroup
            label="Your Password"
            labelInfo="(required)"
            helperText={error.password}
          >
            <InputGroup
              type="password"
              value={input.password}
              onChange={handleChange("password")}
              required
            />
          </FormGroup>
          <Buttons>
            <LoginButton icon="log-in" type="submit">
              Login
            </LoginButton>
          </Buttons>
        </form>
      </Contents>
    </Root>
  )
}

const mapStateToProps = ({ pageLogin }: { pageLogin: PageLoginState }) => ({
  input: pageLogin.input,
  error: pageLogin.error
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      inputAction: pageLoginActions.input,
      loginAction: pageLoginActions.login.started
    },
    dispatch
  )

export default compose<EnhancedProps, {}>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers<EnhancedProps, HandlerProps>({
    handleSubmit: ({ loginAction }) => (
      e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault()
      loginAction()
    },
    handleChange: ({ inputAction }) => (inputType: string) => (
      e: React.FormEvent<HTMLInputElement>
    ) => {
      inputAction({ inputType, value: e.currentTarget.value })
    }
  })
)(Login)

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.Colors.LIGHT_GRAY5};
`

const Contents = styled.div`
  color: black;
  width: 400px;
`

const LoginButton = styled(Button)`
  width: 50%;
`

const Buttons = styled.div`
  text-align: center;
`
