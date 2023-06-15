import { useState } from "react";

export function useCustomState(initialValue){
   const [value,set] = useState(initialValue)
   return {value,set}
}
