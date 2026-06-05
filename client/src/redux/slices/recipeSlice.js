// src/redux/slices/recipeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// ── Async thunks ──────────────────────────────────────────────────────────────

export const fetchRecipe = createAsyncThunk(
  'recipe/fetch',
  async ({ country, mealType }, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/recipes/fetch', {
        params: { country, mealType },
      })
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Could not fetch recipe. Please try again.'
      )
    }
  }
)

export const fetchRandomCountry = createAsyncThunk(
  'recipe/randomCountry',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/recipes/random')
      return data.country
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not spin the globe.')
    }
  }
)

export const fetchRecentlySpun = createAsyncThunk(
  'recipe/recentlySpun',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/recipes/recently-spun')
      return data.recipes
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not load recently spun.')
    }
  }
)

export const fetchCountries = createAsyncThunk(
  'recipe/countries',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/recipes/countries')
      return data.countries
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not load countries.')
    }
  }
)

// ── Slice ─────────────────────────────────────────────────────────────────────
const recipeSlice = createSlice({
  name: 'recipe',
  initialState: {
    currentRecipe:  null,
    recentlySpun:   [],
    countries:      [],
    selectedCountry: null,
    selectedMealType: 'dinner',
    isSpinning:     false,
    loading:        false,
    fromCache:      false,
    error:          null,
    activeTab:      'steps', // 'ingredients' | 'steps' | 'tips'
  },
  reducers: {
    setSelectedCountry(state, action) {
      state.selectedCountry = action.payload
    },
    setSelectedMealType(state, action) {
      state.selectedMealType = action.payload
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload
    },
    clearRecipe(state) {
      state.currentRecipe = null
      state.error = null
    },
    clearRecipeError(state) {
      state.error = null
    },
    setRecipe(state, action) {
      state.currentRecipe = action.payload
    },
  },
  extraReducers: (builder) => {
    // ── Fetch recipe ───────────────────────────────────────────────────────
    builder
      .addCase(fetchRecipe.pending, (state) => {
        state.loading = true
        state.error   = null
        state.currentRecipe = null
      })
      .addCase(fetchRecipe.fulfilled, (state, action) => {
        state.loading       = false
        state.currentRecipe = action.payload.recipe
        state.fromCache     = action.payload.fromCache
        state.activeTab     = 'steps'
      })
      .addCase(fetchRecipe.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // ── Random country (Spin) ──────────────────────────────────────────────
    builder
      .addCase(fetchRandomCountry.pending, (state) => {
        state.isSpinning = true
      })
      .addCase(fetchRandomCountry.fulfilled, (state, action) => {
        state.isSpinning     = false
        state.selectedCountry = action.payload
      })
      .addCase(fetchRandomCountry.rejected, (state) => {
        state.isSpinning = false
      })

    // ── Recently spun ──────────────────────────────────────────────────────
    builder
      .addCase(fetchRecentlySpun.fulfilled, (state, action) => {
        state.recentlySpun = action.payload
      })

    // ── Countries ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countries = action.payload
      })
  },
})

export const {
  setSelectedCountry,
  setSelectedMealType,
  setActiveTab,
  clearRecipe,
  clearRecipeError,
  setRecipe,
} = recipeSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectCurrentRecipe   = (state) => state.recipe.currentRecipe
export const selectRecentlySpun    = (state) => state.recipe.recentlySpun
export const selectCountries       = (state) => state.recipe.countries
export const selectSelectedCountry = (state) => state.recipe.selectedCountry
export const selectSelectedMealType= (state) => state.recipe.selectedMealType
export const selectIsSpinning      = (state) => state.recipe.isSpinning
export const selectRecipeLoading   = (state) => state.recipe.loading
export const selectRecipeError     = (state) => state.recipe.error
export const selectFromCache       = (state) => state.recipe.fromCache
export const selectActiveTab       = (state) => state.recipe.activeTab

export default recipeSlice.reducer