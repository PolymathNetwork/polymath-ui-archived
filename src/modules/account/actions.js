// @flow

import BigNumber from 'bignumber.js'
import sigUtil from 'eth-sig-util'
// $FlowFixMe
import { PolyToken } from 'polymathjs'

import { fetching, fetchingFailed, fetched, notify, txStart, txEnd, txFailed } from '../..'
import { formName } from './SignUpForm'
import type { ExtractReturn } from '../../redux/helpers'
import type { GetState, RootState } from '../../redux/reducer'
import offchainFetch from '../../offchainFetch'

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
  signerAddress?: string,
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

  if (global.FS) {
    const account = getState().network.account
    global.FS.identify(account, {
      ethAddress: account,
    })
  }

  dispatch(fetched())
}

const signData = async (web3, account, accountJSON, address) => {
  if (!web3.currentProvider.sendAsync) {
    return web3.eth.sign(accountJSON, address)
  }

  const result = await new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        method: 'eth_signTypedData',
        params: [account, address],
        from: address,
      },
      (err, result) => err ? reject(err) : resolve(result),
    )
  })

  if (result.error) {
    throw result.error
  }

  const recovered = sigUtil.recoverTypedSignature({
    data: account,
    sig: result.result,
  })

  if (recovered.toLowerCase() !== address.toLowerCase()) {
    throw new Error('Failed to verify signer, got: ' + result)
  }

  return result.result
}

export const signUp = () => async (dispatch: Function, getState: GetState) => {
  dispatch(txStart('Requesting your signature...'))
  try {
    const data = getState().form[formName].values
    const { web3 } = getState().network
    const address = getState().network.account

    if (!web3 || !address) {
      throw new Error('web3 or account is undefined')
    }

    const typedSigAccount = [
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
    const accountJSON = JSON.stringify(typedSigAccount)
    const signature = await signData(web3, typedSigAccount, accountJSON, address)

    let accountData: AccountData = {
      account: {
        name: data.name,
        email: data.email,
      },
      accountJSON,
      signature,
    }
    const accountDataString = JSON.stringify(accountData)
    localStorage.setItem(address, accountDataString)

    await dispatch(sendRegisterEmail())

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

export const getAccountData = (state: RootState): ?AccountData => {
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

  accountData.signerAddress = address

  return accountData
}

export const sendRegisterEmail = () => async (dispatch: Function, getState: GetState) => {
  const accountData = getAccountData(getState())
  if (!accountData) {
    throw new Error('Not signed in.')
  }

  const emailResult = await offchainFetch({
    query: `
      mutation ($input: RegisterInput!) {
        register(input: $input)
      }
    `,
    variables: {
      input: {
        accountData: {
          accountJSON: accountData.accountJSON,
          signature: accountData.signature,
          signerAddress: accountData.signerAddress,
        },
      },
    },
  })

  if (emailResult.errors) {
    // eslint-disable-next-line no-console
    console.error('sendRegisterEmail failed.', emailResult.errors)
  }
}
