import React from "react";
import { useUpdateProfile } from "react-firebase-hooks/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

function profileupdate() {
  const [updateProfile, updating, error_1] = useUpdateProfile(auth);
  const [user, loading, error_2] = useAuthState(auth);
  const [profilename, setprofilename] = React.useState();
  const [photoURL, setphotoURL] = React.useState();

  const Updateuserdetails = async (e) => {
    e.preventDefault();
    if (profilename && photoURL) {
      const success = await updateProfile({ profilename, photoURL });
      if (success) {
        toast.success("Profile updated");
      }
    }else{
      toast.error("One of input is not provided")
    }
  };

  if (user) {
    return (
      <div class="w-full h-screen bg-blue-600 flex flex-col items-center justify-center">
        <h1 class="text-lg font-bold absolute top-[10px] text-white">
          USER PROFILE UPDATE
        </h1>
        <div class="w-[40%] bg-gray-100 h-auto rounded-lg shadow-xl p-5">
          <form
            onSubmit={Updateuserdetails}
            class="flex flex-col items-center justify-around"
          >
            <p>Your Student UID : {user.uid}</p>

          {user.photoURL ? <Image alt="userprofile" src={user.photoURL} class="rounded-full mt-4 mb-2 border-2 border-blue-400" width={100} height={100}/>: <h1>No user profile image</h1>}

            <label for="displayname">Enter Your Displayname</label>
            <input
              type="text"
              id="displayname"
              class="rounded-lg px-8 py-2 mb-2"
              onChange={(e) => setprofilename(e.target.value)}
            />
            <label for="photoURL">Enter your photoURL</label>
            <input
              type="url"
              id="photoURL"
              class="rounded-lg px-8 py-2 mt-2"
              onChange={(e) => setphotoURL(e.target.value)}
            />

            <button
              type="submit"
              class="px-3 py-2 bg-blue-600 rounded-lg mt-6 text-white"
            >
              UpdateProfile
            </button>
          </form>
        </div>
        <Toaster />
      </div>
    );
  } else {
    return <h1>Route is protected</h1>;
  }
}

export default profileupdate;
