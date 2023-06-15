import { signIn } from "next-auth/react";
import { follow, unfollow } from "../services/client/follow.client";
import axios from "axios";
export const UserActions = {

  REGISTER: async (_, payload, dispatch) => {
    try {
      dispatch(UserActions.LOADING)
      await axios.post("/api/user", payload);
      return { success: {message:"email verification link sent."} };
    } catch (err) {
      console.log(err)
      return { error: {message:"something went wrong."} };
    }
  },


  LOADING:()=>{
     return {loading:true} 
  },


  TOGGLE_FOLLOW: async (state) => {
    const toggleFollow = state.isFollowing
      ? await unfollow(state.id)
      : await follow(state.id);
    if (!toggleFollow) {
      state.error = { message: "something went wrong" };
      return { ...state };
    }
    state.isFollowing = !state.isFollowing;
    return { ...state };
  },

  UPDATE: async (state, payload) => {
    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("dateOfBirth", payload.dateOfBirth);
      formData.append("email", payload.email);
      if (payload.profile) {
        formData.append("image", payload.profile);
      }
      if (payload.cover) formData.append("cover", payload.cover);
      const newUserRes = await fetch("/api/user/" + state.id, {
        method: "PATCH",
        body: formData,
      });
      const newUser = await newUserRes.json();
      await signIn("credentials");
      return newUser;
    } catch (err) {
      return state;
    }
  },
};
