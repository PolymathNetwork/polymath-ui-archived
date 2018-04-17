// @flow

import BigNumber from 'bignumber.js'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { thousandsDelimiter, addressShortifier } from '../helpers'
import logo from '../../img/logo.svg'
import networkIcon from '../../img/icons/network.svg'
import polyIcon from '../../img/icons/poly.svg'
import accountIcon from '../../img/icons/account.svg'
import tokenIcon from '../../img/icons/token.svg'

type Props = {|
  network: string,
  balance: ?BigNumber,
  account: string,
  ticker: ?string,
|}

export default class Navbar extends Component<Props> {
  render () {
    const { balance, account, network, ticker } = this.props
    return (
      <div className='pui-navbar'>
        <Link to='/'>
          <div className='pui-navbar-logo'>
            <img src={logo} alt='Polymath' />
          </div>
        </Link>
        <ul className='pui-navbar-menu'>
          <li>
            <img src={networkIcon} alt='Active network' style={{ marginRight: '2px' }} />
            {network}
          </li>
          <li>
            <img src={polyIcon} alt='Your POLY balance' />
            { balance ? thousandsDelimiter(new BigNumber(balance).integerValue()) + ' POLY' : '...' }
          </li>
          <li>
            <img src={accountIcon} alt='Account' />
            { addressShortifier(account) }
          </li>
          { ticker ? (
            <li>
              <img src={tokenIcon} alt='Token' />
              { ticker }
            </li>
          ) : ''}
        </ul>
      </div>
    )
  }
}
