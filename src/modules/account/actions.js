// @flow

import BigNumber from 'bignumber.js'
import sigUtil from 'eth-sig-util'
import { PolyToken } from 'polymathjs'
import type { Address } from 'polymathjs/types'
import type { Node } from 'react'

import { fetching, fetchingFailed, fetched, notify } from '../..'
import { formName as signUpFormName } from './SignUpForm'
import * as offchain from '../../offchain'
import type { ExtractReturn } from '../../redux/helpers'
import type { GetState } from '../../redux/reducer'
import { tx } from '../tx/actions'

export const SIGN_IN_START = 'polymath-ui/account/SIGN_IN_START'
export const signInStart = () => ({ type: SIGN_IN_START })

export const SIGN_IN_CANCEL = 'polymath-ui/account/SIGN_IN_CANCEL'
export const signInCancel = () => ({ type: SIGN_IN_CANCEL })

export const SIGNED_IN = 'polymath-ui/account/SIGNED_IN'
export const signedIn = () => ({ type: SIGNED_IN })

export const SIGNED_UP = 'polymath-ui/account/SIGNED_UP'
export const signedUp = (name: string, email: string, isEmailConfirmed: boolean = true) =>
  ({ type: SIGNED_UP, name, email, isEmailConfirmed })

export const REQUEST_CONFIRM_EMAIL = 'polymath-ui/account/REQUEST_CONFIRM_EMAIL'
export const ENTER_PIN_DEFAULT = 'polymath-ui/account/ENTER_PIN_DEFAULT'
export const ENTER_PIN_SUCCESS = 'polymath-ui/account/ENTER_PIN_SUCCESS'
export const ENTER_PIN_ERROR = 'polymath-ui/account/ENTER_PIN_ERROR'
export const CANCEL_CONFIRM_EMAIL = 'polymath-ui/account/CANCEL_CONFIRM_EMAIL'
export const cancelConfirmEmail = () => ({ type: CANCEL_CONFIRM_EMAIL })

export const EMAIL_CONFIRMED = 'polymath-ui/account/EMAIL_CONFIRMED'
export const emailConfirmed = () => ({ type: EMAIL_CONFIRMED })

export const BALANCE = 'polymath-ui/account/BALANCE'
export const setBalance = (balance: BigNumber) => ({ type: BALANCE, balance })

export type Action =
  | ExtractReturn<typeof signedIn>
  | ExtractReturn<typeof signedUp>
  | ExtractReturn<typeof setBalance>

export type AccountInnerData = {|
  name: string,
  email: string,
|}

const fetchBalance = () => async (dispatch: Function) => {
  const balance = await PolyToken.myBalance()
  await PolyToken.subscribeMyTransfers(
    async (toOrFrom: Address, value: BigNumber, isFrom: boolean, isNoise: boolean) => {
      if(!isNoise){
        dispatch(setBalance(await PolyToken.myBalance()))
        dispatch(notify(isFrom ? 'Sent '+ PolyToken.removeDecimals(value)+' POLY'
          : 'Received '+PolyToken.removeDecimals(value)+' POLY', true))
      }
    })
  dispatch(setBalance(balance))
}

export const signIn = () => async (dispatch: Function, getState: GetState) => {
  if (getState().pui.account.isSignedIn) {
    return
  }

  dispatch(fetching())
  dispatch(signInStart())

  const { web3, account } = getState().network

  if (global.FS) {
    global.FS.identify(account, {
      ethAddress: account,
    })
  }

  let authCode, authName
  try {
    [authCode, authName] = await Promise.all([
      offchain.getAuthCode(account),
      offchain.getAuthName(),
      dispatch(fetchBalance()),
    ])
  } catch (e) {
    dispatch(fetchingFailed(e))
    return
  }

  dispatch(fetched())

  let sig
  try {
    sig = await signData(web3, authCode, [{ type: 'string', name: authName, value: authCode }], account)
  } catch (e) {
    dispatch(signInCancel())
    return
  }

  dispatch(fetching())
  try {
    const user = await offchain.auth(authCode, sig, account)

    if (global.FS) {
      global.FS.identify(account, {
        ethAddress: account,
        ...(user || {}),
      })
    }

    dispatch(signedIn())

    if (user) {
      dispatch(signedUp(user.name, user.email, true))
    }

    dispatch(fetched())
  } catch (e) {
    dispatch(fetchingFailed(e))
  }
}

const signData = async (web3, normal, typed, address) => {
  if (!web3.currentProvider.sendAsync) {
    return web3.eth.sign(normal, address)
  }

  const result = await new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        method: 'eth_signTypedData',
        params: [typed, address],
        from: address,
      },
      (err, result) => err ? reject(err) : resolve(result),
    )
  })

  if (result.error) {
    throw result.error
  }

  const recovered = sigUtil.recoverTypedSignature({
    data: typed,
    sig: result.result,
  })

  if (recovered.toLowerCase() !== address.toLowerCase()) {
    throw new Error('Failed to verify signer, got: ' + result)
  }

  return result.result
}

export const signUp = () => async (dispatch: Function, getState: GetState) => {
  const { name, email } = getState().form[signUpFormName].values
  dispatch(signedUp(name, email, false))
  dispatch(fetched())
  dispatch(notify(
    'You Were Successfully Signed Up',
    true
  ))
}

export const requestConfirmEmail = (email: ?string) => async (dispatch: Function, getState: GetState) => {
  const { name } = getState().pui.account
  if (!email) { // eslint-disable-next-line no-param-reassign
    email = getState().pui.account.email
  } else { // $FlowFixMe
    dispatch(signedUp(name, email, false))
  }
  dispatch(fetching())
  try {
    await offchain.newEmail(email, name)
    dispatch({ type: REQUEST_CONFIRM_EMAIL })
    dispatch(fetched())
  } catch (e) {
    dispatch(fetchingFailed(e))
  }

}

export const confirmEmail = (pin: string) => async (dispatch: Function, getState: GetState) => {
  // TODO @bshevchenko: fires two times for some reason, one time with string and another time with object
  if (typeof pin !== 'string') {
    return
  }
  if (!pin) {
    dispatch({ type: ENTER_PIN_DEFAULT })
    return
  }
  try {
    await offchain.confirmEmail(pin)
    // TODO @bshevchenko: show success screen
    if (global.FS) {
      const { email, name } = getState().pui.account
      const { account } = getState().network
      global.FS.identify(account, {
        ethAddress: account,
        email,
        name,
      })
    }
    dispatch({ type: ENTER_PIN_SUCCESS })
  } catch (e) {
    dispatch({ type: ENTER_PIN_ERROR })
  }
}
// eslint-disable-next-line max-len
export const email = (txHash: string, subject: string, body: Node) => async (dispatch: Function, getState: GetState) => {
  // eslint-disable-next-line global-require, import/no-unresolved, $FlowFixMe
  const polymathJS = require('polymathjs/package.json')
  await offchain.email(txHash, subject, body, polymathJS.dependencies['polymath-core'], getState().network.id)
}

export const faucet = (address: ?string) => async (dispatch: Function) => {
  const polyFaucetAmount=25000
  dispatch(tx(
    ['Receiving POLY From Faucet'],
    async () => {
      await PolyToken.getTokens(polyFaucetAmount, address)
    },
    'You have successfully received ' + polyFaucetAmount + ' POLY',
    undefined,
    undefined,
    'ok',
    true // TODO @bshevchenko: !isEmailConfirmed
  ))
}
