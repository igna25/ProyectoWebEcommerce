import Link from "next/link"
const LoginButton =()=>{
    return (
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none"
        >
          <Link href="/login">Login</Link>
        </button>
    )
}
export default LoginButton