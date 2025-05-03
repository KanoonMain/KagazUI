import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import SitemarkIcon from "./SitemarkIcon";
import axiosService from "../services/axiosService";
import { setUserData, signOut } from "../store/slice/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, credits } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  function handleLogOut(){
    dispatch(signOut())
    navigate('/')
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      try {
        const data = await axiosService.processGetRequest(
          "http://localhost:5000/template/credits"
        );
        dispatch(
          setUserData({ email: parseJwt(token).email, credits: data.credits })
        );
      } catch (err) {
        console.error("Error fetching credits:", err);
      }
    };
    if(email == ""){
      fetchUserInfo();
    }
  }, [location.pathname]);

  // Utility function to decode JWT
  const parseJwt = (token) => {
    try {
      const base64 = token.split(".")[1];
      return JSON.parse(atob(base64));
    } catch (e) {
      return {};
    }
  };

  if (location.pathname === "/") return null;

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <SitemarkIcon />
        </Link>

        {email && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">
              <strong>{email}</strong> | Credits: ₹<strong>{credits}</strong>
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/recharge")}
            >
              Add Credits
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={handleLogOut}
            >
              Sign Out
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
