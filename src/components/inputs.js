/* eslint-disable no-unused-vars */
import React from 'react'
import PropTypes from 'prop-types'
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

TextInput.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string
  }),
  className: PropTypes.string
}
