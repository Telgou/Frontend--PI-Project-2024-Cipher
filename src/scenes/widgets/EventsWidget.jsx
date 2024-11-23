import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import EventWidget from "./EventWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("https://backend-pi-project-2024-cipher-production.up.railway.app/events/getEvents", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    console.log("data",data);
    };

    fetchPosts();
  }, [dispatch, token]);




  return (
    <>
      {Array.isArray(posts) &&
        posts.map((event) => {
          
          return (
            // Dans PostsWidget
<EventWidget
  postId={event.id}
  title={event.titre}
  dateDebut={event.dateDebut}
  picturePath={event.picturePath}
/>


          );
        })}
    </>
  );
};

export default PostsWidget;
