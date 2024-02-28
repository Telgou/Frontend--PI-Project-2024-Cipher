import React, { useState, useEffect } from "react";
import {
  Typography,
   Box
} from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import UserImage from "components/UserImage";
import { useSelector } from "react-redux";

const MyPostWidget = ({ picturePath }) => {
  const { _id } = useSelector((state) => state.user);
  const [groupData, setGroupData] = useState({
    groupName: "4 TWIN 4",
    memberCount: 1,
  });

  useEffect(() => {
    // Fetch group data or use your own logic to get group details
    // For demonstration purposes, using a sample fetch
    const fetchGroupData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/group/${_id}`);
        const data = await response.json();
        setGroupData({
          groupName: data.groupName,
          memberCount: data.memberCount,
        });
      } catch (error) {
        console.error("Error fetching group data", error);
      }
    };

    fetchGroupData();
  }, [_id]);

  return (
    <WidgetWrapper>
    <Box display="flex" alignItems="center">
      <UserImage image={picturePath} />
      <Box marginLeft={2}>
        <Typography variant="h5" gutterBottom>
          Welcome to your group, Professor , {groupData.groupName}!
        </Typography>
        <Typography variant="subtitle1">
          {groupData.memberCount} {groupData.memberCount === 1 ? "member" : "members"}
        </Typography>
      </Box>
    </Box>

  </WidgetWrapper>
  );
};

export default MyPostWidget;
