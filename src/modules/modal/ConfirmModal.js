// @flow

import React, { Component } from 'react'
// import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Modal, ModalHeader, Icon } from 'carbon-components-react'
// import type { Dispatch } from 'redux'

import { cancelConfirm } from './actions'
// import type { Action } from './actions'

import type { RootState } from '../../redux/reducer'
import type { ModalState } from './reducer'

// type Props = {
//   cancelConfirm: typeof cancelConfirm,
// }

type DispatchProps = {|
  cancelConfirm: () => { },
|}

const mapStateToProps = (state: RootState): ModalState => state.pui.modal

// const mapDispatchToProps: DispatchProps = {
//   cancelConfirm,
// }

const mapDispatchToProps = (dispatch: Function): Object => {
  return {
    cancelConfirm: () => {
      dispatch(cancelConfirm())
    },
  }
}

class ConfirmModal extends Component<ModalState, DispatchProps> {
  handleSubmit = () => {
    this.props.onSubmit()
  }

  handleClose = () => {
    this.props.cancelConfirm()
  }
  // This function is necessary for Carbon Components ModalHeader
  onClose = () => {
    this.props.cancelConfirm()
  }
  render () {
    const { isModalVisible, headerText, message, labelColor } = this.props
    return (
      <Modal
        className='pui-tx-modal'
        open={isModalVisible}
        onFocus={this.handleClose}
        onRequestClose={this.handleClose}
        onRequestSubmit={this.handleSubmit}
        primaryButtonText='Confirm'
        secondaryButtonText='Cancel'
      >
        <ModalHeader
          label={<span style={{ color: `${labelColor}` }}>Confirmation Required</span>}
          closeModal={this.onClose}
          title={
            <span>
              <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />&nbsp; {headerText}
            </span>
          }
        />
        <div className='bx--modal-content__text'>{message}</div>
      </Modal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal)
