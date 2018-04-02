// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Loading } from 'carbon-components-react'

import { etherscanTx } from '../helpers'
import type { RootState } from '../redux/reducer'
import type { TxState } from '../redux/tx/reducer'

const mapStateToProps = (state: RootState): TxState => state.pui.tx

class TxModal extends Component<TxState> {

  render () {
    return (
      <Modal
        className='pui-tx-modal'
        open={this.props.isProcessing}
        passiveModal
        modalHeading={this.props.message}
        modalLabel='Transaction Processing'
      >
        <Loading withOverlay={false} />
        {this.props.hash ? (
          <p className='bx--modal-content__text'>
            See on Etherscan:{' '}
            { etherscanTx(this.props.hash, true) }
          </p>
        ) : ''}
      </Modal>
    )
  }
}

export default connect(mapStateToProps)(TxModal)
