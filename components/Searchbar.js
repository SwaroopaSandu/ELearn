import React, { use } from 'react'
import {FcBusinessman} from "react-icons/fc";
import Image from 'next/image';
import logo from '../assets/images/logo.png'
import { signOut } from "firebase/auth";
import {auth,db} from '../config/firebase'
import { useRouter } from 'next/router'
import { useAuthState } from "react-firebase-hooks/auth";
import { collection,getDocs } from 'firebase/firestore';



function Searchbar() {

    const router = useRouter()
    const[filter_data,setfilter_data]=React.useState([])
    const[course,setcourse]=React.useState()
    
    const [user, loading, error] = useAuthState(auth);

    const logout = () => {
        signOut(auth);
      };

    const handleSearch = async (e) => {
      e.preventDefault();
      const query = await getDocs(collection(db, "courses"));
      const output = query.docs.filter((doc) => doc.data().title.toLowerCase().includes(course.toLowerCase()) || doc.data().instructor.toLowerCase().includes(course.toLowerCase()) );
      if (course === "") {
        setfilter_data([]);
      } else {
        setfilter_data(output);
      }
    };

  return (
    <div class="w-full bg-black h-[60px] flex flex-row items-center justify-between">
      <Image src={logo} alt="logo" class="object-contain w-[16rem] h-[5rem]" />

      <div class="absolute ml-[20rem]">
        <label for ="search" class="text-blue-600"></label>
        <input id="search" onChange={(e) => setcourse(e.target.value)} type="text-black" class="rounded-full px-8 py-2 shadow-lg" placeholder="search course by name" />
        <button class="ml-[5px] bg-blue-600 text-white px-4 py-2 rounded-full" onClick={handleSearch}>
          {" "}
          Search
        </button>
      </div>
      <button class="bg-red-600 text-white rounded-full px-4 py-2 absolute right-[100px]" onClick={logout}>
        Logout
      </button>
      {user.photoURL ? (
        <Image alt="userPhoto" src={user.photoURL} width={40} height={40} class="rounded-lg  bg-blue-400 mr-[30px] hover: cursor-pointer" onClick={() => router.push("profileupdate")} />
      ) : (
        <FcBusinessman class="w-[40px] h-[40px] rounded-lg  bg-blue-400 mr-[30px] hover: cursor-pointer" onClick={() => router.push("profileupdate")} />
      )}

      {filter_data.length > 0 && (
        <div class="absolute bg-gray-200 rounded-lg p-2 w-[400px] left-[316px] top-[55px] flex flex-col items-center justify-start">
          {filter_data.map((doc) => {
            return (
              <>
                <div class="bg-blue-300 rounded-lg p-4 w-full cursor-pointer m-2" onClick={()=>router.push(`course/${doc.id}`)}>
                  <h1>{doc.data().title}</h1>

                </div>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default Searchbar