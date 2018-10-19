import * as React from "react"
import styled from "styled-components"

import loadingStyle from "helpers/loadingStyle"

type Props = React.ImgHTMLAttributes<{}> & {
  avatarUrl: string | undefined
}

const Avatar: React.SFC<Props> = ({ avatarUrl, alt, ...props }) => {
  return (
    <Root {...props}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          width={props.width}
          height={props.height}
          alt={alt}
        />
      ) : (
        <React.Fragment />
      )}
    </Root>
  )
}

export default Avatar

const Root = styled.div`
  width: ${({ width }: any) => `${width}px`};
  height: ${({ height }: any) => `${height}px`};
  border-radius: 3px;
  overflow: hidden;
  object-fit: cover;
`
