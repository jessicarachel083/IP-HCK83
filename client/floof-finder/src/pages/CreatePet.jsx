import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { createPet, clearError } from '../store/petsSlice'

const CreatePet = () => {
  const [formData, setFormData] = useState({
    petName: '',
    petType: '',
    breed: '',
    color: '',
    lastSeenDate: '',
    lastSeenLocation: '',
    contactInfo: '',
    petPhoto: null
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { createLoading, createError } = useSelector((state) => state.pets)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const validateForm = () => {
    const errors = {}
    const requiredFields = {
      petName: 'Pet name is required',
      petType: 'Pet type is required',
      breed: 'Breed is required',
      lastSeenDate: 'Last seen date is required',
      lastSeenLocation: 'Last seen location is required',
      contactInfo: 'Contact information is required',
      petPhoto: 'Pet photo is required'
    }

    Object.keys(requiredFields).forEach(field => {
      if (!formData[field]) {
        errors[field] = requiredFields[field]
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    
    if (type === 'file') {
      const file = files[0]
      setFormData({
        ...formData,
        [name]: file
      })
      
      // Clear validation error for this field
      if (file && validationErrors[name]) {
        setValidationErrors({
          ...validationErrors,
          [name]: ''
        })
      }
      
      // Create image preview
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setImagePreview(null)
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
      
      // Clear validation error for this field if it has a value
      if (value && validationErrors[name]) {
        setValidationErrors({
          ...validationErrors,
          [name]: ''
        })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    
    if (!validateForm()) {
      return
    }

    try {
      const result = await dispatch(createPet(formData))
      
      if (createPet.fulfilled.match(result)) {
        // Success - redirect to home without alert
        navigate('/')
      }
    } catch (error) {
      console.error('Error creating pet:', error)
    }
  }

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <h2>Report a Missing Pet</h2>
      
      {createError && (
        <div className="error-message">
          {createError}
        </div>
      )}

      {isSubmitted && Object.keys(validationErrors).length > 0 && (
        <div className="error-message">
          Please fill in all required fields
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Pet Photo */}
        <div className="form-group">
          <label htmlFor="petPhoto">Pet Photo *</label>
          <input
            type="file"
            id="petPhoto"
            name="petPhoto"
            accept="image/*"
            onChange={handleChange}
            style={{
              borderColor: validationErrors.petPhoto ? '#dc3545' : '#ddd'
            }}
          />
          {validationErrors.petPhoto && (
            <small style={{ color: '#dc3545', fontSize: '0.875rem' }}>
              {validationErrors.petPhoto}
            </small>
          )}
          {imagePreview && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={imagePreview} 
                alt="Pet preview" 
                style={{ 
                  width: '200px', 
                  height: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '10px' 
                }}
              />
            </div>
          )}
        </div>

        {/* Pet Name */}
        <div className="form-group">
          <label htmlFor="petName">Pet Name *</label>
          <input
            type="text"
            id="petName"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            placeholder="Enter pet's name"
            style={{
              borderColor: validationErrors.petName ? '#dc3545' : '#ddd'
            }}
          />
          {validationErrors.petName && (
            <small style={{ color: '#dc3545', fontSize: '0.875rem' }}>
              {validationErrors.petName}
            </small>
          )}
        </div>

        {/* Pet Type (Species) */}
        <div className="form-group">
          <label htmlFor="petType">Pet Type *</label>
          <select
            id="petType"
            name="petType"
            value={formData.petType}
            onChange={handleChange}
            style={{
              borderColor: validationErrors.petType ? '#dc3545' : '#ddd'
            }}
          >
            <option value="">Select pet type</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Hamster">Hamster</option>
            <option value="Other">Other</option>
          </select>
          {validationErrors.petType && (
            <small style={{ color: '#dc3545', fontSize: '0.875rem' }}>
              {validationErrors.petType}
            </small>
          )}
        </div>

        {/* Breed */}
        <div className="form-group">
          <label htmlFor="breed">Breed *</label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            placeholder="Enter breed (e.g., Golden Retriever, Mixed, Unknown)"
            style={{
              borderColor: validationErrors.breed ? '#dc3545' : '#ddd'
            }}
          />
          {validationErrors.breed && (
            <small style={{ color: '#dc3545', fontSize: '0.875rem' }}>
              {validationErrors.breed}
            </small>
          )}
        </div>

        {/* Color */}
        <div className="form-group">
          <label htmlFor="color">Color/Markings</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Describe color and markings"
          />
        </div>

        {/* Last Seen Date */}
        <div className="form-group">
          <label htmlFor="lastSeenDate">Last Seen Date *</label>
          <input
            type="date"
            id="lastSeenDate"
            name="lastSeenDate"
            value={formData.lastSeenDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            style={{
              borderColor: validationErrors.lastSeenDate ? '#dc3545' : '#ddd'
            }}
          />
          {validationErrors.lastSeenDate && (
            <small style={{ color: '#dc3545', fontSize: '0.875rem' }}>
              {validationErrors.lastSeenDate}
            </small>
          )}
        </div>

        {/* Last Seen Location */}
        <div className="form-group">
          <label htmlFor="lastSeenLocation">Last Seen Location *</label>
          <input
            type="text"
            id="lastSeenLocation"
            name="lastSeenLocation"
            value={formData.lastSeenLocation}
            onChange={handleChange}
            placeholder="Enter specific location (street, neighborhood, landmarks)"
            style={{
              borderColor: validationErrors.lastSeenLocation ? '#dc3545' : '#ddd'
            }}
          />
          {validationErrors.lastSeenLocation && (
            <small style={{ color: '#dc3545', fontSize: '0.875rem' }}>
              {validationErrors.lastSeenLocation}
            </small>
          )}
        </div>

        {/* Contact Info */}
        <div className="form-group">
          <label htmlFor="contactInfo">Contact Information *</label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder={user?.phoneNumber || "Enter contact phone number or other contact info"}
            style={{
              borderColor: validationErrors.contactInfo ? '#dc3545' : '#ddd'
            }}
          />
          {validationErrors.contactInfo && (
            <small style={{ color: '#dc3545', fontSize: '0.875rem' }}>
              {validationErrors.contactInfo}
            </small>
          )}
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={createLoading}
        >
          {createLoading ? 'Reporting Pet...' : 'Report Missing Pet'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          * Required fields
        </p>
      </div>
    </div>
  )
}

export default CreatePet