"use client"

import { createContext,useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Children } from "react/cjs/react.production";

const AuthContext = createContext();

export const AuthProvider = ({Children})=>{
    const [user, setUser] = useState(null);
    const router = useRouter();

    const login  = async (username,password)=>{
        try{
            const formData = new FormData();
            formData.append('username',username);
            formData.append('password',password);
            const response = await axios.post('http://localhost:8000/auth/token',formData,{
                header:{'Content-Type':'application/x-www-form-urlencoded'},
            })
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.acess_token}`;
            localStorage.setItem('token',response.data.acess_token)
            setUser(response.data)
            router.push('/')
        }catch(error){
            console.log("Failed To Login",error)
        }
    };
   const logout = ()=>{
    setUser(null);
    delete axios.default.headers.common['Authorization'];
    router.push('/login')
   };

   return(
    <AuthContext.Provider value={{user,login,logout}}>
        {children}
    </AuthContext.Provider>
   );

}
export default AuthContext