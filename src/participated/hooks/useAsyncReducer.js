import { useCallback, useReducer } from "react";
export function useAsyncReducer(reducer, initialState, middleware) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const asyncDispatch = useCallback(async (action) => {
    if (middleware) {
      try{
        action.payload = await middleware(state, action, dispatch);
      }catch(err){
        action.error = err
      }
    }
    dispatch(action);
  }, []);
  return [state, asyncDispatch];
}
