// @flow

import * as a from './actions'
import type { Notify } from './actions'

type ToasterState = {
  notify: ?Notify
}

const defaultState = {
  notify: null,
}

export default (state: ToasterState = defaultState, action: a.ToasterAction) => {
  switch (action.type) {
    case a.NOTIFY:
      return {
        ...state,
        notify: action.notify,
      }
    default:
      return state
  }
}
