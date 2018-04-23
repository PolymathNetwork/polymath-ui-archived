// @flow

import React, { Component } from 'react'
import { Form, Button } from 'carbon-components-react'
import { Field, reduxForm } from 'redux-form'

import { TextInput } from '../../'
import {
  required,
  maxLength,
  email,
} from '../../validate'

export const formName = 'signup'

const maxLength100 = maxLength(100)

type Props = {
  handleSubmit: () => void,
}

class SignUpForm extends Component<Props> {
  render () {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Field
          name='name'
          component={TextInput}
          label='Name'
          placeholder='Enter your full name'
          validate={[required, maxLength100]}
        />
        <Field
          name='email'
          component={TextInput}
          label='Email'
          placeholder='Enter your contact email address'
          validate={[required, email]}
        />
        <p className='pui-input-hint'>
          We don&apos;t store your name and email.
          They will be saved on your computer for further email sendings about your transactions.
        </p>
        <Button type='submit'>
          Save Account Info
        </Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
})(SignUpForm)
