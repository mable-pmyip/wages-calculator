import { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../hooks/useAuth'

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #1a1a1a;
`

const LoginCard = styled.div`
  text-align: center;
  padding: 48px 40px;
  border-radius: 16px;
  background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
  border: 1px solid rgba(74, 222, 128, 0.2);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  max-width: 420px;
  width: 100%;

  h1 {
    margin-bottom: 8px;
    font-size: 2.5rem;
    color: #e5e5e5;
    background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 640px) {
    padding: 32px 24px;

    h1 {
      font-size: 2rem;
    }
  }
`

const Subtitle = styled.p`
  margin-bottom: 32px;
  color: #a0a0a0;
  font-size: 1rem;
  line-height: 1.5;
`

const GoogleSignInButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(74, 222, 128, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`

const GoogleLogo = styled.img`
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 4px;
  padding: 2px;
`

const ErrorMessage = styled.p`
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ef4444;
  margin-top: 16px;
  font-size: 0.9rem;
`

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
    <LoginContainer>
      <LoginCard>
        <h1>💰 Wages Calculator</h1>
        <Subtitle>Track your work hours and calculate total earnings</Subtitle>

        <GoogleSignInButton onClick={handleGoogleSignIn}>
          <GoogleLogo
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
          />
          Sign in with Google
        </GoogleSignInButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginCard>
    </LoginContainer>
  )
}
