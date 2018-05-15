// @flow

import BigNumber from 'bignumber.js'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { thousandsDelimiter, addressShortifier } from '../helpers'
import polyLogo from '../../img/logo.svg'
import networkIcon from '../../img/icons/network.svg'
import polyIcon from '../../img/icons/poly.svg'
import accountIcon from '../../img/icons/account.svg'
import tokenIcon from '../../img/icons/token.svg'
import type { RootState } from '../redux/reducer'

type StateProps = {|
  network: string,
  account: string,
  balance: ?BigNumber
|};

const mapStateToProps = (state: RootState): StateProps => ({
  network: state.network.name,
  account: state.network.account,
  balance: state.pui.account.balance,
})

type Props = {|
  ticker: ?string,
  logo: ?string
|} & StateProps;

class Navbar extends Component<Props> {

  render () {
    const { balance, account, network, ticker, logo } = this.props
    return (
      <div className='pui-navbar'>
        <Link to='/'>
          <div className='pui-navbar-logo'>
            {logo ? (
              <img src={logo} alt='Company Logo' />
            ) : (
              <img src={polyLogo} alt='Polymath' />
            )}
          </div>
        </Link>
        <ul className='pui-navbar-menu'>
          <li>
            <img
              src={networkIcon}
              alt='Active network'
              style={{ marginRight: '2px' }}
            />
            {network}
          </li>
          <li>
            <img src={polyIcon} alt='Your POLY balance' />
            {balance
              ? thousandsDelimiter(new BigNumber(balance).integerValue()) +
                ' POLY'
              : '...'}
          </li>
          <li>
            <img src={accountIcon} alt='Account' />
            {addressShortifier(account)}
          </li>
          {ticker ? (
            <li>
              <img src={tokenIcon} alt='Token' />
              {ticker}
            </li>
          ) : (
            ''
          )}
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Navbar)
