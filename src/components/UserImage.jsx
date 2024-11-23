import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`https://backend-pi-project-2024-cipher-production.up.railway.app/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
