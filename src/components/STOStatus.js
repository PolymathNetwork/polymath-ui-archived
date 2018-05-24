// @flow

import BigNumber from 'bignumber.js'
import React, { Component } from 'react'
import type { SecurityToken, STODetails } from 'polymathjs'

import { etherscanAddress } from '../helpers'
import Countdown from './Countdown'
import type { CountdownProps } from './Countdown'
import ProgressBar from './ProgressBar'

type Props = {|
  token: SecurityToken,
  details: STODetails,
|}

const niceAmount = (poly: BigNumber) =>
  Math.ceil(poly.toNumber()).toLocaleString()

const dateFormat = (date: Date) =>
  date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const getCountdownProps = (startDate: Date, endDate: Date): ?CountdownProps => {
  const now = new Date()

  if (now < startDate) {
    return {
      deadline: startDate,
      title: 'Time Left Until the Offering Starts',
    }
  } else if (now < endDate) {
    return {
      deadline: endDate,
      title: 'Time Left Until the Offering Ends',
    }
  }

  return null
}

export default class STOStatus extends Component<Props> {
  render () {
    const { token, details } = this.props

    const countdownProps = getCountdownProps(details.start, details.end)

    const symbol = details.isPolyFundraise ? 'POLY' : 'ETH'

    const raisedText = `${niceAmount(details.raised)} ${symbol}`
    const capText = `${niceAmount(details.cap)} ${token.ticker}`

    const distTokens = niceAmount(details.raised.times(details.rate))

    const fractionComplete = details.raised
      .div(details.cap.div(details.rate))
      .times(100)
      .toFixed(1)

    return (
      <div className='pui-page-box'>
        <h2 className='pui-h2'>Capped STO</h2>
        <p className='pui-sto-status-contract'>Contract { etherscanAddress(details.address) }</p>
        <div className='bx--row'>
          <div className='bx--col-xs-8 pui-sto-status-grow'>
            <div className='pui-sto-status-numbers'>
              <div>{fractionComplete}%</div>
              <div className='pui-key-value'>
                <div>Cap</div>
                {capText}
              </div>
            </div>
            <ProgressBar
              className='pui-sto-status-progress-bar'
              progress={fractionComplete / 100}
            />
            <div className='pui-sto-status-bottom-row'>
              <div className='pui-sto-status-dates'>
                <div className='pui-key-value'>
                  <div>Start Date</div>
                  {dateFormat(details.start)}
                </div>
                <div className='pui-key-value'>
                  <div>End Date</div>
                  {dateFormat(details.end)}
                </div>
                <div className='pui-key-value'>
                  <div style={{ paddingLeft: '60px' }}>
                    1 {symbol} = {details.rate} {token.ticker}
                  </div>
                </div>
              </div>
              <div>
                <div className='pui-key-value pui-countdown-raised'>
                  <div>Total Funds Raised</div>
                  ~{raisedText}
                  <div>
                    ~{distTokens} {token.ticker}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {countdownProps != null && (
            <div className='bx--col-xs-4'>
              <div className='pui-sto-countdown-container'>
                <Countdown
                  deadline={countdownProps.deadline}
                  title={countdownProps.title}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}
