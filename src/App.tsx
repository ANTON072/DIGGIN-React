import * as React from "react"
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import firebase from "firebase/app"
import { compose, lifecycle, withHandlers } from "recompose"
import * as R from "ramda"

import GlobalStyles from "components/GlobalStyles"
import { actions as userActions } from "redux/modules/user"
import MainLayout from "components/MainLayout"
import LoginPageContainer from "containers/PageLoginContainer"
import HomePageContainer from "containers/PageHomeContainer"

interface ReduxProps {
  registerAction: ({ uid, appUid }: { uid: string; appUid: string }) => void
}

interface HandlersProps {
  handleRedirect: () => void
}

type EnhancedProps = RouteComponentProps<{}> & ReduxProps & HandlersProps

const authWhiteList = ["/login"]

const App: React.SFC<EnhancedProps> = () => {
  return (
    <React.Fragment>
      <GlobalStyles />
      <Switch>
        <MainLayout exact path="/" component={HomePageContainer} />
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
  withRouter,
  connect(
    null,
    mapDispatchToProps
  ),
  withHandlers<EnhancedProps, {}>({
    handleRedirect: ({ location, history }) => () => {
      if (!authWhiteList.includes(location.pathname)) {
        history.push("/login")
      }
    }
  }),
  lifecycle<EnhancedProps, {}>({
    componentDidMount() {
      const { location, history } = this.props
      // ログイン状態をリッスン
      firebase.auth().onAuthStateChanged((user: any) => {
        if (user) {
          const { uid } = user.providerData[0]
          this.props.registerAction({
            uid,
            appUid: user.uid
          })
        } else {
          this.props.handleRedirect()
        }
      })
    }
  })
)(App)
