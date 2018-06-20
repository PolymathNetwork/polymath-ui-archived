// @flow

import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import type { Node } from 'react'

import { Icon } from 'carbon-components-react'

import logo from '../../img/logo.svg'

type MenuItem = {|
  title: string,
  body: Node
|}

type Props = {|
  pageTitle: string,
  headerText: string,
  menuItems: Array<MenuItem>
|}

export default class Terms extends Component<Props> {

  // noinspection JSMethodCanBeStatic
  showList (items: Array<MenuItem>) {
    return (
      <ol className='bx--list--ordered pui-list'>
        {items.map((item: MenuItem, index) => (

          <li className='bx--list__item' >
            <a href={`#section_${index + 1}`} >
              {item.title}{' '}
              <Icon
                name='icon--arrow--right'
              />
            </a>
          </li>
        ))
        }
      </ol>
    )
  }

  // noinspection JSMethodCanBeStatic
  showContent (items: Array<MenuItem>) {
    return (
      <ol className='bx--list--ordered pui-list'>
        {items.map((item: MenuItem, index) => (

          <li className='bx--list__item' >
            <h2 className='pui-h2' id={`section_${index + 1}`}>{item.title}</h2>
            <p>{item.body}</p>
          </li>
        ))
        }
      </ol>
    )
  }

  render () {
    const { menuItems, headerText, pageTitle } = this.props
    return (
      <DocumentTitle title='Polymath'>

        <Fragment>

          <div className='pui-navbar'>
            <Link to='/'>
              <div className='pui-navbar-logo'>

                <img src={logo} alt='Polymath' />

              </div>
            </Link>
          </div>
          <h1 className='pui-h1'>{pageTitle}</h1>

          <div className='bx--row'>
            <div className='bx--col-xs-4' >

              <div className='pui-page-box pui-sidenav'>

                {this.showList(menuItems)}

              </div>
            </div>
            <div className='bx--col-xs-8'>
              <div className='pui-page-box'>
                <div className='terms-of-service' >
                  {headerText}
                  {this.showContent(menuItems)}
                </div>
              </div>

            </div>
          </div>
        </Fragment>
      </DocumentTitle >

    )
  }
}
