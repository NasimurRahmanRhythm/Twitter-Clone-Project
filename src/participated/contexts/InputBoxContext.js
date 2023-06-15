import { useCustomState } from "../hooks/useCustomState";

const { createContext, useContext } = require("react");

const InputBoxContext = createContext()

export const InputBoxProvider = ({children})=>{ 
  const inputBoxId = useCustomState()
  return <InputBoxContext.Provider value={inputBoxId}>
   {children}
  </InputBoxContext.Provider>
}

export function useInputBoxId(){
  const id = useContext(InputBoxContext)
  return id
} 
