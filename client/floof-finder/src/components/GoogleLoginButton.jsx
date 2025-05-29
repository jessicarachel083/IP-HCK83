import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { googleLogin } from '../store/authSlice'

const GoogleLoginButton = () => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // We'll set this in .env
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        })

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with'
          }
        )
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleCredentialResponse = async (response) => {
    try {
      // The response.credential contains the JWT ID token
      await dispatch(googleLogin(response.credential))
    } catch (error) {
      console.error('Google login error:', error)
    }
  }

  if (isLoading) {
    return (
      <button className="google-login-btn" disabled>
        <span>Signing in...</span>
      </button>
    )
  }

  return (
    <div className="google-login-container">
      <div className="google-login-divider">
        <span>or</span>
      </div>
      <div id="google-signin-button"></div>
    </div>
  )
}

export default GoogleLoginButton