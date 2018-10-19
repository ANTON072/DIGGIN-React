import classNames from "classnames"

const loadingStyle = (loading: boolean, props = {}) => {
  return classNames({ ...props, "bp3-skeleton": loading })
}

export default loadingStyle
