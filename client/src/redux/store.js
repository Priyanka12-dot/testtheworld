// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer   from './slices/authSlice'
import recipeReducer from './slices/recipeSlice'

const store = configureStore({
  reducer: {
    auth:   authReducer,
    recipe: recipeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types that may have non-serializable values
        ignoredActions: ['recipe/setRecipe'],
      },
    }),
})

export default store