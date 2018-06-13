// @flow

import * as a from './actions'
import type { Action } from './actions'

export type ModalState = {
  isModalVisible: boolean,
  headerText: string,
  message: string,
  labelColor: string,
  cancelConfirm: () => any,
  onSubmit: () => any,
}

const defaultState = {
  isModalVisible: false,
  headerText: '',
  message: '',
  labelColor: '',
  cancelConfirm: () => {},
  onSubmit: () => {},
}

export default (state: ModalState = defaultState, action: Action) => {
  switch (action.type) {
    case a.CONFIRM:
      return {
        ...state,
        isModalVisible: true,
        headerText: action.headerText,
        message: action.message,
        labelColor: action.labelColor,
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
