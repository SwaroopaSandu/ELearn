import React from "react";
import { getCookie, deleteCookie } from "cookies-next";
import Image from "next/image";
import logo from "../../assets/images/logo.png";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../config/firebase";
import { useRouter } from "next/router";
import { FcPlus } from "react-icons/fc";
import { useEffect ,useState } from "react";

function InstructorDashboard() {
  const router = useRouter();
  const { instructor_id } = router.query;
  const[instructor,setinstructor]=useState();

  const logout = (e) => {
    e.preventDefault();
    deleteCookie("instructor_id");
    window.location.reload();
  };

  useEffect(() => {
    setinstructor(getCookie("instructor_id"));
  }, []);

  const [value, loading_db, error_db] = useCollection(collection(db, "courses"), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  return (
    <div class="w-full h-screen bg-blue-300">
      {instructor ? (
        <>
          <div class="flex flex-row bg-yellow-300 items-center w-full h-[60px] justify-between">
            <Image alt="logo" src={logo} class="object-contain w-[7rem] h-[7rem]" />
            <p class="text-black font-bold ml-2">INSTRUCTOR DASHBOARD</p>
            <logout onClick={logout} class="bg-red-600 rounded-full px-4 p-2 mr-3 cursor-pointer text-white font-bold">
              Logout
            </logout>
          </div>

          <button onClick={() => router.push(`addcourse/${instructor_id}`)} class="bg-yellow-300 p-4 font-bold ml-3 mt-2 rounded-lg">
            Add Course <FcPlus class="object-contain inline-block" />{" "}
          </button>
          <h1 class="ml-3 mt-2 text-red-800 font-bold">Welcome Back {instructor_id}!</h1>

          <p class="text-black font-bold mt-2 ml-3">YOUR TEACHING COURSES</p>

          <div class="flex flex-row flex-wrap w-full h-auto mt-3 ml-3">
            {value &&
              value.docs
                .filter((doc) => doc.data().instructor_id === getCookie("instructor_id"))
                .map((doc) => {
                  return (
                    <>
                      <div class="bg-white p-4 shadow-lg rounded-lg w-[350px] h-[200px] ml-3 pb-4 pt-4 flex flex-col items-center justify-center">
                        <h1 class="m-2 font-bold">{doc.data().title}</h1>
                        <Image alt="doccover" src={doc.data().cover} width={200} height={200} class="rounded-lg object-contain" />
                        <button onClick={() => router.push(`courseupdate/${doc.id}`)} class=" bg-yellow-300 px-4 p-2 rounded-lg font-semibold text-sm mb-3 mt-5">
                          UPDATE COURSE CONTENT
                        </button>
                      </div>
                    </>
                  );
                })}
          </div>
        </>
      ) : (
        <div class="flex flex-col items-center justify-start">
          <h1 class="text-black text-sm text-center">ROUTE PROTECTED</h1>
          <a href="/instructorLogin" class="underline">
            Go back to Login Page
          </a>
        </div>
      )}
    </div>
  );
}

export default InstructorDashboard;