import { useContext } from "react"
import { modalContext } from "../contexts/modalContext"

export function useModal(){
  const {open,close,startLoading,completeLoading} = useContext(modalContext) 
  return {open,close,startLoading,completeLoading}
}
