import React from "react";
import { ShareOutlined } from "@mui/icons-material";
import { IconButton, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";

const PostWidget = ({
  name,
  NumMumber,
  description,
  members,
}) => {
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const formatMembers = (members) => {
    if (!Array.isArray(members)) {
      return "";
    }
    return members.map(member => `${member.firstName} ${member.lastName}`).join(", ");
  };
  

  return (
    <WidgetWrapper m="2rem 0">
    {/* Convert name to string and render */}
    <Typography color={main} sx={{ mt: "1rem" }}>
      Group Name: {String(name)}
    </Typography>
    {/* Convert NumMumber to string and render */}
    <Typography color={main} sx={{ mt: "1rem" }}>
      NumMumber: {String(NumMumber)}
    </Typography>
    {/* Convert description to string and render */}
    <Typography color={main}>
      Description: {String(description)}
    </Typography>
    {/* Render formatted members string */}
    <Typography color={main}>
        Members: {formatMembers(members)}
      </Typography>


    <IconButton>
      <ShareOutlined />
    </IconButton>
  </WidgetWrapper>
);
};

export default PostWidget;