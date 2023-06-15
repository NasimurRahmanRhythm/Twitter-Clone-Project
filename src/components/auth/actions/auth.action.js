export const AuthActions = {
  REGISTER: async (state, payload, dispatch) => {
    try {
      dispatch(UserActions.LOADING);
      const user = await axios.post("/api/user", payload);
      return { success: { message: "Email verification link has sent." } };
    } catch (err) {
      return { error: { message: "Something went wrong." } };
    }
  },

  LOGIN: async (state, payload, dispatch) => {},
};
