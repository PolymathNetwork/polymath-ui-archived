// @flow

import { createApolloFetch } from 'apollo-fetch'

// eslint-disable-next-line import/prefer-default-export
const offchainFetch = createApolloFetch({
  uri: (process.env.REACT_APP_OFFCHAIN_URL || 'https://polymath-offchain.herokuapp.com') + '/graphql',
})
export default offchainFetch
