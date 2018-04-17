// @flow

import BigNumber from 'bignumber.js'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Loading } from 'carbon-components-react'
import type { RouterHistory } from 'react-router-dom'

import Toaster from './components/Toaster'
import TxModal from './components/TxModal'
import Navbar from './components/Navbar'
import { setupHistory } from './redux/common/actions'

type StateProps = {
  isFetching: boolean,
  network: string,
  account: string,
}

type DispatchProps = {|
  setupHistory: (history: RouterHistory) => any,
|}

const mapStateToProps = (state): StateProps => ({
  isFetching: state.pui.common.isFetching,
  network: state.network.name,
  account: state.network.account,
})

const mapDispatchToProps: DispatchProps = {
  setupHistory,
}

type Props = {|
  history: RouterHistory,
  balance: ?BigNumber,
  ticker: ?string,
|} & StateProps & DispatchProps

class PolymathUI extends Component<Props> {

  componentWillMount () {
    this.props.setupHistory(this.props.history)
  }

  render () {
    const { network, balance, account, ticker } = this.props
    return (
      <div>
        <Navbar network={network} balance={balance} account={account} ticker={ticker} />
        <Toaster />
        <TxModal />
        {this.props.isFetching ? <Loading /> : ''}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PolymathUI)
