import {
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    Typography,
  } from "@mui/material";
  import { useEffect, useRef, useState } from "react";
  import { useSearchParams, useNavigate } from "react-router-dom";
  import axiosService from "../../services/axiosService";
  import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
  import { setUserData } from "../../store/slice/authSlice";
  
  const PaymentStatusPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { email } = useAppSelector((state) => state.auth);
  
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const [message, setMessage] = useState("");
    const [credits, setCredits] = useState<number | null>(null);
  
    const [searchParams] = useSearchParams();
    const transactionId = searchParams.get("transactionId");
  
    const hasCalledRef = useRef(false); // Prevent multiple API calls
  
    useEffect(() => {
      if (!transactionId || hasCalledRef.current) return;
  
      hasCalledRef.current = true;
  
      const verifyPayment = async () => {
        try {
          const response = await axiosService.processGetRequest(
            `https://kagaz.ruaaventures.com/api/template/verify-payment/${transactionId}`
          );
  
          if (response && response.credits !== undefined) {
            setStatus("success");
            setMessage("Payment successful. Credits have been added.");
            setCredits(response.credits);
            dispatch(setUserData({ email, credits: response.credits }));
          } else {
            setStatus("error");
            setMessage(response.message || "Payment verification failed.");
          }
        } catch (error) {
          console.error(error);
          setStatus("error");
          setMessage("Server error while verifying payment.");
        } finally {
          setLoading(false);
        }
      };
  
      verifyPayment();
    }, [transactionId, dispatch, email]);
  
    return (
      <Container component="main" maxWidth="sm">
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 4, mt: 4 }}>
          {loading ? (
            <Box textAlign="center">
              <CircularProgress />
              <Typography mt={2}>Verifying your payment...</Typography>
            </Box>
          ) : (
            <Box textAlign="center">
              <Typography variant="h5" gutterBottom>
                {status === "success"
                  ? "Payment Successful 🎉"
                  : "Payment Failed ❌"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {message}
              </Typography>
              {status === "success" && credits !== null && (
                <Typography variant="h6" sx={{ mt: 2 }}>
                  New Credit Balance: {credits}
                </Typography>
              )}
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color={status === "success" ? "primary" : "error"}
                  onClick={() => navigate("/")}
                  sx={{ mr: 2 }}
                >
                  Go to Dashboard
                </Button>
                {status === "error" && (
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/recharge")}
                  >
                    Try Again
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    );
  };
  
  export default PaymentStatusPage;
  