// @flow

import * as a from './actions'
import type { Action } from './actions'

export type TxSuccessState = {
  title: string,
  goTitle: string,
  route: string
}

export type TxState = {
  isProcessing: boolean,
  message: ?string,
  hash: ?string,
  receipt: ?Object,
  success: ?TxSuccessState,
}

const defaultState = {
  isProcessing: false,
  message: null,
  hash: null,
  receipt: null,
  success: null,
}

export default (state: TxState = defaultState, action: Action) => {
  switch (action.type) {
    case a.START:
      return {
        ...state,
        isProcessing: true,
        receipt: null,
        hash: null,
        message: action.message,
      }
    case a.HASH:
      return {
        ...state,
        hash: action.hash,
      }
    case a.END:
      return {
        ...state,
        receipt: action.receipt,
        isProcessing: false,
      }
    case a.FAILED:
      return {
        ...state,
        isProcessing: false,
      }
    case a.SUCCESS:
      return {
        ...state,
        success: {
          ...action,
        },
      }
    case a.CONTINUE:
      return {
        ...state,
        success: null,
      }
    default:
      return state
  }
}
