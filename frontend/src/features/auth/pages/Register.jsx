import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormGroup from '../component/FormGroup'
import '../style/register.scss'
import { useAuth } from '../hooks/useauth'

const Register = () => {
  const navigate = useNavigate()
  const [username, setusername] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const { loading, authError, handleregister } = useAuth()

  async function handlesubmit(e) {
    e.preventDefault()
    const normalizedUsername = username.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (normalizedUsername.length < 2 || password.trim().length < 8) {
      return
    }

    const data = await handleregister({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
    })
    if (data) {
      navigate('/login')
    }
  }

  return (
    <main className='auth-page register-page'>
      <div className='auth-shell'>
        <div className='auth-illustration'>
          <span className='brand-badge'>Moodify</span>
          <h1>Start your journey</h1>
          <p>
            Create your profile to capture your feelings, reflect on your progress, and build healthier habits.
          </p>
        </div>

        <section className='auth-card'>
          <div className='auth-header'>
            <p className='eyebrow'>Create account</p>
            <h2>Register</h2>
          </div>

          <form onSubmit={handlesubmit} className='auth-form'>
            {authError && <p style={{ color: '#ff8a80', marginBottom: '12px' }}>{authError}</p>}
            <FormGroup
              value={username}
              onChange={(e) => setusername(e.target.value)}
              label='Full name'
              placeholder='John Doe'
              name='username'
              required
              minLength={2}
            />
            <FormGroup
              value={email}
              onChange={(e) => setemail(e.target.value)}
              label='Email'
              placeholder='you@example.com'
              name='email'
              type='email'
              required
            />
            <FormGroup
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              label='Password'
              placeholder='Create a password'
              type='password'
              name='password'
              required
              minLength={8}
            />

            <button type='submit' className='primary-button' disabled={loading}>
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <p className='auth-footer'>
            Already have an account? <Link to='/login'>Login</Link>
          </p>
        </section>
      </div>
    </main>
  )
}

export default Register
