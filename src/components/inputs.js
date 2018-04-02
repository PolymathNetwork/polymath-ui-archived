// @flow

import React from 'react'
import { TextInput as CarbonTextInput } from 'carbon-components-react'

type Props = {
  input: {
    name: string,
    [any]: any
  },
  label: string,
  meta: {
    touched: boolean,
    error: string
  },
  className: string,
  [any]: any
}

// eslint-disable-next-line
export const TextInput = ({
  input,
  label,
  meta: { touched, error },
  className,
  ...rest
}: Props) => {
  return (<CarbonTextInput
    {...input}
    id={input.name}
    labelText={label}
    invalid={touched && !!error}
    invalidText={error}
    className={className}
    {...rest}
  />)
}
