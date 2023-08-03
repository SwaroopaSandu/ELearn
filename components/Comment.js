import React, { use } from "react";
import { FcBusinessman } from "react-icons/fc";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { Timestamp, updateDoc, arrayUnion } from "firebase/firestore";

function Comment({ user, doc }) {
  const [showReplies, setShowReplies] = React.useState(false);
  const [showReplyBox, setShowReplyBox] = React.useState(false);
  const [newReply, setNewReply] = React.useState("");

  const comment = doc.data();

  const handleSubmitReply = async (e) => {
    e.preventDefault();

    const newReplyObj = {
      text: newReply,
      time: Timestamp.fromDate(new Date()),
      uploader: user.uid,
      pic: user.photoURL ? user.photoURL : "https://t3.ftcdn.net/jpg/03/08/06/76/360_F_308067695_ueERUpIyDeIxHyaFhK670UPSkRss5znp.jpg",
    };

    let repliesArr = comment.replies;
    repliesArr.push(newReplyObj);

    await updateDoc(doc.ref, {
      replies: repliesArr,
    }).finally(() => toast.success("Reply Submitted"));
    let textBox = document.getElementById("reply");
    textBox.value = textBox.defaultValue;
    setShowReplyBox(false);
    setShowReplies(true);
  };

  return (
    <div class="rounded-lg shadow-lg bg-[#396bee] mt-4 p-2 flex flex-col">
      <div class="w-full flex flex-row justify-between items-center">
        <p class="text-sm ml-1 text-white">User: {comment.uploader}</p>
        <p class="font-medium text-white">
          {comment.time.toDate().toLocaleString("en-US", { timeZone: "EST" })}
        </p>
      </div>

      <div class="w-full flex flex-row justify-between items-center">
        {comment.pic ? (
          <Image
            src={comment.pic}
            alt="ProfilePic N/A"
            width={50}
            height={50}
            class="object-contain rounded-full border-white border-[2px] ml-1"
          />
        ) : (
          <Image
            src="https://t3.ftcdn.net/jpg/03/08/06/76/360_F_308067695_ueERUpIyDeIxHyaFhK670UPSkRss5znp.jpg"
            alt="ProfilePic N/A"
            width={50}
            height={50}
            class="object-contain rounded-full border-white border-[2px] ml-1"
          />
        )}
        <p class="block break-words p-2.5 w-full mx-1 text-white rounded-lg shadow-sm bg-black border-gray-600 border">
          {comment.text}
        </p>
        <button
          onClick={() => setShowReplyBox(!showReplyBox)}
          class="cursor-pointer bg-gray-700 px-4 py-2.5 rounded-lg font-medium text-white"
        >
          Reply
        </button>
      </div>

      <div
        class="font-medium flex flex-row cursor-pointer rounded-lg hover:bg-green-200 ml-1 mt-2"
        onClick={() => setShowReplies(!showReplies)}
      >
        {showReplies ? <p class="text-xs font-bold text-white">CLOSE</p> : <p class="text-xs font-bold text-white">OPEN</p>}
        <p class="mx-1 text-xs">Replies:</p>
        <p class="text-xs">{comment.replies.length}</p>
      </div>
      <div class="ml-20">
        {showReplies ? (
          comment.replies.map((reply) => (
            <div class="w-[90%]">
              <div class="w-full flex flex-row justify-between">
                <p class="text-sm ml-1">User: {reply.uploader}</p>
                <p class="font-medium">
                  {reply.time
                    .toDate()
                    .toLocaleString("en-US", { timeZone: "EST" })}
                </p>
              </div>
              <div class="w-full flex flex-row justify-start h-auto mt-[-1]">
                {reply.pic ? (
                  <Image
                    src={reply.pic}
                    alt="ProfileImage N/A"
                    width={50}
                    height={50}
                    class="object-contain rounded-full border-white border-[2px] ml-1"
                  />
                ) : (
                  <p>ProfileImage N/A</p>
                )}
                <p class="block break-words p-2.5 w-full mx-1 text-white rounded-lg shadow-sm bg-black border-gray-600 border">
                  {reply.text}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div></div>
        )}
        {showReplyBox ? (
          <form
            onSubmit={handleSubmitReply}
            class="mt-4 flex flex-row items-center"
          >
           
            <label
              for="reply"
              class="block text-sm font-medium text-gray-600"
            ></label>
            <input
              type="text"
              id="reply"
              class="block mx-1 p-2.5 w-full text-sm rounded-lg shadow-sm bg-black border-gray-600 placeholder-gray-400 text-white border focus:ring-primary-500 focus:border-primary-500"
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Enter your reply..."
            />
            <button
              type="submit"
              class="text-left w cursor-pointer bg-green-400 px-3 py-2 rounded-lg font-medium text-white"
            >
              SendReply
            </button>
          </form>
        ) : (
          <div></div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default Comment;
