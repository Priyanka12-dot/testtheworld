// src/hooks/useFetchRecipe.js
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchRecipe,
  fetchRandomCountry,
  fetchRecentlySpun,
  fetchCountries,
  setSelectedCountry,
  setSelectedMealType,
  selectCurrentRecipe,
  selectSelectedCountry,
  selectSelectedMealType,
  selectIsSpinning,
  selectRecipeLoading,
  selectRecipeError,
  selectRecentlySpun,
  selectCountries,
  selectFromCache,
  selectActiveTab,
  setActiveTab,
  clearRecipe,
} from '../redux/slices/recipeSlice'

/**
 * useFetchRecipe — centralised hook for all recipe-related state and actions.
 */
const useFetchRecipe = () => {
  const dispatch = useDispatch()

  // ── State ─────────────────────────────────────────────────────────────────
  const currentRecipe    = useSelector(selectCurrentRecipe)
  const selectedCountry  = useSelector(selectSelectedCountry)
  const selectedMealType = useSelector(selectSelectedMealType)
  const isSpinning       = useSelector(selectIsSpinning)
  const loading          = useSelector(selectRecipeLoading)
  const error            = useSelector(selectRecipeError)
  const recentlySpun     = useSelector(selectRecentlySpun)
  const countries        = useSelector(selectCountries)
  const fromCache        = useSelector(selectFromCache)
  const activeTab        = useSelector(selectActiveTab)

  // ── Actions ───────────────────────────────────────────────────────────────

  const spinGlobe = useCallback(async () => {
    const result = await dispatch(fetchRandomCountry())
    if (fetchRandomCountry.fulfilled.match(result)) {
      // Auto-fetch recipe after spin
      dispatch(fetchRecipe({
        country:  result.payload,
        mealType: selectedMealType,
      }))
    }
  }, [dispatch, selectedMealType])

  const getRecipe = useCallback((country, mealType) => {
    const c = country  || selectedCountry
    const m = mealType || selectedMealType
    if (!c || !m) return
    dispatch(fetchRecipe({ country: c, mealType: m }))
  }, [dispatch, selectedCountry, selectedMealType])

  const selectCountry = useCallback((country) => {
    dispatch(setSelectedCountry(country))
  }, [dispatch])

  const selectMealType = useCallback((mealType) => {
    dispatch(setSelectedMealType(mealType))
  }, [dispatch])

  const loadRecentlySpun = useCallback(() => {
    dispatch(fetchRecentlySpun())
  }, [dispatch])

  const loadCountries = useCallback(() => {
    dispatch(fetchCountries())
  }, [dispatch])

  const changeTab = useCallback((tab) => {
    dispatch(setActiveTab(tab))
  }, [dispatch])

  const clear = useCallback(() => {
    dispatch(clearRecipe())
  }, [dispatch])

  return {
    currentRecipe,
    selectedCountry,
    selectedMealType,
    isSpinning,
    loading,
    error,
    recentlySpun,
    countries,
    fromCache,
    activeTab,
    spinGlobe,
    getRecipe,
    selectCountry,
    selectMealType,
    loadRecentlySpun,
    loadCountries,
    changeTab,
    clear,
  }
}

export default useFetchRecipe