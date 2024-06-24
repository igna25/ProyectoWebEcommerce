import Link from 'next/link';
import AuthButton from './LogoutButton';
import {  Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/auth-config';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';
import CartButton from './dashboard/CartButton';
import Image from "next/image";
import HomeButton from './HomeButton';
import SearchBar from './dashboard/SearchBar';


const NavBar  = async ()=>{
  
  const session:Session|null = await getServerSession(authOptions)
  let AuthButton = (session)? 
  <LogoutButton></LogoutButton>:
  <LoginButton></LoginButton>
  

    return (
      <div className="bg-gray-800 sticky top-0">
        <div className="container mx-auto flex justify-between items-center">
          <HomeButton></HomeButton>
          <CartButton></CartButton>
          {AuthButton}
        </div>
      </div>
    )
}

export default NavBar;