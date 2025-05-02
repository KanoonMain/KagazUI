import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const authenticateUser = (email, password) => {
  console.log(email, password);
  return "sample-auth-token"; // Example token
};

export default function LoginPage() {
  const navigate = useNavigate();

  // Function to handle login
  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy login credentials (you can replace this with real form values)
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Authenticate the user and get the auth token (replace with real authentication logic)
    const authToken = authenticateUser(email, password);
    // If authentication is successful
    if (authToken) {
      // Store auth token and last login time
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("lastSignInTime", new Date().getTime().toString());
      // Redirect user to the create page
      navigate("/create");
    } else {
      // If authentication fails, show an error message (you can handle this as needed)
      alert("Invalid credentials");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 4, mt: 4, mb: 4 }}>
        <Typography
          component="h1"
          variant="h5"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Sign in
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleLogin}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            placeholder="your@email.com"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Link href="#" variant="body2">
              Forgot your password?
            </Link>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              borderRadius: 2,
              backgroundColor: "#1a1a1a",
              color: "white",
            }}
          >
            Sign in
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account?{" "}
            <Link onClick={() => navigate("/signup")}>Sign Up</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
