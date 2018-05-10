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
          placeholder='Enter your name'
          validate={[required, maxLength100]}
        />
        <Field
          name='email'
          component={TextInput}
          label='Email'
          placeholder='Enter your email address'
          validate={[required, email]}
        />
        <Button type='submit'>
          CREATE ACCOUNT
        </Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
})(SignUpForm)
