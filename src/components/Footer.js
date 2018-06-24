// @flow

import React, { Component } from 'react'
import { Link } from 'react-router-dom'

type Props = {|
  fixed: any,
  border:any,
|};

export default class Footer extends Component<Props> {

  render () {
    const { fixed, border } = this.props
    return (
      
      <div className={'pui-footer ' + (fixed ? 'pui-footer-fixed ' : '') + (border ? 'pui-footer-border' : '')}>
        <Link className='pui-footer-text' to='/'>
          &copy; {(new Date().getFullYear())} Polymath
        </Link>
        <ul className='pui-footer-links'>
          <li>
            <Link to='termsofuse' target='_blank'>Terms of use</Link>
          </li>
          <li>
            <Link to='privacypolicy' target='_blank'>Privacy policy</Link>
          </li>
        </ul>
      </div>
    )
  }
}
