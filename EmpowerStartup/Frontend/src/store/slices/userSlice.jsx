const { createSlice } = require('@reduxjs/toolkit');

const userSlice = createSlice({
  name: 'user',
  initialState: [],
  reducers: {
    setUserProfile(state, action) {
      state.push(action.payload);
    },
    removeUser(state, action) {},
  },
});


console.log("kjsdbhfsdfsdf",userSlice.actions)

export default userSlice.reducer;
export const {setUserProfile} =userSlice.actions
