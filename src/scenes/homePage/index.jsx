import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import MyGroupWidget from "scenes/widgets/MyGroupWidget";
import MyActivityWidget from "scenes/widgets/MyActivityWidget";
import MyEventWidget from "scenes/widgets/MyEventWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import ActivitysWidget from "scenes/widgets/ActivitysWidget";
import EventsWidget from "scenes/widgets/EventsWidget";
//import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import GroupsPostsWidget from "../widgets/GroupsPostsWidget";

const HomePage = () => {
  const [showGroupWidget, setShowGroupWidget] = useState(false);
  const [showEventWidget, setShowEventsWidget] = useState(false);
  const [showSportsWidget, setShowSportsWidget] = useState(false); // New state
  const handleGroupIconClick = () => {
    setShowGroupWidget(true);
    setShowSportsWidget(false); // Set showSportsWidget to false when group icon is clicked
    setShowEventsWidget(false);
    console.log("groupIcon appear? " , showGroupWidget);
  };

  const handleEventIconClick = () => {
    setShowEventsWidget(true);
    setShowSportsWidget(false); // Set showSportsWidget to false when group icon is clicked
    setShowGroupWidget(false);
    console.log("groupIcon appear? " , showGroupWidget);
  };

  const handleActivityIconClick = () => {
    setShowGroupWidget(false);
    setShowSportsWidget(true); // Set showSportsWidget to true when sports icon is clicked
    setShowEventsWidget(false);
    console.log("SportsIncon appear? " , showSportsWidget);
  };
  useEffect(() => {
    console.log("showGroupWidget:", showGroupWidget);
    console.log("showSportsWidget:", showSportsWidget);
  }, [showGroupWidget, showSportsWidget]);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar 
      handleGroupIconClick={handleGroupIconClick}
      handleEventIconClick={handleEventIconClick}
      handleActivityIconClick={handleActivityIconClick}
      />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {showGroupWidget && <MyGroupWidget picturePath={picturePath} />}

          { !showEventWidget && !showGroupWidget && !showEventWidget && <MyPostWidget/>}

          {showSportsWidget && <MyActivityWidget />}
          {showEventWidget && <MyEventWidget />}
          {/* <MyPostWidget picturePath={picturePath} /> */}
          { showGroupWidget && <GroupsPostsWidget/>}
          {  !showEventWidget && !showGroupWidget && !showEventWidget && <PostsWidget userId={_id} />}
          {showSportsWidget && <ActivitysWidget userId={_id} />}
          {showEventWidget && <EventsWidget userId={_id} />}
          
          
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
