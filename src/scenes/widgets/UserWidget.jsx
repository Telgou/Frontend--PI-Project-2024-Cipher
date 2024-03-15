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
import { setUserImagePath } from "state";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Dropzone from "react-dropzone";

const UserWidget = ({ userId, picturePath,getUserPosts }) => {
  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [file, setFile] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userimagepath = useSelector((state) => state.userImagePath);
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`http://127.0.0.1:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
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
    viewedProfile,
    impressions,
    friends,
    department,
    educationalUnit,
  } = user;

  ///////////// Edit User Modal //////////////
  const handleEditOpen = () => {
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleUpdateUserInfo = async () => {
    try {
      const formData = new FormData();
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
      console.log("user", user);
      console.log("formdata", formData);
      const response = await fetch(`http://127.0.0.1:3001/users/${userId}/update`, {
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
        //console.log(updateduser)
        dispatch(
          setUserImagePath(updateduser.picturePath)
        );

        /*
        dispatch(
          setLogin({
            user: updateduser,
          })
        );*/
      }
      getUser();
      handleEditClose();
    } catch (error) {
      console.error(error);
    }
  };

  const EditSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.string().required("required"),
  });
// eslint-disable-next-line

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={userimagepath} />
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
        <ManageAccountsOutlined style={{ cursor: 'pointer' }} onClick={() => handleEditOpen()} />
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
      <Box p="1rem 0">
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
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      </Box>


      {/* Edit infos Modal */}
      <Modal
        open={editOpen}
        onClose={handleEditClose}
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

          <Grid container spacing={2}>
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
          </Grid>

          <Box mt={2} textAlign="right">
            <Button variant="contained" onClick={handleUpdateUserInfo}>
              Update
            </Button>
          </Box>

        </Box>
      </Modal>
    </WidgetWrapper>
  );
};

export default UserWidget;
