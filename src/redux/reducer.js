// @flow

import { combineReducers } from 'redux'
import common from './common/reducer'
import toaster from './toaster/reducer'
import tx from './tx/reducer'
import type { TxState } from './tx/reducer'
import type { ToasterState } from './toaster/reducer'
import type { CommonState } from './common/reducer'

export default combineReducers({
  common,
  toaster,
  tx,
})

export type RootState = {
  pui: {
    common: CommonState,
    tx: TxState,
    toaster: ToasterState,
  }
}

export type GetState = () => RootState
