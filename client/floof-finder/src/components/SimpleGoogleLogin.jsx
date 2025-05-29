import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { googleLogin } from '../store/authSlice'

const SimpleGoogleLogin = () => {
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.auth)

  const handleCredentialResponse = async (response) => {
    try {
      await dispatch(googleLogin(response.credential))
    } catch (error) {
      console.error('Google login failed:', error)
    }
  }

  useEffect(() => {
    const loadGoogleScript = () => {
      // Check if script already exists
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        initializeGoogleSignIn()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = initializeGoogleSignIn
      document.head.appendChild(script) // Use document.head instead of document.body
    }

    const initializeGoogleSignIn = () => {
      if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse
        })
        
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with'
          }
        )
      }
    }

    loadGoogleScript()

    return () => {
      // Improved cleanup - check if script exists and is actually a child
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript)
      }
    }
  }, []) // Remove handleCredentialResponse from dependencies to avoid re-renders

  return (
    <div className="google-login-container">
      <div className="login-divider">
        <span>or</span>
      </div>
      
      <div id="google-signin-button"></div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  )
}

export default SimpleGoogleLogin