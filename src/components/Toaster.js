import { ToastNotification } from 'carbon-components-react'
import React, { Component } from 'react'

import styles from '../styles.css'

const STAY_TIME = 4000

export default class Toaster extends Component {
  state = {
    toasts: []
  }

  show (toast) {
    this.setState((previousState) => {
      const toasts = previousState.toasts
      const newKey = toasts.reduce((max, toast) => Math.max(max, toast.key), toasts[0] ? toasts[0].key : 0) + 1

      setTimeout(() => {
        this.startHidingKey(newKey)
      }, STAY_TIME)

      return {
        ...previousState,
        toasts: [...toasts, {
          key: newKey,
          data: toast,
          hiding: false
        }]
      }
    })
  }

  clear () {
    this.setState({ toasts: [] })
  }

  getToastIndexByKey = (state, key) => state.toasts
    .map(toast => toast.key)
    .indexOf(key)

  startHidingKey = (key) => {
    this.setState((previousState) => {
      const index = this.getToastIndexByKey(previousState, key)
      if (index === -1 || previousState.toasts[index].hiding) {
        return
      }

      setTimeout(() => {
        this.removeKey(key)
      }, styles.toastFadeDuration)

      return {
        ...previousState,
        toasts: Object.assign(
          [...previousState.toasts],
          {[index]: {
            ...previousState.toasts[index],
            hiding: true
          }}
        )
      }
    })
  }

  removeKey = (key) => {
    this.setState((previousState) => {
      const index = this.getToastIndexByKey(previousState, key)
      if (index === -1) {
        return
      }

      return {
        ...previousState,
        toasts: [
          ...previousState.toasts.slice(0, index),
          ...previousState.toasts.slice(index + 1)
        ]
      }
    })
  }

  render () {
    const toastElements = this.state.toasts.map(({
      key,
      hiding,
      data
    }) => (
      <ToastNotification
        {...data}
        key={key}
        onCloseButtonClick={() => this.removeKey(key)}
        className={`pui-toast ${hiding ? 'hide' : ''}`}
      />
    ))

    return (
      <div>
        {toastElements}
      </div>
    )
  }
}
