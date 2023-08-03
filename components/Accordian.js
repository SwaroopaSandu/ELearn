import React from 'react'


function Accordian({index,url}) {
    const[toggle,settoggle] = React.useState(false)
  return <div onClick={(e)=>settoggle(!toggle)} class="rounded-lg bg-blue-300 flex flex-col items-center justify-center w-2/3 min-h-[40px] m-3 cursor-pointer">
    <h1 class="text-center text-white font-mono font-semibold">VIDEO {index}</h1> 
   {toggle && <div class="m-4">
   <video width="750" height="500" controls>
      <source src={url} type="video/mp4"/>
    </video>
    
    
    
    </div>}


  </div>;
}

export default Accordian;