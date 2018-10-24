import * as React from "react"
import styled from "styled-components"
import { ButtonGroup, Icon, Alert } from "@blueprintjs/core"
import { Link } from "react-router-dom"
import { compose, withStateHandlers, branch, renderComponent } from "recompose"

import Profile from "components/Profile"
import TagIndex from "components/TagIndex"
import SidebarAdd from "components/SidebarAdd"
import { UserEntityProps } from "redux/modules/user/entity"
import { withLoggedIn } from "redux/modules/user"

export interface SidebarProps {
  handleLogout: () => void
  user: UserEntityProps
}

interface InnerProps {
  confirm: boolean
  loggedIn: boolean
  handleConfirm: (show: boolean) => void
}

type EnhancedProps = SidebarProps & InnerProps

const LoggedInSidebar: React.SFC<EnhancedProps> = ({
  confirm,
  handleConfirm,
  handleLogout,
  user
}) => {
  console.log("user:", user)
  return (
    <React.Fragment>
      <Alert
        isOpen={confirm}
        cancelButtonText="キャンセル"
        confirmButtonText="ログアウトする"
        onCancel={() => handleConfirm(false)}
        onConfirm={() => {
          handleLogout()
          handleConfirm(false)
        }}
      >
        <p>ログアウトしますか？</p>
      </Alert>
      <Profile user={user} />
      <UserNav fill loading={user.loading ? 1 : 0}>
        <Link to={`/${user.login}`} className="bp3-button">
          My Diggin'
        </Link>
        <Link to={`/${user.login}/bookmarks`} className="bp3-button">
          Bookmarks
        </Link>
      </UserNav>
      <TagBlock />
      <Footer>
        <LogoutButton
          loading={user.loading ? 1 : 0}
          icon="log-out"
          onClick={() => handleConfirm(true)}
        />
      </Footer>
    </React.Fragment>
  )
}

export default compose<EnhancedProps, SidebarProps>(
  withLoggedIn,
  branch<EnhancedProps>(
    ({ loggedIn }) => !loggedIn,
    renderComponent(SidebarAdd)
  ),
  withStateHandlers(
    () => ({
      confirm: false
    }),
    {
      handleConfirm: state => show => ({
        ...state,
        confirm: show
      })
    }
  )
)(LoggedInSidebar)

const UserNav = styled(ButtonGroup)`
  pointer-events: ${(props: { loading: number }) =>
    props.loading ? "none" : "auto"};
  opacity: ${(props: { loading: number }) => (props.loading ? 0.5 : 1)};
  margin-top: 15px;
`

const TagBlock = styled(TagIndex)`
  margin-top: 15px;
`

const Footer = styled.div`
  margin-top: 15px;
  text-align: right;
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
