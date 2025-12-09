import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Paper,
  Box,
} from "@mui/material";
import api from "@/services/api";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/users/forgot-password", { email });
      setSuccess(response.data.detail);
      setEmail("");
    } catch (error) {
      if (error.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        setError(error.response.data.detail);
      } else {
        setError(error.response?.data?.detail || "Failed to send reset email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: "100%" }}>
        <Stack spacing={3}>
          <Typography variant="h4" textAlign="center">
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Enter your email address and we'll send you a link to reset your
            password
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                sx={{ textAlign: "center", display: "block" }}
              >
                Back to Login
              </Link>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
}
