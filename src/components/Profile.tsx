import * as React from "react"
import styled from "styled-components"

import loadingStyle from "helpers/loadingStyle"
import { UserProps } from "redux/modules/user"
import Avatar from "components/Avatar"
import { FaGithub } from "react-icons/fa"

interface Props {
  user: UserProps
}

type EnhancedProps = Props

export const Profile: React.SFC<EnhancedProps> = ({ user }) => {
  const { login, avatarUrl, htmlUrl, name } = user.entity
  const { loading } = user.app
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

export default Profile

const Root = styled.div`
  background-color: #fff;
  position: relative;
  .link-text {
    position: absolute;
    bottom: 0;
    right: 0;
    color: ${({ theme }) => theme.Colors.LIGHT_GRAY1};
    visibility: hidden;
  }
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
