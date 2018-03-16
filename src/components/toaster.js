import { ToastNotification } from 'carbon-components-react'
import React, { Component } from 'react'
import { Transition } from 'react-transition-group'

import styles from '../style.css'

export class Toaster extends Component {
  state = {
    toasts: []
  }

  show (toast, duration = 4000) {
    this.setState((previousState) => {
      const toasts = previousState.toasts
      const newKey = toasts.reduce((max, toast) => Math.max(max, toast.key), toasts[0] ? toasts[0].key : 0) + 1

      if (duration > 0) {
        setTimeout(() => {
          this.startHidingKey(newKey)
        }, duration)
      }

      return {
        ...previousState,
        toasts: [
          {
            key: newKey,
            data: toast,
            hiding: false
          },
          ...toasts,
        ]
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
      }, styles.toastAnimationDuration)

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
      <Transition
        key={key}
        in={!hiding}
        appear={true}
        timeout={0} >
        {(status) => (
          <ToastNotification
            {...data}
            onCloseButtonClick={() => this.removeKey(key)}
            className={`pui-toast pui-toast-${status}`}
          />
        )}
      </Transition>
    ))

    return (
      <div className="pui-toaster">
        {toastElements}
      </div>
    )
  }
}

export const ToasterContainer = ({ children }) => (
  <div className="pui-toaster-container">{children}</div>
)
