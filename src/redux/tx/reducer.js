// @flow

import type { Web3Receipt } from 'polymath.js_v2/types'

import * as a from './actions'
import type { Action } from './actions'

export type TxState = {
  isProcessing: boolean,
  message: ?string,
  hash: ?string,
  receipt: ?Web3Receipt,
}

const defaultState = {
  isProcessing: false,
  message: null,
  hash: null,
  receipt: null,
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
    default:
      return state
  }
}
