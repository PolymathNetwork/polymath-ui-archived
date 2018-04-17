// @flow

import BigNumber from 'bignumber.js'
import React, { Component } from 'react'

import Countdown from './Countdown'
import type { CountdownProps } from './Countdown'
import ProgressBar from './ProgressBar'

type Props = {|
  title: string,
    start: Date,
      end: Date,
        raised: BigNumber,
          cap: BigNumber,
            isPolyFundraise: boolean,
|}

const niceAmount = (poly: BigNumber) => Math.round(poly.toNumber()).toLocaleString()
const dateFormat = (date: Date) => date.toLocaleDateString('en', {
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
    const { title, start, end, raised, cap, isPolyFundraise } = this.props

    const countdownProps = getCountdownProps(start, end)

    const symbol = isPolyFundraise ? 'POLY' : 'ETH'

    const raisedText = `${niceAmount(raised)} ${symbol}`
    const capText = `${niceAmount(cap)} ${symbol}`

    const fractionComplete = raised.div(cap).times(100).toFixed(1)

    return (
      <div className='page-box'>
        <div className='bx--row'>
          <div className='bx--col-xs-auto'>
            <h3 id='pui-sto-status-title' className='bx--type-beta'>{title} <span className='bx--tag bx--tag--ibm'>Raise in {symbol}</span></h3>
          </div>
        </div>
        <div className='bx--row'>
          <div className='bx--col-xs-12 bx--col-md-6 pui-sto-status-grow'>
            <div className='pui-sto-status-numbers'>
              <div>{fractionComplete}%</div>
              <div className='pui-key-value'>
                <div>Cap</div>
                {capText}
              </div>
            </div>
            <ProgressBar className='pui-sto-status-progress-bar' progress={fractionComplete} />
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
              </div>
              <div>
                <div className='pui-key-value pui-countdown-poly'>
                  <div>Total funds raised</div>
                  {raisedText}
                </div>
              </div>
            </div>
          </div>
          {countdownProps != null && (
            <div className='bx--col-xs-12 bx--col-md-6'>
              <div className='pui-sto-countdown-container'>
                <Countdown deadline={countdownProps.deadline} title={countdownProps.title} />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}
