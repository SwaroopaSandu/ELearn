import React from "react";
import { db, storage } from "../../../config/firebase";
import { doc, addDoc, getDoc, collection, setDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/router";
import { getCookie ,deleteCookie } from 'cookies-next';

function Addcourse({ instructor_id, instructor_name }) {
  const router = useRouter()
  const [title, settitle] = React.useState("");
  const [progresspercent, setProgresspercent] = React.useState(0);
  const[file,setfile]=React.useState()
  const [cover, setcover] = React.useState("");
  const [level, setlevel] = React.useState("");
  const [fileURL, setfileURL] = React.useState(null);

  const addCourse = async (e) => {
    e.preventDefault();
      if (!file) return;
      const storageRef = ref(storage, `cover/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgresspercent(progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            setfileURL(downloadURL);
            try {
              const docRef = await addDoc(collection(db, "courses"), {
                cover: downloadURL,
                level: level,
                instructor_id: instructor_id,
                instructor: instructor_name,
                videos: [],
                title: title,
              });
  
              await setDoc(doc(db, "discussions", docRef.id), {});
              await setDoc(doc(db,"ratings",docRef.id),{});
              toast.success("course created successfully")
              setTimeout(()=>{
                router.push(`/instructor/${instructor_id}`)
              },2000)
  
            } catch (e) {
              toast.error(e);
            }
          });
        }
      );

    

  };

  return ( getCookie("instructor_id") &&
    <section class="max-w-4xl p-6 mx-auto bg-blue-600 rounded-md shadow-md dark:bg-gray-800 mt-20">
      <h1 class="text-xl font-bold text-white capitalize dark:text-white">Add Course</h1>
      <form onSubmit={addCourse}>
        <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          <div>
            <label class="text-white dark:text-gray-200" for="username">
              Title
            </label>
            <input
              id="username"
              type="text"
              class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              onChange={(e) => settitle(e.target.value)}
            />
          </div>

          <div>
            <label class="text-white dark:text-gray-200" for="passwordConfirmation">
              Difficulty
            </label>
            <select
              onChange={(e) => setlevel(e.target.value)}
              class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-white">Cover</label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-white" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label
                    for="file-upload"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span class="p-2">Upload a file</span>
                    <input onChange={(e)=>setfile(e.target.files[0])} id="file-upload"name="file-upload" type="file" class="sr-only" />
                  </label>
                  <p class="pl-1 text-white">or drag and drop</p>
                </div>
                <p class="text-xs text-white">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button type="submit" class="px-8 py-2 leading-5 text-black transition-colors duration-200 transform bg-yellow-300 rounded-md focus:outline-none focus:bg-gray-600">
            Add
          </button>
        </div>
      </form>
      <Toaster/>
    </section>
  );
}

export async function getServerSideProps(context) {
  const { instructor_id } = context.query;
  const docRef = doc(db, "instructors", instructor_id);
  const docSnap = await getDoc(docRef);
  const instructor_name = docSnap.data().name;
  return { props: { instructor_id, instructor_name } };
}

export default Addcourse;
