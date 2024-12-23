import { useState } from "react";
import { useParams } from "react-router-dom";
import io from 'socket.io-client';
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setUserImagePath } from "state";
import Dropzone from "react-dropzone";
import HCaptcha from '@hcaptcha/react-hcaptcha';
import FlexBetween from "components/FlexBetween";
import { showNotification } from "../../components/react-notifications";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required").min(2, "First name must be at least 2 characters").max(50, "First name can't exceed 50 characters"),
  lastName: yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters").max(50, "Last name can't exceed 50 characters"),
  //email: yup.string().email("Invalid email format").required("Email is required").max(50, "Email can't exceed 50 characters"),
  password: yup.string().required("Password is required").min(5, "Password must be at least 5 characters"),
  location: yup.string().required("Location is required"),
  occupation: yup.string().required("Occupation is required"),
  picture: yup.string().required("Picture is required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};
//const socket = io('https://localhost:8082');
const Form = () => {
  const { tok } = useParams();
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);
    formData.append("tok", tok.split('=')[1]);

    const savedUserResponse = await fetch(
      process.env.REACT_APP_API ? process.env.REACT_APP_API : "https://backend-pi-project-2024-cipher-production.up.railway.app"+"/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    //onSubmitProps.resetForm();
    //console.log(savedUser.error)
    console.log(savedUserResponse.status);
    if (savedUserResponse.status == 403) {
      showNotification('info', savedUser.error);
    }// eslint-disable-next-line
    if (savedUserResponse.status == 404) {
      showNotification('info', savedUser.error);
    }// eslint-disable-next-line
    if (savedUserResponse.status == 400) {
      showNotification('info', 'Please Try again');
    }// eslint-disable-next-line

    if (savedUser.error?.startsWith('E11000 duplicate key error collection: snu.users index: email_1 dup key:')) {
      console.log("duplicate email"); // eslint-disable-next-line
      showNotification('warning', 'There is already an account with the associated email');

    }// eslint-disable-next-line

    console.log(savedUserResponse.status);
    if (savedUserResponse.status == 201) {
      console.log(savedUserResponse.status, "201");
      showNotification('success', 'You have registered successfully');
      setPageType("login");
      localStorage.setItem(
        'chat-app-current-user',
        JSON.stringify(savedUser.user)
      );
    }
  };

  const login = async (values, onSubmitProps) => {
    const token = tok.split('=log')[1];
    const bodyValues = { ...values };
    console.log(token)
    if (token !== undefined) {
      bodyValues.logtoken = token;
    }

    const loggedInResponse = await fetch(process.env.REACT_APP_API ? process.env.REACT_APP_API : "https://backend-pi-project-2024-cipher-production.up.railway.app"+"/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, logtoken: tok.split('=log')[1] }),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();

    console.log(loggedIn);
    if (loggedIn.msg == "New connection location detected, please check your email to continue logging in")
      showNotification('info', 'New connection location detected, please check your email to continue logging in');
    if (loggedInResponse.status == 400) {
      showNotification('info', 'Please Try again');
    }// eslint-disable-next-line

    if (loggedIn && loggedIn.token) {

      console.log("infooooo:", loggedIn);
      localStorage.setItem(
        'chat-app-current-user',
        JSON.stringify(loggedIn.user)

      );
      localStorage.setItem('authToken', loggedIn.token);
      console.log("storageeeeee:", localStorage);

      dispatch(setUserImagePath(loggedIn.user.picturePath));
      dispatch(setLogin({
        user: loggedIn.user,
        token: loggedIn.token,
      }));

      navigate("/home");

      const userId = loggedIn.user._id;
     // socket.emit('login', userId);
    } else {
      console.error("Login failed:", loggedIn.message);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) {
      await register(values, onSubmitProps);
      // Retrieve the registered user data from local storage
      const userData = JSON.parse(localStorage.getItem('chat-app-current-user'));
      // Check if userData is not null before setting it in local storage
      if (userData) {
        localStorage.setItem('chat-app-current-user', JSON.stringify(userData));
      }
    };
  }

  const [button, setbutton] = useState(true);
  const captchaVerify = () => {
    setbutton(false);
  };
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
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
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            {isLogin && <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />}
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box style={{ marginTop: '2rem' }}>
            <HCaptcha
              sitekey={'f7bca377-9e98-4dce-8ff6-1a3949121602' || process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
              onVerify={captchaVerify}
            />
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            //disabled={button}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
