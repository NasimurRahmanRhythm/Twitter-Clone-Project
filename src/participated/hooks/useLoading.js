import { useCallback,  useState } from "react";
export function useLoading(){
  const [loading,setLoading] = useState({
    started : false,
    completed: false
  })
  const start = useCallback(() => setLoading(state=>({...state,started:true})))
  const complete = useCallback(async() => {
    const response = new Promise((resolve,_reject)=>{
     setLoading(state=>({...state,completed:true}))
     setTimeout(()=>{
       setLoading({started:false,completed:false})
       resolve()
     },300)
    })
    return response
  })
  return {start,complete,loading}
}


// import { useCallback, useEffect, useState } from "react";
// export function useLoading(){
//   const [loading,setLoading] = useState({
//     started : false,
//     completed: false
//   })
//   const [isStarted,setStarted] = useState(false) 
//   const [isCompleted,setCompleted] = useState(false)
//   const start = useCallback(() => setStarted(true))
//   const complete = useCallback(async() => {
//     const response = new Promise((resolve,_reject)=>{
//      setCompleted(true)
//      setTimeout(()=>{
//        setStarted(false)
//        setCompleted(false)
//        resolve()
//      },300)
//     })
//     return response
//   })
//   return {start,complete,isStarted,isCompleted}
// }
