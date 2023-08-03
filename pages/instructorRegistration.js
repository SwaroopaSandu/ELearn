import React from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image';
import logo from '../assets/images/logo.png'
import {db} from '../config/firebase';
import {addDoc, doc,setDoc} from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import toast, { Toaster } from "react-hot-toast";


function instructorRegistration() {
    const router = useRouter();
    const [username, setusername] = React.useState();
    const [password, setpassword] = React.useState();
    const [confirmPassword, setconfirmPassword] = React.useState();


    const handleSubmit = async (e) => {
      e.preventDefault();
      if(!username || !password || !confirmPassword){
        alert("one of the input field is not provided")
        setusername("")
        setpassword("")
        setconfirmPassword("")
        window.location.reload()
      }else{
        if (password === confirmPassword) {
          const pass = await bcrypt.hash(password, 10);
          await setDoc(doc(db, "instructors", username), {
            instructor_id: username,
            password: pass,
          });
          toast.success("Registration Successful redirecting you to login page");
          setTimeout(() => {
            router.push("/instructorLogin");
          }, 3000);
          
  
        } else {
          alert("Password and Confirm Password must be same");
        }

      }
    };

    
  return (
    <div class="bg-yellow-300 h-screen w-full flex flex-col items-center justify-center">
      <div class="bg-blue-600 w-2/3 h-2/3 rounded-lg flex flex-col items-center justify-center">
        <Image alt="logo" src={logo} class="object-contain w-[16rem] h-[7rem]"/>
        <p class="font-bold text-white mt-[-40px] mb-6">INSTRUCTOR REGISTRATION</p>
        <form class="flex flex-col " onSubmit={handleSubmit}>
          <label for="username" class="text-white">Username</label>
          <input pattern="^[A-Za-z][A-Za-z0-9_]{7,12}$" title="input can have alphanumeric values and minimum of characters of 7 and max of 12 characters" type="text" name="username" onChange={(e)=>setusername(e.target.value)} id="username" class="border-black rounded-full p-3 px-10 mb-4"/>
          <label for="password" class="text-white">Password</label>
          <input type="password" onChange={(e)=>setpassword(e.target.value)} name="password" id="password" class="border-black rounded-full p-3 px-7 mb-4"/>
          <label for="confirmPassword" class="text-white">Confirm Password</label>
          <input type="password" name="confirmPassword" onChange={(e)=>setconfirmPassword(e.target.value)} id="confirmPassword" class="border-black rounded-full p-3 px-10 mb-4"/>
          <button type="submit" class="p-2 bg-yellow-300 rounded-full cursor-pointer ">Register</button>
        </form>

      </div>

    <Toaster/>


    </div>
  )
}

export default instructorRegistration