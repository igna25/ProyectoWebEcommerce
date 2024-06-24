'use client'
import { signOut } from "next-auth/react"

const LogoutButton = ()=>{

  const authButtonHandler =()=>{
    signOut()
  }
    return (
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none"
          onClick={authButtonHandler}
        >
          Logout
        </button>
    )
}
export default LogoutButton