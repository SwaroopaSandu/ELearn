import React from "react";
import Image from "next/image";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/images/logo.png"

function login() {
  const [email, setemail] = useState();
  const [password, setpassword] = useState();

  const handlelogin = async (e) => {
    e.preventDefault();
    if(!email || !password){
      toast.error("Invalid inputs passed")

    }else{
      await signInWithEmailAndPassword(auth, email, password).catch((e) => {
        toast.error(e.code);
        
      });

    }

   
  };

  return (
    <div class="bg-gray-200 h-screen w-full flex flex-col items-center justify-around">
      <div class=" flex flex-col items-center justify-center h-[40rem] w-[35rem] bg-blue-600 rounded-lg shadow-lg">
        <Image src={logo} alt="logo" class="object-contain w-[16rem] h-[7rem]" />
        <form onSubmit={handlelogin} class="mt-[-10px]">
          <label class="block text-[19px] pb-2 text-white mb-2">
            Email
            <input class="block rounded-xl border-b-4 focus:outline-none w-[25rem] py-4 mt-2 text-black px-4" type="email" onChange={(e) => setemail(e.target.value)} placeholder="Enter your Email" />
          </label>
          <label class="block text-[19px] pb-2 text-white">
            Password
            <input pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters" class="block rounded-xl border-b-4  focus:outline-none w-[25rem] py-4 px-4 mt-2 text-black" type="password" onChange={(e) => setpassword(e.target.value)} placeholder="********" />
          </label>
          <h1 class="text-white">
            Don't have an account ?{" "}
            <a href="/Signup" class=" text-white">
              Sign Up
            </a>
          </h1>

          <button class=" text-black font-bold py-4 px-10 rounded-full mt-3 bg-yellow-300" type="submit">
            Sign In
          </button>
        </form>
        <a href="/instructorLogin" class="text-white font-semibold text-sm underline mt-20">ARE YOU A PROFESSOR ? LOGIN HERE !</a>
        
      </div>

      <Toaster />
    </div>
  );
}

export default login;
