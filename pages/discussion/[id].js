import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { useRouter } from "next/router";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useCollection } from "react-firebase-hooks/firestore";
import Comment from "../../components/Comment";


function discussion() {
  const [user, loading, error] = useAuthState(auth);
  const [newComment, setNewComment] = React.useState("");

  const router = useRouter();
  const { id } = router.query;
  const [value, loading_db, error_db] = useCollection(
    collection(db, "discussions/" + id + "/comments"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    const newCommentObj = {
      text: newComment,
      time: Timestamp.fromDate(new Date()),
      uploader: user.uid,
      pic: user.photoURL ? user.photoURL : "https://t3.ftcdn.net/jpg/03/08/06/76/360_F_308067695_ueERUpIyDeIxHyaFhK670UPSkRss5znp.jpg",
      replies: [],
    };
    await addDoc(
      collection(db, "discussions/" + id + "/comments"),
      newCommentObj
    ).finally(() => toast.success("Comment Submitted"));
    let textBox = document.getElementById("comment");
    textBox.value = textBox.defaultValue;
  };

  return (user &&
    <div class="h-screen justify-start flex flex-col items-center bg-yellow-300 w-full">
      <Toaster />
      <h1 class="w-2/5 font-bold text-2xl text-white mx-auto bg-black p-2 rounded-lg mt-5 text-center">
        DISCUSSION
      </h1>
      <div class="flex flex-col mt-5 ml-4 w-2/3 h-2/3 overflow-y-scroll">
        {value &&
          value.docs.map((doc) => (
            <div key={doc.id}>
              <Comment user={user} doc={doc} />
            </div>
          ))}
      </div>
      <form
        onSubmit={handleSubmitComment}
        class="flex flex-col items-center mt-40 justify-self-end fixed bottom-[15px]"
      >
        <label for="comment" class="block text-sm font-medium text-gray-400">
          
        </label>
        <textarea
          type="text"
          id="comment"
          rows="4"
          class="block p-2.5 w-[25rem] text-sm rounded-lg shadow-sm bg-black border-gray-600 placeholder-gray-400 text-white border focus:ring-primary-500 focus:border-primary-500"
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Enter your comment..."
        />
        <button
          type="submit"
          class="px-3 py-2 bg-blue-600 rounded-lg mt-4 font-medium text-white"
        >
          Send Comment
        </button>
      </form>
    </div>
  );
}

export default discussion;
