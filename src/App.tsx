import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import firebase, { User, UserInfo } from "firebase/app"
import { compose, lifecycle, withHandlers } from "recompose"
import * as R from "ramda"

import GlobalStyles from "components/GlobalStyles"
import { actions as userActions } from "redux/modules/user"
import LoginPageContainer from "containers/PageLoginContainer"
import HomePageContainer from "containers/PageHomeContainer"

interface EnhancedProps {
  registerAction: ({ uid, appUid }: { uid: string; appUid: string }) => void
  handleRegister: (uid: string, appUid: string) => void
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
    handleRegister: ({ registerAction }) => (uid: string, appUid: string) => {
      registerAction({ uid, appUid })
    }
  }),
  lifecycle<EnhancedProps, {}>({
    componentDidMount() {
      // ログイン状態をリッスン
      firebase.auth().onAuthStateChanged((user: any) => {
        if (user) {
          const { uid } = user.providerData[0]
          this.props.handleRegister(uid, user.uid)
        }
      })
    }
  })
)(App)
