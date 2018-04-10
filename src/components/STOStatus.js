// @flow

import BigNumber from 'bignumber.js'
import React, { Component } from 'react'

import Countdown from './Countdown'
import type { CountdownProps } from './Countdown'
import ProgressBar from './ProgressBar'

type Props = {|
  title: string,
  startDate: Date,
  endDate: Date,
  polyRaised: BigNumber,
  polyCap: BigNumber,
|}

const nicePoly = (poly: BigNumber) => Math.round(poly.div(new BigNumber(10).pow(18)).toNumber()).toLocaleString()
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
    const { title, startDate, endDate, polyRaised, polyCap } = this.props

    const countdownProps = getCountdownProps(startDate, endDate)

    const polyRaisedText = `${nicePoly(polyRaised)} POLY`
    const polyCapText = `${nicePoly(polyCap)} POLY`

    const fractionComplete = `${polyRaised.div(polyCap).times(100).toFixed(1)}%`

    return (
      <div className='page-box'>
        <div className='bx--row'>
          <div className='bx--col-xs-auto'>
            <h3 id='pui-sto-status-title' className='bx--type-beta'>{title}</h3>
          </div>
        </div>
        <div className='bx--row'>
          <div className='bx--col-xs-12 bx--col-md-6 pui-sto-status-grow'>
            <div className='pui-sto-status-numbers'>
              <div>{fractionComplete}</div>
              <div className='pui-key-value'>
                <div>Cap</div>
                {polyCapText}
              </div>
            </div>
            <ProgressBar className='pui-sto-status-progress-bar' progress={0.5} />
            <div className='pui-sto-status-bottom-row'>
              <div className='pui-sto-status-dates'>
                <div className='pui-key-value'>
                  <div>Start Date</div>
                  {dateFormat(startDate)}
                </div>
                <div className='pui-key-value'>
                  <div>End Date</div>
                  {dateFormat(endDate)}
                </div>
              </div>
              <div>
                <div className='pui-key-value pui-countdown-poly'>
                  <div>Total funds raised</div>
                  {polyRaisedText}
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
