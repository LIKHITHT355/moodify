import { useEffect, useRef, useState } from "react";
import { AuthContext } from './auth.context';
import { getme } from './services/auth.api';

export const AuthProvider = ({children})=>{
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)
    const [authError, setAuthError] = useState('')
    const initialized = useRef(false)

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true

        getme()
            .then((data) => setuser(data.user))
            .catch(() => setuser(null))
            .finally(() => setloading(false))
    }, [])

    return(
        <AuthContext.Provider value={{user,setuser,loading,setloading,authError,setAuthError}}>
            {children}
        </AuthContext.Provider>
    )
}
