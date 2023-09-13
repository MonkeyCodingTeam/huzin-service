import { createListenerMiddleware, type TypedStartListening } from '@reduxjs/toolkit';
import { AuthAPI } from '@entities/user';
import { invalidateAccessToken } from '@shared/api';

export const invalidateAccessTokenListener = createListenerMiddleware();

// @see https://redux-toolkit.js.org/api/createListenerMiddleware#typescript-usage
export type TypedListening = TypedStartListening<RootState, AppDispatch>;

export const startInvalidateAccessTokenListener =
  invalidateAccessTokenListener.startListening as TypedListening;

startInvalidateAccessTokenListener({
  actionCreator: invalidateAccessToken,
  effect: (_, api) => {
    console.log('Refresh');
    // In the future here may be logic with refresh access token
    // @see https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#preventing-multiple-unauthorized-errors
    api.dispatch(AuthAPI.endpoints.logout.initiate(null));
  },
});
