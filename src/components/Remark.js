// @flow

import React, { Component } from 'react'

type Props = {|
  title: string,
  children: string,
  small?: boolean,
|}

export default class Remark extends Component<Props> {

  render () {
    const { title, children, small } = this.props
    return (
      <div className={'pui-remark' + (small ? ' pui-remark-small' : '')}>
        <div className='pui-remark-title'>{title}</div>
        <div className='pui-remark-text'>{children}</div>
      </div>
    )
  }
}
