// @flow
import type { Node } from 'react'
import type { ExtractReturn } from '../../redux/helpers'

export const CONFIRM = 'polymath-ui/modal/CONFIRM'
export const confirm = (headerText: string, message: Node, labelColor: string, onSubmit: any, onClose: any) => ({
  type: CONFIRM,
  headerText,
  message,
  labelColor,
  onSubmit,
  onClose,
})

export const CLOSE = 'polymath-ui/modal/CLOSE'
export const cancelConfirm = () => ({ type: CLOSE })

export type Action = ExtractReturn<typeof confirm> | ExtractReturn<typeof cancelConfirm>
