import { useState } from "react";
import { useParams } from "react-router-dom";
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
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setUserImagePath } from "state";

const preregisterSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesPreRegister = {
  email: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const { tok } = useParams();
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const ispreRegister = pageType === "preregister";

  const pregister = async (values, onSubmitProps) => {
    const formData = new FormData();
    formData.append("email", values.email);
    console.log('FormData:', formData);
    const savedUserResponse = await fetch(
      "http://127.0.0.1:3001/auth/pregister",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },      
        body: JSON.stringify({ email: values.email }),
      }
    );
    const savedUser = await savedUserResponse.json();
    //onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };


  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://127.0.0.1:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    console.log(loggedIn);
    if (loggedIn) {
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

  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log(values); // Log form values
    if (isLogin) await login(values, onSubmitProps);
    if (ispreRegister) await pregister(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesPreRegister}
      validationSchema={isLogin ? loginSchema : preregisterSchema}
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
          <Box>
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
            >
              {isLogin ? "LOGIN" : "PREREGISTER"}
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
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
