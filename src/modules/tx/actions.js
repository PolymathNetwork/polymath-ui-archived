// @flow

import { notify } from '../../index'
import { etherscanTx } from '../../helpers'
import type { ExtractReturn } from '../../redux/helpers'
import type { GetState } from '../../redux/reducer'

export const START = 'polymath-ui/tx/START'
export const txStart = (message: string) => ({ type: START, message })

export const HASH = 'polymath-ui/tx/HASH'
export const txHash = (hash: string) => ({ type: HASH, hash })

export const END = 'polymath-ui/tx/END'
export const txEnd = (receipt: Object) => ({ type: END, receipt })

export const FAILED = 'polymath-ui/tx/FAILED'
const txFailedAction = () => ({ type: FAILED })

export const SUCCESS = 'polymath-ui/tx/SUCCESS'
export const txSuccess = (title: string, goTitle: string, route: string) => ({ type: SUCCESS, title, goTitle, route })

export const CONTINUE = 'polymath-ui/tx/CONTINUE'
export const txContinue = () => (dispatch: Function, getState: GetState) => {
  // $FlowFixMe
  getState().pui.common.history.push(getState().pui.tx.success.route)
  dispatch({ type: CONTINUE })
}

export type Action =
  | ExtractReturn<typeof txStart>
  | ExtractReturn<typeof txHash>
  | ExtractReturn<typeof txEnd>
  | ExtractReturn<typeof txFailedAction>

export const txFailed = (e: Error) => async (dispatch: Function, getState: GetState) => {
  // eslint-disable-next-line
  console.error('Transaction failed', e)
  let caption
  let isPinned = false
  const receipt = getState().pui.tx.receipt
  if (receipt && receipt.transactionHash) {
    caption = etherscanTx(receipt.transactionHash)
    isPinned = true
  }
  dispatch(notify('Transaction failed', false, e.message, caption, isPinned))
  dispatch(txFailedAction())
}
