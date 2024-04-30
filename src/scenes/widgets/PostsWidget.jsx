import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setMyPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const myposts = useSelector((state) => state.myPosts);
  const userimagepath = useSelector((state) => state.userImagePath);
  const token = useSelector((state) => state.token);
  const { ouruserid } = useSelector((state) => state.user);

  const getPosts = async () => {
    const response = await fetch("http://127.0.0.1:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://127.0.0.1:3001/posts/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    //console.log(data)
    ouruserid === userId ? dispatch(setMyPosts({ myPosts: data })) : dispatch(setPosts({ posts: data }));
    //console.log(myposts)
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  console.log()
  return (
    <>
      {Array.isArray(myposts) && isProfile && ouruserid===userId && myposts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userimagepath}
            likes={likes}
            comments={comments}
            getPosts={getPosts}
          />
        )
      )}

      {Array.isArray(posts) && (!isProfile || ouruserid!==userId) && posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={ (userId===ouruserid) ? userimagepath : userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
