import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { Form } from 'carbon-components-react'

import { TextInput } from '../../index'

export const formName = 'enterPIN'

type Props = {
  onChange: (value: string) => void,
}

class EnterPINForm extends Component<Props> {
  render () {
    return (
      <Form>
        <Field
          name='pin'
          component={TextInput}
          placeholder='Enter PIN Code'
          // eslint-disable-next-line react/jsx-no-bind
          onChangeCode={(value: string) => this.props.onChange(value)}
        />
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
})(EnterPINForm)
