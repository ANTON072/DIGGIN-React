import React from "react"

import { storiesOf } from "@storybook/react"

import Hello from "./index"

storiesOf("Welcome", module).add("to Storybook", () => <Hello />)
