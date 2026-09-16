import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormGroup from '../component/FormGroup'
import '../style/login.scss'
import { useAuth } from '../hooks/useauth'

const Login = () => {
  const { loading, handlelogin } = useAuth()
  const navigate = useNavigate()
  const [password, setpassword] = useState('')
  const [email, setemail] = useState('')

  async function handlesubmit(e) {
    e.preventDefault()
    const data = await handlelogin({ email, password })
    if (data) {
      navigate('/')
    }
  }

  return (
    <main className='auth-page login-page'>
      <div className='auth-shell'>
        <div className='auth-illustration'>
          <span className='brand-badge'>Moodify</span>
          <h1>Welcome back</h1>
          <p>
            Track your emotions, understand your routines, and stay on top of your mood every day.
          </p>
        </div>

        <section className='auth-card'>
          <div className='auth-header'>
            <p className='eyebrow'>Account access</p>
            <h2>Login</h2>
          </div>

          <form onSubmit={handlesubmit} className='auth-form'>
            <FormGroup
              value={email}
              onChange={(e) => setemail(e.target.value)}
              label='Email'
              placeholder='you@example.com'
            />
            <FormGroup
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              label='Password'
              placeholder='Enter your password'
              type='password'
            />

            <div className='form-row'>
              <label className='checkbox-inline'>
                <input type='checkbox' name='remember' />
                <span>Remember me</span>
              </label>
              <Link to='/register' className='text-link'>Forgot password?</Link>
            </div>

            <button type='submit' className='primary-button' disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className='auth-footer'>
            Don’t have an account? <Link to='/register'>Create one</Link>
          </p>
        </section>
      </div>
    </main>
  )
}

export default Login
