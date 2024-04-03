import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import PassresetForm from "./Form forgotpassword";
import { useParams } from "react-router-dom";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { tok } = useParams();
  //console.log(tok.startsWith("tok=pass"))
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          UniSocialize
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          {tok.startsWith("tok=pass") ? "Please enter your new password" : "Welcome to UniSocialize, the Social Media for University professors !"}
        </Typography>
        {tok.startsWith("tok=pass") ? <PassresetForm /> : <Form />}
      </Box>
    </Box>
  );
};

export default LoginPage;
