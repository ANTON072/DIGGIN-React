import * as React from "react"
import { Switch, withRouter, RouteComponentProps } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import firebase from "firebase/app"
import { compose, lifecycle, withHandlers } from "recompose"

import GlobalStyles from "components/GlobalStyles"
import {
  actions as userActions,
  withLoggedIn,
  UserProps
} from "redux/modules/user"
import MainLayout from "components/MainLayout"
import HomePageContainer from "containers/PageHomeContainer"
import { DateTime } from "luxon"

interface ReduxProps {
  user: UserProps
  loggedIn: boolean
  registerAction: (
    {
      githubId,
      userId,
      loggedIn
    }: { githubId: string; userId: string; loggedIn: boolean }
  ) => void
}

interface InnerProps {
  handleRegister: (githubId: string, userId: string) => void
}

type EnhancedProps = RouteComponentProps<{}> & ReduxProps & InnerProps

const App: React.SFC<EnhancedProps> = () => {
  return (
    <React.Fragment>
      <GlobalStyles />
      <Switch>
        <MainLayout exact path="/" component={HomePageContainer} />
      </Switch>
    </React.Fragment>
  )
}

const mapStateToProps = ({ user }: { user: UserProps }) => ({
  user
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      registerAction: userActions.register.started
    },
    dispatch
  )

export default compose<EnhancedProps, InnerProps>(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withLoggedIn,
  withHandlers<EnhancedProps, InnerProps>({
    handleRegister: ({ user, registerAction, loggedIn }) => (
      githubId: string,
      userId: string
    ) => {
      registerAction({
        userId,
        loggedIn,
        githubId
      })
    }
  }),
  lifecycle<EnhancedProps, {}>({
    componentDidMount() {
      // ログイン状態をリッスン
      firebase.auth().onAuthStateChanged((user: any) => {
        if (user) {
          const now = DateTime.local()
            .toUTC()
            .toMillis()
          const updatedAt = user.updatedAt
          console.log(updatedAt)
          if (!this.props.user.userId) {
            // 未登録の場合
            const { uid } = user.providerData[0]
            this.props.handleRegister(uid, user.uid)
          }
          // console.log(
          //   DateTime.local(user.metadata.lastSignInTime)
          //     .toUTC()
          //     .toMillis()
          // )
        }
      })
    }
  })
)(App)
