// @flow

import BigNumber from 'bignumber.js'
import * as a from './actions'
import type { Action } from './actions'

export type AccountState = {
  isInitialized: boolean,
  isSignedUp: ?boolean,
  balance: ?BigNumber,
  isActivated: boolean,
}

const defaultState: AccountState = {
  isInitialized: false,
  isSignedUp: null,
  balance: null,
  isActivated: false,
}

export default (state: AccountState = defaultState, action: Action) => {
  switch (action.type) {
    case a.INITIALIZED:
      return {
        ...state,
        isInitialized: action.value,
      }
    case a.SIGNED_UP:
      return {
        ...state,
        isSignedUp: action.value,
      }
    case a.BALANCE:
      return {
        ...state,
        balance: action.balance,
      }
    case a.ACTIVATED:
      return {
        ...state,
        isActivated: action.value,
      }
    default:
      return state
  }
}
