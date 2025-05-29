import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import petsSlice from './petsSlice'
import sightingsSlice from './sightingsSlice'
import commentsSlice from './commentsSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    pets: petsSlice,
    sightings: sightingsSlice,
    comments: commentsSlice,
  },
})

export default store