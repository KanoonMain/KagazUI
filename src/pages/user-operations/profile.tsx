import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  ListItemSecondaryAction,
  CircularProgress,
} from "@mui/material";
import axiosService from "../../services/axiosService";
import { useAppSelector } from "../../hooks/hooks";

const Profile = () => {
  const { email } = useAppSelector((state) => state.auth);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [regeneratingOrderId, setRegeneratingOrderId] = useState<number | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "info" | "success" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const data = await axiosService.processGetRequest(
          "http://localhost:5000/template/orders"
        );
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handlePasswordUpdate = async () => {
    setPasswordLoading(true);
    try {
      const data = await axiosService.processPostRequest(
        "http://localhost:5000/template/update-password",
        {
          email,
          oldPassword,
          newPassword,
        }
      );
      setSnackbar({ open: true, message: data.message, severity: "success" });
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update password",
        severity: "error",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRegenerate = async (orderId: number) => {
    setRegeneratingOrderId(orderId);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/template/regenerate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId }),
        }
      );

      if (!response.ok) {
        throw new Error("File download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "GeneratedFile.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: `Order #${orderId} regenerated successfully.`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to regenerate order #${orderId}.`,
        severity: "error",
      });
    } finally {
      setRegeneratingOrderId(null);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>
      <Grid container spacing={4}>
        {/* Password Update Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Update Password
            </Typography>
            <TextField
              fullWidth
              label="Old Password"
              type="password"
              margin="normal"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordUpdate}
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Orders Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {ordersLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : orders.length === 0 ? (
              <Typography variant="body2">No orders found.</Typography>
            ) : (
              <List dense>
                {orders.map((order, index) => (
                  <ListItem key={index} divider alignItems="flex-start">
                    <ListItemText
                      primary={`Order #${order.id} | ₹${order.price}`}
                      secondary={
                        <>
                          <Typography variant="body2">
                            <strong>Date:</strong> {order.created_at}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Case Type:</strong> {order.case_type}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Template Type:</strong>{" "}
                            {order.template_type}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleRegenerate(order.id)}
                        disabled={regeneratingOrderId === order.id}
                      >
                        {regeneratingOrderId === order.id ? (
                          <CircularProgress size={18} color="secondary" />
                        ) : (
                          "Regenerate"
                        )}
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
