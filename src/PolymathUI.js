// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Loading } from 'carbon-components-react'
import type { RouterHistory } from 'react-router-dom'

import Toaster from './modules/toaster/Toaster'
import TxModal from './modules/tx/TxModal'
import ConfirmModal from './modules/modal/ConfirmModal'
import Navbar from './components/Navbar'
// import ConfirmModal from './components/ConfirmModal'
import { setupHistory } from './redux/common/actions'

type StateProps = {
  isFetching: boolean,
}

type DispatchProps = {|
  setupHistory: (history: RouterHistory) => any,
|}

const mapStateToProps = (state): StateProps => ({
  isFetching: state.pui.common.isFetching,
})

const mapDispatchToProps: DispatchProps = {
  setupHistory,
}

type Props = {|
  history: RouterHistory,
  ticker: ?string,
  logo: ?string,
|} & StateProps &
  DispatchProps

class PolymathUI extends Component<Props> {
  componentWillMount () {
    this.props.setupHistory(this.props.history)
  }

  render () {
    const { ticker, logo } = this.props
    return (
      <div>
        <Navbar ticker={ticker} logo={logo} />
        <Toaster />
        <TxModal />
        <ConfirmModal />
        {this.props.isFetching ? <Loading /> : ''}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PolymathUI)
