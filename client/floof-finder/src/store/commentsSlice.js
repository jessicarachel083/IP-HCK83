import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_BASE = 'http://localhost:3000'

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
})

// Fetch comments for a specific missing pet
export const fetchCommentsByPetId = createAsyncThunk(
  'comments/fetchByPetId',
  async (petId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/missing-pets/${petId}/comments`)
      
      if (!response.ok) {
        return rejectWithValue(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Debug: Log the actual response
      console.log('Comments API Response:', data)
      
      // Handle different response formats
      if (Array.isArray(data)) {
        return data
      } else if (data && data.comments && Array.isArray(data.comments)) {
        return data.comments
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data
      } else {
        console.log('Comments response format:', typeof data, data)
        return [] // Return empty array instead of error for now
      }
      
    } catch (error) {
      console.error('Fetch comments error:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Create a new comment
export const createComment = createAsyncThunk(
  'comments/create',
  async (commentData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify(commentData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create comment')
      }
      
      console.log('Create comment response:', data)
      
      // Assuming backend returns: {message, comment}
      return data.comment || data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Delete a comment
export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (commentId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const response = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(auth.token)
      })
      
      if (!response.ok) {
        const data = await response.json()
        return rejectWithValue(data.message || 'Failed to delete comment')
      }
      
      return commentId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  comments: [],
  isLoading: false,
  error: null,
  createLoading: false,
  createError: null
}

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.createError = null
    },
    clearComments: (state) => {
      state.comments = []
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchCommentsByPetId.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCommentsByPetId.fulfilled, (state, action) => {
        state.isLoading = false
        state.comments = Array.isArray(action.payload) ? action.payload : []
        console.log('Comments set in state:', state.comments)
      })
      .addCase(fetchCommentsByPetId.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.comments = []
      })
      
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.createLoading = true
        state.createError = null
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.createLoading = false
        state.comments.push(action.payload) // Add to end
      })
      .addCase(createComment.rejected, (state, action) => {
        state.createLoading = false
        state.createError = action.payload
      })
      
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(comment => comment.id !== action.payload)
      })
  }
})

export const { clearError, clearComments } = commentsSlice.actions
export default commentsSlice.reducer