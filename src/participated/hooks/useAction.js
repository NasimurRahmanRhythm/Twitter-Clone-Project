import { useCallback, useState } from "react";
export function useActionDispatcher(initialState) {
  let [state, setState] = useState(initialState);
  const getState = useCallback(()=>{return state},[state])
  const dispatch = useCallback(
    async (action, payload) => {
      if (!action) {
        return state;
      }
      let newState = state;
      if (action.constructor.name === "AsyncFunction") {
        newState = await action(state, payload, dispatch , getState);
      } else if (action.constructor.name === "Function") {
        newState = action(state, payload, dispatch);
      }
      setState(newState);
      console.log(action.name,newState);
      return newState;
    },
    [state]
  );
  return [state, dispatch, getState];
}
