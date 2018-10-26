import * as React from "react"
import { Switch, withRouter, RouteComponentProps } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import firebase from "firebase/app"
import { compose, lifecycle } from "recompose"

import GlobalStyles from "components/GlobalStyles"
import {
  actions as userActions,
  UserEntityProps
} from "redux/modules/user/entity"
import { withLoggedIn } from "redux/modules/user"
import MainLayout from "components/MainLayout"
import HomePageContainer from "containers/PageHomeContainer"
import firebaseApp from "firebase"

interface ReduxProps {
  user: UserEntityProps
  loggedIn: boolean
  fetchUser: (
    { githubId, userId }: { githubId: string; userId: string }
  ) => void
  updateUser: (json: UserEntityProps) => void
}

type EnhancedProps = RouteComponentProps<{}> & ReduxProps

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

const mapStateToProps = ({ user }: { user: UserEntityProps }) => ({
  user
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchUser: userActions.fetch.started,
      updateUser: userActions.update
    },
    dispatch
  )

export default compose<EnhancedProps, {}>(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withLoggedIn,
  lifecycle<EnhancedProps, {}>({
    componentDidMount() {
      // ログイン状態をリッスン
      firebase.auth().onAuthStateChanged((user: any) => {
        if (user) {
          console.log("firebase loggedIn")
          const { uid } = user.providerData[0]
          const githubId = uid
          const userId = user.uid
          this.props.fetchUser({ githubId, userId })
        }
      })
      const db = firebaseApp.firestore
      // ユーザー情報の更新をリッスン
      db.collection("User").onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "modified") {
            console.log("modified")
            this.props.updateUser(change.doc.data())
          }
          if (change.type === "removed") {
            console.log("removed")
            // console.log("Removed city: ", change.doc.data())
          }
        })
      })
    }
  })
)(App)
