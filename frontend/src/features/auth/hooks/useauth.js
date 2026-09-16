import { login, register, getme, logout } from '../services/auth.api'
import { useCallback, useContext } from 'react'
import { AuthContext } from '../auth.context'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  const { user, setuser, loading, setloading, authError, setAuthError } = context

  async function handleregister({ username, email, password }) {
    setloading(true)
    setAuthError('')
    try {
      const data = await register({ username, email, password })
      return data
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Registration failed. Please try again.')
      return null
    } finally {
      setloading(false)
    }
  }

  async function handlelogin({ email, password }) {
    setloading(true)
    setAuthError('')
    try {
      const data = await login({ email, password })
      setuser(data.user)
      return data
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Login failed. Please try again.')
      return null
    } finally {
      setloading(false)
    }
  }

  const handlegetme = useCallback(async () => {
    setloading(true)
    try {
      const data = await getme()
      setuser(data.user)
      return data
    } catch {
      setuser(null)
      return null
    } finally {
      setloading(false)
    }
  }, [setloading, setuser])

  async function handlelogout() {
    setloading(true)
    try {
      const data = await logout()
      setuser(null)
      return data
    } catch (error) {
      console.error('Logout failed:', error)
      setuser(null)
      return null
    } finally {
      setloading(false)
    }
  }

  return {
    user,
    loading,
    authError,
    handleregister,
    handlelogin,
    handlegetme,
    handlelogout,
  }
}

