// @flow

import * as a from './actions'
import type { Action } from './actions'

export type ModalState = {
  isModalVisible: boolean,
  headerText: string,
  labelText: string,
  confirmText: string,
  message: string,
  labelColor: string,
  modalIcon: string,
  onClose: () => any,
  onSubmit: () => any,
}

const defaultState = {
  isModalVisible: false,
  headerText: '',
  labelText: '',
  confirmText: '',
  message: '',
  labelColor: '',
  modalIcon: '',
  onClose: () => {},
  onSubmit: () => {},
}

export default (state: ModalState = defaultState, action: Action) => {
  switch (action.type) {
    case a.SHOW:
      return {
        ...state,
        isModalVisible: true,
        headerText: action.headerText,
        labelText: action.labelText,
        confirmText: action.confirmText,
        labelColor: action.labelColor,
        modalIcon: action.modalIcon,
        message: action.message,
        onClose: action.onClose,
        onSubmit: action.onSubmit,
      }

    case a.CLOSE:
      return {
        ...state,
        isModalVisible: false,
      }

    default:
      return state
  }
}
