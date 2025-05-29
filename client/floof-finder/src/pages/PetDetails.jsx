import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPetById, updatePetStatus, generateDescription } from '../store/petsSlice'
import { fetchSightingsByPetId, createSighting } from '../store/sightingsSlice'
import { fetchCommentsByPetId, createComment, deleteComment } from '../store/commentsSlice'
import './PetDetails.css'

const PetDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  
  const { currentPet, isLoading: petLoading } = useSelector((state) => state.pets)
  const { sightings, isLoading: sightingsLoading, createLoading: sightingCreateLoading } = useSelector((state) => state.sightings)
  const { comments, isLoading: commentsLoading, createLoading: commentCreateLoading } = useSelector((state) => state.comments)
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const [sightingForm, setSightingForm] = useState({
    location: '',
    description: '',
    sightingDate: ''
  })

  const [commentForm, setCommentForm] = useState({
    content: ''
  })

  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Toast notification state
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '' // 'success', 'error', 'info'
  })

  // Check if current user is the pet owner
  const isPetOwner = currentPet && user && currentPet.userId === user.id

  useEffect(() => {
    if (id) {
      dispatch(fetchPetById(id))
      dispatch(fetchSightingsByPetId(id))
      dispatch(fetchCommentsByPetId(id))
    }
  }, [dispatch, id])

  // Show notification function
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' })
    }, 4000)
  }

  // Status update handler (only for pet owner)
  const handleStatusUpdate = async (newStatus) => {
    if (!isPetOwner) {
      showNotification('Only the pet owner can update status', 'error')
      return
    }
    
    try {
      await dispatch(updatePetStatus({ petId: id, status: newStatus })).unwrap()
      showNotification('Status updated successfully!', 'success')
    } catch (error) {
      showNotification('Failed to update status: ' + error, 'error')
    }
  }

  // Generate description handler (only for pet owner)
  const handleGenerateDescription = async () => {
    if (!isPetOwner) {
      showNotification('Only the pet owner can generate description', 'error')
      return
    }
    
    setIsGeneratingDescription(true)
    try {
      await dispatch(generateDescription(id)).unwrap()
      showNotification('Description generated successfully!', 'success')
      // Refresh the pet data to get the new description
      dispatch(fetchPetById(id))
    } catch (error) {
      showNotification('Failed to generate description: ' + error, 'error')
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  // Handle sighting form submission
  const handleSightingSubmit = async (e) => {
    e.preventDefault()
    
    if (!sightingForm.location || !sightingForm.sightingDate) {
      showNotification('Please fill in required fields', 'error')
      return
    }

    const sightingData = {
      ...sightingForm,
      missingPetId: parseInt(id)
    }

    try {
      await dispatch(createSighting(sightingData)).unwrap()
      setSightingForm({ location: '', description: '', sightingDate: '' })
      showNotification('Sighting reported successfully!', 'success')
    } catch (error) {
      showNotification('Failed to report sighting: ' + error, 'error')
    }
  }

  // Handle comment form submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    
    if (!commentForm.content.trim()) {
      showNotification('Please enter a comment', 'error')
      return
    }

    const commentData = {
      content: commentForm.content,
      missingPetId: parseInt(id)
    }

    try {
      await dispatch(createComment(commentData)).unwrap()
      setCommentForm({ content: '' })
      showNotification('Comment posted successfully!', 'success')
    } catch (error) {
      showNotification('Failed to post comment: ' + error, 'error')
    }
  }

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    try {
      await dispatch(deleteComment(commentId)).unwrap()
      showNotification('Comment deleted successfully!', 'success')
    } catch (error) {
      showNotification('Failed to delete comment: ' + error, 'error')
    }
  }

  // Handle image error
  const handleImageError = () => {
    setImageError(true)
  }

  if (petLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading pet details...</p>
      </div>
    )
  }

  if (!currentPet) {
    return (
      <div className="error-container">
        <h2>Pet not found</h2>
        <p>The pet you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="pet-details-container">
      {/* Toast Notification */}
      {notification.show && (
        <div className={`toast-notification toast-${notification.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {notification.type === 'success' && '✅'}
              {notification.type === 'error' && '❌'}
              {notification.type === 'info' && 'ℹ️'}
            </span>
            <span className="toast-message">{notification.message}</span>
            <button 
              className="toast-close" 
              onClick={() => setNotification({ show: false, message: '', type: '' })}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Pet Information Section */}
      <div className="pet-info-card">
        <div className="pet-header">
          <div className="pet-image-container">
            {!imageError && currentPet.petPhoto ? (
              <img 
                src={currentPet.petPhoto} 
                alt={currentPet.petName}
                className="pet-photo"
                onError={handleImageError}
              />
            ) : (
              <div className="pet-photo-placeholder">
                <div className="placeholder-icon">🐾</div>
                <p>No photo available</p>
              </div>
            )}
          </div>
          <div className="pet-basic-info">
            <h1>{currentPet.petName}</h1>
            <p className="pet-type">{currentPet.petType} - {currentPet.breed}</p>
            <p className="pet-color">Color: {currentPet.color}</p>
            <span className={`status-badge status-${currentPet.status || 'missing'}`}>
              {currentPet.status ? currentPet.status.toUpperCase() : 'MISSING'}
            </span>
          </div>
        </div>
        
        <div className="pet-details">
          <div className="detail-item">
            <strong>Last Seen Location:</strong>
            <span>{currentPet.lastSeenLocation}</span>
          </div>
          <div className="detail-item">
            <strong>Date Last Seen:</strong>
            <span>{new Date(currentPet.lastSeenDate).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <strong>Contact Info:</strong>
            <span>{currentPet.contactInfo}</span>
          </div>
          {currentPet.description && (
            <div className="description-section">
              <strong>Description:</strong>
              <p>{currentPet.description}</p>
            </div>
          )}
        </div>

        {/* Owner-only actions */}
        {isPetOwner && (
          <div className="owner-actions">
            <h3>🔧 Owner Actions</h3>
            
            {/* Status Update Section */}
            <div className="status-section">
              <div className="status-update">
                <label htmlFor="status-select">Update Status:</label>
                <select 
                  id="status-select"
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  value={currentPet.status || 'missing'}
                  className="status-select"
                >
                  <option value="missing">Missing</option>
                  <option value="found">Found</option>
                  <option value="reunited">Reunited</option>
                </select>
              </div>
            </div>
            
            {/* AI Description Section */}
            <div className="ai-section">
              <h4>AI Assistant</h4>
              <p className="ai-description">Generate an enhanced description using AI to help with identification</p>
              <button 
                onClick={handleGenerateDescription}
                className="generate-btn"
                disabled={isGeneratingDescription}
              >
                {isGeneratingDescription ? (
                  <>
                    <span className="spinner"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    🤖 Generate AI Description
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sightings Section */}
      <div className="section-card sightings-section">
        <div className="section-header">
          <h2>👁️ Sightings</h2>
          <span className="count-badge">{sightings?.length || 0}</span>
        </div>
        
        {sightingsLoading && (
          <div className="loading-inline">
            <div className="spinner-small"></div>
            <span>Loading sightings...</span>
          </div>
        )}
        
        {/* Add sighting form (for authenticated users) */}
        {isAuthenticated && (
          <div className="form-container">
            <h3>📍 Report a Sighting</h3>
            <form onSubmit={handleSightingSubmit} className="sighting-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    placeholder="Where did you see this pet?"
                    value={sightingForm.location}
                    onChange={(e) => setSightingForm({...sightingForm, location: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={sightingForm.sightingDate}
                    onChange={(e) => setSightingForm({...sightingForm, sightingDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Describe what you saw (behavior, condition, etc.)"
                  value={sightingForm.description}
                  onChange={(e) => setSightingForm({...sightingForm, description: e.target.value})}
                  rows="3"
                />
              </div>
              <button type="submit" disabled={sightingCreateLoading} className="submit-btn">
                {sightingCreateLoading ? (
                  <>
                    <span className="spinner"></span>
                    Reporting...
                  </>
                ) : (
                  'Report Sighting'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Sightings list */}
        <div className="items-list">
          {sightings && sightings.length > 0 ? (
            sightings.map((sighting) => (
              <div key={sighting.id} className="item-card sighting-card">
                <div className="card-header">
                  <div className="location-info">
                    <h4>📍 {sighting.location}</h4>
                    <span className="date">{new Date(sighting.sightingDate).toLocaleDateString()}</span>
                  </div>
                </div>
                {sighting.description && (
                  <p className="description">{sighting.description}</p>
                )}
                <div className="card-footer">
                  <span className="reporter">Reported by: {sighting.User?.username || 'Anonymous'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No sightings reported yet. Be the first to help!</p>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="section-card comments-section">
        <div className="section-header">
          <h2>💬 Comments</h2>
          <span className="count-badge">{comments?.length || 0}</span>
        </div>
        
        {commentsLoading && (
          <div className="loading-inline">
            <div className="spinner-small"></div>
            <span>Loading comments...</span>
          </div>
        )}
        
        {/* Add comment form (for authenticated users) */}
        {isAuthenticated && (
          <div className="form-container">
            <h3>✍️ Add a Comment</h3>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <div className="form-group">
                <textarea
                  placeholder="Share your thoughts, tips, or encouragement..."
                  value={commentForm.content}
                  onChange={(e) => setCommentForm({...commentForm, content: e.target.value})}
                  required
                  rows="4"
                />
              </div>
              <button type="submit" disabled={commentCreateLoading} className="submit-btn">
                {commentCreateLoading ? (
                  <>
                    <span className="spinner"></span>
                    Posting...
                  </>
                ) : (
                  'Post Comment'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Comments list */}
        <div className="items-list">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="item-card comment-card">
                <div className="card-header">
                  <div className="user-info">
                    <strong>{comment.User?.username || 'Anonymous'}</strong>
                    <span className="date">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  {/* Delete button for comment owner */}
                  {user && comment.userId === user.id && (
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="delete-btn"
                      title="Delete comment"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No comments yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PetDetails