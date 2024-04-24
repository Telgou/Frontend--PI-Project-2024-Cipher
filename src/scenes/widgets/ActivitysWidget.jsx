import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import ActivityWidget from "./ActivityWidget";

const PostsWidget = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:3001/activity/get", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    
    };

    fetchPosts();
  }, [dispatch, token]);

  return (
    <>
      {Array.isArray(posts) &&
        posts.map((activity) => {
          const averageRating =
            Array.isArray(activity.feedback) && activity.feedback.length > 0
              ? activity.feedback.reduce((sum, feedback) => sum + feedback.rating, 0) /
                activity.feedback.length
              : 0;
            console.log("so the result is",averageRating );
          return (
            <ActivityWidget
              key={activity._id} // Add a unique key prop
              postId={activity._id}
              name={activity.activityName}
              description={activity.activityTime}
              location={activity.location}
              picturePath={activity.destination}
              userPicturePath={activity.numberOfParticipants}
              likes={activity.startingLocation}
              comments={activity.comments}
              averageRating={averageRating}
            />
          );
        })}
    </>
  );
};

export default PostsWidget;
