import { useParams } from "react-router-dom";

import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import { showNotification } from "../../components/react-notifications";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useState } from "react";

const resetSchema = yup.object().shape({
  password: yup.string().required("required"),
  confirmPassword: yup.string()
    .required('required')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});

const initialValuesReset = {
  password: "",
  confirmPassword: "",
};

const PassresetForm = () => {
  const { tok } = useParams();
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const Reset = async (values, onSubmitProps) => {
    const requestBody = {
      password: values.password,
      token: tok.split('=pass')[1]
    };

    const ResetResponse = await fetch(
      "http://127.0.0.1:3001/auth/resetpass",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );

    const Reset = await ResetResponse.json();
    onSubmitProps.resetForm();
    console.log(Reset);

    console.log(ResetResponse.status);
    if (ResetResponse.status === 200) { // Use strict comparison operator
      console.log(ResetResponse.status, "200");
      showNotification('success', 'You have reset your password successfully');
      dispatch(
        setLogin({
          user: null,
          token: null,
        })
      );
      navigate("/home");
    } else {
      showNotification('info', 'There has been an error resetting your password');
    }
  };


  const handleFormSubmit = async (values, onSubmitProps) => {
    await Reset(values, onSubmitProps);
  };

  const [button, setbutton] = useState(true);
  const captchaVerify = () => {
    setbutton(false);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesReset}
      validationSchema={resetSchema}
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
              label="password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.confirmPassword}
              name="confirmPassword"
              error={Boolean(touched.confirmPassword) && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
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
              disabled={button}
            >
              {"Change Password"}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default PassresetForm;
