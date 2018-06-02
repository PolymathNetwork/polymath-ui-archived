// @flow

import type { ExtractReturn } from '../../redux/helpers'

export const SHOW = 'polymath-ui/modal/SHOW'
export const showModal = (
  headerText: string,
  labelText: string,
  confirmText: string,
  message: string,
  labelColor: string,
  modalIcon: string,
  onClose: any,
  onSubmit: any,
) => ({ type: SHOW, headerText, labelText, confirmText, message, labelColor, modalIcon, onClose, onSubmit })

export const CLOSE = 'polymath-ui/modal/CLOSE'
export const closeModalAction = () => ({ type: CLOSE })

export type Action = ExtractReturn<typeof showModal> | ExtractReturn<typeof closeModalAction>
