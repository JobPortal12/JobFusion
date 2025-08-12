import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateProfilePhoto: (state, action) => {
      if (state.user) {
        state.user.profile = {
          ...state.user.profile,
          profilePhoto: action.payload,
        };
      }
    },
  },
});

export const { setLoading, setUser, updateProfilePhoto } = authSlice.actions;

export default authSlice.reducer;
