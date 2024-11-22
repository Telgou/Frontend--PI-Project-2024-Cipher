import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
  } from "@mui/icons-material";
  import { Button, Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import  Friend  from "components/Friend";
  import  StarRating from "components/StarRating";

  import WidgetWrapper from "components/WidgetWrapper";
  import { useState ,useEffect} from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPost } from "state";
  import { Card, CardContent, makeStyles } from '@material-ui/core';
  import WebRTCVideoCall from "components/WebRTCVideoCall";
  
  const PostWidget = ({
    picturePath,
    userId,
    firstname,
    lastname,
    postId,
    postUserId,
    activityname,
    activityTime,
    numberOfParticipants,
    comments,
    averageRating,
    course,
    covoiturage,
    onlineMeeting,
    sportActivity,
    //coivoiturage
    startingLocation,
    availableSeats,
    driverName,
    driverContact,
    //course
    courseName,
    instructorName,
    courseDuration,
    locationOrPlatform,
    //meeting
    meetingTitle,
    hostName,
    meetingDuration,
    meetingLink,
    meetingAgenda,
    //sportActivity
    location,
    sportActivityName,
    equipmentRequirements
    
  }) => {
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const [showVideoCall, setShowVideoCall] = useState(false);
    // const isLiked = Boolean(likes && likes[loggedInUserId]);
    // const likeCount = likes ? Object.keys(likes).length : 0;
    const [participantsCount, setParticipantsCount] = useState(numberOfParticipants);


const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
    backgroundColor: '#f3f3f3',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: theme.spacing(2),
  },
  heading: {
    color: '#3f51b5',
    marginBottom: theme.spacing(1),
  },
  details: {
    marginBottom: theme.spacing(1),
  },
}));

// const classes = useStyles();
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  //mich teb3ettek

    useEffect(() => {
      console.log('should be here fourth :', course,onlineMeeting,covoiturage,sportActivity);
      console.log("firstName,lastName3",firstname,lastname)
    }, [course,,onlineMeeting,covoiturage,sportActivity]);

    const handleParticipate = async () => {
      try {
        const response = await fetch(`http://backend-pi-project-2024-cipher.onrender.com/activity/updatePnb/${postId}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        });
    
        if (!response.ok) {
          throw new Error('Failed to increment participants');
        }
        setParticipantsCount(numberOfParticipants+1);
      } catch (error) {
        console.error("Error participating:", error);

      }
    };
    const toggleVideoCall = () => {
      setShowVideoCall(prevState => ({
        ...prevState,
        [postId]: !prevState[postId] // Toggle the visibility state for the specific post
      }));
    };
  
    return (
      <WidgetWrapper m="2rem 0">
        <Friend
          friendId={userId}
          name={firstname+" "+lastname}
          subtitle={location}
          userPicturePath={picturePath}
        />
 
   <Card >
      <CardContent>
        <Typography variant="h6" >
          Just Testing
        </Typography>
        {covoiturage && (
          <>
            <Typography    >Starting Location: {startingLocation}</Typography>
            <Typography    >Available Seats: {availableSeats}</Typography>
            <Typography    >Driver Name: {driverName}</Typography>
            <Typography    >Driver Contact: {driverContact}</Typography>
            <Typography    >Number Of Participants: {participantsCount}</Typography>
            < StarRating  averageRating={averageRating} postId={postId} />
            <Button onClick={handleParticipate}>Participate</Button>
          </>
        )}
        {course && (
          <>
            <Typography    >Course Name: {courseName}</Typography>
            <Typography    >Instructor Name: {instructorName}</Typography>
            <Typography    >Course Duration: {courseDuration}</Typography>
            <Typography    >Location/Platform: {locationOrPlatform}</Typography>
            <Typography    >Number Of Participants: {participantsCount}</Typography>
            < StarRating  averageRating={averageRating} postId={postId} />
            <Button onClick={handleParticipate}>Participate</Button>
          </>
        )}
        {onlineMeeting && (
          <>
            <Typography    >Meeting Title: {meetingTitle}</Typography>
            <Typography    >Host Name: {hostName}</Typography>
            <Typography    >Meeting Duration: {meetingDuration}</Typography>
            <Typography    >Meeting Link: {meetingLink}</Typography>
            <Typography    >Meeting Agenda: {meetingAgenda}</Typography>
            <Typography    >Number Of Participants: {participantsCount}</Typography>
            < StarRating  averageRating={averageRating} postId={postId} />
            <Button onClick={handleParticipate}>Participate</Button>
            <Button onClick={toggleVideoCall}>
            {showVideoCall[postId] ? "Hide Video Call" : "Join Video Call"}
          </Button>
          {/* Conditionally render the WebRTCVideoCall component for the specific post */}
          {showVideoCall[postId] && <WebRTCVideoCall />}
          </>
        )}
        {sportActivity && (
          <>
            <Typography    >Location: {location}</Typography>
            <Typography    >Sport Activity Name: {sportActivityName}</Typography>
            <Typography    >Equipment Requirements: {equipmentRequirements}</Typography>
            <Typography    >Number Of Participants: {participantsCount}</Typography>
            < StarRating  averageRating={averageRating} postId={postId} />
            <Button onClick={handleParticipate}>Participate</Button>
          </>
        )}
      </CardContent>
    </Card>
        {/* {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://backend-pi-project-2024-cipher.onrender.com/assets/${picturePath}`}
          />
        )} */}
            
     
        {/* {isComments && (
          <Box mt="0.5rem">
            {comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment}
                </Typography>
              </Box>
            ))}
           
            <Divider />
            
          </Box>
        )} */}
        
      </WidgetWrapper>
    );
  };
  
  export default PostWidget;
  