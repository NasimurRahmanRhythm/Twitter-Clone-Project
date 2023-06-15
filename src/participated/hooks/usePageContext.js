import { useReducer } from "react";
const actions = {
  ADD_TWEET:"ADD_TWEET",
  REMOVE_TWEET:"REMOVE_TWEET",
  UPDATE_TWEET:"UPDATE_TWEET",

  ADD_COMMENT:"ADD_COMMENT",
  REMOVE_COMMENT:"REMOVE_COMMENT",
  UPDATE_COMMENT:"UPDATE_COMMENT",

  ADD_USER:"ADD_USER",
  REMOVE_USER:"REMOVE_USER",
  UPDATE_USER:"UPDATE_USER"
}

function pageReducer(state,action){
  switch(action.type){
    case actions.ADD_TWEET:
    return {...state,tweets:[...state.tweets,action.payload]}
  }
}

export function usePagePropsController(data){
  const [pageData,dispatch] = useReducer(pageReducer,data) 
  return 
}
