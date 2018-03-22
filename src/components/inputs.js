// @flow

/* eslint-disable no-unused-vars */
import React from 'react'
import { TextInput as CarbonTextInput } from 'carbon-components-react'

type Props = {
  input: {
    name: string,
    [any]: any
  },
  label: string,
  meta: {
    touched: bool,
    error: string
  },
  className: string,
  [any]: any
}

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
