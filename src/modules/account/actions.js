// @flow

import BigNumber from 'bignumber.js'
// $FlowFixMe
import { PolyToken } from 'polymathjs'

import { fetching, fetchingFailed, fetched, notify } from '../..'
import { formName } from './SignUpForm'
import type { ExtractReturn } from '../../redux/helpers'
import type { GetState } from '../../redux/reducer'

export const SIGNED_UP = 'polymath-ui/account/SIGNED_UP'
export const signedUp = (value: boolean) => ({ type: SIGNED_UP, value })

export const BALANCE = 'polymath-ui/account/BALANCE'
export const setBalance = (balance: BigNumber) => ({ type: BALANCE, balance })

export type Action =
  | ExtractReturn<typeof signedUp>
  | ExtractReturn<typeof setBalance>

export const initAccount = () => async (dispatch: Function, getState: GetState) => {
  dispatch(fetching())
  const value = localStorage.getItem(String(getState().network.account)) !== null
  let balance
  try {
    balance = await PolyToken.myBalance()
    await PolyToken.subscribeMyTransfers(async () => {
      dispatch(setBalance(await PolyToken.myBalance()))
    })
  } catch (e) {
    dispatch(fetchingFailed(e))
    return
  }
  dispatch(signedUp(value))
  dispatch(setBalance(balance))
  dispatch(fetched())
}

export const signUp = () => async (dispatch: Function, getState: GetState) => {
  dispatch(fetching())
  try {
    const data = getState().form[formName].values
    const account = getState().network.account
    const { web3 } = getState().network
    if (!web3 || !account) {
      throw new Error('web3 or account is undefined')
    }
    const jsonData = JSON.stringify(data)
    data.signature = await web3.eth.sign(jsonData, account)
    localStorage.setItem(account, jsonData)
    dispatch(signedUp(true))
    dispatch(notify(
      'You were successfully signed up',
      true
    ))
    dispatch(fetched())
  } catch (e) {
    dispatch(fetchingFailed(e))
  }
}
