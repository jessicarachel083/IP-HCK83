import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_BASE = 'http://localhost:3000'

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
})

// Fetch sightings for a specific missing pet
export const fetchSightingsByPetId = createAsyncThunk(
  'sightings/fetchByPetId',
  async (petId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/missing-pets/${petId}/sightings`)
      
      if (!response.ok) {
        return rejectWithValue(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Debug: Log the actual response
      console.log('Sightings API Response:', data)
      
      // Handle different response formats (same as pets)
      if (Array.isArray(data)) {
        return data
      } else if (data && data.sightings && Array.isArray(data.sightings)) {
        return data.sightings  // Backend returns: {message, petName, count, sightings}
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data
      } else {
        console.log('Sightings response format:', typeof data, data)
        return [] // Return empty array instead of error for now
      }
      
    } catch (error) {
      console.error('Fetch sightings error:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Create a new sighting
export const createSighting = createAsyncThunk(
  'sightings/create',
  async (sightingData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const response = await fetch(`${API_BASE}/sightings`, {
        method: 'POST',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify(sightingData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create sighting')
      }
      
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  sightings: [],
  isLoading: false,
  error: null,
  createLoading: false,
  createError: null
}

const sightingsSlice = createSlice({
  name: 'sightings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.createError = null
    },
    clearSightings: (state) => {
      state.sightings = []
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch sightings
      .addCase(fetchSightingsByPetId.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSightingsByPetId.fulfilled, (state, action) => {
        state.isLoading = false
        state.sightings = Array.isArray(action.payload) ? action.payload : []
        console.log('Sightings set in state:', state.sightings)
      })
      .addCase(fetchSightingsByPetId.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.sightings = []
      })
      
      // Create sighting
      .addCase(createSighting.pending, (state) => {
        state.createLoading = true
        state.createError = null
      })
      .addCase(createSighting.fulfilled, (state, action) => {
        state.createLoading = false
        state.sightings.unshift(action.payload) // Add to beginning
      })
      .addCase(createSighting.rejected, (state, action) => {
        state.createLoading = false
        state.createError = action.payload
      })
  }
})

export const { clearError, clearSightings } = sightingsSlice.actions
export default sightingsSlice.reducer