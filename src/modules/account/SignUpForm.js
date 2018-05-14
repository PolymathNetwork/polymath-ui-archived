// @flow

import React, { Component } from 'react'
import { Form, Button, Link } from 'carbon-components-react'
import { Field, reduxForm } from 'redux-form'

import { Checkbox, TextInput } from '../../'
import {
  required,
  maxLength,
  email,
} from '../../validate'

export const formName = 'signup'

const maxLength100 = maxLength(100)

type Props = {
  enableSubmit: boolean,
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
        <Field
          name='acceptPrivacy'
          component={Checkbox}
          className='pui-checkbox-small-text'
          label={
            // $FlowFixMe
            <React.Fragment>
              <p>I accept that Polymath may contact me via email to send me updates on my token issuance process.</p>
              <p>For more details, please consult our <Link href='https://polymath.network'>Privacy Policy</a>.</link>
            </React.Fragment>
          }
        />
        <Field
          name='acceptTerms'
          component={Checkbox}
          className='pui-checkbox-small-text'
          label={
            <p>I accept the <Link href='https://polymath.network'>Terms of Use</Link>.</p>
          }
        />
        <Button type='submit' disabled={!this.props.enableSubmit}>
          Save Account Info
        </Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
})(SignUpForm)
