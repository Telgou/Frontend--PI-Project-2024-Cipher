import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setMyPosts } from "state";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
//import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    //const navigate = useNavigate();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const { userId } = useParams();
    const { _id } = useSelector((state) => state.user);
    const { ouruserid } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    const getUser = async () => {
        const response = await fetch(`https://localhost:3001/users/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        //console.log(data);
        setUser(data);
    };

    const getUserPosts = async () => {
        const response = await fetch(
            `https://backend-pi-project-2024-cipher.onrender.com/posts/${userId}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await response.json();
        console.log(data, ouruserid, userId, ouruserid===userId)
        ouruserid === userId ? dispatch(setMyPosts({ myPosts: data })) : dispatch(setPosts({ posts: data }));
        //console.log(myposts)
    };


    useEffect(() => {
        getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) {
        return null
    }

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="2rem"
                justifyContent="center"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <UserWidget userId={userId} picturePath={user.picturePath} getUserPosts={getUserPosts} isprofile={true} />
                    <Box m="2rem 0" />
                    <FriendListWidget userId={userId} />
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    {
                        userId === _id && <MyPostWidget isprofile={true} picturePath={user.picturePath} />
                    }
                    <Box m="2rem 0" />
                    <PostsWidget userId={userId} isProfile={true} />
                </Box>
            </Box>
        </Box>
    );
};

export default ProfilePage;
