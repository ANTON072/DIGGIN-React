import * as React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { compose } from "recompose"
import { FaGithub } from "react-icons/fa"

import loadingStyle from "helpers/loadingStyle"
import { UserState } from "redux/modules/user"
import Avatar from "components/Avatar"

export const Profile: React.SFC<{ user: UserState }> = ({ user }) => {
  const {
    data: { login, avatarUrl, htmlUrl, name, company, blog, location, bio },
    loading
  } = user
  return (
    <Root>
      <a href={htmlUrl} target="_blank">
        <FaGithub className="link-text" size={20} />
        <MyAvatar
          className={loadingStyle(loading)}
          avatarUrl={avatarUrl}
          width={72}
          height={72}
          alt={login}
        />
        <Main className={loadingStyle(loading)}>
          <dt>
            <strong>{name}</strong>
          </dt>
          <dd>{login}</dd>
        </Main>
      </a>
    </Root>
  )
}

const Root = styled.div`
  background-color: #fff;
  position: relative;
  > a {
    position: relative;
    text-decoration: none;
    display: block;
    min-height: 72px;
    &:hover {
      dt {
        text-decoration: underline;
      }
      .link-text {
        visibility: visible;
      }
    }
  }
  .link-text {
    position: absolute;
    bottom: 0;
    right: 0;
    color: ${({ theme }) => theme.Colors.LIGHT_GRAY1};
    visibility: hidden;
  }
`

const MyAvatar = styled(Avatar)`
  position: absolute;
`

const Main = styled.div`
  margin-left: 87px;
  min-height: 3em;
  dt {
    font-size: 16px;
  }
  dd {
    color: ${({ theme }) => theme.Colors.GRAY3};
  }
`

const mapStateToProps = ({ user }: { user: UserState }) => ({
  user
})

export default compose<any, any>(connect(mapStateToProps))(Profile)
