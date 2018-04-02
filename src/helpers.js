// @flow

import React from 'react'
import type { Node } from 'react'

const etherscan = (type: string, value: string, label: string | Node) => {
  return (
    <a href={'https://ropsten.etherscan.io/' + type + '/' + value} target='_blank'>
      {label}
    </a>
  )
}

export const etherscanAddress = (address: string, label?: string | Node) => {
  return etherscan('address', address, label || address)
}

export const etherscanTx = (hash: string, label?: string | Node) => {
  return etherscan('tx', hash, label || 'See on Etherscan')
}

export const etherscanToken = (address: string, label?: string | Node) => {
  return etherscan('token', address, label || address)
}

export const thousandsDelimiter = (v: number) =>
  v.toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
