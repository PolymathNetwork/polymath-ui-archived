// @flow

import type { Node } from 'react'

import type { ExtractReturn } from '../helpers'

export type Notify = {|
  title: string,
  isSuccess?: boolean,
  subtitle?: ?string,
  caption?: ?Node,
  isPinned?: ?boolean,
|}

export const NOTIFY = 'polymath-ui/toaster/NOTIFY'
export const notify = (notify: Notify) => ({ type: 'polymath-ui/toaster/NOTIFY', notify })

export type ToasterAction =
  | ExtractReturn<typeof notify>
