import { configureStore } from '@reduxjs/toolkit'
import { productReducer } from '../reducers/product'

export const store = configureStore({
  reducer: {
    productReducer
  }
})


export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];