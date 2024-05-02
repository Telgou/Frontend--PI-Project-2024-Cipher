import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  myPosts: [],
  userImagePath: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setuser: (state, action) => {
      //console.log(action.payload)
      const newUser = action.payload;
      console.log(state.user)
      if (newUser) {
        state.user = action.payload;
        //console.log(state.user)
        state.fullName = `${newUser.firstName} ${newUser.lastName}`;
      } else {
        console.error("Invalid user payload");
      }
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setMyPosts: (state, action) => {
      state.myPosts = action.payload.map(post => ({
        ...post,
        userPicturePath: state.userImagePath
      }));
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;

      if (action.payload.post.userId === state.user._id) {
        const updatedMyPosts = state.myPosts.map((post) => {
          if (post._id === action.payload.post._id) return action.payload.post;
          return post;
        });
        state.myPosts = updatedMyPosts;
      }
    },
    setUserImagePath: (state, action) => {
      state.userImagePath = action.payload;
    },
  },
});

export const { setMode, setLogin, setfullname, setuser, setLogout, setFriends, setPosts, setPost, setMyPosts, setUserImagePath } =
  authSlice.actions;
export default authSlice.reducer;
