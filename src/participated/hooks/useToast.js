import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";

export function useToast(){
  const create = useContext(ToastContext)
  return create
}
