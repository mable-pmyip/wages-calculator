import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export const Login = () => {
  const { signInWithGoogle } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      await signInWithGoogle()
    } catch (err) {
      setError('Failed to sign in. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💰 Wages Calculator</h1>
        <p className="subtitle">Track your work hours and calculate total earnings</p>

        <button onClick={handleGoogleSignIn} className="google-signin-button">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="google-logo"
          />
          Sign in with Google
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  )
}
