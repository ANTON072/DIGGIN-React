import * as React from "react"
import { Route, Switch } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import firebase from "firebase/app"
import { compose, lifecycle } from "recompose"
import * as R from "ramda"

import GlobalStyles from "components/GlobalStyles"
import { actions as userActions } from "redux/modules/user"
import LoginPageContainer from "containers/PageLoginContainer"
import HomePageContainer from "containers/PageHomeContainer"

interface EnhancedProps {
  registerAction: ({ uid, appUid }: { uid: string; appUid: string }) => void
}

const App: React.SFC<EnhancedProps> = () => {
  return (
    <React.Fragment>
      <GlobalStyles />
      <Switch>
        <Route exact path="/" component={HomePageContainer} />
        <Route exact path="/login" component={LoginPageContainer} />
      </Switch>
    </React.Fragment>
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
  lifecycle<EnhancedProps, {}>({
    componentDidMount() {
      // ログイン状態をリッスン
      firebase.auth().onAuthStateChanged((user: any) => {
        // ログインしている場合
        // ログイン判定は各ページのAPI疎通状態でチェックする
        // APIの疎通がないページはログインチェックしない
        if (user) {
          const { uid } = user.providerData[0]
          this.props.registerAction({
            uid,
            appUid: user.uid
          })
        }
      })
    }
  })
)(App)
