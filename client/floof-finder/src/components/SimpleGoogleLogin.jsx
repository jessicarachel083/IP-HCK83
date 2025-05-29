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
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        initializeGoogleSignIn()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = initializeGoogleSignIn
      document.head.appendChild(script)
    }

    const initializeGoogleSignIn = () => {
      if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse
          // Remove ux_mode and use_fedcm_for_prompt for now
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
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript)
      }
    }
  }, [])

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