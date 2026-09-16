import { useAuth } from '../hooks/useauth'
import { Navigate } from 'react-router-dom'
const Protected = ({children}) => {

    const {user,loading} = useAuth()

     if(loading){
        return <div>Loading...</div>
    }
    if(!loading && !user){
       return <Navigate to="/login"  />
    }
   
  return children
}

export default Protected
