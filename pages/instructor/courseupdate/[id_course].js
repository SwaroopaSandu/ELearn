import React from "react";
import { db, storage } from "../../../config/firebase";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { getCookie } from "cookies-next";

function courseUpdate({ id_course }) {
  const router = useRouter();
  const [instructor_id, setinstructor_id] = useState();
  const [progresspercent, setProgresspercent] = React.useState();
  const [level, setlevel] = useState();
  const [title, settitle] = useState();
  const [file, setfile] = useState();
  const [fileURL, setfileURL] = React.useState(null);

  useEffect(() => {
    setinstructor_id(getCookie("instructor_id"));
  }, []);

  const updateLevel = async (e) => {
    e.preventDefault();
    if (level) {
      const ref = doc(db, "courses", id_course);

      await updateDoc(ref, {
        level: level,
      })
        .then((value) => {
          toast.success("Sucessfully updated course difficulty");
        })
        .catch((e) => {
          toast.error("could not update level");
        });
    } else {
      toast.error("Input value not provided");
    }
  };

  const updateTitle = async (e) => {
    e.preventDefault();
    if (title) {
      const ref = doc(db, "courses", id_course);

      await updateDoc(ref, {
        title: title,
      })
        .then((value) => {
          toast.success("Sucessfully updated course difficulty");
        })
        .catch((e) => {
          toast.error("could not update level");
        });
    } else {
      toast.error("Input value not provided");
    }
  };

  const uploadVideo = async (e) => {
    e.preventDefault();
    const file = e.target[0]?.files[0];
    if (!file) return;
    const storageRef = ref(storage, `videos/${file.name}`);
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
          const docRef = doc(db, "courses", id_course);

          const update = await updateDoc(docRef, {
            videos: arrayUnion(downloadURL),
          })
            .then((value) => {
              toast.success("video Added Sucessfully");
              setProgresspercent();
            })
            .catch((e) => toast.error("Could not add video"));
        });
      }
    );
  };

  return (
    instructor_id && (
      <div class="h-screen w-full bg-blue-300 flex flex-col items-center justify-start">
        {progresspercent && <p class="text-sm font-bold p-2 rounded-lg bg-white">Uploading File :{progresspercent}%</p>}

        <form onSubmit={updateTitle} class="flex flex-col items-start rounded-lg bg-yellow-300 p-6 mb-3 mt-3 w-2/3">
          <label for="title">UPDATE TITLE</label>
          <input class="rounded-lg p-2" id="title" type="text" placeholder="Enter Title" onChange={(e) => settitle(e.target.value)} />
          <button class="p-2 bg-black text-xs font-bold rounded-lg text-white mt-3 cursor-pointer" type="submit">
            Change Title
          </button>
        </form>

        <form onSubmit={updateLevel} class="flex flex-col items-start  bg-yellow-300 p-6 rounded-lg mb-3 w-2/3">
          <label for="level">UPDATE LEVEL</label>
          <select onChange={(e) => setlevel(e.target.value)} id="level" class="p-2">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <button class=" cursor-pointer p-2 bg-black text-xs font-bold rounded-lg text-white mt-3" type="submit">
            Change Difficulty Level
          </button>
        </form>

        <form onSubmit={uploadVideo} class="flex flex-col items-start bg-yellow-300 p-6 rounded-lg mb-3 w-2/3">
          <label for="file">ADD VIDEO</label>
          <input type="file" accept="video/mp4,video/x-m4v,video/*" />
          <button class="cursor-pointer p-2 bg-black text-xs font-bold rounded-lg text-white mt-3" type="submit">
            Upload Video
          </button>
        </form>
        <Toaster />
      </div>
    )
  );
}

export async function getServerSideProps(context) {
  const { id_course } = context.query;
  return {
    props: { id_course }, // will be passed to the page component as props
  };
}

export default courseUpdate;
