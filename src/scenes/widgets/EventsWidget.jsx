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
      const response = await fetch("http://localhost:3001/events/getEvents", {
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
            <EventWidget
              key={event._id} // Add a unique key prop
              postId={event._id}
              name={event.titre}
              description={event.description}
              location={event.lieu}
              picturePath={event.organisateur}
              userPicturePath={event.dateDebut}
              likes={event.dateFin}
              comments={event.comments}
          
            />
          );
        })}
    </>
  );
};

export default PostsWidget;
