import React from 'react'
import Image from 'next/image'
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import logo from "../assets/images/logo.png"
import bycrypt from 'bcryptjs'
import { setCookie ,getCookie} from 'cookies-next';
import { useRouter } from 'next/router';
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from 'react';
function instructorLogin() {


    const router = useRouter();

    const[username,setusername]= React.useState()
    const[password,setpassword]= React.useState()

    const handlelogin = async (e) => {
      e.preventDefault();
      if (!username || !password) {
        toast.error("username or password is not provided");
      } else {
        const querySnapshot = await getDocs(collection(db, "instructors"));
        querySnapshot.forEach((doc) => {
          if (doc.data().instructor_id === username) {
            if (bycrypt.compareSync(password, doc.data().password)) {
              setCookie("instructor_id", doc.data().instructor_id);
              router.push(`instructor/${doc.data().instructor_id}`);
            } else {
              alert("Wrong Username or Password");
              setusername("");
              setpassword("");
            }
          }
        });
      }
    };


    useEffect(() => {
      if(getCookie('instructor_id')){
        router.push(`instructor/${getCookie('instructor_id')}`)
      }
    }, [])
    




  return (
    <div class="w-full h-screen bg-blue-600 flex flex-col items-center justify-center">
      <div class="flex flex-col items-center justify-center w-2/4 h-2/4 bg-red-600 rounded-lg">
        <Image alt="logo" src={logo} class="object-contain w-[16rem] h-[7rem]" />
        <p class="font-bold mt-[-40px] text-white mb-9">INSTRUCTOR LOGIN PAGE</p>
        <label for="username" class="text-white ml-[-130px]">Username</label>
        <input type="text" placeholder='Enter Your Username'value={username} id="username" class="  border-black rounded-full p-3 px-7 mb-4" onChange={(e) => setusername(e.target.value)} />
        <label for="password" class="text-white ml-[-130px]">Password</label>
        <input type="password" placeholder='Enter your Password' value={password} id="password" class=" border-black rounded-full p-3 px-7" onChange={(e) => setpassword(e.target.value)} />
        <button class="bg-black  text-white p-3 px-8 mt-7 rounded-full" onClick={handlelogin}>
          Login
        </button>
        <a href="/instructorRegistration" class=" underline text-white mt-6">Register as an Instructor here !</a>
      </div>
      <a href="/" class="mt-4 underline text-white font-bold font-sans">GO TO STUDENT LOGIN</a>
      <Toaster/>
    </div>
    
  );
}
export default instructorLogin;