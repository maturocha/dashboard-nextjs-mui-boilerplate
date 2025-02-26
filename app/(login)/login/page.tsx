"use client";

import { Grid, Box, Card } from "@mui/material";
import Logo from "@/components/layout/shared/logo/Logo";
import AuthLogin from "@/components/login/AuthLogin";

// Move styles to a constant to avoid recreation on each render
const backgroundStyles = {
  position: "relative",
  "&:before": {
    content: '""',
    background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
    backgroundSize: "400% 400%",
    animation: "gradient 15s ease infinite",
    position: "absolute",
    height: "100%",
    width: "100%",
    opacity: "0.3",
  },
  "@keyframes gradient": {
    "0%": {
      backgroundPosition: "0% 50%",
    },
    "50%": {
      backgroundPosition: "100% 50%",
    },
    "100%": {
      backgroundPosition: "0% 50%",
    },
  },
} as const;

const cardStyles = {
  p: 4, 
  zIndex: 1, 
  width: "100%", 
  maxWidth: "500px"
} as const;

const LoginPage = () => {
  return (
    <Box sx={backgroundStyles}>
      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{ height: "100vh" }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          lg={4}
          xl={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Card elevation={9} sx={cardStyles}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Logo />
            </Box>
            <AuthLogin />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
