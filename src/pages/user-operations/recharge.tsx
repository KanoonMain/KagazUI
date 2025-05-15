import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosService from "../../services/axiosService";
// import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

export default function RechargePage() {
  // const dispatch = useAppDispatch();
  // const { email } = useAppSelector((state) => state.auth);
  const [amount, setAmount] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "info" | "success" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const handleRecharge = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      setSnackbar({
        open: true,
        message: "Not authenticated",
        severity: "error",
      });
      return;
    }

    const amountValue = parseInt(amount, 10);
    if (isNaN(amountValue) || amountValue <= 0) {
      setSnackbar({
        open: true,
        message: "Please enter a valid amount",
        severity: "warning",
      });
      return;
    }

    try {
      console.log("amountValue", amountValue)
      const response = await axiosService.processPostRequest(
        "https://kagaz.ruaaventures.com/api/template/recharge",
        { amount: amountValue }
      );
      console.log(response)
      if (response && response.payment_url) {
        // Redirect user to PhonePe
        window.location.href = response.payment_url;
      } else {
        setSnackbar({
          open: true,
          message: response?.message || "Recharge failed",
          severity: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Server error", severity: "error" });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 4, mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Recharge Credits
        </Typography>
        <Box component="form" onSubmit={handleRecharge} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#1a1a1a",
              color: "white",
              borderRadius: 2,
            }}
          >
            Proceed to Pay
          </Button>
          <Button fullWidth sx={{ mt: 2 }} onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
