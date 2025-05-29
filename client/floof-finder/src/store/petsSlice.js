import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_BASE = 'http://localhost:3000'

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
})

// Async thunks for pets API
export const fetchAllPets = createAsyncThunk(
  'pets/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/missing-pets`)
      
      if (!response.ok) {
        return rejectWithValue(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Debug: Log the actual response
      console.log('API Response:', data)
      
      // Handle different response formats
      if (Array.isArray(data)) {
        return data
      } else if (data && data.missingPets && Array.isArray(data.missingPets)) {
        return data.missingPets
      } else if (data && data.pets && Array.isArray(data.pets)) {
        return data.pets
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data
      } else {
        // If we get here, log the full response for debugging
        console.error('Unexpected response format:', data)
        console.error('Response type:', typeof data)
        console.error('Response keys:', Object.keys(data || {}))
        
        // Try to return an empty array instead of rejecting
        return []
      }
      
    } catch (error) {
      console.error('Fetch error:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const fetchPetById = createAsyncThunk(
  'pets/fetchById',
  async (petId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/missing-pets/${petId}`)
      const data = await response.json()
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch pet details')
      }
      
      // Extract the missingPet object from the response
      return data.missingPet || data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createPet = createAsyncThunk(
  'pets/create',
  async (petData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const formData = new FormData()
      
      // Append all pet data to FormData
      Object.keys(petData).forEach(key => {
        if (petData[key] !== null && petData[key] !== undefined) {
          formData.append(key, petData[key])
        }
      })
      
      const response = await fetch(`${API_BASE}/missing-pets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        },
        body: formData
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create pet')
      }
      
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updatePetStatus = createAsyncThunk(
  'pets/updateStatus',
  async ({ petId, status }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const response = await fetch(`${API_BASE}/missing-pets/${petId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify({ status })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update status')
      }
      
      return { petId, status, ...data }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const generateDescription = createAsyncThunk(
  'pets/generateDescription',
  async (petId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const response = await fetch(`${API_BASE}/missing-pets/${petId}/generate-description`, {
        method: 'PATCH',
        headers: getAuthHeaders(auth.token)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to generate description')
      }
      
      return { petId, ...data }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  pets: [], // Ensure this is always an array
  currentPet: null,
  isLoading: false,
  error: null,
  createLoading: false,
  createError: null
}

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    clearCurrentPet: (state) => {
      state.currentPet = null
    },
    clearError: (state) => {
      state.error = null
      state.createError = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all pets
      .addCase(fetchAllPets.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllPets.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = null
        // Ensure we always set an array
        state.pets = Array.isArray(action.payload) ? action.payload : []
        console.log('Pets set in state:', state.pets)
      })
      .addCase(fetchAllPets.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Failed to fetch pets'
        state.pets = [] // Reset to empty array on error
        console.error('Fetch pets rejected:', action.payload)
      })
      
      // Fetch pet by ID
      .addCase(fetchPetById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPetById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentPet = action.payload
      })
      .addCase(fetchPetById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Create pet
      .addCase(createPet.pending, (state) => {
        state.createLoading = true
        state.createError = null
      })
      .addCase(createPet.fulfilled, (state, action) => {
        state.createLoading = false
        state.pets.unshift(action.payload) // Add to beginning of array
      })
      .addCase(createPet.rejected, (state, action) => {
        state.createLoading = false
        state.createError = action.payload
      })
      
      // Update status
      .addCase(updatePetStatus.fulfilled, (state, action) => {
        const petIndex = state.pets.findIndex(pet => pet.id === action.payload.petId)
        if (petIndex !== -1) {
          state.pets[petIndex].status = action.payload.status
        }
        if (state.currentPet?.id === action.payload.petId) {
          state.currentPet.status = action.payload.status
        }
      })
      
      // Generate description
      .addCase(generateDescription.fulfilled, (state, action) => {
        const petIndex = state.pets.findIndex(pet => pet.id === action.payload.petId)
        if (petIndex !== -1) {
          state.pets[petIndex].description = action.payload.description
        }
        if (state.currentPet?.id === action.payload.petId) {
          state.currentPet.description = action.payload.description
        }
      })
  }
})

export const { clearCurrentPet, clearError } = petsSlice.actions
export default petsSlice.reducer