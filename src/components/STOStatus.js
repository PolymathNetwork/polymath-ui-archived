// @flow

import React, { Component } from 'react'

import ProgressBar from './ProgressBar'

type Props = {|
  // Props here
|}

export default class STOStatus extends Component<Props> {
  render () {
    return (
      <div className='page-box'>
        <div className='bx--row'>
          <h3 id='pui-sto-status-title' className='bx--type-beta'>
            STO Title
          </h3>
        </div>
        <div className='bx--row'>
          <div className='bx--col-xs-12 bx--col-sm-7'>
            <div className='pui-sto-status-numbers'>
              <div>50%</div>
              <div>
                <div><strong>Cap</strong></div>
                <br />
                100,000 POLY
              </div>
            </div>
            <ProgressBar className='pui-sto-status-progress-bar' progress={0.5} />
            <div className='pui-sto-status-bottom-row'>
              <div className='pui-sto-status-dates'>
                <div>Date 1</div>
                <div>Date 2</div>
              </div>
              <div>POLY raised</div>
            </div>
          </div>
          <div className='bx--col-xs-0 bx--col-sm-1' />
          <div className='bx--col-xs-12 bx--col-sm-4'>
            <h3 className='bx--type-beta'>
              Responsive box (countdown here)
            </h3>
          </div>
        </div>
      </div>
    )
  }
}
