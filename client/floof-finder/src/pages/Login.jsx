import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { loginUser, clearError } from '../store/authSlice'
import SimpleGoogleLogin from '../components/SimpleGoogleLogin'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth)

  // Debug logging
  console.log('Login - isAuthenticated:', isAuthenticated, 'user:', user)

  // Check if already authenticated on mount
  useEffect(() => {
    console.log('Login useEffect - isAuthenticated changed:', isAuthenticated)
    if (isAuthenticated) {
      console.log('Navigating to home from Login')
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError())
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      return
    }

    console.log('Submitting login form')
    try {
      const result = await dispatch(loginUser(formData))
      console.log('Login result:', result)
      if (loginUser.fulfilled.match(result)) {
        console.log('Login successful, navigating to home')
        // Force navigation after successful login
        navigate('/', { replace: true })
      }
    } catch (error) {
      console.error('Login error:', error)
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
      <h2>Login to Pet Finder</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <SimpleGoogleLogin />

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login