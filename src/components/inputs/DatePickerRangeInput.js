// @flow

import React from 'react'
import { DatePicker, DatePickerInput } from 'carbon-components-react'

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
  placeholder: string,
  [any]: any
}

export default ({
  input,
  label,
  meta: { touched, error },
  className,
  placeholder,
  ...rest
}: Props) => {
  const [idStart, idEnd] = input.name.split('-')
  const [labelStart, labelEnd] = label.split(';')
  const invalid = touched && !!error
  return (
    <DatePicker
      id={input.name}
      className={className}
      datePickerType='range'
      // eslint-disable-next-line
      onChange={(dates: Array<Date>) => {
        input.onChange(dates || null)
      }}
      {...rest}
    >
      <DatePickerInput
        labelText={labelStart}
        placeholder={placeholder}
        id={idStart}
        invalid={invalid}
        invalidText={error}
        pattern={null}
      />
      <DatePickerInput
        labelText={labelEnd}
        placeholder={placeholder}
        id={idEnd}
        invalid={invalid}
        pattern={null}
      />
    </DatePicker>
  )
}
