import { createGlobalStyle } from "styled-components"
import "normalize.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"

const GlobalStyles = createGlobalStyle`
  html {
    box-sizing: border-box;
    height: 100%;
    font-size: 62.5%;
  }
  *,
  ::before,
  ::after {
    box-sizing: inherit;
  }
  body {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", YuGothic,
      "ヒラギノ角ゴ ProN W3", Hiragino Kaku Gothic ProN, Arial, "メイリオ",
      Meiryo, sans-serif;
    font-size: 14px;
    line-height: 1.7;
    color: #182026;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 0;
  }
  img,
  video {
    max-width: 100%;
    vertical-align: middle;
  }
  a {
    transition: color 0.2s ease-out;
    text-decoration: none;
  }
  button {
    padding: 0;
    border: 0;
    background-color: transparent;
    appearance: none;
    cursor: pointer;
    &:disabled {
      cursor: default;
    }
  }
  button:focus,
  html [type="button"]:focus,
  [type="reset"]:focus,
  [type="submit"]:focus {
    outline: none;
  }
  input,
  textarea {
    -webkit-appearance: none;
  }
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  dl,
  dd,
  ul,
  li,
  ol,
  figure {
    margin: 0;
  }
  small {
    font-size: inherit;
  }
  svg {
    fill: currentColor;
  }
  body > svg {
    position: absolute;
    width: 0;
    height: 0;
  }
  fieldset {
    padding: 0;
    border: 0;
  }
  select {
    border: 0;
    appearance: none;
  }
  select::-ms-expand {
    display: none;
  }
  [aria-controls] {
    cursor: pointer;
  }
`

export default GlobalStyles
