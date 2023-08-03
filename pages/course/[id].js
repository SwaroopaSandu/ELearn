import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "../../assets/images/logo.png";
import { getFirestore, doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore'
import{db,auth} from "../../config/firebase"
import Accordian from "../../components/Accordian";

import { useAuthState } from "react-firebase-hooks/auth";




function course({id}) {
const router = useRouter();
const [user, loading_2, error_2] = useAuthState(auth);
const [value, loading, error] = useDocument(doc(db,"courses", id), {
  snapshotListenOptions: { includeMetadataChanges: true },
});


  return (user &&
    <div class="min-h-screen flex flex-row bg-gray-100">
      <div class="flex flex-col w-56 bg-white  overflow-hidden">
        <div class="flex items-center justify-center h-20 shadow-md bg-blue-400">
          <Image alt="logo" src={logo} height={200} width={200} class="object-contain"/>
        </div>
        <ul class="flex flex-col py-4">
          <li>
            <a href={'/discussion/'+id} class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
              <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"></span>
              <span class="text-sm font-medium">Discussions</span>
            </a>
          </li>
          <li>
            <a href={'/submission/'+id} class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
              <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <i class="bx bx-music"></i>
              </span>
              <span class="text-sm font-medium">Submissions</span>
            </a>
          </li>
        
          <li>
            <a href={'/feedback/'+id} class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
              <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <i class="bx bx-drink"></i>
              </span>
              <span class="text-sm font-medium">Feedback</span>
            </a>
          </li>
        </ul>
      </div>
      <main class="bg-yellow-300 w-full">
        <h1 class="ml-4  mr-4 font-bold text-blue-600 bg-white p-4 rounded-lg mt-3 ">COURSE CONTENT</h1>
        <div class="flex flex-col items-center mt-4">
          {value && value.data().videos.map((video_url,index)=>{
            return(<>
            
            <Accordian index={index} url={video_url}/>
            
            </>)
          }) }
       

        </div>


      </main>
    




    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  
  return {
    props: { id },
  };
}


export default course;


