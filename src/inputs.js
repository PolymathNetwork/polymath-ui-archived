/* eslint-disable no-unused-vars */
import React from 'react'
import { TextInput as CarbonTextInput } from 'carbon-components-react'

export const TextInput = ({
  input,
  label,
  meta: { touched, error },
  className,
  ...rest
}) => {
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
