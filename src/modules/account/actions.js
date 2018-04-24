// @flow

import BigNumber from 'bignumber.js'
// $FlowFixMe
import { PolyToken } from 'polymathjs'

import { fetching, fetchingFailed, fetched, notify } from '../..'
import { formName } from './SignUpForm'
import type { ExtractReturn } from '../../redux/helpers'
import type { GetState, PUIState } from '../../redux/reducer'

export const SIGNED_UP = 'polymath-ui/account/SIGNED_UP'
export const signedUp = (value: boolean) => ({ type: SIGNED_UP, value })

export const BALANCE = 'polymath-ui/account/BALANCE'
export const setBalance = (balance: BigNumber) => ({ type: BALANCE, balance })

export type Action =
  | ExtractReturn<typeof signedUp>
  | ExtractReturn<typeof setBalance>

export type AccountData = {|
  account: {
    name: string,
    email: string,
  },
  accountJSON: string,
  signature: string,
|}

export const initAccount = () => async (dispatch: Function, getState: GetState) => {
  dispatch(fetching())
  const isSignedUp = getAccountData(getState()) != null
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
  dispatch(signedUp(isSignedUp))
  dispatch(setBalance(balance))
  dispatch(fetched())
}

export const signUp = () => async (dispatch: Function, getState: GetState) => {
  dispatch(fetching())
  try {
    const data = getState().form[formName].values
    const { web3 } = getState().network
    const address = getState().network.account

    if (!web3 || !address) {
      throw new Error('web3 or account is undefined')
    }

    const innerAccount = {
      ...data,
      address,
    }
    const accountJSON = JSON.stringify(innerAccount)
    const signature = await web3.eth.sign(accountJSON, address)

    let accountData: AccountData = {
      account: innerAccount,
      accountJSON,
      signature,
    }
    const accountDataString = JSON.stringify(accountData)
    localStorage.setItem(address, accountDataString)

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

export const getAccountData = (state: PUIState): ?AccountData => {
  const address = state.network.account
  const accountDataJSON = localStorage.getItem(address)

  if (accountDataJSON == null) {
    return null
  }

  const accountData = JSON.parse(accountDataJSON)

  if (!accountData.accountJSON) {
    // Stored from old version
    return null
  }

  return accountData
}
