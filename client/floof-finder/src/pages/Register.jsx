import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { registerUser, clearError } from '../store/authSlice'
import SimpleGoogleLogin from '../components/SimpleGoogleLogin'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth)

  // Debug logging
  console.log('Register - isAuthenticated:', isAuthenticated, 'user:', user)

  // Check if already authenticated on mount
  useEffect(() => {
    console.log('Register useEffect - isAuthenticated changed:', isAuthenticated)
    if (isAuthenticated) {
      console.log('Navigating to home from Register')
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError())
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.email || !formData.password) {
      return
    }

    console.log('Submitting register form')
    try {
      const result = await dispatch(registerUser(formData))
      console.log('Register result:', result)
      if (registerUser.fulfilled.match(result)) {
        console.log('Registration successful, navigating to home')
        // Force navigation after successful registration
        navigate('/', { replace: true })
      }
    } catch (error) {
      console.error('Register error:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="form-container">
      <h2>Register for Pet Finder</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <SimpleGoogleLogin />
      
      <p className="form-footer">
        Already have an account? <Link to="/login">Sign in here</Link>
      </p>
    </div>
  )
}

export default Register