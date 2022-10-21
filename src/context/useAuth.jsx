import { useContext, useState } from 'react'
import { createContext } from 'react'

const AuthContext = createContext(null)

export default function AuthProvider(props) {
  const [isLogin, setIsLogin] = useState(
    () => localStorage.getItem('isLogin') || 'false'
  )
  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const auth = useContext(AuthContext)
  if (!auth) {
    throw new Error('必须在AuthContext下使用useAuthContext')
  }
  return auth
}
