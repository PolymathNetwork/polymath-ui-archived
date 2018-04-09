//@flow

import React, { Component } from 'react'

type Props = {|
  deadline: Date,
|}

type State = {|
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
|}

function leading0 (num) {
  return num < 10 ? '0' + num : num
}

class Countdown extends Component<Props, State> {
  state = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }

  componentWillMount () {
    this.updateTimeUntil(this.props.deadline)
  }

  componentDidMount () {
    setInterval(() => this.updateTimeUntil(this.props.deadline), 1000)
  }

  updateTimeUntil = (deadline: Date) => {
    const time = deadline - new Date()

    if (time < 0) {
      this.setState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    } else {
      const seconds = Math.floor((time / 1000) % 60)
      const minutes = Math.floor((time / 1000 / 60) % 60)
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
      const days = Math.floor(time / (1000 * 60 * 60 * 24))
      this.setState({ days, hours, minutes, seconds })
    }
  }

  render () {
    return (
      <div className='pui-countdown'>
        <div className='pui-countdown-top-bar'>
          Time left until the offering ends
        </div>
        <div className='pui-countdown-content'>
          <div className='pui-countdown-days'>
            <div className='pui-countdown-number-column pui-countdown-number'>
              <div><div>{leading0(this.state.days)}</div></div>
            </div>
            <div className='pui-countdown-number-column pui-countdown-number-text'>
              <div><div>DAYS</div></div>
            </div>
          </div>
          <div className='pui-countdown-time'>
            <div className='pui-countdown-number-column pui-countdown-number'>
              <div><div className='pui-countdown-hours'>{leading0(this.state.hours)}</div></div>
              <div><div className='pui-countdown-minutes'>{leading0(this.state.minutes)}</div></div>
              <div><div className='pui-countdown-seconds'>{leading0(this.state.seconds)}</div></div>
            </div>
            <div className='pui-countdown-number-column pui-countdown-number-text'>
              <div><div>HOURS</div></div>
              <div><div>MINUTES</div></div>
              <div><div>SECONDS</div></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Countdown
