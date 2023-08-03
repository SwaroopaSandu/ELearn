import React, { use } from "react";
import Image from "next/image";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/images/logo.png";
import { useRouter } from "next/router";

function Signup() {
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [pass_2, setpass_2] = useState();
  const router = useRouter();

  const create_user = async (e) => {
    e.preventDefault();
    if (pass_2 === password) {
      await createUserWithEmailAndPassword(auth, email, password).then((UserCredential) => {
        router.push("/Dashboard");
      }).catch((e)=>toast.error(e.code))
    } else {
      toast.error("password's doesn't match");
    }
  };

  return (
    <div class="bg-gray-200 h-screen w-full flex flex-col items-center justify-around">
      <div class=" flex flex-col items-center justify-center h-[40rem] w-[35rem] bg-blue-600 rounded-lg shadow-lg">
        <Image src={logo} alt="logo" class="object-contain w-[16rem] h-[7rem]" />
        <form onSubmit={create_user} class="mt-[-10px]">
          <label class="block text-[19px] pb-2 text-white mb-2">
            Email
            <input class="block rounded-xl border-b-4 focus:outline-none w-[25rem] py-4 mt-2 text-black px-4" type="email" onChange={(e) => setemail(e.target.value)} placeholder="Enter your Email" />
          </label>
          <label class="block text-[19px] pb-2 text-white">
            Password
            <input pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"  title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"  class="block rounded-xl border-b-4  focus:outline-none w-[25rem] py-4 px-4 mt-2 text-black" type="password" onChange={(e) => setpassword(e.target.value)} placeholder="********" />
          </label>
          <label class="block text-[19px] pb-2 text-white">
            Re Enter Password
            <input pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"  title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters" class="block rounded-xl border-b-4  focus:outline-none w-[25rem] py-4 px-4 mt-2 text-black" type="password" onChange={(e) => setpass_2(e.target.value)} placeholder="********" />
          </label>
          <h1 class="text-white">
            Already have an account ?
            <a href="/login" class=" text-white">
               &nbsp; Sign In 
            </a>
          </h1>

          <button class=" text-black font-bold py-4 px-10 rounded-full mt-3 bg-yellow-300" type="submit">
            Create Account
          </button>
        </form>
      </div>

      <Toaster />
    </div>
  );
}

export default Signup;
