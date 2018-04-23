// @flow

import { combineReducers } from 'redux'
import common from './common/reducer'
import toaster from '../modules/toaster/reducer'
import tx from '../modules/tx/reducer'
import account from '../modules/account/reducer'
import type { TxState } from '../modules/tx/reducer'
import type { ToasterState } from '../modules/toaster/reducer'
import type { CommonState } from './common/reducer'
import type { AccountState } from '../modules/account/reducer'

export default combineReducers({
  common,
  toaster,
  tx,
  account,
})

export type PUIState = {
  form: any, // redux-form
  network: any, // TODO @bshevchenko: polymath-auth
  pui: {
    common: CommonState,
    tx: TxState,
    toaster: ToasterState,
    account: AccountState,
  }
}

export type GetState = () => PUIState
