import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setUserImagePath } from "state";
import { showNotification } from "../../components/react-notifications";

const preregisterSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const forgotSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
});

const initialValuesPreRegister = {
  email: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const ispreRegister = pageType === "preregister";
  const isforgotpassword = pageType === "forgot";

  const pregister = async (values, onSubmitProps) => {
    const formData = new FormData();
    formData.append("email", values.email);
    //console.log('FormData:', formData);
    const savedUserResponse = await fetch(
      "https://backend-pi-project-2024-cipher.onrender.com/auth/pregister",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      }
    );
    const savedUser = await savedUserResponse.json();
    //console.log(savedUser.error);
    //console.log(savedUser.error.startsWith('PreUser validation failed: email:'))
    //onSubmitProps.resetForm();
    console.log(savedUserResponse.status == 201);

    // eslint-disable-next-line
    if (savedUser.error?.startsWith('E11000 duplicate key error collection:')) {
      showNotification('warning', 'There is already an account with the associated email');
    }

    if (savedUser.error?.startsWith('PreUser validation failed: email:')) {
      showNotification('info', "You need to register using an @esprit.tn email");
    }

    if (savedUserResponse.status == 201) {
      showNotification('success', "Please Check Your Email");
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("https://backend-pi-project-2024-cipher.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    //console.log(loggedIn);
    if (loggedIn.msg == "New connection location detected, please check your email to continue logging in")
      showNotification('info', 'New connection location detected, please check your email to continue logging in');
    if (loggedInResponse.status == 400) {
      showNotification('info', 'Please Try again');
    }// eslint-disable-next-line

    if (loggedInResponse.status == 200) {
      dispatch(
        setUserImagePath(loggedIn.user.picturePath)
      );

      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const forgotpassword = async (values, onSubmitProps) => {
    const ForgotResponse = await fetch("https://backend-pi-project-2024-cipher.onrender.com/auth/forgotpass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const forgot = await ForgotResponse.json();
    onSubmitProps.resetForm();
    console.log(forgot);
    // eslint-disable-next-line
    if (ForgotResponse.status == 200) {
      showNotification('success', 'Please check your email to continue resetting your password')
      setPageType("login");
    }
  }


  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log(values);
    if (isLogin) await login(values, onSubmitProps);
    if (ispreRegister) await pregister(values, onSubmitProps);
    if (isforgotpassword) await forgotpassword(values, onSubmitProps);
  };

  const [button, setbutton] = useState(true);
  const captchaVerify = () => {
    setbutton(false);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesPreRegister}
      validationSchema={isLogin ? loginSchema : isforgotpassword ? forgotSchema : preregisterSchema}
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
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            {isLogin && (
              <>
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
              </>
            )}
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
              {isLogin ? "LOGIN" : isforgotpassword ? "RESET" : "PREREGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "preregister" : "login");
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
            <Typography
              onClick={() => {
                setPageType(!isforgotpassword ? "forgot" : "login");
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
              {isLogin ? "forgot password?" : ""}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
