import { useEffect ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import ActivityWidget from "./ActivityWidget";

const PostsWidget = ({ course, onlineMeeting, covoiturage, sportActivity ,userId, picturePath, firstname, lastname,}) => {
  const dispatch = useDispatch();
  //const posts = useSelector((state) => state.posts);
  const [posts,setposts] = useState(undefined)
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("https://localhost:3001/activity/get", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log("firstName,lastName2",firstname,lastname)
      //dispatch(setPosts({ posts: data }));
      setposts(data)
    };

    fetchPosts();
  }, [dispatch, token]);

  // Filter posts based on the corresponding properties
  const filteredPosts = posts ? posts.filter((activity) =>{
    if (course && activity.course) {
      
      return true;
      
    }
    if (onlineMeeting && activity.onlineMeeting) {
      return true;
    }
    if (covoiturage && activity.covoiturage) {
      return true;
    }
    if (sportActivity && activity.sportActivity) {
      return true;
    }
    return false;
  }): [];

  return (
    <>
      {filteredPosts.map((activity) => {
        const averageRating =
          Array.isArray(activity.feedback) && activity.feedback.length > 0
            ? activity.feedback.reduce((sum, feedback) => sum + feedback.rating, 0) /
              activity.feedback.length
            : 0;

        return (
          <ActivityWidget
            key={activity._id}
            postId={activity._id}
            userId={userId}
            firstname={firstname} 
            lastname={lastname}
            picturePath={picturePath}
            activityname={activity.activityName}
            activityTime={activity.activityTime}
            numberOfParticipants={activity.numberOfParticipants}
            comments={activity.comments}
            course={course}
            covoiturage={covoiturage}
            onlineMeeting={onlineMeeting}
            sportActivity={sportActivity}
            averageRating={averageRating}
            startingLocation={activity.startingLocation}
            destination={activity.destination}
            availableSeats={activity.availableSeats}
            driverName={activity.driverName}
            driverContact={activity.driverContact}
            courseName={activity.courseName}
            instructorName={activity.instructorName}
            courseDuration={activity.courseDuration}
            locationOrPlatform={activity.locationOrPlatform}
            meetingTitle={activity.meetingTitle}
            hostName={activity.hostName}
            meetingDuration={activity.meetingDuration}
            meetingLink={activity.meetingLink}
            meetingAgenda={activity.meetingAgenda}
            location={activity.location}
            sportActivityName={activity.sportActivityName}
            equipmentRequirements={activity.equipmentRequirements}
          />
        );
      })}
    </>
  );
};

export default PostsWidget;
