// @flow

import BigNumber from 'bignumber.js'
// $FlowFixMe
import { PolyToken } from 'polymathjs'
import sigUtil from 'eth-sig-util'

import { fetching, fetchingFailed, fetched, notify, txStart, txEnd, txFailed } from '../..'
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
  const account = String(getState().network.account)
  const value = localStorage.getItem(account) !== null
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

  if (global.FS) {
    global.FS.identify(account, {
      ethAddress: account,
    })
  }

  dispatch(fetched())
}

const signData = (web3, data, account) => {
  return new Promise((resolve, reject) => {
    const msgParams = [
      {
        type: 'string',
        name: 'Name',
        value: data.name,
      },
      {
        type: 'string',
        name: 'Email',
        value: data.email,
      },
    ]
    if (!web3.currentProvider.sendAsync) {
      return resolve(web3.eth.sign(JSON.stringify(msgParams), account))
    }
    web3.currentProvider.sendAsync({
      method: 'eth_signTypedData',
      params: [msgParams, account],
      from: account,
    }, (error, result) => {
      if (error) {
        return reject(error)
      }
      if (result.error) {
        return reject(result.error)
      }
      const recovered = sigUtil.recoverTypedSignature({
        data: msgParams,
        sig: result.result,
      })
      if (recovered.toLowerCase() === account.toLowerCase()) {
        return resolve(result.result)
      }
      reject(new Error('Failed to verify signer, got: ' + result))
    })
  })
}

export const signUp = () => async (dispatch: Function, getState: GetState) => {
  dispatch(txStart('Requesting your signature...'))
  try {
    const data = getState().form[formName].values
    const account = getState().network.account
    const { web3 } = getState().network
    if (!web3 || !account) {
      throw new Error('web3 or account is undefined')
    }
    data.signature = await signData(web3, data, account)
    localStorage.setItem(account, JSON.stringify(data))
    dispatch(signedUp(true))
    dispatch(notify(
      'You were successfully signed up',
      true
    ))
    dispatch(txEnd({}))
  } catch (e) {
    dispatch(txFailed(e))
  }
}
