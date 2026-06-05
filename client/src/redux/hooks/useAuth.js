// src/redux/hooks/useAuth.js
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentUser,
  selectToken,
  selectIsLoggedIn,
  selectIsGuest,
  selectHasAccess,
  selectAuthLoading,
  selectAuthError,
  selectAuthSuccess,
  selectSavedRecipes,
  loginUser,
  registerUser,
  logout,
  continueAsGuest,
  clearError,
  clearSuccess,
  saveRecipeToProfile,
  toggleFavorite,
  removeSavedRecipe,
} from '../slices/authSlice'

const useAuth = () => {
  const dispatch = useDispatch()

  return {
    // ── State ────────────────────────────────────────────────────────────
    user:         useSelector(selectCurrentUser),
    token:        useSelector(selectToken),
    isLoggedIn:   useSelector(selectIsLoggedIn),
    isGuest:      useSelector(selectIsGuest),
    hasAccess:    useSelector(selectHasAccess),   // true if logged in OR guest
    loading:      useSelector(selectAuthLoading),
    error:        useSelector(selectAuthError),
    successMsg:   useSelector(selectAuthSuccess),
    savedRecipes: useSelector(selectSavedRecipes),

    // ── Actions ──────────────────────────────────────────────────────────
    login:           (creds)   => dispatch(loginUser(creds)),
    register:        (creds)   => dispatch(registerUser(creds)),
    logout:          ()        => dispatch(logout()),
    continueAsGuest: ()        => dispatch(continueAsGuest()),
    clearError:      ()        => dispatch(clearError()),
    clearSuccess:    ()        => dispatch(clearSuccess()),
    saveRecipe:      (id)      => dispatch(saveRecipeToProfile(id)),
    toggleFav:       (id)      => dispatch(toggleFavorite(id)),
    removeRecipe:    (id)      => dispatch(removeSavedRecipe(id)),
  }
}

export default useAuth