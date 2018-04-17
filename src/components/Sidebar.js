// @flow

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import type { Node } from 'react'

type MenuItem = {|
  title: string,
  icon: Node,
  to: string,
  isActive: boolean,
|}

type Props = {|
  topItems: Array<MenuItem>,
  bottomItems: Array<MenuItem>,
|}

export default class Sidebar extends Component<Props> {
  render () {
    const { topItems } = this.props
    return (
      <div className='pui-sidebar'>
        <ul>
          {topItems.map((item: MenuItem) => (
            <Link key={item.to} to={item.to}>
              <li className={item.isActive ? 'active' : ''}>
                {item.icon}
                <p>{item.title}</p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }
}
