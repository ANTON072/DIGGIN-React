import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import firebase from "firebase/app"
import { compose, lifecycle, withHandlers } from "recompose"

import GlobalStyles from "components/GlobalStyles"
import { actions as userActions } from "redux/modules/user"
import LoginPageContainer from "containers/PageLoginContainer"
import HomePageContainer from "containers/PageHomeContainer"

interface EnhancedProps {
  registerAction: () => void
  handleRegister: () => void
}

const App: React.SFC<EnhancedProps> = () => {
  return (
    <BrowserRouter>
      <React.Fragment>
        <GlobalStyles />
        <Switch>
          <Route exact path="/" component={HomePageContainer} />
          <Route exact path="/login" component={LoginPageContainer} />
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      registerAction: userActions.register.started
    },
    dispatch
  )

export default compose<EnhancedProps, {}>(
  connect(
    null,
    mapDispatchToProps
  ),
  withHandlers<EnhancedProps, {}>({
    handleRegister: ({ registerAction }) => () => {
      registerAction()
    }
  }),
  lifecycle<EnhancedProps, {}>({
    componentDidMount() {
      // ログイン状態をリッスン
      firebase.auth().onAuthStateChanged(user => {
        console.log("state change")
        if (user) {
          this.props.handleRegister()
        }
      })
    }
  })
)(App)
