import { useAutoAnimate } from "@formkit/auto-animate/react";
import { BiCross } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import { useCustomState } from "../hooks/useCustomState";
import { useListState } from "../hooks/useListState";
const { createContext, useState, useId } = require("react");
export const ToastContext = createContext()

export function ToastProvider({children}){
  const toasts = useListState([]) 
  const create = ({importance="success",text="",timeOut = 2000}) => {
    const newToast = {id:(Math.random()*100).toString()+text,text,importance}
    console.log("toast created",text)
    toasts.add(newToast) 
    setTimeout(()=>{
      toasts.remove(newToast)
    },timeOut)
  }

  return <ToastContext.Provider value={create}>
    {children}
    <div className="col" style={{ gap:'0.5rem', position:'fixed',bottom:'1rem',right:'1rem',zIndex:10}}>
      {
        toasts.value.map(toast=>(
           <div key={toast.id} className={`toast fadeIn ${toast.importance}`}> <span className="btn btn-icon" onClick={()=>toasts.remove(toast)}>
            <RxCross1/>
          </span> {toast.text}</div> 
        ))
      }
    </div>
  </ToastContext.Provider>
}
