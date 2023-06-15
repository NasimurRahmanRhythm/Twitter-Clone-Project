import { useCallback, useState } from "react";
export function useListState(initialValue=[]){
  const [value,set] = useState(initialValue)
  const add = useCallback((newItem)=>set(state=>[newItem,...state]))
  const remove = useCallback((toRemove)=>set(state=>state.filter(item => item.id != toRemove.id )))
  return {value,set,add,remove}
}
