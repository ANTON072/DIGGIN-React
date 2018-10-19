import * as React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { compose, withStateHandlers, lifecycle } from "recompose"
import { ButtonGroup, Icon, Alert } from "@blueprintjs/core"
import { Link } from "react-router-dom"

import { actions as userActions, UserState } from "redux/modules/user"
import ProfileContainer from "containers/ProfileContainer"

interface OuterProps {
  user: UserState
  confirm: boolean
  logoutAction: () => void
  handleLogout: (show: boolean) => void
}

type EnhancedProps = OuterProps

export const Sidebar = ({
  user,
  handleLogout,
  logoutAction,
  confirm,
  ...rest
}: EnhancedProps) => {
  return (
    <Root {...rest}>
      <Alert
        isOpen={confirm}
        cancelButtonText="キャンセル"
        confirmButtonText="ログアウトする"
        onCancel={() => handleLogout(false)}
        onConfirm={logoutAction}
      >
        <p>ログアウトしますか？</p>
      </Alert>
      <ProfileContainer />
      <Block>
        <UserNav fill loading={user.loading ? 1 : 0}>
          <Link to={`/${user.data.login}`} className="bp3-button">
            My Diggin'
          </Link>
          <Link to={`/${user.data.login}/bookmarks`} className="bp3-button">
            Bookmarks
          </Link>
        </UserNav>
      </Block>
      <Block>
        <Footer>
          <LogoutButton
            loading={user.loading ? 1 : 0}
            icon="log-out"
            onClick={() => handleLogout(true)}
          />
        </Footer>
      </Block>
    </Root>
  )
}

const Root = styled.div`
  padding: 15px;
  background-color: #fff;
`
const Block = styled.div`
  margin-top: 15px;
`

const Footer = styled.div`
  text-align: right;
`

const UserNav = styled(ButtonGroup)`
  pointer-events: ${(props: { loading: number }) =>
    props.loading ? "none" : "auto"};
  opacity: ${(props: { loading: number }) => (props.loading ? 0.5 : 1)};
`

const LogoutButton = styled(Icon)`
  cursor: pointer;
  color: ${({ theme }) => theme.Colors.LIGHT_GRAY1};
  pointer-events: ${(props: { loading: number }) =>
    props.loading ? "none" : "auto"};
  opacity: ${(props: { loading: number }) => (props.loading ? 0.5 : 1)};
  &:hover {
    color: ${({ theme }) => theme.Colors.BLUE2};
  }
`

const mapStateToProps = ({ user }: { user: UserState }) => ({
  user
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      logoutAction: userActions.logout.started
    },
    dispatch
  )

export default compose<EnhancedProps, EnhancedProps>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStateHandlers(
    () => ({
      confirm: false
    }),
    {
      handleLogout: (state, props) => show => ({
        ...state,
        confirm: show
      })
    }
  )
)(Sidebar)
