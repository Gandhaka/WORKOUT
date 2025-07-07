"use client"

import { createContext,useState,useEffect, useContext} from "react"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { useRouter } from "next/navigation"


const AuthContext = createContext();


export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [authToken,setAuthToken] = useState(null)
    const [loading,setLoading] = useState(true)
    const router = useRouter();
  

  const decodeAndSetUser = (authToken)=>{
    try{
        const decodeToken = jwtDecode(authToken);
        setUser({
            username : decodeToken.sub,
            id : decodeToken.id
        });
    }catch(error){
        console.error("Error Decoding Token",error)
        setUser(null);
        localStorage.removeItem(authToken)
        setAuthToken(null)
    }
  };

    
  

  useEffect(()=>{
    console.log("AuthContext : UseEffect Starting current loading",loading);
    const storedToken = localStorage.getItem('authToken')
    if(storedToken)
        {
            console.log("AuthContext: Token found in localStorage.")
            setAuthToken(storedToken)
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            decodeAndSetUser(storedToken);
        } 
        else{
            console.log("No Token Found,");
        }
        setLoading(false);
        console.log("AuthContext : setLoading(False) called");
  },[]);

    const login  = async (username,password)=>{
        try{
            const formData = new FormData();
            formData.append('username',username);
            formData.append('password',password);
            const response = await axios.post('http://localhost:8000/auth/token',formData,{
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
            })
            //axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.acess_token}`;
            const newToken = response.data.access_token;
            localStorage.setItem('token',newToken)
            setAuthToken(newToken)
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
           // setUser(response.data)
            decodeAndSetUser(newToken)
           router.push('/')

        }catch(error){
            console.log("Failed To Login",error)
            setUser(null)
        }
    };
   const logout = ()=>{
    setUser(null);
    setAuthToken(null)
    localStorage.removeItem(authToken)
    delete axios.defaults.headers.common['Authorization'];
    router.push('/login')
    };
    

   const contextData = {
    user : user,
    login:login,
    logout:logout,
    authToken:authToken, 
    loading : loading
    };

    if(loading)
    {
        return<div>Loading AUthentication...</div>
    }

    return(
     <AuthContext.Provider value= {contextData}>
        {children}
     </AuthContext.Provider>
   );
}

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext