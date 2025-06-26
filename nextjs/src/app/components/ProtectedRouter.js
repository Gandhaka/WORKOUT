"use client"

import { useContext,useEffect } from "react"
import { useRouter } from "next/navigation"
import AuthContext from "../context/AuthContext"
import { Children } from "react/cjs/react.production"

const ProtectedRoute = ({Children})=>{
    const {user} = useContext(AuthContext);
    const router = useRouter()

    useEffect(()=>{
        if(!user){
            router.push('/login');
        }


    },[user,router]);

    return user ? Children :null;
}

export default  ProtectedRoute;