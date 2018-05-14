// @flow
/* eslint-disable jsx-a11y/label-has-for */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Button } from 'carbon-components-react'

import { txContinue } from './actions'
import { etherscanTx } from '../../helpers'
import { bull } from '../../index'
import paperPlane from '../../../img/icons/paper-plane.svg'
import type { TxSuccessState } from './reducer'

type StateProps = {|
  hash: string,
|} & TxSuccessState

type DispatchProps = {|
  txContinue: () => any,
|}

const mapStateToProps = (state): StateProps => ({
  ...state.pui.tx.success,
  hash: state.pui.tx.hash,
})

const mapDispatchToProps: DispatchProps = {
  txContinue,
}

type Props = {|
  className: ?string,
|} & StateProps & DispatchProps

class TxSuccess extends Component<Props> {

  handleGo = () => {
    this.props.txContinue()
  }

  render () {
    const { className } = this.props
    return (
      <div className={'pui-single-box' + (className ? ' ' + className : '')}>
        <div className='pui-single-box-header'>
          <div className='pui-single-box-bull'>
            <img src={bull} alt='Bull' />
          </div>
          <h1 className='pui-h1'>
            <Icon name='checkmark--glyph' fill='#00AA5E' width='24' height='24' />&nbsp;
            {this.props.title}
          </h1>
          <h3 className='pui-h3'>
            You can check the transaction details on Etherscan for independent
            validation by clicking on the transaction hash below.
          </h3>
          <div className='pui-clearfix' />
          <div className='bx--form-item pui-form-item-blue'>
            <label className='bx--label'>Transaction hash</label>
            <p>{etherscanTx(this.props.hash, this.props.hash)}</p>
          </div>
          <h2
            className='pui-h2'
            align='center'
            style={{ marginTop: '32px', marginBottom: '4px', color: '#5A6872', fontWeight: 300, lineHeight: '35px' }}
          >
            <img src={paperPlane} width='64' height='64' alt='Paper Plane' /><br />
            We just sent you an email with the transaction<br />
            details for your records. Check your inbox.
          </h2>
          <p align='center'>
            <Button onClick={this.handleGo}>
              {this.props.goTitle}
            </Button>
          </p>
          <p className='pui-input-hint'>
            Your email address is not stored on Polymath servers, only on your browser&apos;s local storage.
            To clear this information, simply clear your browser&apos;s cache.
          </p>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TxSuccess)
