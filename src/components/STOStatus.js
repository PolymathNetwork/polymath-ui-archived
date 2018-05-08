// @flow

import BigNumber from 'bignumber.js'
import React, { Component } from 'react'

import Countdown from './Countdown'
import type { CountdownProps } from './Countdown'
import ProgressBar from './ProgressBar'

type Props = {|
  ticker: string,
  rate: BigNumber,
  title: string,
  start: Date,
  end: Date,
  raised: BigNumber,
  cap: BigNumber,
  isPolyFundraise: boolean
|};

const niceAmount = (poly: BigNumber) =>
  Math.round(poly.toNumber()).toLocaleString()
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
      title: 'Time left until the offering starts',
    }
  } else if (now < endDate) {
    return {
      deadline: endDate,
      title: 'Time left until the offering ends',
    }
  }

  return null
}

export default class STOStatus extends Component<Props> {
  render () {
    const {
      title,
      start,
      end,
      raised,
      cap,
      isPolyFundraise,
      ticker,
      rate,
    } = this.props

    const countdownProps = getCountdownProps(start, end)

    const symbol = isPolyFundraise ? 'POLY' : 'ETH'

    const raisedText = `${niceAmount(raised)} ${symbol}`
    const capText = `${niceAmount(cap)} ${symbol}`

    const distTokens = niceAmount(raised.times(rate))

    const fractionComplete = raised
      .div(cap)
      .times(100)
      .toFixed(1)

    return (
      <div className='pui-page-box'>
        <h2 className='pui-h2'>{title}</h2>
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
              progress={fractionComplete}
            />
            <div className='pui-sto-status-bottom-row'>
              <div className='pui-sto-status-dates'>
                <div className='pui-key-value'>
                  <div>Start Date</div>
                  {dateFormat(start)}
                </div>
                <div className='pui-key-value'>
                  <div>End Date</div>
                  {dateFormat(end)}
                </div>
                <div className='pui-key-value'>
                  <div>
                    1 ETH = {rate} {ticker}
                  </div>
                </div>
              </div>
              <div>
                <div className='pui-key-value pui-countdown-poly'>
                  <div>Total funds raised</div>
                  {raisedText}
                  <div>
                    {distTokens} {ticker}
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
