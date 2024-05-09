import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import Heart from "../../assets/heart.svg";
import HeartFilled from "../../assets/heartFilled.svg";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  post,
  postId,
  socket,
  user,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  getPosts
}) => {
  const [liked, setLiked] = useState(false);//notif
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes && likes[loggedInUserId]);
  const likeCount = likes ? Object.keys(likes)?.length : 0;

  const handleNotification = (type) => {
    type === 1 && setLiked(true);
    socket.emit("sendNotification", {
      senderName: user,
      receiverName: post.username,
      type,
    });}

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://127.0.0.1:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const CommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:3001/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newComment,
          postId: postId
        }),
      });

      if (response.ok) {
        getPosts();
        setNewComment("");
        console.log("Comment added successfully");
      } else {
        console.error("Error adding comment:", response.status);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const timeDifference = new Date() - date;
    console.log(dateString)
    console.log(date)
    console.log(timeDifference)

    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysAgo > 0) {
      return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    } else if (hoursAgo > 0) {
      return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else if (minutesAgo > 0) {
      return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    } else {
      return 'Just Now'
    }
  }
  return (
    <WidgetWrapper m="2rem 0" p="20rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://127.0.0.1:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <img src={HeartFilled} alt="" className="cardIcon" />
              ) : (
                <img
                  src={Heart}
                  alt=""
                  className="cardIcon"
                  onClick={() => handleNotification(1)}
                />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments?.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          <form onSubmit={CommentSubmit}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              style={{
                border: '1px solid lightgray',
                borderRadius: '5px',
                padding: '5px 10px',
                backgroundColor: '#f4f4f4',
                margin: '0 5px',
                width: 'calc(100% - 60px)',
                '&::placeholder': {
                  color: primary
                }
              }}
            />
          </form>
          {comments?.map((comment, i) => (
            <div style={{ display: 'flex', marginTop: '1rem' }} key={`${name}-${i}`}>
              {false && <UserImage image={comment.userpic}></UserImage>}
              <Box width={'60px'} height={'60px'}>
                <img
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                  width={'40rem'}
                  height={'40rem'}
                  alt="user"
                  src={`http://127.0.0.1:3001/assets/${comment.userpic}`}
                ></img>
              </Box>

              <Box style={{ width: '100%' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ float: 'left' }}>
                    {comment.username}

                  </div>
                  <div style={{ float: 'right' }}>
                    {getTimeAgo(comment.createdAt)}
                  </div>
                </div>

                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment.text}
                </Typography>
              </Box>
            </div>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
