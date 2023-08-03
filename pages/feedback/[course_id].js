import React from 'react'
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Rating from "react-rating"
import { doc,getDoc,updateDoc,arrayUnion,setDoc, collection, addDoc} from 'firebase/firestore';
import { useEffect } from 'react';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';


function Feedback({course_id}) {
  const [user, loading, error] = useAuthState(auth);
  const[professor,setprofessor]= React.useState()
  const[course,setcourse]=React.useState()
  const[rating,setrating]=React.useState()
  const[message,setmessage]=React.useState()

  useEffect(() => {
    const document = async () => {
      const docRef = doc(db, "courses", course_id);
      await getDoc(docRef).then(async (docSnap) => {
        setcourse(docSnap.data())
        const other = doc(db, "instructors", docSnap.data().instructor_id);
        const output = await getDoc(other);
        setprofessor(output.data());
      });
    };

    document();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!course_id || !user || !message || !rating){
      toast.error("One of the inputs passed are not valid")

    }else{
      await setDoc(doc(db, "ratings", `${user.uid}:${course_id}`), {
        course_id: course_id,
        user_id: user.uid,
        message: message,
        rating: rating,
      });
      toast.success("update successfully")

    }
    
  
  };
  

  return (user &&
    <div class="w-full h-screen bg-yellow-300 flex flex-col items-center justify-start">
     <div class="bg-white shadow-lg rounded-lg w-3/6 h-1.5/3 mt-6">
     {professor &&
     (<>
     <div class="w-full flex flex-col items-center m-2">
     <Image src={professor.photo? professor.photo :"https://i.tribune.com.pk/media/images/professor1623749268-0/professor1623749268-0.jpg"} alt="No Image" width={200} height={200} class="object-contain rounded-full border-blue-600 border-[5px] mt-2"/>
     <p class="font-semibold mt-1">Professor : {professor.name ? professor.name : professor.instructor_id}</p>
     <p class="font-mono mt-1">Course : {course.title}</p>

     </div>  
     
     </>)
     }
     <div class="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
      <h1 class="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Rate Your Course</h1>
       <form onSubmit={handleSubmit} class="space-y-8">
          <div>
              <label for="rating" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your Rating</label>
              <Rating name="rating" onClick={(rate)=>setrating(rate)} initialRating={rating}/>
          </div>
          <div class="sm:col-span-2">
              <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Your message</label>
              <textarea onChange={(e)=>setmessage(e.target.value)} id="message" rows="6" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..."></textarea>
          </div>
          <button type="submit" class="py-3 px-8 text-sm font-medium text-center text-white rounded-lg bg-blue-600 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Send</button>
      </form>
  </div>

     </div>
     <Toaster/>
    </div>
  )
}




export async function getServerSideProps(context) {
  const {course_id} = context.query

  return {
    props: {course_id},
  }
}

export default Feedback
