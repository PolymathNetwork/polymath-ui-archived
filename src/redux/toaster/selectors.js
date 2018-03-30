import { createSelector } from 'reselect'

import { getPUIState } from '../selectors'

export const getToasterState = createSelector(
  getPUIState,
  (puiState) => puiState.toaster
)
