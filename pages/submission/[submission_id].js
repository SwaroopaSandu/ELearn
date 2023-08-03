import React, { use } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { storage, auth, db } from "../../config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/router";
import { collection, addDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useCollection } from "react-firebase-hooks/firestore";
import { FcFile } from "react-icons/fc";

function submission() {
  const [fileURL, setfileURL] = React.useState(null);
  const [progresspercent, setProgresspercent] = React.useState(0);
  const [user, loading, error] = useAuthState(auth);
  const [value, loading_db, error_db] = useCollection(
    collection(db, "submissions"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const router = useRouter();
  const { submission_id } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target[0]?.files[0];
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setfileURL(downloadURL);
          //store data inside the document
          if (user) {
            const docdata = {
              title: file.name,
              url: downloadURL,
              time: Timestamp.fromDate(new Date()),
              uploader: user.uid,
              course_id: submission_id,
            };
            const docRef = await addDoc(collection(db, "submissions"), docdata);
            toast.success("Document added to Database");
          } else {
            toast.error("User not found");
          }
        });
      }
    );
  };

  return (user &&
    <div class="h-screen font-sans text-gray-900 bg-gray-300 border-box">
      <div class="flex justify-center w-full mx-auto sm:max-w-lg">
        <div class="flex flex-col items-center justify-center w-[70%] h-auto my-20 bg-white sm:w-3/4 sm:rounded-lg sm:shadow-xl">
          <div class="mt-10 mb-10 text-center">

            <h2 class="text-2xl font-semibold mb-2">Upload your files</h2>
            <p class="text-xs text-gray-500">
              File should be of format .docx .pdf
            </p>

          </div>
          <form
            onSubmit={handleSubmit}
            class="relative w-4/5 h-auto max-w-xs mb-20 bg-gray-100 rounded-lg shadow-inner pb-13"
          >
            <input
              type="file"
              id="file-upload"
              accept="application/pdf,application/msword"
              class="hidden"
            />
            <label
              for="file-upload"
              class="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer"
            >
              <p class="z-10 text-xs font-light text-center text-[#f3f4f6 ]">
                Drag & Drop your files here
              </p>
              <svg
                class="z-10 w-8 h-8 text-indigo-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
              </svg>
            </label>
            <div class="flex flex-col items-center justify-center">
              <button
                type="submit"
                class="bg-yellow-300 px-4 py-2 mb-6 mt-6 ml-19  text-black rounded-full font-bold text-sm"
              >
                UPLOAD ASSIGNMENT
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="flex flex-col items-center justify-between bg-blue-600 rounded-lg shadow-lg p-3">
        <h1 class="font-mono text-white font-bold">YOUR SUBMISSIONS</h1>

        {value &&
          value.docs
            .filter(
              (doc) =>
                doc.data().uploader === user.uid &&
                doc.data().course_id === submission_id
            )
            .map((doc) => {
              return (
                <>
                  <div class="flex flex-col items-center justify-between bg-white shadow-xl rounded-lg p-6 h-auto w-auto m-2">
                    <h1>File Name : {doc.data().title}</h1>
                    <p>Date Uploaded : {doc.data().time.toDate().toString()}</p>
                    <a href={doc.data().url} download>
                      Download Your Submission :{" "}
                      <FcFile class="w-5 h-5 float-right cursor-pointer" />
                    </a>
                  </div>
                </>
              );
            })}
      </div>

      <Toaster />
    </div>
  );
}

export default submission;
