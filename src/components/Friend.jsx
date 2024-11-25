import {
  PersonAddOutlined, PersonRemoveOutlined, DeleteOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, deletePost } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useEffect } from "react";

const Friend = ({ friendId, name, subtitle, userPicturePath, postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = Array.isArray(friends) ? friends.find((friend) => friend._id === friendId) : null;

  const patchFriend = async () => {
    const response = await fetch(
      process.env.REACT_APP_API ? process.env.REACT_APP_API : `https://backend-pi-project-2024-cipher-production.up.railway.app` + `/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  const handleDelete = async (postId) => {
    dispatch(deletePost({ postId }));
    await fetch(`${process.env.REACT_APP_API || "https://backend-pi-project-2024-cipher-production.up.railway.app"}/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {_id !== friendId ? <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton> : postId ?
        <FlexBetween mt="1rem">
          <IconButton onClick={() => handleDelete(postId)}>
            <DeleteOutlined sx={{ color: palette.error.main }} />
          </IconButton>
        </FlexBetween> : undefined}
    </FlexBetween>
  );
};

export default Friend;
