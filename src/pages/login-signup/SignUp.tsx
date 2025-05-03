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
import { useState } from "react";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const agreeToTerms = e.target.agreeToTerms.checked;

    if (!agreeToTerms) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/template/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(
          "Registration successful. Please check your email to confirm.",
        );
        setTimeout(() => navigate("/signin"), 2000); // Redirect after success
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

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
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSignUp}>
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
              control={<Checkbox name="agreeToTerms" color="primary" />}
              label="I agree to the Terms and Conditions"
            />
          </Box>
          {error && (
            <Typography
              variant="body2"
              color="error"
              align="center"
              sx={{ mt: 1 }}
            >
              {error}
            </Typography>
          )}
          {success && (
            <Typography
              variant="body2"
              color="success.main"
              align="center"
              sx={{ mt: 1 }}
            >
              {success}
            </Typography>
          )}
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
            Sign Up
          </Button>
          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Link component="button" onClick={() => navigate("/signin")}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
