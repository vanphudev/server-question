import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
   name: "user",
   initialState: {
      user: null,
      accessToken: null,
      refreshToken: null,
   },
   reducers: {
      setUser(state, action) {
         state.user = action.payload.user;
      },
      clearUser(state) {
         state.user = null;
      },
   },
});

export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
