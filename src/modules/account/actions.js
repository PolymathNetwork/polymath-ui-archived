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

export const INITIALIZED = 'polymath-ui/account/INITIALIZED'
export const setInitialized = (value: boolean) => ({ type: INITIALIZED, value })

export const SIGNED_UP = 'polymath-ui/account/SIGNED_UP'
export const signedUp = (value: boolean) => ({ type: SIGNED_UP, value })

export const BALANCE = 'polymath-ui/account/BALANCE'
export const setBalance = (balance: BigNumber) => ({ type: BALANCE, balance })

export const ACTIVATED = 'polymath-ui/account/ACTIVATED'
export const setActivated = (value: boolean) => ({ type: ACTIVATED, value })

export type Action =
  | ExtractReturn<typeof setInitialized>
  | ExtractReturn<typeof signedUp>
  | ExtractReturn<typeof setBalance>
  | ExtractReturn<typeof setActivated>

export type AccountInnerData = {|
  name: string,
  email: string,
|}

export type AccountData = {|
  account: AccountInnerData,
  accountJSON: string,
  signature: string,
  signerAddress?: string,
|}

export type AccountDataForFetch = {|
  accountJSON: string,
  signature: string,
  signerAddress: string,
|}

const fetchBalance = () => async (dispatch: Function) => {
  const balance = await PolyToken.myBalance()
  await PolyToken.subscribeMyTransfers(async () => {
    dispatch(setBalance(await PolyToken.myBalance()))
  })
  dispatch(setBalance(balance))
}

const fetchIsActivated = () => async (dispatch: Function, getState: GetState) => {
  try {
    const address = getState().network.account
    const result = await offchainFetch({
      query: `
        query ($address: String!) {
          isUserActivated(address: $address)
        }
      `,
      variables: {
        address,
      },
    })

    if (result.errors) {
      // eslint-disable-next-line no-console
      console.error('isUserActivated failed:', result.errors)
      dispatch(setActivated(false))
      return
    }

    dispatch(setActivated(result.data.isUserActivated))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('fetchIsActivated failed:', err)
  }
}

export const initAccount = () => async (dispatch: Function, getState: GetState) => {
  dispatch(fetching())
  const isSignedUp = getAccountData(getState()) != null

  try {
    await Promise.all([
      dispatch(fetchBalance()),
      ...(isSignedUp ? [dispatch(fetchIsActivated())] : []),
    ])
  } catch (e) {
    dispatch(fetchingFailed(e))
    return
  }

  dispatch(signedUp(isSignedUp))

  if (global.FS) {
    const account = getState().network.account
    global.FS.identify(account, {
      ethAddress: account,
    })
  }

  dispatch(setInitialized(true))
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

export const updateAccount = (account: AccountInnerData) => async (dispatch: Function, getState: GetState) => {
  const { web3 } = getState().network
  const address = getState().network.account

  if (!web3 || !address) {
    throw new Error('web3 or account is undefined')
  }

  const prevAccountData = getAccountData(getState())
  if (prevAccountData) {
    const prevAccount = prevAccountData.account
    if (prevAccount.name === account.name && prevAccount.email === account.email) {
      // No changes made
      return
    }
  }

  const typedSigAccount = [
    {
      type: 'string',
      name: 'Name',
      value: account.name,
    },
    {
      type: 'string',
      name: 'Email',
      value: account.email,
    },
  ]
  const accountJSON = JSON.stringify(typedSigAccount)
  const signature = await signData(web3, typedSigAccount, accountJSON, address)

  let accountData: AccountData = {
    account,
    accountJSON,
    signature,
  }
  const accountDataString = JSON.stringify(accountData)
  localStorage.setItem(address, accountDataString)

  await dispatch(sendRegisterRequest())
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

    await dispatch(updateAccount({
      name: data.name,
      email: data.email,
    }))

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

export const getAccountDataForFetch = (state: RootState): ?AccountDataForFetch => {
  const accountData = getAccountData(state)
  if (!accountData || !accountData.signerAddress) {
    return null
  }

  return {
    accountJSON: accountData.accountJSON,
    signature: accountData.signature,
    signerAddress: accountData.signerAddress,
  }
}

export const sendRegisterRequest = () => async (dispatch: Function, getState: GetState) => {
  const accountData = getAccountDataForFetch(getState())
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
        accountData,
      },
    },
  })

  if (emailResult.errors) {
    // eslint-disable-next-line no-console
    console.error('sendRegisterRequest failed.', emailResult.errors)
  }
}

export const sendActivationEmail = () => async (dispatch: Function, getState: GetState) => {
  const accountData = getAccountDataForFetch(getState())
  if (!accountData) {
    throw new Error('Not signed in.')
  }

  const emailResult = await offchainFetch({
    query: `
      mutation ($input: SendActivationEmailInput!) {
        sendActivationEmail(input: $input)
      }
    `,
    variables: {
      input: {
        accountData,
      },
    },
  })

  if (emailResult.errors) {
    // eslint-disable-next-line no-console
    console.error('sendActivationEmail failed.', emailResult.errors)
  }
}
