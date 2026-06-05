// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// ── Persist token + guest flag to localStorage ────────────────────────────────
const TOKEN_KEY = 'ttw_token'
const USER_KEY  = 'ttw_user'
const GUEST_KEY = 'ttw_guest'

const loadFromStorage = () => {
  try {
    const token   = localStorage.getItem(TOKEN_KEY)
    const user    = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    const isGuest = localStorage.getItem(GUEST_KEY) === 'true'
    return { token, user, isGuest }
  } catch {
    return { token: null, user: null, isGuest: false }
  }
}

const saveToStorage = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.removeItem(GUEST_KEY)   // logged-in users are never guests
}

const clearStorage = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(GUEST_KEY)
}

// ── Async thunks ──────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', { username, email, password })
      saveToStorage(data.token, data.user)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed.')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      saveToStorage(data.token, data.user)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed.')
    }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me')
      return data.user
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Session expired.')
    }
  }
)

export const saveRecipeToProfile = createAsyncThunk(
  'auth/saveRecipe',
  async (recipeId, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/users/save-recipe', { recipeId })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not save recipe.')
    }
  }
)

export const toggleFavorite = createAsyncThunk(
  'auth/toggleFavorite',
  async (savedRecipeId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/users/saved-recipes/${savedRecipeId}/favorite`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not update favourite.')
    }
  }
)

export const removeSavedRecipe = createAsyncThunk(
  'auth/removeRecipe',
  async (savedRecipeId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/users/saved-recipes/${savedRecipeId}`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not remove recipe.')
    }
  }
)

// ── Slice ─────────────────────────────────────────────────────────────────────
const { token: persistedToken, user: persistedUser, isGuest: persistedGuest } = loadFromStorage()

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:       persistedUser  || null,
    token:      persistedToken || null,
    isGuest:    persistedGuest || false,
    loading:    false,
    error:      null,
    successMsg: null,
  },
  reducers: {
    // Called when user clicks "Continue as Guest"
    continueAsGuest(state) {
      state.isGuest = true
      state.user    = null
      state.token   = null
      localStorage.setItem(GUEST_KEY, 'true')
    },
    logout(state) {
      state.user    = null
      state.token   = null
      state.isGuest = false
      state.error   = null
      clearStorage()
    },
    setCredentials(state, action) {
      const { user, token } = action.payload
      state.user    = user
      state.token   = token
      state.isGuest = false
      saveToStorage(token, user)
    },
    clearError(state) {
      state.error = null
    },
    clearSuccess(state) {
      state.successMsg = null
    },
  },
  extraReducers: (builder) => {
    // ── Register ───────────────────────────────────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
        state.token   = action.payload.token
        state.isGuest = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // ── Login ──────────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
        state.token   = action.payload.token
        state.isGuest = false
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // ── Fetch current user ─────────────────────────────────────────────────
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user    = action.payload
        state.isGuest = false
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user    = null
        state.token   = null
        state.isGuest = false
        clearStorage()
      })

    // ── Save recipe ────────────────────────────────────────────────────────
    builder
      .addCase(saveRecipeToProfile.fulfilled, (state, action) => {
        if (state.user) state.user.savedRecipes = action.payload.savedRecipes
        state.successMsg = action.payload.message
      })
      .addCase(saveRecipeToProfile.rejected, (state, action) => {
        state.error = action.payload
      })

    // ── Toggle favourite ───────────────────────────────────────────────────
    builder
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (state.user) state.user.savedRecipes = action.payload.savedRecipes
        state.successMsg = action.payload.message
      })

    // ── Remove recipe ──────────────────────────────────────────────────────
    builder
      .addCase(removeSavedRecipe.fulfilled, (state, action) => {
        if (state.user) state.user.savedRecipes = action.payload.savedRecipes
      })
  },
})

export const {
  continueAsGuest,
  logout,
  setCredentials,
  clearError,
  clearSuccess,
} = authSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectCurrentUser  = (state) => state.auth.user
export const selectToken        = (state) => state.auth.token
export const selectIsLoggedIn   = (state) => !!state.auth.token
export const selectIsGuest      = (state) => state.auth.isGuest
export const selectHasAccess    = (state) => !!state.auth.token || state.auth.isGuest
export const selectAuthLoading  = (state) => state.auth.loading
export const selectAuthError    = (state) => state.auth.error
export const selectAuthSuccess  = (state) => state.auth.successMsg
export const selectSavedRecipes = (state) => state.auth.user?.savedRecipes || []

export default authSlice.reducer