import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import GroupWidget from "./GroupWidget";

const PostsWidget = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchUserGroups  = async () => {
      try {
      const response = await fetch(process.env.REACT_APP_API ? process.env.REACT_APP_API : "https://backend-pi-project-2024-cipher-production.up.railway.app"+"/groups/group", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
      console.log(data);
    } catch (error) {
      console.error("Error fetching groups:", error.message);
    }
  };

  fetchUserGroups();
}, [dispatch, token]);

  return (
    <>
      {Array.isArray(posts) &&
        posts.map((group) => (
          <GroupWidget
            key={group._id}
            name={group.groupName}
            NumMumber={group.NumMumber}
            description={group.description}
            members={group.members}
          />
        ))}
    </>
  );
};

export default PostsWidget;