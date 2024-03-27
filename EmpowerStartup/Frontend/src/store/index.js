import { configureStore } from "@reduxjs/toolkit";
// to
import userProfileReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    user: userProfileReducer,
  }
});


export default store;