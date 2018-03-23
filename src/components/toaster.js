// @flow

import { ToastNotification } from 'carbon-components-react'
import React, { Component } from 'react'
import type { Node } from 'react'
import { Transition } from 'react-transition-group'

// This line would be 'style.scss' if we were to bundle with Webpack.
// $FlowFixMe
import styles from '../style.css'

export type Toast = {
  key: number,
  hiding: bool,
  data: Object,
}

type State = {
  toasts: Array<Toast>
}

export class Toaster extends Component<{}, State> {
  state = {
    toasts: []
  }

  show (toast: Toast, duration: number = 4000) {
    this.setState((previousState) => {
      const toasts = previousState.toasts
      const newKey = toasts.reduce(
        (max, toast) => Math.max(max, toast.key),
        toasts[0] ? toasts[0].key : 0
      ) + 1

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

  getToastIndexByKey = (state: State, key: number) => state.toasts
    .map(toast => toast.key)
    .indexOf(key)

  startHidingKey = (key: number) => {
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

  removeKey = (key: number) => {
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

export const ToasterContainer = ({
  children
}: {
  children: Node
}) => (
  <div className="pui-toaster-container">{children}</div>
)
