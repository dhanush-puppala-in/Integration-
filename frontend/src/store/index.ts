import { configureStore } from '@reduxjs/toolkit';
import chapterLeaderReducer from './slices/chapterLeaderSlice';

export const store = configureStore({
  reducer: {
    chapterLeader: chapterLeaderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
