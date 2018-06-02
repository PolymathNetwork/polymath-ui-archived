// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, ModalHeader, Icon } from 'carbon-components-react'

import type { RootState } from '../../redux/reducer'
import type { ModalState } from './reducer'

const mapStateToProps = (state: RootState): ModalState => state.pui.modal

class ConfirmModal extends Component<ModalState> {
  handleSubmit = () => {
    this.props.onSubmit()
  }

  handleClose = () => {
    this.props.onClose()
  }
  //This function is necessary for Carbon Components ModalHeader
  onClose = () => {
    this.props.onClose()
  }
  render () {
    const { isModalVisible, onClose, headerText, labelText, labelColor, modalIcon, confirmText, message } = this.props
    return (
      <Modal
        className='pui-tx-modal'
        open={isModalVisible}
        onFocus={this.handleClose}
        onRequestClose={onClose}
        onRequestSubmit={this.handleSubmit}
        primaryButtonText={confirmText}
        secondaryButtonText='Cancel'
      >
        <ModalHeader
          label={<span style={{ color: { labelColor } }}>{labelText}</span>}
          closeModal={onClose}
          title={
            <span>
              <Icon name={`${modalIcon}`} fill='#E71D32' width='24' height='24' />&nbsp; {headerText}
            </span>
          }
        />
        <div className='bx--modal-content__text'>
          <p>{message}</p>
        </div>
      </Modal>
    )
  }
}

export default connect(mapStateToProps)(ConfirmModal)
