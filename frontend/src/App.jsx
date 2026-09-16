import {RouterProvider} from "react-router"
import {router} from "./app.routes"
import "./features/shared/styles/global.scss"
import { AuthProvider } from './features/auth/auth.context.jsx'
import { SongProvider } from './features/song/services/song.context.jsx'
function App(){

  return(
    <AuthProvider>
      <SongProvider>
        <RouterProvider router={router}/>
      </SongProvider>
    </AuthProvider>
    
  )
}

export default App
