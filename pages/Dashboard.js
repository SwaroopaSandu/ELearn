import React from "react";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import Searchbar from "../components/Searchbar";
import Image from "next/image";
import { useRouter } from "next/router";


function Dashboard() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  const [rating_docs, setrating_docs] = React.useState();
  const [value, loading_db, error_db] = useCollection(
    collection(db, "courses"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    const querySnapshot = async () => {
      await getDocs(collection(db, "ratings")).then((data) => {
        setrating_docs(data.docs);
      });
    };
    querySnapshot();
  }, []);



  const getRating=(rating_id)=>{
    if(!rating_id) return ;
    const output = rating_docs.filter((item)=>item.data().course_id===rating_id)
    const sum = output.reduce((accumulator, object) => {
      return accumulator + object.data().rating;
    }, 0);
    return sum/output.length
    
  }

  if (user) {
    return (
      <div>
        <Searchbar />

        <h1 class="font-extrabold ml-4 mt-2 text-xl">COURSES</h1>
        <div class="w-full flex align-start justify-start h-auto mt-2">
          {value &&
            value.docs.map((doc) => {
              return (
                <>
                  <div
                    id={doc.id}
                    onClick={() => router.push(`course/${doc.id}`)}
                    class="rounded-lg shadow-lg bg-yellow-300 text-black w-[300px] h-auto p-5 mx-2 flex flex-col items-center justify-around cursor-pointer"
                  >
                    <h1 class="py-2 font-bold">{doc.data().title}</h1>

                    <Image
                      src={doc.data().cover}
                      width={200}
                      height={200}
                      class="rounded-lg"
                    />
                    <p class="text-black font-mono font-bold">
                      {doc.data().instructor}
                    </p>

                    <div class="flex flex-row">

                      <p class="text-sm font-normal">
                        RATING :{" "}
                        {parseFloat(getRating(doc.id))
                          ? parseFloat(getRating(doc.id).toFixed(2))
                          : 0}{" "}
                      </p>

                    </div>
                    <p class="text-pink-700">{doc.data().level}</p>
                  </div>
                </>
              );
            })}
        </div>
      </div>
    );
  } else {
    return <h1>ROUTE PROTECTED</h1>;
  }
}

export default Dashboard;