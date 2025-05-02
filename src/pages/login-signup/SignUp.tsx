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

export default function SignUpPage() {
  const navigate = useNavigate();
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, mt: 4, mb: 4 }}>
        <Typography
          component="h1"
          variant="h5"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Sign Up
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
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
            autoComplete="new-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirm-password"
            autoComplete="new-password"
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
              control={<Checkbox value="agreeToTerms" color="primary" />}
              label="I agree to the Terms and Conditions"
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              navigate("/welcome"); // Redirect to a welcome or confirmation page
            }}
            sx={{
              mt: 3,
              mb: 2,
              borderRadius: 2,
              backgroundColor: "#1a1a1a",
              color: "white",
            }}
          >
            Sign Up
          </Button>
          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Link onClick={() => navigate("/signin")}>Sign In</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
