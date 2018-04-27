// @flow

import React from 'react'
import { DatePicker, DatePickerInput } from 'carbon-components-react'

type Props = {
  input: {
    name: string,
    onChange: (any) => void,
  },
  label: string,
  meta: {
    touched: boolean,
    error: string
  },
  className: string,
  placeholder: string,
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
        if (dates.length < 2) {
          // DatePicker can return an array of one while you're in the process
          // of selecting a range.
          return
        }
        input.onChange(dates || null)
      }}
      {...rest}
    >
      <DatePickerInput
        /* eslint-disable react/jsx-no-bind */
        onChange={() => {}}
        onClick={() => {}}
        /* eslint-enable react/jsx-no-bind */
        labelText={labelStart}
        placeholder={placeholder}
        id={idStart}
        invalid={invalid}
        invalidText={error}
        pattern={null}
      />
      <DatePickerInput
        /* eslint-disable react/jsx-no-bind */
        onChange={() => {}}
        onClick={() => {}}
        /* eslint-enable react/jsx-no-bind */
        labelText={labelEnd}
        placeholder={placeholder}
        id={idEnd}
        invalid={invalid}
        pattern={null}
      />
    </DatePicker>
  )
}
