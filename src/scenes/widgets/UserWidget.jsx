import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, Modal, Button, TextField, Grid } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch } from "react-redux";
import { setUserImagePath, setuser } from "state";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import * as yup from "yup";
import Dropzone from "react-dropzone";

const UserWidget = ({ userId, picturePath, getUserPosts, isprofile }) => {

  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [singular, setSingular] = useState(undefined);
  const [file, setFile] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const ouruser = useSelector((state) => state.user);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`https://backend-pi-project-2024-cipher-production.up.railway.app/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    await setUser(data);

    //console.log(user);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    github,
    linkedin,
    twitter,
    viewedProfile,
    impressions,
    friends,
    department,
    educationalUnit,
  } = user;

  ///////////// Edit User Modal //////////////
  const openEditModal = (singular) => {
    setEditOpen(true);
  };
  const clodeEditModal = () => {
    setEditOpen(false);
  };

  const UpdateUserInfo = async () => {
    try {
      const formData = new FormData();
      if (singular === undefined) {
        formData.append("firstName", document.getElementById("firstName").value);
        formData.append("lastName", document.getElementById("lastName").value);
        formData.append("occupation", document.getElementById("occupation").value);
        formData.append("location", document.getElementById("location").value);
        formData.append("department", document.getElementById("department").value);
        formData.append("educationalUnit", document.getElementById("educationalUnit").value);

        if (file != null) {
          formData.append("picturePath", file.name);
          formData.append("picture", file);
        }
      }
      if (singular === 'github' || singular === undefined) formData.append("github", document.getElementById("github").value);
      if (singular === 'linkedin' || singular === undefined) formData.append("linkedin", document.getElementById("linkedin").value);
      if (singular === 'twitter' || singular === undefined) formData.append("twitter", document.getElementById("twitter").value);

      //console.log("user", user);
      //console.log("formdata", formData);
      const response = await fetch(`https://backend-pi-project-2024-cipher-production.up.railway.app/users/${userId}/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update user information");
      }
      const responseData = await response.json();

      //console.log(responseData);

      if (response.status === 200) {
        const updateduser = await responseData.user;
        getUserPosts()
        console.log(updateduser)
        dispatch(
          setUserImagePath(updateduser.picturePath),
        );
        dispatch(
          setuser(updateduser)
        );
        /*
        dispatch(
          setLogin({
            user: updateduser,
          })
        );*/
      }
      getUser();
      clodeEditModal();
    } catch (error) {
      console.error(error);
    }
  };
  // eslint-disable-next-line
  const EditSchema = yup.object().shape({
    firstName: yup.string().required("First name is required").min(2, "First name must be at least 2 characters").max(50, "First name can't exceed 50 characters"),
    lastName: yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters").max(50, "Last name can't exceed 50 characters"),
    password: yup.string().required("Password is required").min(5, "Password must be at least 5 characters"),
    location: yup.string().required("Location is required"),
    occupation: yup.string().required("Occupation is required"),
    picture: yup.string().required("Picture is required"),
  });

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={user.picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends?.length} friends</Typography>
          </Box>
        </FlexBetween>
        {ouruser._id == userId && <ManageAccountsOutlined style={{ cursor: 'pointer' }} onClick={() => {
          setSingular(undefined);
          openEditModal();
        }} />}
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      {isprofile && <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>}

      <Divider />

      {/* FOURTH ROW */}
      {isprofile && <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        {user.github && <FlexBetween gap="1rem">

          <a href={'https://github.com/' + user.github} style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer" >
            <FlexBetween gap="1rem">
              <img src="../assets/github.png" alt="github" style={{ objectFit: 'contain' }} />
              <Box>
                <Typography color={main} fontWeight="500">
                  Github
                </Typography>
                <Typography color={medium}>Developer Platform</Typography>
              </Box>
            </FlexBetween>
          </a>
          {ouruser._id == userId && <EditOutlined sx={{ color: main }} style={{ cursor: 'pointer' }} onClick={() => {
            setSingular('github');
            openEditModal("github")
          }} />}
        </FlexBetween>}

        {user.twitter &&
          <FlexBetween gap="1rem" mb="0.5rem">
            <a href={'https://twitter.com/' + user.twitter} style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer" >
              <FlexBetween gap="1rem">
                <img src="../assets/twitter.png" alt="twitter" />
                <Box>
                  <Typography color={main} fontWeight="500">
                    Twitter
                  </Typography>
                  <Typography color={medium}>Social Network</Typography>
                </Box>
              </FlexBetween>
            </a>
            {ouruser._id == userId && <EditOutlined sx={{ color: main }} onClick={() => {
              setSingular('twitter');
              openEditModal("twitter")
            }} />}
          </FlexBetween>}


        {user.linkedin && <FlexBetween gap="1rem">
          <a href={'https://linkedin.com/in/' + user.linkedin} style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer" >
            <FlexBetween gap="1rem">
              <img src="../assets/linkedin.png" alt="linkedin" />
              <Box>
                <Typography color={main} fontWeight="500">
                  Linkedin
                </Typography>
                <Typography color={medium}>Network Platform</Typography>
              </Box>
            </FlexBetween>
          </a>
          {ouruser._id == userId && <EditOutlined sx={{ color: main }} onClick={() => {
            setSingular('linkedin');
            openEditModal("linkedin")
          }} />}
        </FlexBetween>}
      </Box>}


      {/* Edit infos Modal */}
      <Modal
        open={editOpen}
        onClose={clodeEditModal}
        aria-labelledby="edit-user-info-modal"
        aria-describedby="modal-to-edit-user-information"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h4" id="modal-title" sx={{ py: 4 }}>
            Edit Personal Information
          </Typography>

          {singular == undefined && <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                id="firstName"
                label="First Name"
                variant="outlined"
                defaultValue={firstName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="lastName"
                label="Last Name"
                variant="outlined"
                defaultValue={lastName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="occupation"
                label="Occupation"
                variant="outlined"
                defaultValue={occupation}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="location"
                label="Location"
                variant="outlined"
                defaultValue={location}
              />
            </Grid>
            <Grid item xs={12}>
              <Dropzone
                id="picture"
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={(acceptedFiles) => {
                  setFile(acceptedFiles[0]);
                  //setFieldValue("picture", acceptedFiles[0])
                  console.log("set picture");
                }
                }
              >
                {({ getRootProps, getInputProps }) => (
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!picturePath ? (
                      <p>Add Picture Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{picturePath}</Typography>
                        <EditOutlinedIcon />
                      </FlexBetween>
                    )}
                  </Box>
                )}
              </Dropzone>
            </Grid>

            <Grid item xs={6}>
              <TextField
                id="department"
                label="Department"
                variant="outlined"
                defaultValue={department}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="educationalUnit"
                label="Educational Unit"
                variant="outlined"
                defaultValue={educationalUnit}
              />
            </Grid>
          </Grid>}

          <Grid container mt={2} spacing={2}>
            {(singular == 'linkedin' || singular == undefined) && <Grid item xs={6}>
              <TextField
                id="linkedin"
                label="linkedin"
                variant="outlined"
                defaultValue={linkedin}
              />
            </Grid>}
            {(singular == 'github' || singular == undefined) && <Grid item xs={6}>
              <TextField
                id="github"
                label="github"
                variant="outlined"
                defaultValue={github}
              />
            </Grid>}
            {(singular == 'twitter' || singular == undefined) && <Grid item xs={6}>
              <TextField
                id="twitter"
                label="twitter"
                variant="outlined"
                defaultValue={twitter}
              />
            </Grid>}
          </Grid>

          <Box mt={2} textAlign="right">
            <Button variant="contained" onClick={() => UpdateUserInfo()}>
              Update
            </Button>
          </Box>

        </Box>
      </Modal>
    </WidgetWrapper >
  );
};

export default UserWidget;
